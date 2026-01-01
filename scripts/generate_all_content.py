#!/usr/bin/env python3
"""
동적 콘텐츠 생성 스크립트
- 사육 팁(Magazine Style): 30개
- 커뮤니티 Q&A(Forum Style): 50개
"""

import json
import os
import random
from datetime import datetime, timedelta

# ============================================
# 공통 설정
# ============================================
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'constants')

def random_date_within_months(months=3):
    """최근 N개월 이내 랜덤 날짜 생성"""
    now = datetime.now()
    days_back = random.randint(0, months * 30)
    date = now - timedelta(days=days_back)
    return date.isoformat()

def random_id():
    """랜덤 ID 생성"""
    return f"{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"

# ============================================
# Module 1: 사육 팁 Knowledge Base
# ============================================

SEO_ADJECTIVES = [
    "획기적인", "절대 실패 없는", "전문가 추천", "초보자 필수",
    "꿀팁 가득한", "완벽 정리", "핵심만 담은", "실전에서 검증된",
    "최신 트렌드", "브리더가 알려주는", "2024 업데이트"
]

TIPS_DATABASE = {
    "diet": {
        "titles": [
            "{adj} 크레스티드 게코 먹이 급여 가이드",
            "크레 집사라면 꼭 알아야 할 {adj} 급여 패턴",
            "{adj} 영양 밸런스 맞추는 법",
            "까다로운 크레 입맛 사로잡는 {adj} 방법",
            "거식 탈출! {adj} 먹이 교체 전략"
        ],
        "intros": [
            "크레스티드 게코의 건강은 먹이에서 시작됩니다. 올바른 급여 습관이 장수의 비결이죠.",
            "많은 초보 집사분들이 먹이 급여에서 실수를 합니다. 오늘은 그 해결책을 알려드릴게요.",
            "크레의 식욕이 떨어졌다면? 이 글을 끝까지 읽어보세요. 해답이 있습니다.",
            "슈퍼푸드와 귀뚜라미, 어떻게 조합해야 할까요? 전문가의 노하우를 공개합니다."
        ],
        "points": [
            ("## 🍽️ 급여 주기의 황금 비율", "성체 기준 주 3-4회 급여가 이상적입니다. 매일 급여는 오히려 비만을 유발할 수 있어요.\n\n어린 개체(베이비~서브아덜트)는 매일 또는 격일로 급여하되, 소량씩 자주 주는 것이 성장에 도움이 됩니다."),
            ("## 🥄 슈퍼푸드(CGD) 선택 가이드", "팬게아(Pangea), 레파시(Repashy), 주메드(Zoo Med) 등 검증된 브랜드를 선택하세요.\n\n### 추천 제품\n- **팬게아 프룻 믹스**: 맛에 민감한 크레에게 인기\n- **레파시 그럽스앤프룻**: 곤충 함량 높아 식욕 자극\n- **팬게아 브리더 포뮬라**: 번식 개체 영양 보충"),
            ("## 🦗 곤충 급여의 중요성", "월 2-4회 정도 귀뚜라미나 두비아를 급여하면 사냥 본능을 자극하고 양질의 단백질을 공급합니다.\n\n**주의:** 곤충은 반드시 크레 머리 너비보다 작아야 합니다. 칼슘 파우더 더스팅도 필수!"),
            ("## 💧 수분 공급 전략", "신선한 물을 항상 준비해두고, 미스팅 시 잎에 맺힌 물방울을 핥아먹는 습성도 활용하세요.\n\n습도 60-70%를 유지하면 자연스럽게 수분 섭취가 이루어집니다."),
            ("## 🍌 과일 급여, 이렇게 하세요", "바나나, 망고, 파파야 등을 으깨서 가끔 급여할 수 있습니다.\n\n### ⚠️ 금지 과일\n- 감귤류(산성이 강함)\n- 아보카도(독성)\n- 루바브(옥살산 함유)"),
            ("## 📊 먹이 거부 시 체크리스트", "1. 온도가 적정한가? (22-26°C)\n2. 스트레스 요인은 없는가?\n3. 탈피 직전인가?\n4. 새로운 환경에 적응 중인가?\n\n위 사항을 하나씩 점검해보세요.")
        ],
        "conclusions": [
            "올바른 급여 습관은 하루아침에 만들어지지 않습니다. 꾸준히 관찰하고 기록하는 것이 핵심이에요!",
            "여러분의 크레가 건강하게 오래 살 수 있도록, 오늘 배운 내용을 꼭 실천해보세요.",
            "궁금한 점이 있다면 커뮤니티에 질문해주세요. 함께 고민하고 해결해드립니다!"
        ]
    },
    "housing": {
        "titles": [
            "{adj} 비바리움 세팅 완전 정복",
            "크레스티드 게코 {adj} 사육장 구성법",
            "{adj} 온습도 관리 마스터 클래스",
            "바이오액티브 셋업: {adj} 시작 가이드",
            "{adj} 조명 & 열원 배치 전략"
        ],
        "intros": [
            "사육장 환경은 크레스티드 게코의 행복과 직결됩니다. 제대로 된 셋업이 반려의 시작이죠.",
            "바이오액티브? 심플 셋업? 어떤 것이 좋을까요? 각각의 장단점을 파헤쳐봅니다.",
            "온습도 관리가 어렵다면 이 글이 도움이 될 거예요. 핵심만 정리했습니다.",
            "조명은 크레에게 정말 필요할까요? 논란의 주제를 과학적으로 분석합니다."
        ],
        "points": [
            ("## 🏠 사육장 크기 선택", "**최소 권장 사이즈**\n- 성체 1마리: 45x45x60cm 이상\n- 서브아덜트: 30x30x45cm\n\n수직 공간이 중요합니다. 크레는 나무 위에서 생활하는 수목성 도마뱀이에요."),
            ("## 🌡️ 온도 그라데이션 만들기", "핫스팟(상단): 26-28°C, 쿨존(하단): 22-24°C를 유지하세요.\n\n### 열원 옵션\n- 세라믹 히터: 빛 없이 열만 공급\n- 딥 히트 프로젝터(DHP): 깊은 침투열\n- 할로겐 램프: 자연광 + 열"),
            ("## 💨 습도 관리 꿀팁", "목표: 60-70% (밤에는 80%까지 OK)\n\n**습도 유지 방법**\n1. 아침저녁 미스팅\n2. 스페그넘 모스 배치\n3. 물그릇 설치\n4. 환기 조절"),
            ("## 🌿 식물 & 은신처 배치", "포토스, 피토니아, 브로멜리아 등 무독성 식물을 추천합니다.\n\n코르크 바크, 대나무 튜브 등 다양한 높이에 은신처를 배치하면 스트레스가 줄어듭니다."),
            ("## 🪵 바닥재 선택", "- **심플 셋업**: 키친타올, 신문지 (교체 용이)\n- **바이오액티브**: 코코넛 파이버 + 스페그넘 모스 + 청소부 생물\n\n모래, 자갈은 사용 금지! 장폐색 위험이 있습니다."),
            ("## 💡 조명의 진실", "크레는 야행성이지만, 약한 UVB(2.0-5.0)는 건강에 도움이 됩니다.\n\n낮밤 사이클(12시간)을 유지하면 서캐디안 리듬이 안정됩니다.")
        ],
        "conclusions": [
            "완벽한 환경은 없지만, 꾸준한 관리로 최적의 환경에 가까워질 수 있습니다.",
            "크레가 활발하게 움직이고 잘 먹는다면, 여러분의 셋업은 성공입니다!",
            "사육장 세팅에 정답은 없어요. 여러분의 환경에 맞게 조정해보세요."
        ]
    },
    "health": {
        "titles": [
            "{adj} 크레스티드 게코 건강 체크리스트",
            "탈피 문제? {adj} 해결 가이드",
            "{adj} 질병 예방과 초기 대응",
            "변으로 알아보는 {adj} 건강 진단법",
            "FTS(플로피 테일 신드롬) {adj} 예방법"
        ],
        "intros": [
            "크레스티드 게코도 아플 수 있습니다. 조기 발견이 치료의 핵심이에요.",
            "탈피 문제는 많은 집사들의 고민이죠. 원인과 해결책을 정리했습니다.",
            "변의 상태만 봐도 건강을 알 수 있다는 사실, 알고 계셨나요?",
            "예방이 최선의 치료입니다. 기본적인 건강 관리법을 알아봅시다."
        ],
        "points": [
            ("## 🩺 일일 건강 체크 포인트", "매일 확인할 사항:\n1. 눈이 맑고 촉촉한가?\n2. 피부에 상처나 변색이 없는가?\n3. 꼬리가 통통한가?\n4. 활동성은 정상인가?"),
            ("## 🦴 MBD(대사성 골질환) 예방", "**원인**: 칼슘/D3 부족, UVB 부족\n\n**증상**:\n- 턱이 고무처럼 물렁해짐\n- 다리가 휘거나 떨림\n- 움직임 둔화\n\n**예방**: 칼슘 더스팅 + 적절한 조명"),
            ("## 🐍 탈피 문제 해결", "탈피 잔여물이 남았다면:\n1. 습도를 80%까지 올리기\n2. 미온수에 10분 불리기\n3. 면봉으로 부드럽게 제거\n\n⚠️ 발가락, 꼬리 끝 탈피 껍질은 혈액순환 장애 유발 가능!"),
            ("## 💩 변 상태로 건강 확인", "| 정상 | 이상 |\n|------|------|\n| 갈색+흰색(요산) | 녹색/노란색 |\n| 형태 유지 | 물설사 |\n| 무취~약한 냄새 | 악취 |\n\n지속적인 이상 시 동물병원 방문 권장"),
            ("## 🏥 동물병원 방문 신호", "- 48시간 이상 거식\n- 급격한 체중 감소\n- 눈이 움푹 들어감\n- 입에서 분비물\n- 숨소리가 이상함\n\n파충류 전문 병원 리스트를 미리 확보해두세요!"),
            ("## 🔄 검역(Quarantine) 절차", "새 개체 입양 시 최소 30일 격리!\n\n격리 환경:\n- 별도 사육장\n- 별도 도구 사용\n- 마지막에 관리\n\n기존 개체 보호를 위한 필수 과정입니다.")
        ],
        "conclusions": [
            "건강한 크레는 10-20년을 함께합니다. 작은 관심이 큰 차이를 만들어요.",
            "이상 징후가 보인다면 망설이지 말고 전문가와 상담하세요.",
            "예방적 관리가 가장 효과적인 치료입니다. 오늘부터 시작해보세요!"
        ]
    }
}

