# Pangea Reptile Blog Scraper

Pangea Reptile 블로그에서 크레스티드 게코 사육 정보를 수집하는 Python 스크립트입니다.

## 파일 구조

```
scripts/
├── requirements.txt    # Python 의존성
└── pangea_scraper.py   # 스크래퍼 메인 스크립트
```

## 실행 방법

```powershell
# 1. scripts 폴더로 이동
cd scripts

# 2. 가상환경 생성 (권장)
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 스크래퍼 실행
python pangea_scraper.py
```

## 출력

`src/constants/pangea_data.json` 파일이 생성됩니다.

```json
{
  "source": "Pangea Reptile Blog",
  "scraped_at": "2024-12-29T10:30:00",
  "total_articles": 15,
  "articles": [
    {
      "title": "Crested Gecko Care Guide",
      "url": "https://...",
      "summary": "앞 200자 요약...",
      "content": "전체 본문 텍스트..."
    }
  ]
}
```

## 주의사항

- 차단 방지를 위해 요청 간 1~3초 랜덤 딜레이가 적용됩니다.
- 사이트 구조 변경 시 셀렉터 수정이 필요할 수 있습니다.
