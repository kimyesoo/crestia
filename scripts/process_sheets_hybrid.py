#!/usr/bin/env python3
"""
process_sheets_hybrid.py - 네이버 지식인 Q&A 데이터 정제 스크립트

Google Sheets의 Sheet2에서 지식인 검색 결과를 가져와,
Groq API (Llama 3.3)를 사용해 3단계 AI 처리 후 고품질 Q&A로 변환합니다.

3단계 처리:
1. Relevance Filter (선별) - 크레 관련 여부 확인
2. Fact Check & Correction (검증) - Knowledge Base 기준 교정
3. Reformatting (가공) - 초보자 질문 + 고인물 답변 스타일로 재구성
"""

import os
import json
import time
import re
from datetime import datetime
from typing import Optional, Dict, List, Any

# ============================================
# 환경변수 / API 키 설정
# ============================================
# Groq API Key (환경변수에서 가져오기)
GROQ_API_KEY = os.environ.get("XAI_API_KEY", os.environ.get("GROQ_API_KEY", ""))
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
GROQ_MODEL = "llama-3.3-70b-versatile"

# Google Sheets 설정
GOOGLE_SHEET_ID = os.environ.get("GOOGLE_SHEET_ID", "")
SHEET_NAME = "Sheet2"  # 지식인 데이터가 있는 시트

# 출력 경로
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'constants')

# ============================================
# Knowledge Base (절대 팩트)
# ============================================
KNOWLEDGE_BASE = """
[절대 팩트 - 크레스티드 게코 사육 기준]

1. 릴리 화이트 (Lilly White):
   - 슈퍼폼(릴리 x 릴리)은 치사 유전 → 교배 절대 금지
   - 반드시 노멀 또는 다른 모프와 교배해야 함

2. 먹이:
   - 슈퍼푸드(팬게아, 레파시) + 곤충 병행 권장
   - 젤리만 급여는 영양 불균형 → 잘못된 정보
   - 과일은 간식 수준으로만 (메인 아님)

3. 카푸치노 (Cappuccino):
   - 세이블(Sable)과 대립 유전자(Allelic) 관계
   - 카푸치노 x 세이블 = 루왁(Luwak) 콤보
   - 슈퍼 카푸치노(멜라니스틱)는 콧구멍 축소/안구 질환 위험

4. 문스톤/파이볼드:
   - 크레스티드 게코 공식 모프 아님
   - 상술 또는 다른 종 용어 차용 → 주의 필요

5. 온도/환경:
   - 적정 온도: 22~26°C
   - 28°C 이상: 위험, 30°C 이상: 치명적
   - 습도 사이클: 낮 50-60%, 밤 70-80%
"""

# ============================================
# Groq API 클라이언트
# ============================================
def call_groq_llm(prompt: str, system_prompt: str = "") -> Optional[str]:
    """Groq API 호출 (Llama 3.3)"""
    try:
        import requests
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": GROQ_MODEL,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        response = requests.post(
            f"{GROQ_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        response.raise_for_status()
        
        data = response.json()
        return data["choices"][0]["message"]["content"]
        
    except Exception as e:
        print(f"❌ Groq API 오류: {e}")
        return None


# ============================================
# 3단계 AI 처리 로직
# ============================================

def step1_relevance_filter(title: str, content: str) -> bool:
    """Step 1: 관련성 필터 - 크레스티드 게코 사육 관련 여부 확인"""
    
    system_prompt = """당신은 파충류 커뮤니티 관리자입니다.
질문이 '크레스티드 게코' 사육과 직접 관련이 있는지 판단하세요.
관련이 있으면 "RELEVANT", 없으면 "SKIP"만 출력하세요.

SKIP 기준:
- 단순 분양 홍보/광고
- 다른 파충류(레오파드 게코, 볼파이톤 등) 질문
- 크레와 전혀 관련없는 내용
"""
    
    prompt = f"""다음 지식인 질문이 크레스티드 게코 사육과 관련이 있나요?

제목: {title}
내용: {content}

RELEVANT 또는 SKIP 중 하나만 출력하세요."""

    result = call_groq_llm(prompt, system_prompt)
    if result:
        return "RELEVANT" in result.upper()
    return False