def generate_husbandry_tips(count=30):
    """사육 팁 30개 생성"""
    articles = []
    categories = list(TIPS_DATABASE.keys())
    
    for i in range(count):
        category = categories[i % len(categories)]
        db = TIPS_DATABASE[category]
        
        # 제목 생성
        adj = random.choice(SEO_ADJECTIVES)
        title = random.choice(db["titles"]).format(adj=adj)
        
        # 서론
        intro = random.choice(db["intros"])
        
        # 본론 (3개 랜덤 선택)
        points = random.sample(db["points"], min(3, len(db["points"])))
        body = "\n\n".join([f"{h}\n\n{content}" for h, content in points])
        
        # 결론
        conclusion = random.choice(db["conclusions"])
        
        # 전체 콘텐츠 조립
        content = f"{intro}\n\n{body}\n\n---\n\n**마무리**\n\n{conclusion}"
        
        articles.append({
            "id": random_id(),
            "title": title,
            "category": category,
            "summary": intro[:100] + "..." if len(intro) > 100 else intro,
            "content": content,
            "author": random.choice(["크레팁", "게코마스터", "사육왕", "초록집사", "파충류연구소"]),
            "views": random.randint(50, 3000),
            "likes": random.randint(5, 200),
            "created_at": random_date_within_months(3),
            "tags": [category, "크레스티드게코", random.choice(["초보", "중급", "고급"])]
        })
    
    return articles

