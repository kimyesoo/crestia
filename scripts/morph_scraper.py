#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MorphMarket Crested Gecko Morph Scraper (Selenium Version)
===========================================================
MorphMarket Morphpedia에서 크레스티드 게코 모프 정보를 수집하여
JSON 파일로 저장하는 자동화 스크립트입니다.

Selenium을 사용하여 JavaScript로 렌더링되는 콘텐츠도 수집합니다.

사용법:
-------
1. 의존성 설치:
   pip install -r requirements.txt

2. 스크립트 실행:
   python morph_scraper.py

출력:
-----
../src/constants/morph_data.json
"""

import json
import random
import re
import time
from datetime import datetime
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# ============ 설정 ============
BASE_URL = "https://www.morphmarket.com"
MORPHPEDIA_URL = f"{BASE_URL}/morphpedia/crested-geckos/"
DESCRIPTION_MAX_LENGTH = 500

# 출력 경로 (스크립트 위치 기준 상대 경로)
SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_DIR = SCRIPT_DIR.parent / "src" / "constants"
OUTPUT_FILE = OUTPUT_DIR / "morph_data.json"


def create_driver():
    """Selenium Chrome 드라이버 생성."""
    options = Options()
    options.add_argument("--headless=new")  # 헤드리스 모드
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver


def clean_text(text: str) -> str:
    """HTML 태그 제거 및 텍스트 정제."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def slugify(name: str) -> str:
    """이름을 URL-safe ID로 변환."""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def scrape_morphmarket(driver):
    """MorphMarket Morphpedia를 스크래핑."""
    results = []
    
    print("=" * 60)
    print("🦎 MorphMarket Morphpedia Scraper 시작 (Selenium)")
    print(f"   대상: {MORPHPEDIA_URL}")
    print("=" * 60)
    
    # 1. Morphpedia 메인 페이지 로드
    print("\n[1/3] Morphpedia 메인 페이지 로딩 중...")
    try:
        driver.get(MORPHPEDIA_URL)
        # 페이지 로딩 대기 (최대 15초)
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        # 추가 대기 (JavaScript 렌더링)
        time.sleep(3)
    except Exception as e:
        print(f"[ERROR] 페이지 로딩 실패: {e}")
        return results
    
    # 2. 페이지 스크롤하여 모든 콘텐츠 로드
    print("[2/3] 페이지 스크롤 중...")
    last_height = driver.execute_script("return document.body.scrollHeight")
    scroll_count = 0
    max_scrolls = 10
    
    while scroll_count < max_scrolls:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
        scroll_count += 1
        print(f"  스크롤 {scroll_count}회...")
    
    # 3. 모프 카드 추출
    print("[3/3] 모프 정보 추출 중...")
    soup = BeautifulSoup(driver.page_source, "html.parser")
    
    # 다양한 셀렉터로 모프 카드 찾기
    morph_cards = []
    
    # MorphMarket의 trait 카드 셀렉터들
    selectors = [
        "a[href*='/morphpedia/crested-geckos/'][href$='/']",
        ".trait-card a",
        "[class*='TraitCard'] a",
        ".morph-item a",
        "a.trait-link",
    ]
    
    for selector in selectors:
        cards = soup.select(selector)
        if cards:
            print(f"[INFO] '{selector}' 셀렉터로 {len(cards)}개 요소 발견")
            morph_cards.extend(cards)
            break
    
    if not morph_cards:
        # 대체: 모든 모프 관련 링크 찾기
        print("[INFO] 기본 셀렉터로 모프를 찾지 못함. 링크 패턴으로 검색 중...")
        all_links = soup.find_all("a", href=re.compile(r"/morphpedia/crested-geckos/[a-z0-9-]+/?$", re.I))
        morph_cards = [link for link in all_links if link.get("href") != "/morphpedia/crested-geckos/"]
        print(f"[INFO] 링크 패턴으로 {len(morph_cards)}개 모프 발견")
    
    # 중복 제거
    seen_urls = set()
    unique_morphs = []
    
    for card in morph_cards:
        href = card.get("href", "")
        if not href or href in seen_urls:
            continue
        if "/morphpedia/crested-geckos/" not in href:
            continue
        if href == "/morphpedia/crested-geckos/":
            continue
            
        seen_urls.add(href)
        
        # 이름 추출
        name = clean_text(card.get_text())
        if not name or len(name) < 2:
            # href에서 이름 추출
            name_from_url = href.rstrip("/").split("/")[-1]
            name = name_from_url.replace("-", " ").title()
        
        full_url = href if href.startswith("http") else f"{BASE_URL}{href}"
        unique_morphs.append({"name": name, "url": full_url})
    
    print(f"[INFO] 총 {len(unique_morphs)}개 고유 모프 발견")
    
    # 4. 각 모프 상세 페이지 방문
    for i, morph in enumerate(unique_morphs, 1):
        print(f"  [{i}/{len(unique_morphs)}] {morph['name'][:30]}...")
        
        try:
            driver.get(morph["url"])
            time.sleep(random.uniform(1.5, 3))
            
            detail_soup = BeautifulSoup(driver.page_source, "html.parser")
            
            # 설명 추출
            description = ""
            desc_selectors = [
                ".trait-description",
                ".description",
                "[class*='Description']",
                ".content p",
                "article p",
                "main p"
            ]
            
            for selector in desc_selectors:
                desc_elem = detail_soup.select_one(selector)
                if desc_elem:
                    text = clean_text(desc_elem.get_text())
                    if len(text) > 30:
                        description = text[:DESCRIPTION_MAX_LENGTH]
                        if len(text) > DESCRIPTION_MAX_LENGTH:
                            description += "..."
                        break
            
            # 타입 추출 (Dominant, Recessive 등)
            morph_type = ""
            type_selectors = [
                ".trait-type",
                ".inheritance",
                "[class*='Type']",
                ".badge",
                ".tag"
            ]
            
            for selector in type_selectors:
                type_elem = detail_soup.select_one(selector)
                if type_elem:
                    type_text = clean_text(type_elem.get_text())
                    if type_text and len(type_text) < 50:
                        morph_type = type_text
                        break
            
            results.append({
                "id": slugify(morph["name"]),
                "name": morph["name"],
                "type": morph_type,
                "description": description,
                "originalUrl": morph["url"]
            })
            
            print(f"        ✓ 수집 완료 - {morph_type or 'Unknown Type'}")
            
        except Exception as e:
            print(f"        ✗ 에러: {type(e).__name__}: {e}")
            results.append({
                "id": slugify(morph["name"]),
                "name": morph["name"],
                "type": "",
                "description": "",
                "originalUrl": morph["url"]
            })
            continue
    
    return results


