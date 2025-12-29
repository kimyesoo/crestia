#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pangea Reptile Blog Scraper
============================
Pangea Reptile 블로그에서 크레스티드 게코 관련 사육 정보를 수집하여
JSON 파일로 저장하는 자동화 스크립트입니다.

사용법:
-------
1. 의존성 설치:
   pip install -r requirements.txt

2. 스크립트 실행:
   python pangea_scraper.py

출력:
-----
../src/constants/pangea_data.json
"""

import json
import os
import random
import re
import time
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ============ 설정 ============
BASE_URL = "https://www.pangeareptile.com"
BLOG_URL = f"{BASE_URL}/blogs/blog"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
REQUEST_TIMEOUT = 30
SUMMARY_LENGTH = 200

# 출력 경로 (스크립트 위치 기준 상대 경로)
SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_DIR = SCRIPT_DIR.parent / "src" / "constants"
OUTPUT_FILE = OUTPUT_DIR / "pangea_data.json"


def get_soup(url: str) -> BeautifulSoup | None:
    """
    URL에서 HTML을 가져와 BeautifulSoup 객체로 반환.
    네트워크 에러 시 None 반환.
    """
    headers = {"User-Agent": USER_AGENT}
    
    try:
        response = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return BeautifulSoup(response.text, "html.parser")
    except requests.RequestException as e:
        print(f"[ERROR] 페이지 요청 실패: {url}")
        print(f"        {type(e).__name__}: {e}")
        return None


def clean_text(text: str) -> str:
    """HTML 태그 제거 및 텍스트 정제."""
    if not text:
        return ""
    # 여러 공백을 하나로
    text = re.sub(r'\s+', ' ', text)
    # 앞뒤 공백 제거
    return text.strip()


def extract_blog_list(soup: BeautifulSoup) -> list[dict]:
    """
    블로그 목록 페이지에서 게시글 링크와 제목 추출.
    """
    articles = []
    
    # Shopify 블로그 구조에 맞게 셀렉터 조정
    # 다양한 가능한 셀렉터 시도
    selectors = [
        "article.article",
        ".blog-post",
        ".article-item",
        ".blog-article",
        "article",
        ".article"
    ]
    
    for selector in selectors:
        items = soup.select(selector)
        if items:
            print(f"[INFO] '{selector}' 셀렉터로 {len(items)}개 게시글 발견")
            break
    else:
        # 대체: 모든 링크에서 /blogs/blog/ 패턴 찾기
        print("[INFO] 기본 셀렉터로 게시글을 찾지 못함. 링크 패턴으로 검색 중...")
        all_links = soup.find_all("a", href=re.compile(r"/blogs/blog/[^/]+"))
        seen_urls = set()
        
        for link in all_links:
            href = link.get("href", "")
            if href and href not in seen_urls:
                seen_urls.add(href)
                title = clean_text(link.get_text()) or "Untitled"
                full_url = href if href.startswith("http") else f"{BASE_URL}{href}"
                articles.append({"title": title, "url": full_url})
        
        print(f"[INFO] 링크 패턴으로 {len(articles)}개 게시글 발견")
        return articles
    
    # 일반적인 게시글 카드 파싱
    for item in items:
        link_tag = item.find("a", href=True)
        if not link_tag:
            continue
            
        href = link_tag.get("href", "")
        if not href or "/blogs/blog/" not in href:
            continue
            
        title_tag = item.find(["h1", "h2", "h3", "h4"]) or link_tag
        title = clean_text(title_tag.get_text()) if title_tag else "Untitled"
        
        full_url = href if href.startswith("http") else f"{BASE_URL}{href}"
        articles.append({"title": title, "url": full_url})
    
    return articles


def extract_article_content(soup: BeautifulSoup) -> str:
    """
    게시글 상세 페이지에서 본문 내용 추출.
    """
    # 본문 콘텐츠를 담는 다양한 셀렉터 시도
    content_selectors = [
        ".article__content",
        ".blog-content",
        ".rte",  # Shopify 기본 Rich Text Editor 클래스
        ".article-content",
        "article .content",
        ".post-content",
        "article"
    ]
    
    for selector in content_selectors:
        content_elem = soup.select_one(selector)
        if content_elem:
            # 스크립트, 스타일 태그 제거
            for tag in content_elem.find_all(["script", "style", "nav", "header", "footer"]):
                tag.decompose()
            
            text = clean_text(content_elem.get_text())
            if len(text) > 50:  # 최소 50자 이상의 내용이 있어야 유효
                return text
    
    return ""


def scrape_pangea_blog() -> list[dict]:
    """
    Pangea Reptile 블로그 전체를 스크래핑.
    """
    results = []
    
    print("=" * 60)
    print("🦎 Pangea Reptile Blog Scraper 시작")
    print(f"   대상: {BLOG_URL}")
    print("=" * 60)
    
    # 1. 블로그 목록 페이지 가져오기
    print("\n[1/3] 블로그 목록 페이지 수집 중...")
    soup = get_soup(BLOG_URL)
    
    if not soup:
        print("[ERROR] 블로그 목록 페이지를 가져올 수 없습니다.")
        return results
    
    # 2. 게시글 목록 추출
    print("[2/3] 게시글 목록 추출 중...")
    articles = extract_blog_list(soup)
    
    if not articles:
        print("[WARNING] 게시글을 찾을 수 없습니다. 사이트 구조가 변경되었을 수 있습니다.")
        return results
    
    print(f"[INFO] 총 {len(articles)}개 게시글 발견")
    
    # 3. 각 게시글 상세 내용 수집
    print("[3/3] 게시글 상세 내용 수집 중...")
    
    for i, article in enumerate(articles, 1):
        print(f"  [{i}/{len(articles)}] {article['title'][:40]}...")
        
        # 차단 방지를 위한 랜덤 딜레이
        time.sleep(random.uniform(1, 3))
        
        try:
            detail_soup = get_soup(article["url"])
            
            if detail_soup:
                content = extract_article_content(detail_soup)
                summary = content[:SUMMARY_LENGTH] + "..." if len(content) > SUMMARY_LENGTH else content
                
                results.append({
                    "title": article["title"],
                    "url": article["url"],
                    "summary": summary,
                    "content": content,
                    "scraped_at": datetime.now().isoformat()
                })
                print(f"        ✓ 수집 완료 ({len(content)}자)")
            else:
                print(f"        ✗ 상세 페이지 로드 실패")
                
        except Exception as e:
            print(f"        ✗ 에러 발생: {type(e).__name__}: {e}")
            continue
    
    return results


def save_to_json(data: list[dict]) -> bool:
    """
    수집된 데이터를 JSON 파일로 저장.
    """
    try:
        # 출력 디렉토리 생성 (없으면)
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        output_data = {
            "source": "Pangea Reptile Blog",
            "source_url": BLOG_URL,
            "scraped_at": datetime.now().isoformat(),
            "total_articles": len(data),
            "articles": data
        }
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 저장 완료: {OUTPUT_FILE}")
        print(f"   총 {len(data)}개 게시글 저장됨")
        return True
        
    except Exception as e:
        print(f"\n[ERROR] 파일 저장 실패: {type(e).__name__}: {e}")
        return False


def main():
    """메인 실행 함수."""
    start_time = time.time()
    
    # 스크래핑 실행
    data = scrape_pangea_blog()
    
    if data:
        save_to_json(data)
    else:
        print("\n⚠️ 수집된 데이터가 없습니다.")
    
    elapsed = time.time() - start_time
    print(f"\n⏱️ 총 소요 시간: {elapsed:.1f}초")
    print("=" * 60)


if __name__ == "__main__":
    main()