# ============================================
# Module 2: 커뮤니티 Q&A Knowledge Base
# ============================================

PERSONAS = {
    "초보맘": {"prefix": "안녕하세요ㅠㅠ 처음 크레 키우는 초보인데요...", "suffix": "도와주세요ㅠㅠ", "emoji": "😢"},
    "궁금이": {"prefix": "질문 있습니다! ", "suffix": "아시는 분 계실까요?", "emoji": "🤔"},
    "장비병": {"prefix": "사육장 세팅 중인데요, ", "suffix": "추천 부탁드려요!", "emoji": "🔧"},
    "걱정충": {"prefix": "혹시 이거 문제 있는 건가요? ", "suffix": "너무 걱정돼서 글 올립니다.", "emoji": "😰"},
    "급한맘": {"prefix": "급해요!!! ", "suffix": "빠른 답변 부탁드립니다!!", "emoji": "🆘"}
}

QNA_DATABASE = {
    "거식": {
        "situations": [
            "크레가 3일째 아무것도 안 먹어요",
            "귀뚜라미는 거들떠도 안 봐요", 
            "슈퍼푸드만 핥다 말아요",
            "분양 후 일주일째 거식 중이에요",
            "갑자기 밥을 안 먹기 시작했어요"
        ],
        "details": [
            "온습도 체크해봤는데 정상인 것 같은데...",
            "원래는 잘 먹었거든요",
            "꼬리가 좀 가늘어진 것 같기도 하고",
            "스트레스 받은 것 같진 않은데",
            "다른 브랜드 사료로 바꿔볼까요?"
        ],
        "expert_empathy": [
            "거식은 정말 마음 졸이시게 하죠. 충분히 이해합니다!",
            "걱정이 많으시겠어요. 하지만 크레는 원래 며칠 굶어도 괜찮습니다.",
            "처음 겪으시면 당황스러우실 텐데, 같이 원인을 찾아봐요!"
        ],
        "solutions": [
            "**온도 체크가 우선입니다.** 22-26°C가 적정입니다. 너무 덥거나 추우면 식욕이 떨어져요.\n\n저녁에 온도가 20도 이하로 떨어지지 않는지 확인해보세요.",
            "**새 환경 적응 중일 수 있어요.** 분양 후 1-2주는 거식이 흔합니다. 가급적 만지지 말고 안정을 취하게 해주세요.",
            "**먹이를 바꿔보세요.** 팬게아 프룻믹스 → 레파시 그럽스앤프룻 등 맛이 다른 걸로 시도해보세요. 취향이 확실한 아이들이 있어요.",
            "**탈피 직전일 수 있습니다.** 눈이 뿌옇거나 피부가 칙칙해 보이면 탈피 준비 중이에요. 탈피 후 보통 식욕이 돌아옵니다."
        ]
    },
    "건강": {
        "situations": [
            "꼬리가 살짝 휘어있는 것 같아요",
            "탈피 껍질이 발가락에 남아있어요",
            "변이 평소랑 달라요",
            "눈 부분이 좀 이상해 보여요",
            "몸에 작은 점 같은 게 생겼어요"
        ],
        "details": [
            "언제부터인지 잘 모르겠는데",
            "만져보면 아파하는 것 같기도 하고",
            "활동성은 그대로인데",
            "사진 첨부했으니 봐주세요",
            "병원 가봐야 할까요?"
        ],
        "expert_empathy": [
            "사진 잘 봤어요! 걱정되셨겠지만 크게 문제될 것 같진 않아요.",
            "이런 증상은 비교적 흔한 편이에요. 차분하게 대응하면 됩니다.",
            "빨리 질문해주셔서 다행이에요. 조기 발견이 중요하거든요!"
        ],
        "solutions": [
            "**탈피 껍질 제거법:** 미온수(28-30°C)에 10분 정도 불려주세요. 그 후 젖은 면봉으로 살살 벗겨주시면 됩니다. 절대 마른 상태에서 강제로 벗기지 마세요!",
            "**FTS(플로피테일) 의심:** 꼬리가 휘는 건 수직 공간에서 거꾸로 매달려 있을 때 발생해요. 은신처 위치를 조정하고, 심하면 수의사 상담을 권합니다.",
            "**변 이상 시 체크:** 일시적인 경우가 많아요. 하지만 3일 이상 지속되거나 악취가 심하면 기생충 검사를 받아보세요.",
            "**습도를 높여보세요.** 많은 피부 문제가 건조함에서 시작됩니다. 70% 이상 유지하고, 물그릇을 더 큰 걸로 교체해보세요."
        ]
    },
    "환경": {
        "situations": [
            "사육장 온도가 자꾸 떨어져요",
            "습도 유지가 너무 힘들어요",
            "미스팅 시스템 추천해주세요",
            "바이오액티브 세팅 어떻게 해요?",
            "조명 필요한가요?"
        ],
        "details": [
            "현재 세팅 사진 올려봅니다",
            "예산은 ~만원 정도인데",
            "유튜브 봤는데 다들 말이 달라서",
            "지금 쓰는 건 ~인데",
            "다른 분들은 어떻게 하시나요?"
        ],
        "expert_empathy": [
            "환경 세팅은 정말 고민이 많으시죠! 저도 그랬어요.",
            "좋은 질문이에요. 환경이 안정되면 크레도 훨씬 건강해집니다.",
            "세팅 사진 잘 봤어요! 기본은 잘 갖춰진 것 같습니다."
        ],
        "solutions": [
            "**온도 유지 팁:** 세라믹 히터 + 온도조절기(서모스탯) 조합을 추천해요. 히트매트는 사육장 측면에 붙이시고, 상단 60% 정도에 열원을 배치하세요.",
            "**습도 관리:** 아침저녁 미스팅 + 스페그넘 모스 배치가 가장 효과적이에요. 자동 미스팅은 Monsoon, MistKing 등이 좋습니다.",
            "**바이오액티브 시작:** 배수층(레카) → 방충망 → 코코넛 파이버+스페그넘 → 낙엽 순서로 깔고, 청소부(스프링테일, 이소포드)를 투입하세요.",
            "**조명:** 필수는 아니지만 약한 UVB(2.0-5.0)와 LED 조명으로 12시간 사이클을 맞춰주면 건강에 도움이 됩니다."
        ]
    },
    "일반": {
        "situations": [
            "크레가 저를 무서워하는 것 같아요",
            "핸들링 어떻게 해야 하나요?",
            "암수 구별이 안 돼요",
            "이 개체 예쁜가요? 감정 부탁드려요",
            "번식 언제부터 가능한가요?"
        ],
        "details": [
            "입양한 지 한 달 정도 됐어요",
            "손 대면 도망가요",
            "유튜브 보고 따라해봤는데",
            "아직 베이비인데",
            "궁금한 게 너무 많네요 ㅎㅎ"
        ],
        "expert_empathy": [
            "천천히 하시면 돼요! 크레는 원래 경계심이 있는 아이들이에요.",
            "좋은 질문이에요. 많은 분들이 궁금해하시는 부분입니다!",
            "사진 귀엽네요 ㅎㅎ 답변드릴게요!"
        ],
        "solutions": [
            "**핸들링 팁:** 갑자기 위에서 잡지 마시고, 손을 바닥에 대고 크레가 스스로 올라오게 유도하세요. 첫 2주는 하루 5분 이내로 짧게!",
            "**암수 구별:** 성체(40g+)가 되면 수컷은 꼬리 기부에 헤미페니스 주머니가 볼록하게 보여요. 그 위에 모공(Pores)도 있습니다.",
            "**번식 준비:** 암컷은 40g 이상, 수컷은 35g 이상이 권장됩니다. 하지만 체중보다 건강 상태와 성숙도가 더 중요해요. 최소 18개월 이상 권장!",
            "**적응 기간:** 새 환경에 2-4주 정도 적응 기간이 필요해요. 이 기간엔 관찰만 하시고, 핸들링은 자제해주세요."
        ]
    }
}

