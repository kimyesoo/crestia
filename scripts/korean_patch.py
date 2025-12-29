#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Korean Patch - 파충류 데이터 한국어 번역 스크립트
=================================================
영어로 된 모프 데이터와 Pangea 블로그 데이터를
한국어로 번역하고 SEO 최적화된 형태로 저장합니다.

사용법:
-------
1. 의존성 설치:
   pip install deep-translator

2. 스크립트 실행:
   python korean_patch.py

출력:
-----
../src/constants/morph_data_ko.json
../src/constants/pangea_data_ko.json
"""

import json
import re
import time
from datetime import datetime
from pathlib import Path

from deep_translator import GoogleTranslator

# ============ 경로 설정 ============
SCRIPT_DIR = Path(__file__).parent.resolve()
CONSTANTS_DIR = SCRIPT_DIR.parent / "src" / "constants"

MORPH_INPUT = CONSTANTS_DIR / "morph_data.json"
MORPH_OUTPUT = CONSTANTS_DIR / "morph_data_ko.json"
PANGEA_INPUT = CONSTANTS_DIR / "pangea_data.json"
PANGEA_OUTPUT = CONSTANTS_DIR / "pangea_data_ko.json"

# ============ 파충류 전문 용어 사전 (Glossary) ============
REPTILE_GLOSSARY = {
    # 사육 용어
    "substrate": "바닥재",
    "Substrate": "바닥재",
    "shedding": "탈피",
    "Shedding": "탈피",
    "enclosure": "사육장",
    "Enclosure": "사육장",
    "terrarium": "테라리움",
    "Terrarium": "테라리움",
    "hatchling": "해칭(베이비)",
    "Hatchling": "해칭(베이비)",
    "juvenile": "준성체",
    "Juvenile": "준성체",
    "adult": "성체",
    "Adult": "성체",
    "gravid": "배란(알을 밴)",
    "Gravid": "배란(알을 밴)",
    "breeding": "브리딩",
    "Breeding": "브리딩",
    "clutch": "클러치(한 배 알)",
    "Clutch": "클러치(한 배 알)",
    
    # 유전 용어
    "morph": "모프",
    "Morph": "모프",
    "gene": "유전 형질",
    "Gene": "유전 형질",
    "recessive": "열성",
    "Recessive": "열성",
    "dominant": "우성",
    "Dominant": "우성",
    "incomplete dominant": "불완전 우성",
    "Incomplete Dominant": "불완전 우성",
    "co-dominant": "공우성",
    "Co-dominant": "공우성",
    "polygenic": "다유전자성",
    "Polygenic": "다유전자성",
    "heterozygous": "헤테로(이형접합)",
    "Heterozygous": "헤테로(이형접합)",
    "homozygous": "호모(동형접합)",
    "Homozygous": "호모(동형접합)",
    "phenotype": "표현형",
    "Phenotype": "표현형",
    "genotype": "유전형",
    "Genotype": "유전형",
    "lineage": "혈통",
    "Lineage": "혈통",
    "trait": "형질",
    "Trait": "형질",
    
    # 종 이름
    "crested gecko": "크레스티드 게코",
    "Crested Gecko": "크레스티드 게코",
    "gargoyle gecko": "가고일 게코",
    "Gargoyle Gecko": "가고일 게코",
    "leopard gecko": "레오파드 게코",
    "Leopard Gecko": "레오파드 게코",
    "chameleon": "카멜레온",
    "Chameleon": "카멜레온",
    
    # 사육 환경
    "humidity": "습도",
    "Humidity": "습도",
    "temperature": "온도",
    "Temperature": "온도",
    "basking": "바스킹(일광욕)",
    "Basking": "바스킹(일광욕)",
    "UVB": "UVB",
    "misting": "미스팅(분무)",
    "Misting": "미스팅(분무)",
    "bioactive": "바이오액티브",
    "Bioactive": "바이오액티브",
    "isopod": "아이소포드(쥐며느리)",
    "Isopod": "아이소포드(쥐며느리)",
    "springtail": "톡토기",
    "Springtail": "톡토기",
    
    # 먹이
    "diet": "사료",
    "Diet": "사료",
    "feeder": "먹이곤충",
    "Feeder": "먹이곤충",
    "cricket": "귀뚜라미",
    "Cricket": "귀뚜라미",
    "dubia": "두비아",
    "Dubia": "두비아",
    "gut-loading": "거트로딩",
    "Gut-loading": "거트로딩",
}

# ============ 모프 이름 한글화 사전 ============
MORPH_NAME_KO = {
    "Lilly White": "릴리 화이트",
    "Axanthic": "악산틱",
    "Dalmatian": "달마시안",
    "Super Dalmatian": "슈퍼 달마시안",
    "Harlequin": "할리퀸",
    "Extreme Harlequin": "익스트림 할리퀸",
    "Pinstripe": "핀스트라이프",
    "Flame": "플레임",
    "Tiger": "타이거",
    "Phantom": "팬텀",
    "Cappuccino": "카푸치노",
    "Cream": "크림",
    "Orange": "오렌지",
    "Red Base": "레드 베이스",
    "Yellow Base": "옐로우 베이스",
    "Black Base": "블랙 베이스",
    "Lavender": "라벤더",
    "Tangerine": "탠저린",
    "Bi-color": "바이컬러",
    "Tri-color": "트라이컬러",
    "Patternless": "패턴리스",
    "Brindle": "브린들",
    "Halloween": "할로윈",
    "Cold Fusion": "콜드 퓨전",
    "Snowflake": "스노우플레이크",
    "Hypo": "하이포",
    "Sable": "세이블",
    "Empty Back": "엠티백",
    "White Wall": "화이트 월",
    "Quad-stripe": "쿼드 스트라이프",
    "Super Stripe": "슈퍼 스트라이프",
    "Soft Scale": "소프트 스케일",
    "Chevron": "셰브론",
    "Crowned": "크라운드",
    "Drippy": "드리피",
    "Fringing": "프린징",
    "Furred": "펄드",
    "Ink Spot": "잉크 스팟",
    "Kneecaps": "니캡",
    "Monochrome": "모노크롬",
    "Oil Spot": "오일 스팟",
    "Olive": "올리브",
    "Portholes": "포트홀",
    "Solid Back": "솔리드 백",
    "White Patterning": "화이트 패터닝",
    "Orange Patterning": "오렌지 패터닝",
    "White Tip": "화이트 팁",
    "Cluster Spots": "클러스터 스팟",
    "Creamsicle": "크림시클",
    "Buckskin": "벅스킨",
    "Blushing": "블러싱",
    "Normal": "노말",
    "Tailless": "테일리스",
    "Hybrid": "하이브리드",
}

# 번역기 초기화
translator = GoogleTranslator(source='en', target='ko')


def apply_glossary(text: str) -> str:
    """전문 용어 사전을 적용하여 번역 품질 향상."""
    for eng, kor in REPTILE_GLOSSARY.items():
        text = text.replace(eng, kor)
    return text


def get_korean_morph_name(eng_name: str) -> str:
    """
    영어 모프 이름을 '한글명 (EngName)' 형식으로 변환.
    """
    # 이름에서 불필요한 부분 제거 (유전타입, 가용성 등)
    parts = eng_name.split()
    
    # 유전 타입 및 기타 키워드 목록
    stop_words = ['Recessive', 'Dominant', 'Incomplete', 'Polygenic', 'Other', 'Physical',
                  'Common', 'Average', 'Higher', 'Lower', 'Rarest', 'Availability',
                  'First', 'produced', 'in', 'At', 'least']
    
    # 이름 부분만 추출
    name_parts = []
    for i, part in enumerate(parts):
        if part in stop_words:
            break
        # 연도 패턴 (2010, 2020 등) 제외
        if re.match(r'^\d{4}$', part):
            break
        name_parts.append(part)
    
    clean_name = ' '.join(name_parts) if name_parts else eng_name.split()[0]
    
    # 사전에서 한글 이름 찾기
    korean_name = MORPH_NAME_KO.get(clean_name, None)
    
    if korean_name:
        return f"{korean_name} ({clean_name})"
    else:
        # 사전에 없으면 영어 이름 유지
        return f"{clean_name}"


def translate_text(text: str, max_length: int = 4500) -> str:
    """
    텍스트를 한국어로 번역.
    긴 텍스트는 청크로 나누어 번역.
    """
    if not text or len(text.strip()) == 0:
        return text
    
    try:
        # Google Translate 제한으로 긴 텍스트는 분할
        if len(text) <= max_length:
            translated = translator.translate(text)
        else:
            # 문장 단위로 분할
            sentences = text.replace('\n', ' [NEWLINE] ').split('. ')
            chunks = []
            current_chunk = ""
            
            for sentence in sentences:
                if len(current_chunk) + len(sentence) < max_length:
                    current_chunk += sentence + ". "
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = sentence + ". "
            
            if current_chunk:
                chunks.append(current_chunk.strip())
            
            # 각 청크 번역
            translated_chunks = []
            for chunk in chunks:
                time.sleep(0.5)  # API 제한 방지
                translated_chunk = translator.translate(chunk)
                translated_chunks.append(translated_chunk)
            
            translated = ' '.join(translated_chunks)
            translated = translated.replace('[NEWLINE]', '\n')
        
        # 전문 용어 사전 적용
        translated = apply_glossary(translated)
        
        return translated
        
    except Exception as e:
        print(f"[WARNING] 번역 실패: {str(e)[:50]}")
        return text


def process_morph_data():
    """모프 데이터 한국어 변환."""
    print("\n" + "=" * 60)
    print("🧬 모프 데이터 한국어 변환 시작")
    print("=" * 60)
    
    if not MORPH_INPUT.exists():
        print(f"[ERROR] 파일을 찾을 수 없습니다: {MORPH_INPUT}")
        return False
    
    with open(MORPH_INPUT, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total = len(data['morphs'])
    translated_morphs = []
    
    for i, morph in enumerate(data['morphs'], 1):
        print(f"[{i}/{total}] {morph['name'][:40]}...")
        
        # 이름 한글화
        ko_name = get_korean_morph_name(morph['name'])
        
        # 설명 번역 (있는 경우)
        ko_description = ""
        if morph.get('description'):
            ko_description = translate_text(morph['description'])
            time.sleep(0.3)
        
        translated_morphs.append({
            "id": morph['id'],
            "name": ko_name,
            "nameEn": morph['name'],
            "type": morph.get('type', ''),
            "description": ko_description,
            "originalUrl": morph['originalUrl']
        })
    
    # 출력 데이터 구성
    output_data = {
        "source": "MorphMarket Morphpedia (한국어 번역)",
        "source_url": data['source_url'],
        "translated_at": datetime.now().isoformat(),
        "translator": "Crestia Korean Patch",
        "total_morphs": len(translated_morphs),
        "morphs": translated_morphs
    }
    
    CONSTANTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(MORPH_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 저장 완료: {MORPH_OUTPUT}")
    return True


def process_pangea_data():
    """Pangea 블로그 데이터 한국어 변환."""
    print("\n" + "=" * 60)
    print("📚 Pangea 블로그 데이터 한국어 변환 시작")
    print("=" * 60)
    
    if not PANGEA_INPUT.exists():
        print(f"[ERROR] 파일을 찾을 수 없습니다: {PANGEA_INPUT}")
        return False
    
    with open(PANGEA_INPUT, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total = len(data['articles'])
    translated_articles = []
    
    for i, article in enumerate(data['articles'], 1):
        print(f"[{i}/{total}] {article['title'][:40]}...")
        
        try:
            # 제목 번역
            ko_title = translate_text(article['title'])
            time.sleep(0.3)
            
            # 요약 번역
            ko_summary = translate_text(article['summary'])
            time.sleep(0.3)
            
            # 본문 번역 (긴 텍스트)
            ko_content = translate_text(article['content'])
            
            # 출처 문구 추가
            ko_content += "\n\n---\n> 🔗 출처: Pangea Reptile Blog (크레스티아 번역)"
            
            translated_articles.append({
                "title": f"{ko_title}",
                "titleEn": article['title'],
                "url": article['url'],
                "summary": ko_summary,
                "content": ko_content,
                "scraped_at": article['scraped_at']
            })
            
            print(f"        ✓ 번역 완료")
            time.sleep(1)  # API 제한 방지
            
        except Exception as e:
            print(f"        ✗ 번역 실패: {e}")
            # 실패 시 원문 유지
            translated_articles.append({
                "title": article['title'],
                "titleEn": article['title'],
                "url": article['url'],
                "summary": article['summary'],
                "content": article['content'] + "\n\n---\n> 🔗 Source: Pangea Reptile Blog",
                "scraped_at": article['scraped_at']
            })
    
    # 출력 데이터 구성
    output_data = {
        "source": "Pangea Reptile Blog (한국어 번역)",
        "source_url": data['source_url'],
        "translated_at": datetime.now().isoformat(),
        "translator": "Crestia Korean Patch",
        "total_articles": len(translated_articles),
        "articles": translated_articles
    }
    
    with open(PANGEA_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 저장 완료: {PANGEA_OUTPUT}")
    return True


def main():
    """메인 실행 함수."""
    start_time = time.time()
    
    print("=" * 60)
    print("🦎 Crestia Korean Patch - 한국어 번역 스크립트")
    print("=" * 60)
    print("\n[INFO] 라이브러리: deep-translator (Google Translate API)")
    print("[INFO] 전문 용어 사전 적용: 활성화")
    
    # 모프 데이터 처리
    process_morph_data()
    
    # Pangea 데이터 처리
    process_pangea_data()
    
    elapsed = time.time() - start_time
    print("\n" + "=" * 60)
    print(f"⏱️ 총 소요 시간: {elapsed / 60:.1f}분")
    print("=" * 60)


if __name__ == "__main__":
    main()