def save_to_json(data: list[dict]) -> bool:
    """수집된 데이터를 JSON 파일로 저장."""
    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        output_data = {
            "source": "MorphMarket Morphpedia",
            "source_url": MORPHPEDIA_URL,
            "scraped_at": datetime.now().isoformat(),
            "total_morphs": len(data),
            "morphs": data
        }
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 저장 완료: {OUTPUT_FILE}")
        print(f"   총 {len(data)}개 모프 저장됨")
        return True
        
    except Exception as e:
        print(f"\n[ERROR] 파일 저장 실패: {e}")
        return False


def main():
    """메인 실행 함수."""
    start_time = time.time()
    driver = None
    
    try:
        print("[INIT] Chrome 드라이버 초기화 중...")
        driver = create_driver()
        
        # 스크래핑 실행
        data = scrape_morphmarket(driver)
        
        if data:
            save_to_json(data)
        else:
            print("\n⚠️ 수집된 데이터가 없습니다.")
            
    except Exception as e:
        print(f"\n[FATAL] 치명적 오류: {e}")
    finally:
        if driver:
            driver.quit()
            print("[CLEANUP] 드라이버 종료됨")
    
    elapsed = time.time() - start_time
    print(f"\n⏱️ 총 소요 시간: {elapsed:.1f}초")
    print("=" * 60)


if __name__ == "__main__":
    main()
