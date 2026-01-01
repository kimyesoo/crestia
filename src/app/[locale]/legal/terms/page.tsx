import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-zinc-300 pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        홈으로
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">이용약관</h1>
                    <p className="text-zinc-500 text-sm">Terms of Service</p>
                    <p className="text-zinc-600 text-xs mt-2">최종 수정일: 2025년 1월 1일</p>
                </div>

                {/* Content */}
                <div className="space-y-10 text-zinc-400 leading-relaxed">

                    {/* 제1조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제1조 (목적)</h2>
                        <p>
                            본 약관은 Crestia(이하 &quot;회사&quot;)가 제공하는 크레스티드 게코
                            혈통 관리 및 브리딩 정보 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여
                            회사와 이용자 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을
                            목적으로 합니다.
                        </p>
                    </section>

                    {/* 제2조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제2조 (정의)</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>&quot;서비스&quot;란 회사가 제공하는 크레스티드 게코 혈통 관리, 모프 계산,
                                디지털 ID 카드 발급, 분양 계약서 생성 등 일체의 서비스를 의미합니다.</li>
                            <li>&quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는
                                회원 및 비회원을 의미합니다.</li>
                            <li>&quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서,
                                회사의 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                        </ol>
                    </section>

                    {/* 제3조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제3조 (면책 조항)</h2>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                            <p className="text-amber-400 font-medium">⚠️ 중요 안내</p>
                        </div>
                        <ol className="list-decimal list-inside space-y-3">
                            <li>
                                회사가 제공하는 <strong className="text-white">모프 계산기, 유전 정보,
                                    브리딩 예측 결과</strong> 등은 참고용 정보이며, 전문적인 수의학적 진단이나
                                의료적 조언을 대체하지 않습니다.
                            </li>
                            <li>
                                회사는 서비스에서 제공하는 정보의 정확성, 완전성, 신뢰성을 보증하지 않으며,
                                이용자가 해당 정보를 활용하여 발생하는 모든 결과에 대해 책임을 지지 않습니다.
                            </li>
                            <li>
                                개체의 건강, 유전병, 번식 관련 결정은 반드시 전문 수의사 또는 관련 전문가와
                                상담 후 진행하시기 바랍니다.
                            </li>
                            <li>
                                회사는 이용자 간의 거래(분양, 교환 등)에 개입하지 않으며, 거래로 인해
                                발생하는 분쟁에 대해 책임을 지지 않습니다.
                            </li>
                        </ol>
                    </section>

                    {/* 제4조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제4조 (저작권 및 지식재산권)</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>
                                서비스 내의 모든 콘텐츠(텍스트, 이미지, 로고, 디자인, 소프트웨어,
                                데이터베이스 구조 등)에 대한 저작권 및 기타 지식재산권은 회사에 귀속됩니다.
                            </li>
                            <li>
                                이용자는 회사의 사전 서면 동의 없이 서비스의 콘텐츠를 복제, 배포, 전송,
                                출판, 판매, 2차 저작물 작성 등의 방법으로 이용하거나 제3자에게
                                이용하게 할 수 없습니다.
                            </li>
                            <li>
                                이용자가 서비스에 업로드한 콘텐츠(게코 사진, 혈통 정보 등)의 저작권은
                                해당 이용자에게 있으나, 서비스 운영 및 홍보 목적으로 회사가 이를
                                사용할 수 있습니다.
                            </li>
                        </ol>
                    </section>

                    {/* 제5조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제5조 (서비스 이용)</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>이용자는 본 약관 및 관계 법령을 준수하여야 합니다.</li>
                            <li>이용자는 타인의 명예를 훼손하거나 불이익을 주는 행위를 하여서는 안 됩니다.</li>
                            <li>이용자는 서비스를 이용하여 불법적인 행위를 하여서는 안 됩니다.</li>
                            <li>회사는 서비스의 운영상, 기술상 필요한 경우 서비스의 전부 또는 일부를
                                변경할 수 있습니다.</li>
                        </ol>
                    </section>

                    {/* 제6조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제6조 (회원 탈퇴 및 자격 상실)</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>회원은 언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 즉시
                                회원탈퇴를 처리합니다.</li>
                            <li>회원이 본 약관을 위반한 경우, 회사는 사전 통지 없이 회원 자격을
                                제한 또는 정지시킬 수 있습니다.</li>
                        </ol>
                    </section>

                    {/* 제7조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제7조 (약관의 변경)</h2>
                        <p>
                            회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내
                            공지사항을 통해 공지합니다. 변경된 약관에 동의하지 않는 경우 이용자는
                            서비스 이용을 중단하고 탈퇴할 수 있습니다.
                        </p>
                    </section>

                    {/* 제8조 */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">제8조 (준거법 및 관할법원)</h2>
                        <p>
                            본 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국 법률을
                            적용하며, 분쟁이 발생한 경우 회사의 본사 소재지를 관할하는 법원을
                            전속 관할법원으로 합니다.
                        </p>
                    </section>

                    {/* 부칙 */}
                    <section className="border-t border-zinc-800 pt-8">
                        <h2 className="text-lg font-bold text-white mb-4">부칙</h2>
                        <p>본 약관은 2025년 1월 1일부터 시행됩니다.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