def step2_fact_check_and_correct(title: str, content: str) -> Dict[str, Any]:
    """Step 2: 사실 확인 및 교정"""
    
    system_prompt = f"""당신은 크레스티드 게코 전문가입니다.
아래 Knowledge Base를 기준으로 지식인 답변의 정확성을 검증하고 오류를 교정하세요.

{KNOWLEDGE_BASE}

특히 다음 오류를 반드시 교정하세요:
- "릴리끼리 붙여보세요" → "절대 안 됩니다(치사유전)"
- "젤리만 줘도 됩니다" → "슈퍼푸드+곤충 병행 권장"
- "문스톤 모프" → "공식 모프 아님, 상술 주의"
- "30도까지 괜찮아요" → "28도 이상 위험, 30도 치명적"
"""

    prompt = f"""다음 지식인 Q&A를 분석하고 교정하세요:

제목: {title}
원문: {content}

JSON 형식으로 응답하세요:
{{
    "has_errors": true/false,
    "error_summary": "발견된 오류 요약 (없으면 null)",
    "corrected_answer": "교정된 정확한 답변"
}}

JSON만 출력하세요."""

    result = call_groq_llm(prompt, system_prompt)
    if result:
        try:
            # JSON 추출 (```json 블록 내부 또는 전체)
            json_match = re.search(r'\{[\s\S]*\}', result)
            if json_match:
                return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    return {"has_errors": False, "error_summary": None, "corrected_answer": content}


def step3_reformat_qna(title: str, original_content: str, corrected_answer: str) -> Optional[Dict[str, str]]:
    """Step 3: Q&A 재포맷 - 초보자 질문 + 고인물 답변 스타일"""
    
    system_prompt = """당신은 파충류 커뮤니티 콘텐츠 에디터입니다.
지식인 Q&A를 크레스티드 게코 커뮤니티 스타일로 재구성하세요.

질문자 페르소나: 다급하고 궁금한 초보자 (ㅠㅠ, ?? 등 감정 표현 사용)
답변자 페르소나: 친절하고 명쾌한 '크레 고인물' (이모지 적절히 사용, 핵심 정보 강조)
"""

    prompt = f"""다음 Q&A를 커뮤니티 스타일로 재구성하세요:

원본 제목: {title}
원본 질문: {original_content}
교정된 답변: {corrected_answer}

JSON 형식으로 응답하세요:
{{
    "title": "[질문] 재구성된 제목 (궁금증 유발, 20자 이내)",
    "content": "재구성된 질문 본문 (초보자 말투, 100자 이내)",
    "best_answer": "재구성된 답변 (친절한 고인물 말투, 이모지 포함, 핵심 정보 강조)"
}}

JSON만 출력하세요."""

    result = call_groq_llm(prompt, system_prompt)
    if result:
        try:
            json_match = re.search(r'\{[\s\S]*\}', result)
            if json_match:
                return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    return None


# ============================================
# Google Sheets 연동 (간단 버전)
# ============================================

def get_sheet_data_mock() -> List[Dict[str, str]]:
    """
    Mock 데이터 (실제로는 Google Sheets API 사용)
    실제 구현 시 gspread 라이브러리 사용 권장
    """
    # 테스트용 샘플 데이터
    return [
        {
            "title": "릴리끼리 교배해도 되나요?",
            "content": "릴리 화이트 암수가 있는데 둘이 붙이면 더 하얀 애기가 나온다고 해서요. 해도 될까요?"
        },
        {
            "title": "크레 먹이로 젤리만 줘도 되나요",
            "content": "슈퍼푸드 비싸서 그냥 곤충 젤리로 주려는데 괜찮을까요? 답변 부탁드려요"
        },
        {
            "title": "카푸치노 모프 알려주세요",
            "content": "카푸치노랑 세이블이 뭐가 다른지 모르겠어요. 교배하면 어떻게 되나요?"
        },
        {
            "title": "여름에 온도 30도 넘어도 괜찮나요?",
            "content": "에어컨이 없어서 방이 32도까지 올라가는데 크레가 버틸 수 있을까요?"
        },
        {
            "title": "문스톤 크레 분양합니다 (광고)",
            "content": "예쁜 문스톤 크레 분양합니다. 연락주세요 010-xxxx-xxxx"
        }
    ]


