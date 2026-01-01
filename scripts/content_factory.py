#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Content Factory - 초기 시드 데이터 생성 스크립트
==============================================
사이트 런칭 시 '빈 집'처럼 보이지 않도록
현실감 있는 초기 데이터를 대량 생성합니다.

실행: python content_factory.py
출력: src/constants/initial_qna.json, morph_list_full.json
"""

import json
import random
import os
from datetime import datetime, timedelta

# ============ 경로 설정 ============
OUTPUT_DIR = "../src/constants"

# ============ 닉네임 풀 (20개) ============
NICKNAMES = [
    "크레집사", "도마뱀조아", "GeckoLover", "뉴칼레도니아", "왕초보",
    "모프수집가", "야행성친구", "파충류덕후", "게코사랑", "릴리화이트",
    "크레사육러", "Gecko_Master", "초록이맘", "콩이아빠", "주니어집사",
    "크레스트", "게코홀릭", "NewCaledon", "겍사랑해", "열대우림"
]

# ============ 말머리 풀 ============
PREFIXES = [
    "급해요 ㅠㅠ", "질문드립니다!", "초보입니다", "이거 정상인가요?",
    "도와주세요!", "궁금한 게 있어요", "처음인데요", "경험자분들..",
    "급질문!", "[질문]", "걱정이에요", "혹시요..", "여쭤볼게요"
]

# ============ Q&A 토픽 (10가지) ============
QNA_TOPICS = [
    {
        "topic": "먹이 거부",
        "questions": ["밥을 안 먹어요", "CGD를 거부합니다", "3일째 안 먹는데 괜찮나요?"],
        "content": "분양받은 지 얼마 안 됐는데 밥을 통 안 먹어요. 온도 25도, 습도 70% 맞추고 있는데... 스트레스 받은 걸까요?",
        "answer": "적응기일 수 있습니다. 3~4일 정도는 지켜보시고, 귀뚜라미 즙을 살짝 묻혀보세요. 2주 이상 지속되면 수의사 상담 권장합니다."
    },
    {
        "topic": "탈피 부전",
        "questions": ["탈피 껍질이 남았어요", "발가락에 허물이 안 벗겨져요", "눈에 허물이 낀 것 같아요"],
        "content": "탈피를 했는데 발가락 끝에 허물이 남아있어요. 습도가 부족했던 걸까요? 어떻게 해야 하나요?",
        "answer": "습도가 부족했나 봅니다. 사우나(젖은 통)를 15분 정도 해주시고 면봉으로 살살 밀어주세요. 억지로 뜯으면 안 돼요!"
    },
    {
        "topic": "성별 구분",
        "questions": ["우리 크레 암컷인가요?", "성별 구분법 알려주세요", "수컷 특징이 뭔가요?"],
        "content": "6개월 정도 됐는데 성별 확인이 안 돼요. 꼬리 밑 사진 첨부했는데 봐주실 수 있나요?",
        "answer": "보통 15~20g 정도면 확실해지지만, 루페로 천공을 보면 5g부터도 고수들은 구별합니다. 수컷은 꼬리 밑이 볼록해요!"
    },
    {
        "topic": "합사 질문",
        "questions": ["두 마리 합사해도 되나요?", "암컷끼리 합사 가능한가요?", "수컷끼리 싸우나요?"],
        "content": "친구를 들여주고 싶은데 합사해도 괜찮을까요? 케이지는 45x45x60이에요.",
        "answer": "비추천합니다. 크레는 독립 생활을 하며, 꼬리 잘림이나 싸움이 일어날 수 있습니다. 단독 사육이 안전해요."
    },
    {
        "topic": "온도 관리",
        "questions": ["온도 28도 괜찮나요?", "겨울에 히터 필요한가요?", "여름에 너무 더워요"],
        "content": "요즘 방 온도가 28도가 넘는데 괜찮을까요? 에어컨 틀어야 하나요?",
        "answer": "위험합니다! 크레는 고온에 약해요. 28도가 넘어가면 아이스팩이나 에어컨으로 쿨링해주세요. 적정 온도는 22-26도입니다."
    },
    {
        "topic": "습도 관리",
        "questions": ["습도 유지가 어려워요", "하루에 분무 몇 번?", "습도가 너무 낮아요"],
        "content": "습도가 50%밖에 안 올라가요. 분무를 자주 해도 금방 떨어지는데 어떻게 해야 하나요?",
        "answer": "코코넛 파이버 바닥재 사용하시고, 아침저녁 분무 추천해요. 환기도 중요하니 완전 밀폐하진 마세요. 60-80%가 적정입니다."
    },
    {
        "topic": "핸들링",
        "questions": ["핸들링 언제부터?", "물려요 ㅠㅠ", "핸들링하면 도망가요"],
        "content": "분양받은 지 일주일 됐는데 핸들링해도 될까요? 빨리 친해지고 싶어요.",
        "answer": "입양 후 최소 1주일은 적응기(No Touch)를 가져야 합니다. 그 후 5분씩 짧게 시작하세요. 급하면 오히려 역효과예요!"
    },
    {
        "topic": "건강 이상",
        "questions": ["꼬리가 구불거려요", "눈이 부었어요", "배변을 안 해요"],
        "content": "꼬리가 좀 휘어 보이는데 정상인가요? MBD일까 봐 걱정돼요.",
        "answer": "MBD(칼슘 부족) 초기 증상일 수 있습니다. 칼슘제 급여를 늘리고 UVB를 쐬어주세요. 증상이 심하면 수의사 상담 필수!"
    },
    {
        "topic": "먹이 종류",
        "questions": ["귀뚜라미 꼭 줘야 해요?", "CGD만 먹여도 되나요?", "어떤 사료가 좋아요?"],
        "content": "귀뚜라미가 무서워서 CGD만 주고 있는데 괜찮을까요? 성장이 느린 것 같아서요.",
        "answer": "필수는 아닙니다. CGD(슈퍼푸드)만으로도 잘 큽니다. 다만 성장 속도는 귀뚜라미 병행이 빠릅니다. Pangea, Repashy 추천해요!"
    },
    {
        "topic": "케이지 세팅",
        "questions": ["바닥재 추천해주세요", "케이지 크기 얼마나?", "세팅 방법 알려주세요"],
        "content": "처음 키우는데 케이지 세팅을 어떻게 해야 할지 모르겠어요. 기본적으로 뭐가 필요한가요?",
        "answer": "청소가 편한 건 키친타월, 미관상 좋은 건 바크나 코코피트입니다. 초보에겐 키친타월 추천! 은신처 2개, 물그릇, 먹이그릇 필수예요."
    }
]

# ============ 모프 리스트 (50개+) ============
MORPH_LIST = [
    # Incomplete Dominant (불완전 우성)
    {"name": "Lilly White", "ko": "릴리 화이트", "type": "Incomplete Dominant", "rarity": "popular"},
    {"name": "Cappuccino", "ko": "카푸치노", "type": "Incomplete Dominant", "rarity": "rare"},
    {"name": "Frappuccino", "ko": "프라푸치노", "type": "Incomplete Dominant", "rarity": "rare"},
    {"name": "Sable", "ko": "세이블", "type": "Incomplete Dominant", "rarity": "rare"},
    {"name": "Tangerine", "ko": "탠저린", "type": "Incomplete Dominant", "rarity": "popular"},
    {"name": "Soft Scale", "ko": "소프트 스케일", "type": "Incomplete Dominant", "rarity": "rare"},
    {"name": "Empty Back", "ko": "엠티 백", "type": "Incomplete Dominant", "rarity": "rare"},
    {"name": "White Wall", "ko": "화이트 월", "type": "Incomplete Dominant", "rarity": "rare"},
    {"name": "Snowflake", "ko": "스노우플레이크", "type": "Incomplete Dominant", "rarity": "popular"},
    {"name": "Monochrome", "ko": "모노크롬", "type": "Incomplete Dominant", "rarity": "rare"},
    
    # Recessive (열성)
    {"name": "Axanthic", "ko": "악산틱", "type": "Recessive", "rarity": "rare"},
    {"name": "Patternless", "ko": "패턴리스", "type": "Recessive", "rarity": "common"},
    {"name": "Phantom", "ko": "팬텀", "type": "Recessive", "rarity": "popular"},
    {"name": "Super Stripe", "ko": "슈퍼 스트라이프", "type": "Recessive", "rarity": "rare"},
    
    # Dominant (우성)
    {"name": "Pinstripe", "ko": "핀스트라이프", "type": "Dominant", "rarity": "popular"},
    {"name": "Dalmatian", "ko": "달마시안", "type": "Dominant", "rarity": "popular"},
    {"name": "Super Dalmatian", "ko": "슈퍼 달마시안", "type": "Dominant", "rarity": "popular"},
    {"name": "Tiger", "ko": "타이거", "type": "Dominant", "rarity": "common"},
    {"name": "Hypo", "ko": "하이포", "type": "Dominant", "rarity": "common"},
    {"name": "Black Base", "ko": "블랙 베이스", "type": "Dominant", "rarity": "popular"},
    
    # Polygenic (다유전자)
    {"name": "Harlequin", "ko": "할리퀸", "type": "Polygenic", "rarity": "popular"},
    {"name": "Extreme Harlequin", "ko": "익스트림 할리퀸", "type": "Polygenic", "rarity": "popular"},
    {"name": "Flame", "ko": "플레임", "type": "Polygenic", "rarity": "common"},
    {"name": "Bi-color", "ko": "바이컬러", "type": "Polygenic", "rarity": "common"},
    {"name": "Tricolor", "ko": "트라이컬러", "type": "Polygenic", "rarity": "popular"},
    {"name": "Halloween", "ko": "할로윈", "type": "Polygenic", "rarity": "rare"},
    {"name": "Cold Fusion", "ko": "콜드 퓨전", "type": "Polygenic", "rarity": "rare"},
    {"name": "Creamsicle", "ko": "크림시클", "type": "Polygenic", "rarity": "rare"},
    {"name": "Lavender", "ko": "라벤더", "type": "Polygenic", "rarity": "popular"},
    {"name": "Olive", "ko": "올리브", "type": "Polygenic", "rarity": "common"},
    {"name": "Cream", "ko": "크림", "type": "Polygenic", "rarity": "common"},
    {"name": "Orange", "ko": "오렌지", "type": "Polygenic", "rarity": "common"},
    {"name": "Yellow Base", "ko": "옐로우 베이스", "type": "Polygenic", "rarity": "common"},
    {"name": "Red Base", "ko": "레드 베이스", "type": "Polygenic", "rarity": "popular"},
    {"name": "Dark Base", "ko": "다크 베이스", "type": "Polygenic", "rarity": "common"},
    {"name": "Brindle", "ko": "브린들", "type": "Polygenic", "rarity": "common"},
    {"name": "Portholes", "ko": "포트홀", "type": "Polygenic", "rarity": "common"},
    {"name": "Crowned", "ko": "크라운드", "type": "Polygenic", "rarity": "common"},
    {"name": "Drippy", "ko": "드리피", "type": "Polygenic", "rarity": "common"},
    {"name": "Chevron", "ko": "셰브론", "type": "Polygenic", "rarity": "common"},
    {"name": "Quadstripe", "ko": "쿼드 스트라이프", "type": "Polygenic", "rarity": "rare"},
    {"name": "Fringing", "ko": "프린징", "type": "Polygenic", "rarity": "common"},
    {"name": "Furry", "ko": "퍼리", "type": "Polygenic", "rarity": "rare"},
    {"name": "Ink Spot", "ko": "잉크 스팟", "type": "Polygenic", "rarity": "common"},
    {"name": "Kneecaps", "ko": "니캡", "type": "Polygenic", "rarity": "common"},
    {"name": "Buckskin", "ko": "벅스킨", "type": "Polygenic", "rarity": "common"},
    {"name": "Mocha", "ko": "모카", "type": "Polygenic", "rarity": "common"},
    {"name": "Confetti", "ko": "콘페티", "type": "Polygenic", "rarity": "rare"},
    {"name": "White Tip", "ko": "화이트 팁", "type": "Polygenic", "rarity": "common"},
    {"name": "Normal", "ko": "노말", "type": "Other", "rarity": "common"},
]

# ============ 태그 매핑 ============
TAG_MAP = {
    "popular": ["인기", "추천"],
    "rare": ["희귀", "프리미엄"],
    "common": ["기본"]
}

# ============ 설명 생성 ============
def get_description(morph):
    templates = {
        "Incomplete Dominant": f"{morph['ko']}({morph['name']})은(는) 불완전 우성 유전 모프입니다. 헤테로와 호모에서 표현 정도가 다르며, 브리딩 시 다양한 조합이 가능합니다.",
        "Recessive": f"{morph['ko']}({morph['name']})은(는) 열성 유전 모프입니다. 양쪽 부모 모두에게 유전자가 있어야 발현되며, 헤테로는 육안으로 구분이 어렵습니다.",
        "Dominant": f"{morph['ko']}({morph['name']})은(는) 우성 유전 모프입니다. 한쪽 부모에게만 있어도 표현되어 브리딩이 쉬운 편입니다.",
        "Polygenic": f"{morph['ko']}({morph['name']})은(는) 다유전자성 형질입니다. 선택 교배를 통해 퀄리티를 높일 수 있으며, 다양한 표현형이 존재합니다.",
        "Other": f"{morph['ko']}({morph['name']})은(는) 크레스티드 게코의 기본 형태입니다."
    }
    return templates.get(morph["type"], templates["Other"])


def random_date(days=90):
    """최근 N일 이내 랜덤 날짜"""
    delta = random.randint(0, days)
    return (datetime.now() - timedelta(days=delta)).strftime("%Y-%m-%d")


def generate_qna():
    """Q&A 데이터 50개 생성"""
    qna_list = []
    
    for i in range(50):
        topic = random.choice(QNA_TOPICS)
        question = random.choice(topic["questions"])
        prefix = random.choice(PREFIXES)
        
        qna_list.append({
            "id": f"qna-{i+1:03d}",
            "title": f"[{prefix}] {question}",
            "author": random.choice(NICKNAMES),
            "date": random_date(90),
            "views": random.randint(50, 1500),
            "likes": random.randint(0, 30),
            "category": "qna",
            "content": topic["content"],
            "answer": {
                "content": topic["answer"],
                "author": random.choice(["크레마스터", "10년차브리더", "파충류수의사", "뉴칼전문가"]),
                "date": random_date(90),
                "likes": random.randint(5, 40)
            }
        })
    
    return qna_list


def generate_morphs():
    """모프 데이터 생성"""
    morph_list = []
    
    for morph in MORPH_LIST:
        tags = TAG_MAP.get(morph["rarity"], ["기본"]).copy()
        if random.random() > 0.7:
            tags.append("콤보추천")
        
        morph_list.append({
            "id": morph["name"].lower().replace(" ", "-"),
            "name": f"{morph['name']} ({morph['ko']})",
            "nameEn": morph["name"],
            "nameKo": morph["ko"],
            "type": morph["type"],
            "description": get_description(morph),
            "tags": tags,
            "rarity": morph["rarity"]
        })
    
    return morph_list


def main():
    """메인 함수"""
    print("=" * 50)
    print("🏭 Content Factory - 시드 데이터 생성기")
    print("=" * 50)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    # 1. Q&A 생성
    qna_data = generate_qna()
    qna_output = {
        "generated_at": datetime.now().isoformat(),
        "total": len(qna_data),
        "items": qna_data
    }
    
    qna_path = os.path.join(OUTPUT_DIR, "initial_qna.json")
    with open(qna_path, 'w', encoding='utf-8') as f:
        json.dump(qna_output, f, ensure_ascii=False, indent=2)
    print(f"✅ Q&A {len(qna_data)}개 생성 -> initial_qna.json")
    
    # 2. 모프 생성
    morph_data = generate_morphs()
    morph_output = {
        "generated_at": datetime.now().isoformat(),
        "total": len(morph_data),
        "morphs": morph_data
    }
    
    morph_path = os.path.join(OUTPUT_DIR, "morph_list_full.json")
    with open(morph_path, 'w', encoding='utf-8') as f:
        json.dump(morph_output, f, ensure_ascii=False, indent=2)
    print(f"✅ 모프 {len(morph_data)}개 생성 -> morph_list_full.json")
    
    print("=" * 50)
    print("🎉 완료!")


if __name__ == "__main__":
    main()
