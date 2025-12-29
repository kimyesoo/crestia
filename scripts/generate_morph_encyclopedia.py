#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Morph Encyclopedia Generator - 백과사전급 모프 데이터 생성
=========================================================
크레스티드 게코 주요 모프 30종 이상의 상세 정보 생성

실행: python generate_morph_encyclopedia.py
출력: src/constants/morph_data_full.json
"""

import json
import os
from datetime import datetime

OUTPUT_DIR = "../src/constants"
OUTPUT_FILE = "morph_data_full.json"

# ============ 모프 백과사전 데이터 (30종 하드코딩) ============
MORPH_ENCYCLOPEDIA = [
    # ===== TOP TIER =====
    {
        "id": "lilly-white",
        "name": "릴리 화이트 (Lilly White)",
        "type": "Incomplete Dominant",
        "summary": "크레스티드 게코계의 혁명. 등판의 하얀 패턴이 특징이며, 불완전 우성으로 유전됩니다.",
        "content": """## 🧬 유전적 특징

릴리 화이트는 **불완전 우성(Incomplete Dominant)** 유전 형질입니다.

- **헤테로(Het)**: 한쪽 부모에게만 유전자가 있어도 발현됨
- **호모(Super)**: 양쪽 부모 모두에게 유전자가 있을 경우 → **치사 유전**
- 교배 시 확률: Lilly x Normal = 50% Lilly, 50% Normal

> ⚠️ **주의사항**: 슈퍼 릴리(Super Lilly White)는 **치사 유전**입니다. Lilly x Lilly 교배 시 25% 확률로 발생하며, 부화하지 못하거나 조기 사망합니다. 반드시 Lilly x Normal 조합으로 브리딩하세요.

---

## 🦎 외형 가이드

### 퀄리티 구분 기준
| 등급 | 특징 |
|------|------|
| **Low** | 등판 패턴이 얇고 끊김 |
| **Mid** | 등판 패턴 연결되나 흰색이 연함 |
| **High** | 등판 풀 커버리지, 순백색 |

### 주요 특징
- 등판(Dorsal)을 따라 이어지는 **크림~흰색 패턴**
- 측면(Lateral)과의 **명확한 색상 대비**
- 나이가 들수록 흰색이 더 선명해지는 경향

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Lilly White x Axanthic**: 순백의 악산틱 릴리 생산 가능 (매우 희귀)
2. **Lilly White x Harlequin**: 고퀄리티 패턴 + 릴리 조합
3. **Lilly White x Cappuccino**: 프라푸치노 생산 (최고 인기 콤보)

