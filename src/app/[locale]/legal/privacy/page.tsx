import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-zinc-300 pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        홈으로
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">개인정보처리방침</h1>
                    <p className="text-zinc-500 text-sm">Privacy Policy</p>
                    <p className="text-zinc-600 text-xs mt-2">최종 수정일: 2025년 1월 1일</p>
                </div>

                {/* Content */}
                <div className="space-y-10 text-zinc-400 leading-relaxed">

                    {/* 개요 */}
                    <section>
                        <p>
                            Crestia(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요시하며,
                            「개인정보 보호법」 및 관련 법령을 준수하고 있습니다.
                            본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와
                            방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고
                            있는지 알려드립니다.
                        </p>
                    </section>

                    {/* 제1조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제1조 (수집하는 개인정보의 항목)</h2>
                        <p className="mb-4">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                            <div>
                                <h4 className="text-white font-medium mb-1">1. 회원가입 시</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    <li>필수: 이메일 주소, 닉네임(샵 이름)</li>
                                    <li>선택: 프로필 이미지, 연락처</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-1">2. 소셜 로그인 시 (Google 등)</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    <li>이메일 주소, 프로필 이미지, 이름</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-1">3. 서비스 이용 시 자동 수집</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    <li>IP 주소, 쿠키, 접속 기록, 기기 정보, 브라우저 유형</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 제2조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제2조 (개인정보 수집 및 이용 목적)</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>회원 관리: 회원제 서비스 이용, 본인 확인, 부정 이용 방지</li>
                            <li>서비스 제공: 개체 등록, ID 카드 발급, 혈통 관리, 계약서 작성</li>
                            <li>서비스 개선: 신규 서비스 개발, 통계 분석, 이용자 경험 개선</li>
                            <li>마케팅 및 광고: 맞춤형 광고 제공, 이벤트 정보 제공 (동의 시)</li>
                        </ol>
                    </section>

                    {/* 제3조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제3조 (개인정보의 보유 및 이용 기간)</h2>
                        <p className="mb-4">
                            회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이
                            파기합니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서
                            정한 기간 동안 보관합니다.
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>계약 또는 청약철회 기록</span>
                                <span className="text-white">5년</span>
                            </div>
                            <div className="flex justify-between">
                                <span>대금결제 및 재화 공급 기록</span>
                                <span className="text-white">5년</span>
                            </div>
                            <div className="flex justify-between">
                                <span>소비자 불만 또는 분쟁처리 기록</span>
                                <span className="text-white">3년</span>
                            </div>
                            <div className="flex justify-between">
                                <span>웹사이트 방문 기록</span>
                                <span className="text-white">3개월</span>
                            </div>
                        </div>
                    </section>

                    {/* 제4조 - 광고 관련 (중요) */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제4조 (쿠키 및 광고)</h2>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                            <p className="text-blue-400 font-medium">📢 광고 및 쿠키 사용 안내</p>
                        </div>
                        <ol className="list-decimal list-inside space-y-3">
                            <li>
                                <strong className="text-white">제3자 광고 서비스:</strong>
                                본 서비스는 <strong className="text-white">Google 애드센스(Google AdSense)</strong> 등
                                제3자 광고 사업자가 쿠키를 사용하여 이용자에게 맞춤형 광고를 게재할 수 있습니다.
                            </li>
                            <li>
                                <strong className="text-white">쿠키 사용 목적:</strong>
                                Google 및 파트너 네트워크는 이용자가 본 서비스 또는 다른 웹사이트를
                                방문한 기록을 기반으로 관심사에 맞는 광고를 표시하기 위해 쿠키를 사용합니다.
                            </li>
                            <li>
                                <strong className="text-white">맞춤형 광고 비활성화:</strong>
                                이용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">Google 광고 설정</a>을
                                방문하여 맞춤형 광고를 차단할 수 있습니다.
                            </li>
                            <li>
                                <strong className="text-white">쿠키 거부 방법:</strong>
                                이용자는 웹 브라우저의 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                                단, 쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
                            </li>
                        </ol>
                    </section>

                    {/* 제5조 - 제휴 마케팅 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제5조 (제휴 마케팅 및 광고)</h2>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                            <p className="text-amber-400 text-sm">
                                본 서비스는 <strong>쿠팡 파트너스</strong> 등 제휴 마케팅 프로그램에 참여하고 있으며,
                                이에 따라 일정 수수료를 지급받을 수 있습니다.
                            </p>
                        </div>
                        <p>
                            이용자가 본 서비스 내 제휴 링크를 통해 상품을 구매하는 경우,
                            회사는 해당 거래에 대해 제휴사로부터 소정의 수수료를 지급받습니다.
                            이는 이용자가 지불하는 가격에 영향을 미치지 않습니다.
                        </p>
                    </section>

                    {/* 제6조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제6조 (개인정보의 제3자 제공)</h2>
                        <p>
                            회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
                            다만, 다음의 경우에는 예외로 합니다.
                        </p>
                        <ul className="list-disc list-inside mt-3 space-y-1">
                            <li>이용자가 사전에 동의한 경우</li>
                            <li>법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라
                                수사기관의 요구가 있는 경우</li>
                        </ul>
                    </section>

                    {/* 제7조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제7조 (개인정보의 파기)</h2>
                        <p>
                            회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게
                            되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의
                            정보는 복구 및 재생되지 않도록 안전하게 삭제하며, 종이에 출력된 개인정보는
                            분쇄기로 분쇄하거나 소각합니다.
                        </p>
                    </section>

                    {/* 제8조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제8조 (이용자의 권리)</h2>
                        <p className="mb-3">
                            이용자(또는 법정대리인)는 언제든지 자신의 개인정보에 대해 다음의 권리를
                            행사할 수 있습니다.
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>개인정보 열람 요구</li>
                            <li>오류 정정 요구</li>
                            <li>삭제 요구</li>
                            <li>처리 정지 요구</li>
                        </ul>
                        <p className="mt-3 text-sm">
                            위 권리 행사는 서비스 내 설정 또는 이메일(crestiamaster1@gmail.com)을 통해
                            요청하실 수 있습니다.
                        </p>
                    </section>

                    {/* 제9조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제9조 (개인정보 보호책임자)</h2>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="mb-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                                개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여
                                아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                            <div className="mt-3 text-sm">
                                <p><span className="text-zinc-500">담당:</span> <span className="text-white">개인정보 보호책임자</span></p>
                                <p><span className="text-zinc-500">이메일:</span> <span className="text-white">crestiamaster1@gmail.com</span></p>
                            </div>
                        </div>
                    </section>

                    {/* 부칙 */}
                    <section className="border-t border-zinc-800 pt-8">
                        <h2 className="text-lg font-bold text-white mb-4">부칙</h2>
                        <p>본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
