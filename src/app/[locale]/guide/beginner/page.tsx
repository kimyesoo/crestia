'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, ChevronDown, ChevronUp, CheckCircle, Clock, Utensils, Home, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// 가이드 콘텐츠 데이터
// ============================================

interface GuideArticle {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    readTime: string;
    content: React.ReactNode;
}

const GUIDE_ARTICLES: GuideArticle[] = [
    {
        id: 'why-crested-gecko',
        title: '1. 크레스티드 게코, 왜 최고의 반려동물일까요?',
        subtitle: '벌레 없이, 바쁜 당신도 키울 수 있는 완벽한 친구',
        icon: <Sparkles className="w-5 h-5" />,
        readTime: '5분',
        content: (
            <div className="prose prose-invert prose-zinc max-w-none">
                {/* 서론 */}
                <div className="mb-8">
                    <p className="text-zinc-300 leading-relaxed">
                        반려동물을 키우고 싶은 마음... 다들 한 번쯤 있으시죠?
                    </p>
                    <p className="text-zinc-400 leading-relaxed">
                        하지만 현실은 녹록치 않아요.
                    </p>
                    <ul className="text-zinc-400 space-y-1 my-4">
                        <li>🏃 &quot;매일 산책시킬 시간이 없는데...&quot;</li>
                        <li>🏠 &quot;원룸이라 대형견은 무리야...&quot;</li>
                        <li>😱 &quot;고양이 털 알러지가 있어...&quot;</li>
                        <li>🦗 &quot;파충류는... 벌레 줘야 하잖아? 절대 못 해!&quot;</li>
                    </ul>
                    <p className="text-zinc-300 leading-relaxed">
                        혹시 이 중 하나라도 해당되셨다면, 오늘 이 글이 여러분의 인생을 바꿔놓을지도 몰라요.
                    </p>
                    <p className="text-white font-bold text-lg mt-4">
                        &quot;크레스티드 게코(Crested Gecko)&quot; — 바쁜 현대인을 위해 태어난, 21세기 최고의 반려동물을 소개합니다! ✨
                    </p>
                </div>

                {/* 본론 1 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
                        🦗 1. 충식(벌레) 공포에서의 완전한 해방!
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        &quot;도마뱀 키우려면 귀뚜라미 잡아서 줘야 하지 않아?&quot;
                    </p>
                    <p className="text-zinc-300 mb-4">
                        아, 이 오해! 얼마나 많은 분들이 이것 때문에 파충류를 포기했을까요 😭
                    </p>
                    <p className="text-white font-semibold mb-4">
                        크레스티드 게코는 다릅니다.
                    </p>
                    <p className="text-zinc-300 mb-4">
                        놀랍게도 이 아이들은 <strong className="text-white">과일을 주식으로 먹는 몇 안 되는 도마뱀</strong>이에요!
                        야생에서도 과일, 꽃가루, 작은 곤충을 먹으며 살아가죠.
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-start gap-2 text-zinc-300">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>가루 사료(MRP/슈퍼푸드):</strong> 물에 타면 완성! 마치 이유식 같은 부드러운 질감이에요.</span>
                        </li>
                        <li className="flex items-start gap-2 text-zinc-300">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>과일 젤리:</strong> 망고, 바나나 등 다양한 맛. 아이들이 정말 좋아해요.</span>
                        </li>
                        <li className="flex items-start gap-2 text-zinc-300">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>벌레는 100% 선택 사항:</strong> 가끔 영양 보충용으로 줄 수는 있지만, 안 줘도 평생 건강하게 키울 수 있어요!</span>
                        </li>
                    </ul>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-400 text-sm">
                            💡 <strong>요약:</strong> 집에 귀뚜라미 한 마리 없이, 깔끔하고 위생적으로 키울 수 있답니다!
                        </p>
                    </div>
                </div>

                {/* 본론 2 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
                        ⏰ 2. 바쁜 현대인에게 딱 맞는 케어 스케줄
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        &quot;야근이 많아서...&quot;, &quot;출장이 잦아서...&quot;, &quot;집에 늦게 들어오는데...&quot;
                    </p>
                    <p className="text-zinc-300 mb-6">
                        강아지나 고양이라면 걱정되겠죠. 하지만 크레스티드 게코는 <strong className="text-white">미니멀한 케어</strong>로도 충분해요!
                    </p>

                    {/* 케어 스케줄 테이블 */}
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-700">
                                    <th className="text-left py-2 text-zinc-400">항목</th>
                                    <th className="text-left py-2 text-zinc-400">빈도</th>
                                    <th className="text-left py-2 text-zinc-400">소요 시간</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-300">
                                <tr className="border-b border-zinc-800">
                                    <td className="py-2">🍽️ 급여</td>
                                    <td className="py-2">2~3일에 1번</td>
                                    <td className="py-2">1분</td>
                                </tr>
                                <tr className="border-b border-zinc-800">
                                    <td className="py-2">💧 분무(습도 관리)</td>
                                    <td className="py-2">하루 1번 (저녁)</td>
                                    <td className="py-2">30초</td>
                                </tr>
                                <tr>
                                    <td className="py-2">🧹 청소</td>
                                    <td className="py-2">주 1회</td>
                                    <td className="py-2">10분</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-white font-bold mb-4">그게 전부예요!</p>
                    <ul className="space-y-1 text-zinc-300 mb-4">
                        <li>❌ 매일 산책? <strong>필요 없어요.</strong></li>
                        <li>❌ 분리불안? <strong>없어요.</strong> 혼자 있는 걸 좋아해요!</li>
                        <li>❌ 아침마다 밥 챙기기? <strong>2~3일에 한 번</strong>이면 충분해요.</li>
                    </ul>
                    <p className="text-zinc-300">
                        출장 가서 2~3일 비워도 미리 밥만 챙겨놓으면 걱정 끝! 정말 <strong className="text-white">바쁜 직장인, 1인 가구에게 최적화된</strong> 반려동물이에요.
                    </p>
                </div>

                {/* 본론 3 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
                        🏠 3. 쾌적한 사육 환경: 무소음, 무취, 무장비!
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-semibold mb-2">🔇 층간소음 걱정 제로!</h4>
                            <ul className="text-zinc-300 space-y-1">
                                <li>• 짖지 않아요 (당연하지만 중요해요!)</li>
                                <li>• 밤에도 조용히 활동해요</li>
                                <li>• 이웃에게 민폐? 절대 없어요!</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-2">👃 냄새? 거의 안 나요!</h4>
                            <ul className="text-zinc-300 space-y-1">
                                <li>• 배변량이 매우 적어요 (작은 쌀알 크기의 똥...)</li>
                                <li>• 포유류 대비 <strong>냄새가 현저히 적음</strong></li>
                                <li>• 주 1회 청소만 해주면 쾌적!</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-2">🌡️ 특별한 장비 불필요!</h4>
                            <p className="text-zinc-400 mb-2">
                                뱀이나 다른 파충류는 열등, UV등, 온열 패드가 필수지만...
                            </p>
                            <p className="text-white font-semibold mb-2">크레스티드 게코는 달라요!</p>
                            <ul className="text-zinc-300 space-y-1">
                                <li>• 적정 온도: <strong>22~26도</strong> (일반 실내 온도!)</li>
                                <li>• 한국의 실내 환경에서 <strong>별도 장비 없이</strong> 사육 가능</li>
                                <li>• 여름 에어컨, 겨울 난방만 하면 OK!</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-3">
                        <p className="text-[#D4AF37] text-sm">
                            💰 <strong>초기 비용도 저렴하고, 유지 비용도 거의 안 들어요!</strong>
                        </p>
                    </div>
                </div>

                {/* 결론 */}
                <div className="mb-8 text-center py-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        당신의 책상 위 작은 친구를 만나보세요 🌟
                    </h3>
                    <p className="text-zinc-300 mb-4">크레스티드 게코는...</p>
                    <ul className="text-zinc-300 space-y-2 mb-6">
                        <li>✅ 벌레 없이 키울 수 있고</li>
                        <li>✅ 바쁜 당신도 부담 없이 돌볼 수 있고</li>
                        <li>✅ 조용하고 깨끗해서 어디서든 환영받는</li>
                    </ul>
                    <p className="text-white font-bold text-lg mb-4">완벽한 반려동물이에요.</p>
                    <p className="text-zinc-400">
                        작은 눈으로 당신을 올려다보는 이 귀여운 친구와 함께라면,
                        퇴근 후 집에 돌아오는 게 조금 더 설레지 않을까요?
                    </p>
                    <p className="text-[#D4AF37] font-bold text-xl mt-6">
                        지금 바로, 당신의 책상 위 작은 친구를 만나보세요. 🦎💛
                    </p>
                </div>

                {/* Crestia Tip */}
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6">
                    <h4 className="text-[#D4AF37] font-bold mb-4 flex items-center gap-2">
                        📌 Crestia Tip: 핵심 3줄 요약
                    </h4>
                    <div className="space-y-3 text-zinc-300">
                        <p><strong>1️⃣ 벌레 No!</strong> 물에 타는 가루 사료(MRP)만으로 평생 건강하게 키울 수 있어요.</p>
                        <p><strong>2️⃣ 시간 No!</strong> 2~3일에 한 번 급여, 하루 한 번 분무면 끝. 출장도 걱정 없어요.</p>
                        <p><strong>3️⃣ 장비 No!</strong> 실내 온도(22~26도)면 충분. 특별한 조명이나 온열 장비 불필요!</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'how-to-adopt',
        title: '2. 첫 크레스티드 게코, 어떻게 데려올까요?',
        subtitle: '건강한 개체 선별법과 안전한 입양 가이드',
        icon: <CheckCircle className="w-5 h-5" />,
        readTime: '7분',
        content: (
            <div className="prose prose-invert prose-zinc max-w-none">
                {/* 서론 */}
                <div className="mb-8">
                    <p className="text-white font-bold text-xl mb-4">
                        평생 가족이 될 크레, &apos;이것&apos; 3가지는 꼭 확인하고 데려오세요 🦎
                    </p>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        첫 크레스티드 게코를 데려오는 날... 설렘 반, 긴장 반이시죠?
                    </p>
                    <p className="text-zinc-400 leading-relaxed">
                        하지만 잠깐! 눈에 보이는 예쁜 색깔과 귀여운 얼굴에 혹해서
                        <strong className="text-white"> 건강 체크 없이</strong> 데려오면,
                        나중에 병원비로 몇 배를 지출하게 될 수도 있어요.
                    </p>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4">
                        <p className="text-amber-400 text-sm">
                            ⚠️ <strong>실제 사례:</strong> &quot;예쁜 모프에 반해서 데려왔는데,
                            알고 보니 MBD(대사성 골질환) 초기 증상이 있었어요. 치료비만 50만 원이 들었습니다...&quot;
                        </p>
                    </div>
                </div>

                {/* 본론 1 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🏪 1. 어디서 데려올까? (샵 vs 브리더 vs 박람회)
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🏬 파충류 전문샵</h4>
                            <ul className="text-zinc-300 space-y-1 text-sm">
                                <li>✅ 관리가 체계적이고 건강한 개체가 많음</li>
                                <li>✅ 용품을 한 번에 구매할 수 있어 초보자에게 편리</li>
                                <li>✅ AS나 상담이 가능한 곳이 많음</li>
                                <li>⚠️ 가격이 브리더보다 다소 높을 수 있음</li>
                            </ul>
                            <p className="text-green-400 text-sm mt-2 font-medium">👉 초보자 추천!</p>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">👨‍🔬 개인 브리더</h4>
                            <ul className="text-zinc-300 space-y-1 text-sm">
                                <li>✅ 고퀄리티 모프를 합리적인 가격에 구매 가능</li>
                                <li>✅ 부모 개체 정보, 해칭일 등 상세 정보 확인 가능</li>
                                <li>⚠️ 사기나 건강 이슈 확인이 어려울 수 있음</li>
                                <li>⚠️ 후기/평판을 반드시 확인할 것</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🎪 파충류 박람회/전시회</h4>
                            <ul className="text-zinc-300 space-y-1 text-sm">
                                <li>✅ 다양한 모프를 한자리에서 비교 가능</li>
                                <li>✅ 박람회 특가로 저렴하게 구매 가능</li>
                                <li>⚠️ 스트레스 받은 개체가 있을 수 있음</li>
                                <li>⚠️ 충동구매 주의! 미리 원하는 모프 정해두기</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 본론 2 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🏥 2. 건강 체크리스트 (현장에서 바로 확인하세요!)
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        아래 체크리스트를 캡처해서 분양 현장에 가져가세요!
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-zinc-900/50 rounded-lg p-4">
                            <span className="text-2xl">🏃</span>
                            <div>
                                <h4 className="text-white font-semibold">움직임 & 활력</h4>
                                <p className="text-zinc-400 text-sm">
                                    손에 올렸을 때 <strong className="text-white">점프를 하거나 활발하게 움직이는지</strong> 확인하세요.
                                    축 처져 있거나 반응이 없으면 건강에 문제가 있을 수 있어요.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-zinc-900/50 rounded-lg p-4">
                            <span className="text-2xl">🦴</span>
                            <div>
                                <h4 className="text-white font-semibold">허리와 꼬리 (MBD/FTS 체크)</h4>
                                <p className="text-zinc-400 text-sm mb-2">
                                    <strong className="text-white">척추가 S자로 휘어있거나</strong>,
                                    <strong className="text-white">골반뼈가 툭 튀어나와</strong> 보이면
                                    <strong className="text-red-400">MBD(대사성 골질환)</strong> 의심!
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    꼬리가 등 쪽으로 심하게 말려있다면
                                    <strong className="text-red-400">FTS(플로피 테일 증후군)</strong> 가능성이 있어요.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-zinc-900/50 rounded-lg p-4">
                            <span className="text-2xl">👁️</span>
                            <div>
                                <h4 className="text-white font-semibold">눈과 입</h4>
                                <p className="text-zinc-400 text-sm">
                                    <strong className="text-white">눈이 맑고 초롱초롱한지</strong>,
                                    입가에 <strong className="text-red-400">염증이나 곰팡이(마우스 롯)</strong>가 없는지 확인하세요.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-zinc-900/50 rounded-lg p-4">
                            <span className="text-2xl">🦶</span>
                            <div>
                                <h4 className="text-white font-semibold">발가락 & 꼬리 끝</h4>
                                <p className="text-zinc-400 text-sm">
                                    발가락이 다 있는지, <strong className="text-white">탈피 찌꺼기가 감겨있지는 않은지</strong> 확인!
                                    오래 방치된 탈피 잔여물은 혈액순환을 막아 괴사를 일으킬 수 있어요.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 체크리스트 요약표 */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm border border-zinc-700 rounded-lg overflow-hidden">
                            <thead className="bg-[#D4AF37]/20">
                                <tr>
                                    <th className="text-left py-2 px-3 text-[#D4AF37]">체크 항목</th>
                                    <th className="text-center py-2 px-3 text-green-400">✅ 정상</th>
                                    <th className="text-center py-2 px-3 text-red-400">❌ 위험</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-300">
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">움직임</td>
                                    <td className="text-center py-2 px-3">활발, 점프함</td>
                                    <td className="text-center py-2 px-3">축 처짐, 무반응</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">척추/골반</td>
                                    <td className="text-center py-2 px-3">곧고 매끈함</td>
                                    <td className="text-center py-2 px-3">S자, 뼈 돌출</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">눈</td>
                                    <td className="text-center py-2 px-3">맑고 초롱초롱</td>
                                    <td className="text-center py-2 px-3">흐림, 함몰</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">입</td>
                                    <td className="text-center py-2 px-3">깨끗함</td>
                                    <td className="text-center py-2 px-3">염증, 곰팡이</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 본론 3 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🚗 3. 안전하게 집으로 데려오는 법
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-white font-semibold mb-2">📦 이동 중 스트레스 최소화</h4>
                            <ul className="text-zinc-300 space-y-1 text-sm">
                                <li>• <strong>어두운 박스나 파충류 이동백</strong>에 넣어주세요</li>
                                <li>• 키친타월을 깔면 미끄럼 방지 + 배변 처리 용이</li>
                                <li>• 흔들리지 않게 안정적으로 고정!</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-2">🌡️ 온도 관리 (계절별 주의사항)</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                    <p className="text-blue-400 font-medium">❄️ 겨울철</p>
                                    <p className="text-zinc-400">핫팩을 박스 외부에 붙이기 (직접 닿지 않게)</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                    <p className="text-red-400 font-medium">☀️ 여름철</p>
                                    <p className="text-zinc-400">에어컨 바람 직접 쐬지 않게, 너무 덥지 않게</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-2">🏠 집 도착 후 &apos;적응기&apos; 필수!</h4>
                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
                                <p className="text-[#D4AF37] font-medium mb-2">🚫 절대 하지 마세요:</p>
                                <ul className="text-zinc-300 space-y-1 text-sm">
                                    <li>• 도착하자마자 만지작거리기</li>
                                    <li>• 사진 찍으려고 밝은 곳에 꺼내기</li>
                                    <li>• 친구들 보여주려고 핸들링하기</li>
                                </ul>
                                <p className="text-[#D4AF37] font-medium mt-4 mb-2">✅ 이렇게 해주세요:</p>
                                <ul className="text-zinc-300 space-y-1 text-sm">
                                    <li>• <strong>2~3일간은 조용히 적응</strong>할 수 있게 해주세요</li>
                                    <li>• 밥은 다음날부터, 핸들링은 일주일 뒤부터!</li>
                                    <li>• 사육장을 어둡고 조용한 곳에 배치</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 결론 */}
                <div className="text-center py-6">
                    <p className="text-white font-bold text-lg mb-4">
                        첫 입양의 설렘도 중요하지만, 책임감이 더 중요합니다 🙏
                    </p>
                    <p className="text-zinc-400">
                        건강한 아이를 데려와서 오래오래 함께하세요!
                    </p>
                </div>

                {/* Tip 박스 */}
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6">
                    <h4 className="text-[#D4AF37] font-bold mb-4">📌 입양 전 체크리스트 요약</h4>
                    <div className="space-y-2 text-zinc-300 text-sm">
                        <p>☑️ <strong>움직임:</strong> 활발하고 반응이 좋은가?</p>
                        <p>☑️ <strong>척추/골반:</strong> 휘어지거나 튀어나온 곳 없는가?</p>
                        <p>☑️ <strong>눈/입:</strong> 맑고 깨끗한가?</p>
                        <p>☑️ <strong>발가락:</strong> 탈피 잔여물 없는가?</p>
                        <p>☑️ <strong>적응기:</strong> 2~3일 조용히 쉬게 할 준비 됐는가?</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'feeding-guide',
        title: '3. 먹이 가이드: 가루 사료부터 간식까지',
        subtitle: 'MRP 선택법, 급여량, 급여 주기 완벽 정리',
        icon: <Utensils className="w-5 h-5" />,
        readTime: '6분',
        content: (
            <div className="prose prose-invert prose-zinc max-w-none">
                {/* 서론 */}
                <div className="mb-8">
                    <p className="text-white font-bold text-xl mb-4">
                        밥 주는 게 이렇게 쉬울 수가! 🍽️
                    </p>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        크레스티드 게코 사육의 가장 큰 장점 중 하나는 바로 <strong className="text-white">먹이 급여의 간편함</strong>입니다.
                    </p>
                    <p className="text-zinc-400 leading-relaxed">
                        귀뚜라미나 밀웜 같은 살아있는 벌레 없이, <strong className="text-white">물에 타는 가루 사료(MRP)</strong>만으로도
                        평생 건강하게 키울 수 있어요. 이번 글에서는 어떤 사료를 선택하고,
                        얼마나 자주, 얼마만큼 줘야 하는지 완벽하게 정리해드릴게요!
                    </p>
                </div>

                {/* 본론 1 - MRP 소개 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🥣 1. MRP(Meal Replacement Powder)란?
                    </h3>
                    <p className="text-zinc-300 mb-4">
                        MRP는 <strong>&quot;Meal Replacement Powder&quot;</strong>의 약자로,
                        크레스티드 게코에게 필요한 모든 영양소가 들어있는 <strong className="text-white">완전 영양 사료</strong>예요.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                        <p className="text-green-400 text-sm">
                            ✅ <strong>벌레 없이도 OK!</strong> MRP만으로 평생 건강하게 사육 가능합니다.
                        </p>
                    </div>

                    <h4 className="text-white font-semibold mt-6 mb-3">📦 인기 MRP 브랜드</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-white font-medium">Pangea (팡게아)</p>
                            <p className="text-zinc-400 text-sm">가장 인기 있는 브랜드. 다양한 맛 보유</p>
                            <p className="text-green-400 text-xs mt-1">👉 초보자 추천!</p>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-white font-medium">Repashy (레파시)</p>
                            <p className="text-zinc-400 text-sm">영양 밸런스 좋음. 클래식한 선택</p>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-white font-medium">Leapin Leachie</p>
                            <p className="text-zinc-400 text-sm">고단백. 성장기 개체에 인기</p>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-white font-medium">Black Panther Zoological</p>
                            <p className="text-zinc-400 text-sm">프리미엄 브랜드. 기호성 최고</p>
                        </div>
                    </div>
                </div>

                {/* 본론 2 - 급여 방법 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        ⏰ 2. 급여 주기 & 급여량
                    </h3>

                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm border border-zinc-700 rounded-lg overflow-hidden">
                            <thead className="bg-[#D4AF37]/20">
                                <tr>
                                    <th className="text-left py-2 px-3 text-[#D4AF37]">성장 단계</th>
                                    <th className="text-center py-2 px-3 text-[#D4AF37]">급여 주기</th>
                                    <th className="text-center py-2 px-3 text-[#D4AF37]">급여량</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-300">
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🐣 베이비 (0~6개월)</td>
                                    <td className="text-center py-2 px-3">매일 또는 격일</td>
                                    <td className="text-center py-2 px-3">병뚜껑 1/3~1/2</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🦎 서브어덜트 (6~12개월)</td>
                                    <td className="text-center py-2 px-3">2~3일에 1번</td>
                                    <td className="text-center py-2 px-3">병뚜껑 1/2~1개</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🦖 어덜트 (12개월~)</td>
                                    <td className="text-center py-2 px-3">3일에 1번</td>
                                    <td className="text-center py-2 px-3">병뚜껑 1개</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-white font-semibold">🔧 MRP 만드는 법</h4>
                        <div className="bg-zinc-900/50 rounded-lg p-4 space-y-2 text-sm text-zinc-300">
                            <p>1️⃣ 가루와 물을 <strong className="text-white">1:1.5~2 비율</strong>로 섞기</p>
                            <p>2️⃣ <strong className="text-white">케첩 농도</strong> 정도가 적당해요</p>
                            <p>3️⃣ 먹이 접시에 담아 사육장에 넣기</p>
                            <p>4️⃣ <strong className="text-white">24시간 후</strong> 남은 건 버리기 (상하기 쉬움)</p>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                        <p className="text-blue-400 text-sm">
                            💡 <strong>TIP:</strong> 저녁에 밥을 주세요! 크레는 야행성이라 밤에 활동하며 먹습니다.
                        </p>
                    </div>
                </div>

                {/* 본론 3 - 영양제 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        💊 3. 칼슘제 & 영양제
                    </h3>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                        <p className="text-red-400 text-sm">
                            ⚠️ <strong>MBD(대사성 골질환) 예방 필수!</strong> 칼슘과 비타민 D3가 부족하면
                            뼈가 물렁물렁해지는 MBD에 걸릴 수 있어요.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🦴 칼슘제 (D3 포함)</h4>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 실내 사육 시 햇빛을 못 보므로 <strong className="text-white">D3 포함 제품</strong> 필수!</li>
                                <li>• 주 1~2회 MRP에 살짝 뿌려서 급여</li>
                                <li>• 추천: Repashy Calcium Plus, Zoo Med Repti Calcium</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🍊 종합 비타민</h4>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 대부분의 MRP에 이미 포함되어 있음</li>
                                <li>• 별도 급여는 <strong className="text-white">주 1회 이하</strong>로 (과잉 주의)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 본론 4 - 간식 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🍬 4. 간식 급여 (선택 사항)
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        MRP만으로 충분하지만, 가끔 간식을 주면 기호성도 올리고 영양도 보충할 수 있어요!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 font-medium mb-2">✅ 추천 간식</p>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 으깬 바나나 🍌</li>
                                <li>• 으깬 망고 🥭</li>
                                <li>• 무화과, 복숭아</li>
                                <li>• 곤충 (선택): 귀뚜라미, 듀비아</li>
                            </ul>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400 font-medium mb-2">❌ 피해야 할 것</p>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 감귤류 (오렌지, 레몬) 🍊</li>
                                <li>• 아보카도 🥑</li>
                                <li>• 양파, 마늘 🧅</li>
                                <li>• 유제품, 가공식품</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 결론 */}
                <div className="text-center py-6">
                    <p className="text-white font-bold text-lg mb-4">
                        밥 주기 정말 간단하죠? 😊
                    </p>
                    <p className="text-zinc-400">
                        물에 타서 접시에 담아주면 끝! 2~3일에 한 번이면 충분해요.
                    </p>
                </div>

                {/* Tip 박스 */}
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6">
                    <h4 className="text-[#D4AF37] font-bold mb-4">📌 급여 체크리스트</h4>
                    <div className="space-y-2 text-zinc-300 text-sm">
                        <p>☑️ <strong>MRP:</strong> 물과 1:2 비율로 케첩 농도로 섞기</p>
                        <p>☑️ <strong>주기:</strong> 어덜트 기준 3일에 1번</p>
                        <p>☑️ <strong>시간:</strong> 저녁에 급여 (야행성!)</p>
                        <p>☑️ <strong>칼슘:</strong> D3 포함 칼슘제 주 1~2회</p>
                        <p>☑️ <strong>위생:</strong> 24시간 후 남은 밥 버리기</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'enclosure-setup',
        title: '4. 사육장 셋팅 완벽 가이드',
        subtitle: '준비물, 바닥재, 온습도, FTS 예방까지',
        icon: <Home className="w-5 h-5" />,
        readTime: '8분',
        content: (
            <div className="prose prose-invert prose-zinc max-w-none">
                {/* 서론 */}
                <div className="mb-8">
                    <p className="text-white font-bold text-xl mb-4">
                        과소비 방지! 진짜 필요한 것만 알려드릴게요 💰
                    </p>
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4 mb-4">
                        <p className="text-[#D4AF37] text-sm">
                            💡 <strong>이 글을 읽으면 초기 비용 10만 원을 아낄 수 있습니다!</strong><br />
                            샵에서 추천하는 대로 다 사면 30만 원이 훌쩍 넘지만,
                            실제 사육에 꼭 필요한 &apos;생존 필수템&apos;만 정리해 드릴게요.
                        </p>
                    </div>
                </div>

                {/* 본론 1 - 사육장 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🏠 1. 사육장 선택: 비싼 유리장이 정답이 아니에요!
                    </h3>

                    <p className="text-zinc-400 mb-4">
                        제가 직접 다 써본 결과... 초보자에게 <strong className="text-white">적재형 케이지(채집통)</strong>를
                        강력 추천합니다!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 font-medium mb-2">✅ 적재형 케이지 (추천!)</p>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 가볍고 이동이 쉬움</li>
                                <li>• 환기 구멍이 많아 통풍 우수</li>
                                <li>• 청소가 간편함</li>
                                <li>• 가격: 1~2만 원대</li>
                            </ul>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-white font-medium mb-2">🔲 유리 테라리움</p>
                            <ul className="text-zinc-400 text-sm space-y-1">
                                <li>• 인테리어용으로는 예쁨</li>
                                <li>• 무겁고 깨지기 쉬움</li>
                                <li>• 환기 부족 → 곰팡이 주의</li>
                                <li>• 가격: 5~15만 원대</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-400 text-sm">
                            💡 <strong>사이즈 팁:</strong> 베이비 때는 <strong>작은 통(소형)</strong>이 오히려
                            먹이 찾기도 쉽고 안정감을 줘요. 너무 큰 사육장은 스트레스가 될 수 있어요!
                        </p>
                    </div>
                </div>

                {/* 본론 2 - 백업과 구조물 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🌿 2. 내부 구조물: &apos;백업&apos;은 필수입니다!
                    </h3>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                        <p className="text-red-400 text-sm">
                            ⚠️ <strong>FTS(플로피 테일 증후군) 경고!</strong><br />
                            크레는 벽에 거꾸로 매달려 자는 습성이 있어요.
                            이 자세가 오래 지속되면 <strong>꼬리와 골반이 휘는 FTS</strong>에 걸릴 수 있습니다.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🪵 백업 (가로 쉼터) - 필수!</h4>
                            <p className="text-zinc-300 text-sm mb-2">
                                크레가 <strong className="text-white">가로로 누워서 쉴 수 있는 구조물</strong>이에요.
                            </p>
                            <ul className="text-zinc-400 text-sm space-y-1">
                                <li>• 스티로폼 봉, 코르크 튜브, PVC 파이프 등</li>
                                <li>• 다이소 조화 가지도 OK!</li>
                                <li>• 높은 곳에 가로로 배치</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🌳 은신처 (조화/수풀)</h4>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 인조 수풀, 다이소 조화로 저렴하게!</li>
                                <li>• 겁 많은 크레가 숨을 곳 필요</li>
                                <li>• 너무 빽빽하면 환기 방해</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">🍽️ 먹이 접시</h4>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 벽에 붙이는 자석형 or 흡착형</li>
                                <li>• 높은 곳에 설치 (크레는 높은 곳 선호)</li>
                                <li>• 물그릇 대신 분무로 수분 공급</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 본론 3 - 바닥재 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🧻 3. 바닥재: 초보자는 키친타월이 최고!
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 font-medium mb-2">✅ 키친타월 (초보 추천!)</p>
                            <ul className="text-zinc-300 text-sm space-y-1">
                                <li>• 위생적, 교체 쉬움</li>
                                <li>• 변 상태 확인 용이</li>
                                <li>• 오염되면 바로 버리기</li>
                                <li>• 비용: 거의 0원</li>
                            </ul>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-white font-medium mb-2">🌱 바이오액티브 (중급자~)</p>
                            <ul className="text-zinc-400 text-sm space-y-1">
                                <li>• 코코넛 섬유 + 청소 생물</li>
                                <li>• 자연스러운 인테리어</li>
                                <li>• 초기 셋팅이 복잡함</li>
                                <li>• 비용: 5~10만 원</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4">
                        <p className="text-amber-400 text-sm">
                            ⚠️ <strong>피해야 할 바닥재:</strong> 모래, 자갈, 나무 칩 →
                            삼킬 수 있어서 <strong>장폐색</strong> 위험!
                        </p>
                    </div>
                </div>

                {/* 본론 4 - 온습도 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        🌡️ 4. 온도 & 습도 관리
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                            <p className="text-zinc-400 text-sm">온도</p>
                            <p className="text-3xl font-bold text-white">22~26°C</p>
                            <p className="text-zinc-500 text-xs mt-1">일반 실내 온도면 OK!</p>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                            <p className="text-zinc-400 text-sm">습도</p>
                            <p className="text-3xl font-bold text-white">60~80%</p>
                            <p className="text-zinc-500 text-xs mt-1">하루 1번 분무</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-green-400 text-sm">
                                ✅ <strong>특별한 장비 불필요!</strong>
                                한국의 일반 실내 환경에서 열등이나 UV등 없이 사육 가능해요.
                            </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                            <p className="text-blue-400 text-sm">
                                💧 <strong>분무기:</strong> 비싼 자동 분무기보다 저렴한 압축 분무기(2~3천원)면 충분!
                            </p>
                        </div>
                    </div>
                </div>

                {/* 필수 준비물 체크리스트 */}
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                        📦 5. 필수 준비물 & 예상 비용
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-zinc-700 rounded-lg overflow-hidden">
                            <thead className="bg-[#D4AF37]/20">
                                <tr>
                                    <th className="text-left py-2 px-3 text-[#D4AF37]">품목</th>
                                    <th className="text-center py-2 px-3 text-[#D4AF37]">필수 여부</th>
                                    <th className="text-right py-2 px-3 text-[#D4AF37]">예상 가격</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-300">
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🏠 사육장 (적재형)</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">1~2만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🪵 백업/구조물</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">0.5~1만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🌿 은신처 (조화)</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">0.3~0.5만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🍽️ 먹이 접시</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">0.3~0.5만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">💧 분무기</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">0.2~0.3만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🥣 MRP 사료</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">1.5~2만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800">
                                    <td className="py-2 px-3">🦴 칼슘제</td>
                                    <td className="text-center py-2 px-3">⭐ 필수</td>
                                    <td className="text-right py-2 px-3">0.5~1만 원</td>
                                </tr>
                                <tr className="border-t border-zinc-800 bg-[#D4AF37]/10">
                                    <td className="py-2 px-3 font-bold">합계</td>
                                    <td className="text-center py-2 px-3"></td>
                                    <td className="text-right py-2 px-3 font-bold text-[#D4AF37]">약 5~8만 원</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 결론 */}
                <div className="text-center py-6">
                    <p className="text-white font-bold text-lg mb-4">
                        처음부터 완벽한 인테리어를 하려 하지 마세요! 🏡
                    </p>
                    <p className="text-zinc-400">
                        개체와 친해지고, 사육에 익숙해지는 게 먼저예요.<br />
                        6개월~1년 후에 예쁜 테라리움으로 업그레이드해도 늦지 않아요!
                    </p>
                </div>

                {/* Tip 박스 */}
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6">
                    <h4 className="text-[#D4AF37] font-bold mb-4">📌 셋팅 체크리스트</h4>
                    <div className="space-y-2 text-zinc-300 text-sm">
                        <p>☑️ <strong>사육장:</strong> 적재형 케이지 (환기 구멍 多)</p>
                        <p>☑️ <strong>백업:</strong> FTS 예방용 가로 구조물 필수!</p>
                        <p>☑️ <strong>바닥재:</strong> 키친타월 추천 (위생적)</p>
                        <p>☑️ <strong>온도:</strong> 22~26°C (실내 온도 OK)</p>
                        <p>☑️ <strong>습도:</strong> 60~80% (하루 1번 분무)</p>
                    </div>
                </div>
            </div>
        )
    }
];

// ============================================
// 컴포넌트
// ============================================

export default function BeginnerGuidePage() {
    const [expandedId, setExpandedId] = useState<string | null>('why-crested-gecko');

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase mb-4">
                        <BookOpen className="w-3 h-3 mr-2" />
                        Beginner Guide
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-4">
                        초보 사육 가이드
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        크레스티드 게코를 처음 키우시는 분들을 위한 완벽한 가이드입니다.<br />
                        사육장 셋팅부터 먹이급여, 온습도 관리까지 모든 것을 알려드립니다.
                    </p>
                </div>

                {/* Guide Articles */}
                <div className="space-y-4">
                    {GUIDE_ARTICLES.map((article) => (
                        <div
                            key={article.id}
                            className={`bg-zinc-900/50 border rounded-xl overflow-hidden transition-all duration-300 ${expandedId === article.id
                                ? 'border-[#D4AF37]/50'
                                : 'border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                                className="w-full p-6 text-left flex items-center gap-4"
                            >
                                <div className={`p-3 rounded-xl ${expandedId === article.id
                                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                    : 'bg-zinc-800 text-zinc-400'
                                    }`}>
                                    {article.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className={`text-lg font-bold mb-1 ${expandedId === article.id ? 'text-[#D4AF37]' : 'text-white'
                                        }`}>
                                        {article.title}
                                    </h2>
                                    <p className="text-zinc-500 text-sm truncate">{article.subtitle}</p>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <span className="text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {article.readTime}
                                    </span>
                                    {expandedId === article.id ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </div>
                            </button>

                            {/* Content */}
                            <AnimatePresence>
                                {expandedId === article.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-2 border-t border-zinc-800">
                                            {article.content}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link href="/guide" className="text-zinc-500 hover:text-white transition inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        전체 가이드 보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