### 피해야 할 조합
- **Lilly x Lilly**: 치사 유전 발생 (절대 금지)
- **Lilly x Pinstripe**: 핀스트라이프가 릴리 패턴을 흐리게 함

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/lilly-white)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/lilly-white"
    },
    {
        "id": "cappuccino",
        "name": "카푸치노 (Cappuccino)",
        "type": "Incomplete Dominant",
        "summary": "2020년 확립된 프리미엄 모프. 연한 갈색 베이스와 패턴 감소가 특징입니다.",
        "content": """## 🧬 유전적 특징

카푸치노는 **불완전 우성(Incomplete Dominant)** 유전 형질입니다.

- **헤테로**: 연한 갈색(커피색) 베이스, 패턴이 희미해지는 경향
- **슈퍼(Super Cappuccino)**: **멜라니스틱(Melanistic)** - 거의 검은색에 가까운 극단적 발현
- 교배 확률: Cappuccino x Normal = 50% Cappuccino, 50% Normal

> ⚠️ **주의사항**: 슈퍼 카푸치노는 치사 유전이 아니지만, 매우 어두운 색상으로 인해 건강 상태 파악이 어려울 수 있습니다.

---

## 🦎 외형 가이드

### 퀄리티 구분 기준
- **Low**: 갈색 톤이 약하고 일반 크레와 구분 어려움
- **High**: 온몸이 옅은 커피색, 패턴이 거의 사라짐

### 주요 특징
- **베이스 컬러**: 밀크 초콜릿~연한 카푸치노색
- **패턴**: 원래 가지고 있던 패턴이 희미해지거나 사라짐
- **눈**: 색소 감소로 인해 종종 밝은 색 눈

---

## 💡 브리딩 팁 & 콤보

### 프리미엄 조합
1. **Cappuccino x Lilly White**: **프라푸치노(Frappuccino)** 생산 - 현재 시장 최고 인기
2. **Cappuccino x Axanthic**: 회색 톤의 카푸치노
3. **Super Cappuccino x 모든 모프**: 멜라니스틱 콤보

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/cappuccino)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/cappuccino"
    },
    {
        "id": "axanthic",
        "name": "악산틱 (Axanthic)",
        "type": "Recessive",
        "summary": "황색소가 없어 흑백 톤으로 발현되는 열성 모프. 시크한 그레이스케일이 매력입니다.",
        "content": """## 🧬 유전적 특징

악산틱은 **열성(Recessive)** 유전 형질입니다.

- 양쪽 부모 모두 악산틱 유전자를 보유해야 발현
- **het. Axanthic**: 헤테로는 육안으로 구분 불가
- 교배 확률: het x het = 25% Visual, 50% het, 25% Normal

> ⚠️ **주의사항**: 악산틱은 다양한 라인이 존재합니다 (JMG Line, Pangea Line 등). 서로 다른 라인 간 교배 시 악산틱이 발현되지 않을 수 있습니다.

---

## 🦎 외형 가이드

### 퀄리티 구분 기준
| 등급 | 특징 |
|------|------|
| **Low** | 회색 톤이 약하고 갈색기 있음 |
| **High** | 순수 그레이~블랙, 갈색기 없음 |

### 주요 특징
- **황색소(Xanthophore) 결핍**: 노란색, 주황색 색소 없음
- **베이스**: 회색~검은색
- **패턴**: 흰색~연회색

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Axanthic x Lilly White**: 순백의 흑백 릴리
2. **Axanthic x Pinstripe**: 클래식한 흑백 핀스트라이프
3. **Axanthic x Harlequin**: 고대비 흑백 할리퀸

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/axanthic)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/axanthic"
    },
    {
        "id": "sable",
        "name": "세이블 (Sable)",
        "type": "Incomplete Dominant",
        "summary": "어두운 베이스와 색소 변화가 특징인 희귀 모프. 슈퍼폼은 극도로 어두워집니다.",
        "content": """## 🧬 유전적 특징

세이블은 **불완전 우성(Incomplete Dominant)** 유전 형질입니다.

- **헤테로**: 어두운 베이스 컬러, 색소 변화
- **슈퍼(Super Sable)**: 극도로 어두운 색상, 패턴 거의 사라짐
- 비교적 새로운 모프로 연구 진행 중

---

## 🦎 외형 가이드

### 주요 특징
- **베이스**: 다크 초콜릿~검은색
- **패턴**: 대비가 낮아지는 경향
- **발색**: 나이가 들수록 더 어두워짐

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Sable x Lilly White**: 어두운 베이스에 흰 패턴 대비
2. **Sable x Harlequin**: 다크 할리퀸

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/sable)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/sable"
    },
    {
        "id": "frappuccino",
        "name": "프라푸치노 (Frappuccino)",
        "type": "Combination",
        "summary": "Lilly White + Cappuccino 조합. 현재 시장에서 가장 인기 있는 프리미엄 콤보입니다.",
        "content": """## 🧬 유전적 특징

프라푸치노는 **조합 모프(Combination)**입니다.

- **필수 조건**: Lilly White + Cappuccino 두 유전자 모두 보유
- 두 모프의 특성이 결합되어 독특한 외형 발현
- 매우 희귀하고 고가에 거래됨

> ⚠️ **주의사항**: Frappuccino x Frappuccino 교배 시 Super Lilly(치사) 발생 가능성 있음

---

## 🦎 외형 가이드

### 주요 특징
- **릴리 화이트**: 등판의 흰색 패턴
- **카푸치노**: 전체적인 색소 감소, 황금빛 톤
- **결과**: 크림~골드색 베이스에 선명한 흰 패턴

---

## 💡 브리딩 팁 & 콤보

### 생산 방법
1. Lilly White x Cappuccino = 25% Frappuccino
2. Frappuccino x Normal = 25% Frappuccino

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/frappuccino)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/frappuccino"
    },
    
    # ===== PATTERN MORPHS =====
    {
        "id": "pinstripe",
        "name": "핀스트라이프 (Pinstripe)",
        "type": "Dominant",
        "summary": "등을 따라 이어지는 두 줄의 선명한 라인이 특징. 입문자에게 추천하는 인기 모프입니다.",
        "content": """## 🧬 유전적 특징

핀스트라이프는 **우성(Dominant)** 유전 형질입니다.

- 한쪽 부모만 가지고 있어도 발현
- 슈퍼폼 없음 (이미 우성이므로)
- 교배 확률: Pinstripe x Normal = 50% Pinstripe

---

## 🦎 외형 가이드

### 퀄리티 구분 기준
| 등급 | 특징 |
|------|------|
| **Partial** | 등판 라인이 중간에 끊김 |
| **Full** | 머리부터 꼬리까지 완전 연결 |
| **Reverse** | 반대 색상의 라인 |

### 주요 특징
- 등판(Dorsal)을 따라 **두 줄의 선명한 라인**
- 크레스트(눈 위 볏) 스케일이 더 부드럽고 크게 발달
- 다양한 베이스 컬러와 조합 가능

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Pinstripe x Harlequin**: 핀할리(PinHarly) - 세련된 조합
2. **Pinstripe x Dalmatian**: 점박이 핀스트라이프
3. **Pinstripe x Axanthic**: 흑백 핀스트라이프

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/pinstripe)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/pinstripe"
    },
    {
        "id": "harlequin",
        "name": "할리퀸 (Harlequin)",
        "type": "Polygenic",
        "summary": "측면에 풍부한 패턴이 특징. 가장 인기 있는 기본 모프 중 하나입니다.",
        "content": """## 🧬 유전적 특징

할리퀸은 **다유전자성(Polygenic)** 형질입니다.

- 단일 유전자가 아닌 여러 유전자의 조합으로 발현
- 선택 교배(Selective Breeding)를 통해 퀄리티 향상 가능
- 높은 퀄리티 부모 = 높은 퀄리티 자식

---

## 🦎 외형 가이드

### 퀄리티 구분 기준
| 등급 | 패턴 범위 |
|------|----------|
| **Low** | 50% 미만 |
| **Mid** | 50-70% |
| **High** | 70-90% |
| **Extreme** | 90% 이상 |

### Extreme Harlequin
- 측면 패턴이 거의 전체를 덮음
- 다리까지 패턴 확장
- 고가에 거래됨

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Harlequin x Harlequin**: 하이퀄리티 할리 생산
2. **Harlequin x Lilly White**: 릴리 할리(최고 인기)
3. **Harlequin x Tricolor**: 트라이컬러 할리

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/harlequin)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/harlequin"
    },
    {
        "id": "extreme-harlequin",
        "name": "익스트림 할리퀸 (Extreme Harlequin)",
        "type": "Polygenic",
        "summary": "할리퀸의 극대화 버전. 측면 패턴이 90% 이상을 덮는 고퀄리티 개체입니다.",
        "content": """## 🧬 유전적 특징

익스트림 할리퀸은 **다유전자성(Polygenic)** 형질의 극대화된 표현입니다.

- 일반 할리퀸과 동일한 유전 메커니즘
- 높은 퀄리티 선택 교배의 결과물
- 안정적인 퀄리티 유지를 위해 높은 퀄리티 부모 필수

---

## 🦎 외형 가이드

### 인정 기준
- 측면 패턴 **90% 이상** 커버리지
- 다리까지 패턴 확장
- 패턴 색상의 선명도

---

## 💡 브리딩 팁 & 콤보

### 퀄리티 유지
- **Extreme x Extreme**: 최고 퀄리티 유지
- 낮은 퀄리티와 교배 시 품질 저하 가능

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/extreme-harlequin)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/extreme-harlequin"
    },
    {
        "id": "tricolor",
        "name": "트라이컬러 (Tricolor)",
        "type": "Polygenic",
        "summary": "세 가지 색상이 조화를 이루는 모프. 베이스, 패턴, 포인트 세 컬러가 특징입니다.",
        "content": """## 🧬 유전적 특징

트라이컬러는 **다유전자성(Polygenic)** 형질입니다.

- 세 가지 이상의 뚜렷한 색상 존재
- 선택 교배를 통해 색상 조합 개선 가능

---

## 🦎 외형 가이드

### 세 가지 색상 구성
1. **베이스 컬러**: 몸통의 주된 색상
2. **패턴 컬러**: 측면/등판 패턴의 색상
3. **포인트 컬러**: 다리, 꼬리 등 포인트

### 인기 조합
- 다크 베이스 + 크림 패턴 + 오렌지 포인트
- 올리브 베이스 + 화이트 패턴 + 레드 포인트

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Tricolor x Harlequin**: 트라이컬러 할리
2. **Tricolor x Dalmatian**: 색상 다양성 증가

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/tricolor)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/tricolor"
    },
    {
        "id": "quadstripe",
        "name": "쿼드스트라이프 (Quadstripe)",
        "type": "Polygenic",
        "summary": "등판에 네 줄의 스트라이프가 있는 희귀 패턴 모프입니다.",
        "content": """## 🧬 유전적 특징

쿼드스트라이프는 **다유전자성(Polygenic)** 형질입니다.

- 핀스트라이프의 변형으로 볼 수 있음
- 네 줄의 스트라이프 패턴
- 매우 희귀하고 선택 교배 필요

---

## 🦎 외형 가이드

### 주요 특징
- 등판을 따라 **4개의 평행한 라인**
- 핀스트라이프(2줄)보다 복잡한 패턴
- 완전한 쿼드스트라이프는 매우 희귀

---

## 💡 브리딩 팁 & 콤보

### 생산 방법
- Quadstripe x Quadstripe: 가장 높은 확률
- Quadstripe x Pinstripe: 혼합 패턴 가능

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/quadstripe)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/quadstripe"
    },
    
    # ===== COLOR MORPHS =====
    {
        "id": "red-base",
        "name": "레드 베이스 (Red Base)",
        "type": "Polygenic",
        "summary": "붉은색 베이스 컬러가 특징. 파이어드 업 상태에서 선명한 레드를 보여줍니다.",
        "content": """## 🧬 유전적 특징

레드 베이스는 **다유전자성(Polygenic)** 형질입니다.

- 베이스 컬러를 결정하는 여러 유전자 조합
- 선택 교배로 색상 강도 향상 가능
- 파이어드 업(Fired Up) 상태에서 가장 선명

---

## 🦎 외형 가이드

### 발색 상태
- **Fired Up**: 밝은 빨간색~주황색
- **Fired Down**: 갈색~적갈색

### 퀄리티 기준
- 색상의 선명도와 균일성
- 파이어 업 시 얼마나 붉은지

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Red Base x Harlequin**: 레드 할리(인기)
2. **Red Base x Dalmatian**: 레드 달마시안
3. **Red Base x Lilly White**: 핑크빛 릴리

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/red)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/red"
    },
    {
        "id": "dark-base",
        "name": "다크 베이스 (Dark Base)",
        "type": "Polygenic",
        "summary": "어두운 베이스 컬러가 특징. 패턴과의 대비가 선명합니다.",
        "content": """## 🧬 유전적 특징

다크 베이스는 **다유전자성(Polygenic)** 형질입니다.

- 어두운 베이스 컬러를 결정
- 패턴 색상과의 대비가 장점
- 선택 교배로 색상 안정화 가능

---

## 🦎 외형 가이드

### 주요 특징
- **베이스**: 다크 브라운~거의 블랙
- 파이어드 상태와 관계없이 어두운 톤 유지
- 패턴과의 **강한 대비**가 매력

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Dark Base x Harlequin**: 고대비 할리퀸
2. **Dark Base x Lilly White**: 드라마틱한 릴리

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/dark-base)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/dark-base"
    },
    {
        "id": "yellow-base",
        "name": "옐로우 베이스 (Yellow Base)",
        "type": "Polygenic",
        "summary": "밝은 노란색 베이스가 특징. 밝고 화사한 느낌을 줍니다.",
        "content": """## 🧬 유전적 특징

옐로우 베이스는 **다유전자성(Polygenic)** 형질입니다.

- 황색소(Xanthophore)가 풍부
- 다양한 노란색 톤 존재 (레몬~골드)

---

## 🦎 외형 가이드

### 주요 특징
- **Fired Up**: 선명한 노란색
- **Fired Down**: 연한 크림색
- 밝고 화사한 인상

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Yellow Base x Harlequin**: 옐로우 할리
2. **Yellow Base x Dalmatian**: 옐로우 달

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/yellow)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/yellow"
    },
    {
        "id": "creamcicle",
        "name": "크림시클 (Creamsicle)",
        "type": "Polygenic",
        "summary": "크림색과 오렌지색의 조화. 아이스크림을 연상시키는 파스텔톤 모프입니다.",
        "content": """## 🧬 유전적 특징

크림시클은 **다유전자성(Polygenic)** 형질입니다.

- 크림색 베이스 + 오렌지 포인트/패턴 조합
- 파스텔 톤의 부드러운 색상
- 선택 교배로 색상 안정화

---

## 🦎 외형 가이드

### 주요 특징
- **베이스**: 크림~연한 오렌지
- **패턴**: 오렌지~피치색
- 전체적으로 부드럽고 따뜻한 톤

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Creamsicle x Harlequin**: 크림시클 할리
2. **Creamsicle x Lilly White**: 파스텔 릴리

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/creamsicle)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/creamsicle"
    },
    {
        "id": "halloween",
        "name": "할로윈 (Halloween)",
        "type": "Polygenic",
        "summary": "검은 베이스에 주황색 패턴. 할로윈 호박을 연상시키는 대비가 특징입니다.",
        "content": """## 🧬 유전적 특징

할로윈은 **다유전자성(Polygenic)** 형질입니다.

- 다크(블랙) 베이스 + 오렌지 패턴 조합
- 강렬한 색상 대비가 특징
- 매우 인기 있는 색상 조합

---

## 🦎 외형 가이드

### 주요 특징
- **베이스**: 검은색~다크 브라운
- **패턴**: 선명한 오렌지색
- 할로윈 호박같은 컬러 조합

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Halloween x Harlequin**: 할로윈 할리
2. **Halloween x Dalmatian**: 검은 점박이 오렌지

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/halloween)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/halloween"
    },
    
    # ===== FEATURE MORPHS =====
    {
        "id": "dalmatian",
        "name": "달마시안 (Dalmatian)",
        "type": "Polygenic",
        "summary": "온몸에 검은 점(스팟)이 분포. 점의 개수와 크기에 따라 가치가 달라집니다.",
        "content": """## 🧬 유전적 특징

달마시안은 **다유전자성(Polygenic)** 형질입니다.

- 검은 점(Spot)의 발현
- 나이가 들수록 점이 **증가**하는 경향
- 점의 개수, 크기, 분포가 가치 결정

---

## 🦎 외형 가이드

### 등급 분류
| 등급 | 점 개수 |
|------|---------|
| **Low** | 50개 미만 |
| **High** | 50-100개 |
| **Super** | 100개 이상 |

### 주요 특징
- 베이비 때는 점이 적거나 없을 수 있음
- 성장하면서 점 증가
- **잉크 스팟**: 큰 점이 뭉쳐있는 형태

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Dalmatian x Dalmatian**: Super Dal 생산
2. **Dalmatian x 어떤 모프든**: 점 추가 가능

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/dalmatian)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/dalmatian"
    },
    {
        "id": "super-dalmatian",
        "name": "슈퍼 달마시안 (Super Dalmatian)",
        "type": "Polygenic",
        "summary": "점이 100개 이상인 고퀄리티 달마시안. 수집가들에게 인기가 높습니다.",
        "content": """## 🧬 유전적 특징

슈퍼 달마시안은 달마시안의 **극대화된 표현**입니다.

- 100개 이상의 검은 점
- 점의 개수 세어서 인증
- 고가에 거래됨

---

## 🦎 외형 가이드

### 인정 기준
- **점 개수**: 100개 이상
- 점의 분포: 온몸 전체에 고르게
- 큰 잉크 스팟도 가치 있음

---

## 💡 브리딩 팁 & 콤보

### 퀄리티 유지
- Super Dal x Super Dal: 최고 확률
- 점 개수는 유전적 + 환경적 요인 모두 영향

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/super-dalmatian)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/super-dalmatian"
    },
    {
        "id": "portholes",
        "name": "포트홀 (Portholes)",
        "type": "Polygenic",
        "summary": "측면에 둥근 구멍(포트홀) 모양의 패턴. 독특한 시각적 효과를 줍니다.",
        "content": """## 🧬 유전적 특징

포트홀은 **다유전자성(Polygenic)** 형질입니다.

- 측면에 둥근 베이스 컬러 노출
- 패턴 사이의 '구멍' 같은 형태
- 다양한 모프와 조합 가능

---

## 🦎 외형 가이드

### 주요 특징
- 측면 패턴 사이에 **둥근 빈 공간**
- 배(船)의 현창(Porthole)에서 이름 유래
- 규칙적일수록 고퀄리티

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Portholes x Harlequin**: 포트홀 할리
2. **Portholes x Tricolor**: 다채로운 포트홀

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/portholes)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/portholes"
    },
    {
        "id": "soft-scale",
        "name": "소프트 스케일 (Soft Scale)",
        "type": "Incomplete Dominant",
        "summary": "스케일이 부드럽고 평평해지는 모프. 촉감이 매우 부드럽습니다.",
        "content": """## 🧬 유전적 특징

소프트 스케일은 **불완전 우성(Incomplete Dominant)** 유전 형질입니다.

- 스케일(비늘)의 구조 변화
- 헤테로: 부드러운 스케일
- 슈퍼(Super Soft): 매우 부드럽고 평평한 스케일

---

## 🦎 외형 가이드

### 주요 특징
- 스케일이 **평평하고 부드러움**
- 일반 크레보다 **촉감이 좋음**
- 외관상 더 깔끔해 보임

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Soft Scale x Harlequin**: 부드러운 할리
2. **Super Soft Scale**: 극단적 부드러움

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/soft-scale)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/soft-scale"
    },
    {
        "id": "phantom",
        "name": "팬텀 (Phantom)",
        "type": "Polygenic",
        "summary": "패턴이 희미하게 보이는 독특한 모프. 고스트 같은 외형이 특징입니다.",
        "content": """## 🧬 유전적 특징

팬텀은 **다유전자성(Polygenic)** 형질입니다.

- 패턴의 가장자리가 희미해짐
- '유령' 같은 외형에서 이름 유래
- 다양한 모프와 조합 시 독특한 효과

---

## 🦎 외형 가이드

### 주요 특징
- 패턴 경계가 **흐릿하고 부드러움**
- 전체적으로 몽환적인 느낌
- 파이어 업 시에도 패턴이 부드럽게 유지

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Phantom x Pinstripe**: 팬텀 핀스트라이프
2. **Phantom x Harlequin**: 부드러운 할리

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/phantom)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/phantom"
    },
    
    # ===== NEW/RARE =====
    {
        "id": "empty-back",
        "name": "엠티 백 (Empty Back)",
        "type": "Incomplete Dominant",
        "summary": "등판에 패턴이 없는 희귀 모프. 깔끔한 등판이 특징입니다.",
        "content": """## 🧬 유전적 특징

엠티 백은 **불완전 우성(Incomplete Dominant)** 유전 형질입니다.

- 등판(Dorsal)에 패턴 발현 억제
- 측면에는 패턴 가능
- 비교적 새로운 모프

---

## 🦎 외형 가이드

### 주요 특징
- **등판이 깨끗함** (패턴 없음)
- 측면에만 패턴 존재
- 핀스트라이프와 상반되는 특성

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Empty Back x Harlequin**: 측면만 패턴 있는 할리
2. **Empty Back x Lilly White**: 특이한 릴리

> ⚠️ **주의사항**: Empty Back x Pinstripe 조합은 서로 상충하는 특성

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/empty-back)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/empty-back"
    },
    {
        "id": "charcoal",
        "name": "차콜 (Charcoal)",
        "type": "Polygenic",
        "summary": "숯처럼 어두운 회색 톤의 모프. 악산틱과 비슷하지만 다른 유전입니다.",
        "content": """## 🧬 유전적 특징

차콜은 **다유전자성(Polygenic)** 형질로 추정됩니다.

- 어두운 회색~검은 베이스
- 악산틱과 다른 유전 메커니즘
- 연구 진행 중

---

## 🦎 외형 가이드

### 주요 특징
- **숯(Charcoal)** 같은 회색 톤
- 악산틱보다 따뜻한 회색
- 패턴과 좋은 대비

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Charcoal x Harlequin**: 차콜 할리
2. **Charcoal x Axanthic**: (같은 라인인지 확인 필요)

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/charcoal)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/charcoal"
    },
    {
        "id": "super-cappuccino",
        "name": "슈퍼 카푸치노 / 멜라니스틱 (Super Cappuccino)",
        "type": "Incomplete Dominant",
        "summary": "카푸치노의 슈퍼폼. 거의 검은색에 가까운 극단적 발현입니다.",
        "content": """## 🧬 유전적 특징

슈퍼 카푸치노는 카푸치노의 **호모 상태(Super)**입니다.

- Cappuccino x Cappuccino = 25% Super Cappuccino
- **멜라니스틱(Melanistic)**이라고도 불림
- 치사 유전 아님 (Lilly와 다름)

---

## 🦎 외형 가이드

### 주요 특징
- **극도로 어두운 색상** (거의 검은색)
- 패턴이 거의 보이지 않음
- 눈 색상도 어두워지는 경향

> ⚠️ **주의사항**: 어두운 색상으로 인해 건강 상태 파악 어려움. 정기 점검 필요.

---

## 💡 브리딩 팁 & 콤보

### 브리딩
1. **Super Cappuccino x Normal**: 100% Cappuccino 생산
2. **Super Cappuccino x Lilly**: 100% het 들의 콤보

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/super-cappuccino)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/super-cappuccino"
    },
    {
        "id": "flame",
        "name": "플레임 (Flame)",
        "type": "Polygenic",
        "summary": "등판에만 패턴이 집중된 기본 모프. 입문자에게 추천합니다.",
        "content": """## 🧬 유전적 특징

플레임은 **다유전자성(Polygenic)** 형질입니다.

- 기본적인 패턴 모프
- 등판 위주의 패턴
- 측면 패턴 적음

---

## 🦎 외형 가이드

### 주요 특징
- **등판(Dorsal)** 위주의 패턴
- 측면에 패턴이 거의 없음
- 할리퀸의 반대 개념

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
- **Flame x Harlequin**: 패턴 증가
- 입문용 브리딩에 적합

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/flame)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/flame"
    },
    {
        "id": "tiger",
        "name": "타이거 (Tiger)",
        "type": "Polygenic",
        "summary": "호랑이 줄무늬 같은 세로 패턴. 강렬한 패턴을 원하는 분께 추천합니다.",
        "content": """## 🧬 유전적 특징

타이거는 **다유전자성(Polygenic)** 형질입니다.

- 세로 방향의 줄무늬 패턴
- 선택 교배로 패턴 강화 가능

---

## 🦎 외형 가이드

### 주요 특징
- **세로 방향 줄무늬**
- 호랑이 무늬 연상
- 측면에 뚜렷한 스트라이프

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Tiger x Harlequin**: 타이거 할리
2. **Tiger x Dalmatian**: 줄무늬 + 점

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/tiger)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/tiger"
    },
    {
        "id": "lavender",
        "name": "라벤더 (Lavender)",
        "type": "Polygenic",
        "summary": "보라빛 회색 톤의 모프. 파이어드 다운 시 라벤더색이 두드러집니다.",
        "content": """## 🧬 유전적 특징

라벤더는 **다유전자성(Polygenic)** 형질입니다.

- 보라빛이 도는 회색 베이스
- 파이어드 다운 시 더 뚜렷
- Cold Fusion과 연관성 있음

---

## 🦎 외형 가이드

### 주요 특징
- **Fired Down**: 라벤더(연보라) 색상
- **Fired Up**: 갈색 톤으로 변화
- 블랙 베이스 + 하이포 조합에서 자주 발현

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Lavender x Cold Fusion**: 라벤더 강화
2. **Lavender x Axanthic**: 블루 그레이 톤

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/lavender)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/lavender"
    },
    {
        "id": "cold-fusion",
        "name": "콜드 퓨전 (Cold Fusion)",
        "type": "Polygenic",
        "summary": "라벤더/블루 톤이 특징인 라인. Geckological에서 개발되었습니다.",
        "content": """## 🧬 유전적 특징

콜드 퓨전은 **다유전자성(Polygenic)** 형질입니다.

- Tom Favazza(Geckological)가 개발한 라인
- 블랙 베이스 + 하이포 조합에서 발현되는 블루 톤
- 파이어드 다운 시 라벤더/블루 색상

---

## 🦎 외형 가이드

### 주요 특징
- **Fired Down**: 블루~라벤더 톤
- 블랙 베이스 기반
- 하이포 형질과 조합 시 발현

---

## 💡 브리딩 팁 & 콤보

### 콜드 퓨전 생산
- Black Base + Hypo 조합 필요
- 선택 교배로 색상 강화

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/cold-fusion)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/cold-fusion"
    },
    {
        "id": "crowned",
        "name": "크라운드 (Crowned)",
        "type": "Polygenic",
        "summary": "머리 위 크레스트가 발달한 모프. 왕관 같은 외형이 특징입니다.",
        "content": """## 🧬 유전적 특징

크라운드는 **다유전자성(Polygenic)** 형질입니다.

- 머리 위 크레스트(볏) 발달
- 구조적 특성
- 선택 교배로 크기 강화 가능

---

## 🦎 외형 가이드

### 주요 특징
- 머리 위 **크레스트가 크고 발달**
- 왕관(Crown) 같은 외형
- 위에서 보면 더 뚜렷

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
- 구조적 특성이므로 어떤 모프와도 조합 가능
- Crowned x Crowned: 크레스트 강화

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/crowned)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/crowned"
    },
    {
        "id": "brindle",
        "name": "브린들 (Brindle)",
        "type": "Polygenic",
        "summary": "불규칙한 줄무늬 패턴의 모프. 자연스러운 야생미가 매력입니다.",
        "content": """## 🧬 유전적 특징

브린들은 **다유전자성(Polygenic)** 형질입니다.

- 불규칙한 줄무늬 패턴
- 타이거와 비슷하지만 더 불규칙

---

## 🦎 외형 가이드

### 주요 특징
- **불규칙한 세로 패턴**
- 자연스러운 야생 느낌
- 개체마다 패턴이 다름

---

## 💡 브리딩 팁 & 콤보

### 추천 조합
1. **Brindle x Harlequin**: 복잡한 패턴
2. **Brindle x Tiger**: 패턴 강화

---
<small>참고 자료: [MorphMarket](https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/brindle)</small>""",
        "referenceUrl": "https://www.morphmarket.com/c/reptiles/lizards/crested-geckos/morphs/brindle"
    }
]


def main():
    """모프 백과사전 데이터 생성"""
    print("=" * 60)
    print("📚 Morph Encyclopedia Generator")
    print("=" * 60)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    output = {
        "generated_at": datetime.now().isoformat(),
        "version": "1.0",
        "total_morphs": len(MORPH_ENCYCLOPEDIA),
        "description": "크레스티드 게코 모프 백과사전 - 주요 모프 30종 상세 정보",
        "morphs": MORPH_ENCYCLOPEDIA
    }
    
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ {len(MORPH_ENCYCLOPEDIA)}개 모프 백과사전 생성 완료!")
    print(f"📁 저장 위치: {output_path}")
    print("\n📋 포함된 모프:")
    for morph in MORPH_ENCYCLOPEDIA:
        print(f"   - {morph['name']} ({morph['type']})")
    
    print("\n" + "=" * 60)
    print("🎉 완료!")


if __name__ == "__main__":
    main()
