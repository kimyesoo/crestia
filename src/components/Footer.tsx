import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-950 border-t border-zinc-800">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Crestia"
                                width={32}
                                height={32}
                                className="opacity-80"
                            />
                            <span className="text-xl font-serif text-[#D4AF37] font-bold tracking-wider">CRESTIA</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                            크레스티드 게코 혈통 관리의 글로벌 스탠다드.<br />
                            투명한 이력 추적과 신뢰할 수 있는 브리딩 정보를 제공합니다.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide">서비스</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/tools/calculator" className="text-zinc-500 hover:text-white transition">
                                    모프 계산기
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/naming" className="text-zinc-500 hover:text-white transition">
                                    2세 작명소
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/contract" className="text-zinc-500 hover:text-white transition">
                                    분양 계약서
                                </Link>
                            </li>
                            <li>
                                <Link href="/card" className="text-zinc-500 hover:text-white transition">
                                    ID 카드 발급
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide">고객지원</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/legal/terms" className="text-zinc-500 hover:text-white transition">
                                    이용약관
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="text-zinc-500 hover:text-white transition">
                                    개인정보처리방침
                                </Link>
                            </li>
                            <li>
                                <Link href="/community/notice" className="text-zinc-500 hover:text-white transition">
                                    공지사항
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:crestiamaster1@gmail.com" className="text-zinc-500 hover:text-white transition">
                                    문의하기
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-zinc-600 text-xs text-center md:text-left">
                            © {currentYear} Crestia. All rights reserved.
                        </p>

                        {/* Legal Links (Mobile) */}
                        <div className="flex items-center gap-4 text-xs">
                            <Link href="/legal/terms" className="text-zinc-600 hover:text-zinc-400 transition">
                                이용약관
                            </Link>
                            <span className="text-zinc-700">|</span>
                            <Link href="/legal/privacy" className="text-zinc-600 hover:text-zinc-400 transition">
                                개인정보처리방침
                            </Link>
                            <span className="text-zinc-700">|</span>
                            <a href="mailto:crestiamaster1@gmail.com" className="text-zinc-600 hover:text-zinc-400 transition">
                                문의하기
                            </a>
                        </div>
                    </div>

                    {/* Affiliate Disclosure */}
                    <p className="text-zinc-700 text-[10px] text-center mt-4 leading-relaxed">
                        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.<br className="hidden sm:block" />
                        본 서비스에서 제공하는 유전 정보 및 모프 계산 결과는 참고용이며, 전문적인 수의학적 진단을 대체하지 않습니다.
                    </p>
                </div>
            </div>
        </footer>
    );
}