EXPERT_NAMES = ["게코박사", "크레매니아", "파충류수의사", "브리더킴", "경험자", "동물사랑", "크레집사", "렙타일리스트"]

def generate_qna(count=50):
    """커뮤니티 Q&A 50개 생성"""
    posts = []
    categories = list(QNA_DATABASE.keys())
    persona_keys = list(PERSONAS.keys())
    
    for i in range(count):
        category = categories[i % len(categories)]
        db = QNA_DATABASE[category]
        persona = PERSONAS[random.choice(persona_keys)]
        
        # 질문 조립
        situation = random.choice(db["situations"])
        detail = random.choice(db["details"])
        
        question_title = f"{persona['emoji']} {situation}"
        question_body = f"{persona['prefix']}\n\n{situation}\n\n{detail}\n\n{persona['suffix']}"
        
        # 답변 조립
        empathy = random.choice(db["expert_empathy"])
        solution = random.choice(db["solutions"])
        
        answer_body = f"{empathy}\n\n{solution}\n\n도움이 되셨으면 좋겠어요! 추가 질문 있으시면 댓글 남겨주세요 😊"
        
        posts.append({
            "id": random_id(),
            "category": category,
            "question_title": question_title,
            "question_body": question_body,
            "question_author": f"익명{random.randint(1, 999)}",
            "answer": {
                "body": answer_body,
                "author": random.choice(EXPERT_NAMES),
                "likes": random.randint(3, 50),
                "date": random_date_within_months(3)
            },
            "views": random.randint(30, 2000),
            "likes": random.randint(1, 100),
            "comments": random.randint(0, 15),
            "created_at": random_date_within_months(3),
            "tags": [category, "질문", random.choice(["급함", "궁금", "도움요청"])]
        })
    
    return posts

