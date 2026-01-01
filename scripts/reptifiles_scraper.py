import time
import random
import json
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# 저장 경로 설정
OUTPUT_DIR = "../src/constants"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "reptifiles_data.json")

# 타겟 URL
MAIN_URL = "https://reptifiles.com/crested-gecko-care/"

def setup_driver():
    """Selenium 드라이버 설정"""
    options = Options()
    options.add_argument("--headless=new")  # 백그라운드 실행
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    # WebDriver 자동 설치 및 서비스 생성
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    return driver

def get_chapter_links(driver):
    """메인 페이지에서 챕터 링크 수집"""
    print(f"🕵️  메인 페이지 분석 중... ({MAIN_URL})")
    
    try:
        driver.get(MAIN_URL)
        time.sleep(3)  # 페이지 로딩 대기
        
        # 메인 콘텐츠 영역에서 링크 찾기
        links = []
        content_links = driver.find_elements(By.CSS_SELECTOR, ".entry-content a")
        
        for link in content_links:
            href = link.get_attribute("href")
            text = link.text.strip()
            
            # 유효한 챕터 링크만 필터링
            if (
                href and
                'reptifiles.com/crested-gecko-care/' in href and
                href != MAIN_URL and
                'share=' not in href and
                'jpg' not in href and
                '#' not in href and
                len(text) > 3
            ):
                if href not in [x['url'] for x in links]:
                    links.append({"title": text, "url": href})
        
        print(f"✅ 총 {len(links)}개의 유효한 챕터를 찾았습니다.")
        return links
        
    except Exception as e:
        print(f"❌ 메인 페이지 접속 실패: {e}")
        return []

def get_chapter_content(driver, url):
    """챕터 페이지에서 본문 콘텐츠 추출"""
    try:
        print(f"   📖 Reading: {url[:60]}...")
        driver.get(url)
        time.sleep(random.uniform(2, 4))  # 랜덤 대기
        
        # 본문 영역 찾기
        try:
            content_div = driver.find_element(By.CSS_SELECTOR, ".entry-content")
        except:
            print("   ⚠️ 본문 영역을 찾을 수 없습니다.")
            return None
        
        # JavaScript로 광고 요소 제거
        driver.execute_script("""
            const selectors = ['.adthrive-ad', '.sharedaddy', '.jp-relatedposts', 
                               'script', 'style', '.widget', '.advertisement'];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => el.remove());
            });
        """)
        
        # 텍스트 추출 (p, h2, h3, li 태그)
        paragraphs = []
        elements = content_div.find_elements(By.CSS_SELECTOR, "p, h2, h3, li")
        
        for elem in elements:
            text = elem.text.strip()
            if len(text) > 1:
                tag_name = elem.tag_name.lower()
                if tag_name in ['h2', 'h3']:
                    paragraphs.append(f"\n## {text}\n")
                elif tag_name == 'li':
                    paragraphs.append(f"- {text}")
                else:
                    paragraphs.append(text)
        
        content = "\n\n".join(paragraphs)
        return content if content else None
        
    except Exception as e:
        print(f"   ❌ 에러 발생: {e}")
        return None

def main():
    # 저장 폴더 확인
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    print("=" * 60)
    print("🦎 ReptiFiles Crested Gecko Care Guide Scraper (Selenium)")
    print("=" * 60)
    
    # Selenium 드라이버 시작
    print("\n🚀 Chrome 드라이버 초기화 중...")
    driver = setup_driver()
    
    try:
        # 챕터 링크 수집
        links = get_chapter_links(driver)
        if not links:
            print("수집할 링크가 없어 종료합니다.")
            return
        
        collected_data = []
        print("\n📚 상세 내용 수집 시작...")
        
        for idx, item in enumerate(links):
            print(f"\n[{idx+1}/{len(links)}] {item['title']} 수집 중")
            
            content = get_chapter_content(driver, item['url'])
            
            if content:
                collected_data.append({
                    "chapter": item['title'],
                    "url": item['url'],
                    "content": content
                })
                print(f"   ✨ 수집 성공 ({len(content):,}자)")
            else:
                print("   🧨 수집 실패")
            
            # 차단 방지를 위한 랜덤 딜레이
            delay = random.uniform(3, 6)
            time.sleep(delay)
        
        # JSON 저장
        output_data = {
            "source": "ReptiFiles",
            "source_url": MAIN_URL,
            "total_chapters": len(collected_data),
            "chapters": collected_data
        }
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'=' * 60}")
        print(f"🎉 완료! {len(collected_data)}개의 챕터가 저장되었습니다.")
        print(f"📁 파일 위치: {OUTPUT_FILE}")
        print("=" * 60)
        
    finally:
        driver.quit()
        print("🔒 브라우저 종료")

if __name__ == "__main__":
    main()