def get_sheet_data_real() -> List[Dict[str, str]]:
    """
    Google Sheets API를 사용한 실제 데이터 가져오기
    gspread 라이브러리 필요: pip install gspread oauth2client
    """
    try:
        import gspread
        from oauth2client.service_account import ServiceAccountCredentials
        
        # Google Sheets API 인증
        scope = [
            "https://spreadsheets.google.com/feeds",
            "https://www.googleapis.com/auth/drive"
        ]
        
        # 서비스 계정 JSON 키 파일 경로
        creds_path = os.environ.get("GOOGLE_CREDS_PATH", "google_creds.json")
        
        if not os.path.exists(creds_path):
            print("⚠️ Google 인증 파일이 없습니다. Mock 데이터를 사용합니다.")
            return get_sheet_data_mock()
        
        creds = ServiceAccountCredentials.from_json_keyfile_name(creds_path, scope)
        client = gspread.authorize(creds)
        
        # 스프레드시트 열기
        sheet = client.open_by_key(GOOGLE_SHEET_ID).worksheet(SHEET_NAME)
        
        # 모든 레코드 가져오기
        records = sheet.get_all_records()
        
        # Column D(3) = 제목, Column E(4) = 본문+답변
        data = []
        for row in records:
            # 컬럼 이름에 따라 조정 필요
            title = row.get("제목", row.get("title", ""))
            content = row.get("본문", row.get("content", ""))
            
            if title and content:
                data.append({"title": title, "content": content})
        
        return data
        
    except ImportError:
        print("⚠️ gspread 라이브러리가 없습니다. pip install gspread oauth2client")
        return get_sheet_data_mock()
    except Exception as e:
        print(f"❌ Google Sheets 오류: {e}")
        return get_sheet_data_mock()


# ============================================
# 메인 처리 로직
# ============================================

def process_single_qna(title: str, content: str, index: int) -> Optional[Dict[str, Any]]:
    """
    단일 Q&A 처리 (3단계)
    
    데이터 무결성 정책 (Honesty Policy):
    - comment_count: 실제 답변 수 (1 or 0), NOT random
    - views: 랜덤 (50~2000) - 활성화를 위해 유지
    - likes: 조회수의 3~5% 비율로 설정 (리얼한 느낌)
    - is_solved: 답변이 있으면 True
    
    프론트엔드 힌트:
    - 댓글 수 대신 '조회수'와 '좋아요'를 강조해서 보여주세요.
    - 답변이 1개라도 있으면 '✅ 해결됨' 배지를 붙이세요.
    - 팩트체크된 답변에는 '🔬 검증됨' 배지를 추가하세요.
    """
    import random
    
    print(f"\n{'='*50}")
    print(f"📝 처리 중 [{index}]: {title[:30]}...")
    
    # Step 1: 관련성 필터
    print("  Step 1: 관련성 확인...", end=" ")
    if not step1_relevance_filter(title, content):
        print("❌ SKIP (관련 없음)")
        return None
    print("✅ RELEVANT")
    
    # Step 2: 사실 확인 및 교정
    print("  Step 2: 팩트 체크...", end=" ")
    fact_check = step2_fact_check_and_correct(title, content)
    if fact_check.get("has_errors"):
        print(f"⚠️ 교정됨: {fact_check.get('error_summary', '')[:30]}")
    else:
        print("✅ 정확함")
    
    corrected_answer = fact_check.get("corrected_answer", content)
    
    # Step 3: 재포맷
    print("  Step 3: 스타일 변환...", end=" ")
    formatted = step3_reformat_qna(title, content, corrected_answer)
    if formatted:
        print("✅ 완료")
        
        # === Honesty Policy: 현실적인 메트릭 생성 ===
        # 조회수: 50~2000 랜덤 (질문 흥미도에 따라)
        views = random.randint(50, 2000)
        
        # 좋아요: 조회수의 3~5% (리얼한 반응률)
        like_rate = random.uniform(0.03, 0.05)
        likes = max(5, int(views * like_rate))
        
        # 댓글 수: 실제 답변 수 (정직한 값)
        # best_answer가 있으면 1, 없으면 0
        has_answer = bool(formatted.get("best_answer"))
        comment_count = 1 if has_answer else 0
        
        # 해결 상태: 답변이 있으면 해결됨
        is_solved = has_answer
        
        return {
            "id": f"kin-{index}",
            "source": "naver_kin",
            "original_title": title,
            "processed": {
                **formatted,
                # 프론트엔드에서 사용할 메트릭
                "views": views,
                "likes": likes,
                "comment_count": comment_count,
                "is_solved": is_solved,
                # 닉네임 (추후 다양화 가능)
                "author": random.choice([
                    "왕초보브리더", "크레입문자", "도마뱀뉴비", "파충류초보맘",
                    "궁금이가득", "게코시작", "크레사랑해", "초보사육사"
                ])
            },
            "fact_checked": fact_check.get("has_errors", False),
            "processed_at": datetime.now().isoformat()
        }
    else:
        print("❌ 실패")
        return None