# ============================================
# 메인 실행
# ============================================

def main():
    # 출력 디렉토리 확인
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("🦎 크레스티드 게코 콘텐츠 생성 시작...\n")
    
    # 1. 사육 팁 생성
    print("📝 사육 팁 생성 중... (30개)")
    tips = generate_husbandry_tips(30)
    tips_data = {
        "source": "Crestia Auto Generator",
        "generated_at": datetime.now().isoformat(),
        "total_articles": len(tips),
        "articles": tips
    }
    
    tips_path = os.path.join(OUTPUT_DIR, "husbandry_data_dynamic.json")
    with open(tips_path, "w", encoding="utf-8") as f:
        json.dump(tips_data, f, ensure_ascii=False, indent=2)
    print(f"   ✅ 저장 완료: {tips_path}")
    
    # 2. Q&A 생성
    print("\n💬 커뮤니티 Q&A 생성 중... (50개)")
    qna = generate_qna(50)
    qna_data = {
        "source": "Crestia Auto Generator",
        "generated_at": datetime.now().isoformat(),
        "total_posts": len(qna),
        "posts": qna
    }
    
    qna_path = os.path.join(OUTPUT_DIR, "community_qna_dynamic.json")
    with open(qna_path, "w", encoding="utf-8") as f:
        json.dump(qna_data, f, ensure_ascii=False, indent=2)
    print(f"   ✅ 저장 완료: {qna_path}")
    
    print("\n🎉 콘텐츠 생성 완료!")
    print(f"   - 사육 팁: {len(tips)}개")
    print(f"   - Q&A: {len(qna)}개")

if __name__ == "__main__":
    main()
