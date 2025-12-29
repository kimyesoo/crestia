#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Morph Data Merger - 기존 모프 데이터와 백과사전 병합
====================================================
기존 55개 모프 데이터에 백과사전 상세 정보를 매칭하여 병합합니다.

실행: python merge_morph_data.py
출력: src/constants/morph_data_merged.json
"""

import json
import os
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "src", "constants")

# 기존 데이터 파일
EXISTING_FILE = os.path.join(OUTPUT_DIR, "morph_data_ko.json")
ENCYCLOPEDIA_FILE = os.path.join(OUTPUT_DIR, "morph_data_full.json")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "morph_data_merged.json")


def normalize_id(morph_id):
    """ID 정규화 (비교용)"""
    # 긴 ID에서 핵심 부분만 추출
    parts = morph_id.lower().split('-')
    
    # 첫 1-2 단어만 추출 (모프 이름)
    keywords = ['recessive', 'dominant', 'polygenic', 'incomplete', 'other', 
                'physical', 'common', 'average', 'lower', 'higher', 'rarest',
                'availability', 'first', 'produced', 'at', 'least', 'in']
    
    clean_parts = []
    for part in parts:
        if part not in keywords and not part.isdigit():
            clean_parts.append(part)
        else:
            break
    
    return '-'.join(clean_parts) if clean_parts else parts[0]


def extract_type_from_name(name_en):
    """영문명에서 유전 타입 추출"""
    name_lower = name_en.lower()
    
    if 'incomplete dominant' in name_lower:
        return 'Incomplete Dominant'
    elif 'recessive' in name_lower:
        return 'Recessive'
    elif 'dominant' in name_lower:
        return 'Dominant'
    elif 'polygenic' in name_lower:
        return 'Polygenic'
    elif 'physical' in name_lower:
        return 'Physical'
    elif 'other' in name_lower:
        return 'Other'
    return ''


def main():
    print("=" * 60)
    print("🔗 Morph Data Merger - 모프 데이터 병합")
    print("=" * 60)
    
    # 1. 기존 데이터 로드
    with open(EXISTING_FILE, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
    
    print(f"📂 기존 데이터 로드: {len(existing_data['morphs'])}개 모프")
    
    # 2. 백과사전 데이터 로드
    with open(ENCYCLOPEDIA_FILE, 'r', encoding='utf-8') as f:
        encyclopedia_data = json.load(f)
    
    print(f"📚 백과사전 로드: {len(encyclopedia_data['morphs'])}개 모프")
    
    # 3. 백과사전을 ID로 인덱싱
    encyclopedia_map = {}
    for morph in encyclopedia_data['morphs']:
        encyclopedia_map[morph['id']] = morph
    
    # 4. 병합
    merged_morphs = []
    matched_count = 0
    unmatched = []
    
    for morph in existing_data['morphs']:
        # ID 정규화하여 매칭 시도
        normalized = normalize_id(morph['id'])
        
        # 백과사전에서 찾기
        encyclopedia_entry = encyclopedia_map.get(normalized)
        
        # 유전 타입 추출
        extracted_type = extract_type_from_name(morph.get('nameEn', ''))
        
        if encyclopedia_entry:
            # 매칭 성공 - 백과사전 데이터로 보강
            merged_morph = {
                "id": normalized,
                "name": morph['name'],
                "nameEn": morph.get('nameEn', '').split()[0:2] if morph.get('nameEn') else '',
                "type": encyclopedia_entry['type'],
                "summary": encyclopedia_entry['summary'],
                "description": encyclopedia_entry['content'],  # 마크다운 상세 본문
                "originalUrl": morph.get('originalUrl', ''),
                "referenceUrl": encyclopedia_entry.get('referenceUrl', ''),
                "hasEncyclopedia": True
            }
            matched_count += 1
        else:
            # 매칭 실패 - 기본 설명 생성
            unmatched.append(morph['name'])
            merged_morph = {
                "id": normalized,
                "name": morph['name'],
                "nameEn": morph.get('nameEn', ''),
                "type": extracted_type,
                "summary": f"{morph['name']} 모프입니다.",
                "description": f"""## 🧬 유전적 특징

{morph['name']}은(는) **{extracted_type or '미분류'}** 유전 형질입니다.

---

## 🦎 외형 가이드

이 모프에 대한 상세 정보는 준비 중입니다.

---

## 💡 브리딩 팁 & 콤보

더 많은 정보는 MorphMarket을 참고해주세요.

---
<small>참고 자료: [MorphMarket]({morph.get('originalUrl', '')})</small>""",
                "originalUrl": morph.get('originalUrl', ''),
                "hasEncyclopedia": False
            }
        
        merged_morphs.append(merged_morph)
    
    # 5. 결과 저장
    output = {
        "source": "Crestia Morph Encyclopedia",
        "version": "1.0",
        "generated_at": datetime.now().isoformat(),
        "total_morphs": len(merged_morphs),
        "encyclopedia_matched": matched_count,
        "morphs": merged_morphs
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    # 6. 결과 출력
    print("\n" + "-" * 60)
    print(f"✅ 병합 완료!")
    print(f"   📊 전체 모프: {len(merged_morphs)}개")
    print(f"   🎯 백과사전 매칭: {matched_count}개")
    print(f"   ❓ 기본 설명: {len(unmatched)}개")
    print(f"   📁 저장 위치: {OUTPUT_FILE}")
    
    if unmatched:
        print(f"\n📋 매칭되지 않은 모프 ({len(unmatched)}개):")
        for name in unmatched[:10]:
            print(f"   - {name}")
        if len(unmatched) > 10:
            print(f"   ... 외 {len(unmatched) - 10}개")
    
    print("\n" + "=" * 60)
    print("🎉 완료!")


if __name__ == "__main__":
    main()