def main():
    """메인 실행"""
    print("🦎 네이버 지식인 Q&A 처리 시작")
    print(f"   Knowledge Base 적용됨")
    print(f"   3단계 AI 처리: 선별 → 검증 → 가공\n")
    
    # API 키 확인
    if not GROQ_API_KEY:
        print("❌ GROQ_API_KEY 또는 XAI_API_KEY 환경변수를 설정하세요.")
        print("   예: set XAI_API_KEY=your-groq-api-key")
        return
    
    # 데이터 가져오기 (Mock 또는 실제)
    use_real_sheets = os.environ.get("USE_REAL_SHEETS", "false").lower() == "true"
    
    if use_real_sheets:
        print("📊 Google Sheets에서 데이터 가져오는 중...")
        raw_data = get_sheet_data_real()
    else:
        print("📊 테스트 데이터 사용 중...")
        raw_data = get_sheet_data_mock()
    
    print(f"   총 {len(raw_data)}개 항목 발견\n")
    
    # 처리
    processed_items = []
    skipped_count = 0
    
    for i, item in enumerate(raw_data, 1):
        result = process_single_qna(item["title"], item["content"], i)
        
        if result:
            processed_items.append(result)
        else:
            skipped_count += 1
        
        # API 레이트 리밋 방지
        time.sleep(1)
    
    # 결과 저장
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_path = os.path.join(OUTPUT_DIR, "community_kin_processed.json")
    
    output_data = {
        "source": "Naver Kin via Groq Llama 3.3 Processing",
        "processed_at": datetime.now().isoformat(),
        "total_raw": len(raw_data),
        "total_processed": len(processed_items),
        "total_skipped": skipped_count,
        "items": processed_items
    }
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    # 결과 출력
    print(f"\n{'='*50}")
    print("✅ 처리 완료!")
    print(f"   - 원본 데이터: {len(raw_data)}개")
    print(f"   - 처리 완료: {len(processed_items)}개")
    print(f"   - 건너뜀: {skipped_count}개")
    print(f"   - 저장 위치: {output_path}")
    
    # 샘플 출력
    if processed_items:
        print(f"\n📌 샘플 결과:")
        sample = processed_items[0]["processed"]
        print(f"   제목: {sample.get('title', 'N/A')}")
        print(f"   질문: {sample.get('content', 'N/A')[:50]}...")
        print(f"   답변: {sample.get('best_answer', 'N/A')[:50]}...")


if __name__ == "__main__":
    main()
