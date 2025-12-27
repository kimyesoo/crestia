'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, RefreshCw, Copy, Check, Egg } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// ===== 데이터 타입 정의 =====
interface NameEntry {
    name: string;
    nameKr: string;
    desc: string;
}

type Mood = 'cute' | 'cool' | 'mystical' | 'luxury';
type Gender = 'male' | 'female' | 'unknown';
type Morph = 'lilyWhite' | 'axanthic' | 'cappuccino' | 'red' | 'yellow' | 'dark';

// ===== 풍부한 이름 데이터베이스 =====
const NAME_DB: Record<Mood, NameEntry[]> = {
    cute: [
        { name: "Mochi", nameKr: "모찌", desc: "말랑말랑하고 귀여운 찹쌀떡 같은 매력을 가진 아이" },
        { name: "Podo", nameKr: "포도", desc: "동글동글하고 달콤한 포도알처럼 사랑스러운 아이" },
        { name: "Bori", nameKr: "보리", desc: "황금빛 보리밭처럼 따뜻하고 포근한 느낌" },
        { name: "Toto", nameKr: "토토", desc: "뒹굴뒹굴 굴러다니는 작고 동그란 귀요미" },
        { name: "Nabi", nameKr: "나비", desc: "나비처럼 예쁘고 가볍게 날아다니는 요정 같은 아이" },
        { name: "Dubu", nameKr: "두부", desc: "하얗고 말랑한 두부처럼 부드러운 성격의 아이" },
        { name: "Bongbong", nameKr: "봉봉", desc: "달콤한 사탕처럼 보기만 해도 기분이 좋아지는 아이" },
        { name: "Kongkong", nameKr: "콩콩", desc: "작은 콩알처럼 깡충깡충 뛰어다니는 모습이 귀여운 아이" },
        { name: "Mango", nameKr: "망고", desc: "열대과일처럼 달콤하고 상큼한 매력의 소유자" },
        { name: "Coco", nameKr: "코코", desc: "코코넛처럼 동글동글하고 사랑스러운 아이" },
        { name: "Pudding", nameKr: "푸딩", desc: "푸들푸들 부드럽고 달콤한 디저트 같은 존재" },
        { name: "Mongsil", nameKr: "몽실", desc: "몽글몽글 구름처럼 포근하고 복슬복슬한 아이" },
    ],
    cool: [
        { name: "Rex", nameKr: "렉스", desc: "왕을 뜻하는 라틴어, 최상위 포식자의 기운을 가진 아이" },
        { name: "Storm", nameKr: "스톰", desc: "폭풍처럼 강렬한 인상을 주는 카리스마의 소유자" },
        { name: "Blade", nameKr: "블레이드", desc: "날카롭고 예리한 눈빛을 가진 멋진 전사" },
        { name: "Shadow", nameKr: "섀도우", desc: "그림자처럼 조용하지만 강렬한 존재감" },
        { name: "Thunder", nameKr: "썬더", desc: "천둥같은 힘과 위엄을 가진 아이" },
        { name: "Viper", nameKr: "바이퍼", desc: "빠르고 정확한 독사 같은 날렵함의 소유자" },
        { name: "Titan", nameKr: "타이탄", desc: "거대한 신화 속 거인처럼 압도적인 존재" },
        { name: "Hunter", nameKr: "헌터", desc: "본능적인 사냥꾼의 날카로운 감각을 가진 아이" },
        { name: "Phoenix", nameKr: "피닉스", desc: "재에서 부활하는 불사조의 강인함" },
        { name: "Draco", nameKr: "드라코", desc: "전설 속 용처럼 강력하고 신비로운 존재" },
        { name: "Chaos", nameKr: "카오스", desc: "혼돈 속에서도 빛나는 독보적인 아이" },
        { name: "Nero", nameKr: "네로", desc: "검은 밤을 지배하는 어둠의 제왕" },
    ],
    mystical: [
        { name: "Luna", nameKr: "루나", desc: "달빛을 머금은 신비로운 밤의 요정" },
        { name: "Aurora", nameKr: "오로라", desc: "북극의 오로라처럼 환상적인 빛을 가진 아이" },
        { name: "Stella", nameKr: "스텔라", desc: "밤하늘의 별처럼 빛나라는 소망을 담아" },
        { name: "Mystic", nameKr: "미스틱", desc: "알 수 없는 신비로운 매력으로 가득한 존재" },
        { name: "Cosmos", nameKr: "코스모스", desc: "우주처럼 광대하고 무한한 가능성" },
        { name: "Eclipse", nameKr: "이클립스", desc: "일식처럼 모든 시선을 사로잡는 신비로운 아이" },
        { name: "Nebula", nameKr: "네뷸라", desc: "성운처럼 몽환적이고 아름다운 존재" },
        { name: "Astral", nameKr: "아스트랄", desc: "별들 사이를 유영하는 영적인 존재" },
        { name: "Zephyr", nameKr: "제피르", desc: "서풍의 신처럼 부드럽고 신비로운 아이" },
        { name: "Celeste", nameKr: "셀레스트", desc: "천상의 존재처럼 고귀하고 신비로운 아이" },
        { name: "Enigma", nameKr: "에니그마", desc: "풀리지 않는 수수께끼 같은 매력" },
        { name: "Phantom", nameKr: "팬텀", desc: "환영처럼 신비롭고 포착하기 어려운 존재" },
    ],
    luxury: [
        { name: "Louis", nameKr: "루이", desc: "프랑스 왕족의 기품이 느껴지는 고귀한 이름" },
        { name: "Gucci", nameKr: "구찌", desc: "독보적인 패턴과 가치를 지닌 명품 같은 아이" },
        { name: "Chanel", nameKr: "샤넬", desc: "시대를 초월하는 우아함과 세련됨" },
        { name: "Cartier", nameKr: "까르띠에", desc: "다이아몬드처럼 영롱하게 빛나는 존재" },
        { name: "Bentley", nameKr: "벤틀리", desc: "최고급 럭셔리를 상징하는 품격 있는 아이" },
        { name: "Versace", nameKr: "베르사체", desc: "화려하고 대담한 아름다움의 소유자" },
        { name: "Rolex", nameKr: "롤렉스", desc: "시간이 지나도 변치 않는 가치를 지닌 존재" },
        { name: "Hermès", nameKr: "에르메스", desc: "장인정신이 깃든 최상의 품격" },
        { name: "Tiffany", nameKr: "티파니", desc: "티파니 블루처럼 특별하고 아름다운 아이" },
        { name: "Monaco", nameKr: "모나코", desc: "지중해의 보석 같은 품격과 우아함" },
        { name: "Caviar", nameKr: "캐비어", desc: "희소하고 귀중한 존재, 최상의 가치" },
        { name: "Dior", nameKr: "디올", desc: "세련된 파리지앵의 우아함을 담은 이름" },
    ],
};

// 모프별 추가 이름 (색상/패턴 기반)
const MORPH_NAMES: Record<Morph, NameEntry[]> = {
    lilyWhite: [
        { name: "Snow", nameKr: "스노우", desc: "눈처럼 순백의 아름다움을 가진 아이" },
        { name: "Pearl", nameKr: "펄", desc: "진주처럼 은은하게 빛나는 우아한 존재" },
        { name: "Ivory", nameKr: "아이보리", desc: "상아처럼 고급스러운 흰빛의 소유자" },
        { name: "Cloud", nameKr: "클라우드", desc: "구름처럼 부드럽고 포근한 하얀 아이" },
    ],
    axanthic: [
        { name: "Silver", nameKr: "실버", desc: "은빛으로 빛나는 고귀한 아이" },
        { name: "Slate", nameKr: "슬레이트", desc: "청회색 돌처럼 단단하고 멋진 존재" },
        { name: "Steel", nameKr: "스틸", desc: "강철처럼 강하고 빛나는 아이" },
        { name: "Ash", nameKr: "애쉬", desc: "잿빛의 신비로운 매력을 가진 존재" },
    ],
    cappuccino: [
        { name: "Latte", nameKr: "라떼", desc: "부드러운 라떼처럼 따뜻한 색감의 아이" },
        { name: "Mocha", nameKr: "모카", desc: "진한 모카처럼 깊은 매력의 소유자" },
        { name: "Cinnamon", nameKr: "시나몬", desc: "계피처럼 달콤하고 따뜻한 색의 아이" },
        { name: "Caramel", nameKr: "카라멜", desc: "캐러멜처럼 달콤하고 부드러운 존재" },
    ],
    red: [
        { name: "Ruby", nameKr: "루비", desc: "붉은 보석처럼 강렬하게 빛나는 아이" },
        { name: "Blaze", nameKr: "블레이즈", desc: "불꽃처럼 뜨겁고 열정적인 존재" },
        { name: "Scarlet", nameKr: "스칼렛", desc: "강렬한 스칼렛빛의 매혹적인 아이" },
        { name: "Ember", nameKr: "엠버", desc: "타오르는 잔불처럼 따뜻하고 강렬한 아이" },
    ],
    yellow: [
        { name: "Sunny", nameKr: "써니", desc: "햇살처럼 밝고 따뜻한 에너지의 아이" },
        { name: "Honey", nameKr: "허니", desc: "꿀처럼 달콤하고 황금빛인 존재" },
        { name: "Amber", nameKr: "앰버", desc: "호박처럼 따뜻한 빛을 가진 아이" },
        { name: "Goldie", nameKr: "골디", desc: "황금처럼 빛나는 소중한 존재" },
    ],
    dark: [
        { name: "Onyx", nameKr: "오닉스", desc: "검은 보석처럼 깊고 신비로운 아이" },
        { name: "Midnight", nameKr: "미드나잇", desc: "한밤중처럼 깊고 매혹적인 존재" },
        { name: "Obsidian", nameKr: "옵시디언", desc: "흑요석처럼 날카롭고 아름다운 아이" },
        { name: "Noir", nameKr: "느와르", desc: "프랑스어로 검정, 고급스러운 어둠" },
    ],
};

// 성별별 추가 이름
const GENDER_NAMES: Record<Gender, NameEntry[]> = {
    male: [
        { name: "Duke", nameKr: "듀크", desc: "공작처럼 품위 있는 남성적인 멋" },
        { name: "Baron", nameKr: "바론", desc: "남작의 위엄과 품격을 가진 아이" },
        { name: "Prince", nameKr: "프린스", desc: "왕자처럼 고귀하고 멋진 존재" },
        { name: "Knight", nameKr: "나이트", desc: "기사처럼 용감하고 충직한 아이" },
    ],
    female: [
        { name: "Duchess", nameKr: "더치스", desc: "공작부인처럼 우아한 여성미" },
        { name: "Princess", nameKr: "프린세스", desc: "공주처럼 사랑받는 소중한 존재" },
        { name: "Queen", nameKr: "퀸", desc: "여왕처럼 당당하고 아름다운 아이" },
        { name: "Lady", nameKr: "레이디", desc: "귀부인처럼 품위 있는 아이" },
    ],
    unknown: [
        { name: "Angel", nameKr: "엔젤", desc: "천사처럼 순수하고 아름다운 존재" },
        { name: "Bliss", nameKr: "블리스", desc: "행복 그 자체인 축복받은 아이" },
        { name: "Lucky", nameKr: "럭키", desc: "행운을 가져다주는 복덩이" },
        { name: "Miracle", nameKr: "미라클", desc: "기적처럼 찾아온 소중한 존재" },
    ],
};

// ===== 컴포넌트 =====
export default function NamingPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [gender, setGender] = useState<Gender | null>(null);
    const [morph, setMorph] = useState<Morph | null>(null);
    const [mood, setMood] = useState<Mood | null>(null);
    const [results, setResults] = useState<NameEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // 이름 생성 로직
    const generateNames = () => {
        if (!mood) return;

        setIsLoading(true);

        // 로딩 애니메이션을 위한 딜레이
        setTimeout(() => {
            const allNames: NameEntry[] = [];

            // 분위기 기반 이름 추가
            allNames.push(...NAME_DB[mood]);

            // 모프 기반 이름 추가
            if (morph) {
                allNames.push(...MORPH_NAMES[morph]);
            }

            // 성별 기반 이름 추가
            if (gender) {
                allNames.push(...GENDER_NAMES[gender]);
            }

            // 랜덤하게 3개 선택 (중복 제거)
            const shuffled = allNames.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 3);

            setResults(selected);
            setIsLoading(false);
            setStep(2);
        }, 2000);
    };

    const handleReset = () => {
        setStep(1);
        setGender(null);
        setMorph(null);
        setMood(null);
        setResults([]);
    };

    const handleCopy = async (name: string, index: number) => {
        await navigator.clipboard.writeText(name);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // 옵션 데이터
    const genderOptions = [
        { value: 'male' as Gender, icon: '♂', label: '수컷' },
        { value: 'female' as Gender, icon: '♀', label: '암컷' },
        { value: 'unknown' as Gender, icon: '?', label: '미구분' },
    ];

    const morphOptions = [
        { value: 'lilyWhite' as Morph, label: '릴리 화이트', color: 'bg-gradient-to-r from-white to-gray-100' },
        { value: 'axanthic' as Morph, label: '아잔틱', color: 'bg-gradient-to-r from-gray-400 to-gray-500' },
        { value: 'cappuccino' as Morph, label: '카푸치노', color: 'bg-gradient-to-r from-amber-700 to-amber-600' },
        { value: 'red' as Morph, label: '레드', color: 'bg-gradient-to-r from-red-500 to-red-600' },
        { value: 'yellow' as Morph, label: '옐로우', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500' },
        { value: 'dark' as Morph, label: '다크', color: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    ];

    const moodOptions = [
        { value: 'cute' as Mood, emoji: '🥰', label: '귀여운' },
        { value: 'cool' as Mood, emoji: '😎', label: '멋진' },
        { value: 'mystical' as Mood, emoji: '✨', label: '신비로운' },
        { value: 'luxury' as Mood, emoji: '👑', label: '럭셔리' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 overflow-hidden">
            {/* 배경 효과 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative border-b border-purple-500/20 bg-black/30 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/tools" className="text-zinc-400 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            2세 작명소
                        </h1>
                        <p className="text-sm text-purple-300/70">Gecko Naming Center</p>
                    </div>
                </div>
            </div>

            {/* SEO Content Section */}
            <div className="relative max-w-4xl mx-auto px-4 pt-6">
                <div className="bg-gradient-to-r from-purple-500/10 to-transparent border-l-4 border-purple-400 pl-4 py-3 mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        파충류/도마뱀 이름 짓기 (AI 작명소)
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        소중한 반려 도마뱀에게 어울리는 특별한 이름을 지어주세요.
                        크레스티드 게코, 레오파드 게코 등 다양한 파충류에 어울리는
                        영어, 한글, 일본어 스타일의 유니크한 이름을 추천해 드립니다.
                        모프 색상과 성격에 맞는 센스 있는 이름을 짓기 위한 최고의 선택!
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {/* Step 1: 입력 */}
                    {step === 1 && !isLoading && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* 안내 텍스트 */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    당신의 <span className="text-amber-400">게코</span>에게 어울리는 이름은?
                                </h2>
                                <p className="text-zinc-400">
                                    개체의 특징을 선택하면 센스 있는 이름을 추천해 드려요
                                </p>
                            </div>

                            {/* 성별 선택 */}
                            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-sm text-purple-300">1</span>
                                    성별
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {genderOptions.map((option) => (
                                        <motion.button
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setGender(option.value)}
                                            className={`
                                                py-4 px-4 rounded-xl border-2 transition-all duration-200
                                                flex flex-col items-center gap-2
                                                ${gender === option.value
                                                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                                                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-purple-500/50'
                                                }
                                            `}
                                        >
                                            <span className="text-2xl">{option.icon}</span>
                                            <span className="font-medium">{option.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* 모프 선택 */}
                            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-sm text-purple-300">2</span>
                                    대표 모프 (색상)
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {morphOptions.map((option) => (
                                        <motion.button
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setMorph(option.value)}
                                            className={`
                                                py-3 px-4 rounded-xl border-2 transition-all duration-200
                                                flex items-center gap-3
                                                ${morph === option.value
                                                    ? 'border-amber-400 bg-amber-400/10'
                                                    : 'border-zinc-700 bg-zinc-800/50 hover:border-purple-500/50'
                                                }
                                            `}
                                        >
                                            <div className={`w-6 h-6 rounded-full ${option.color} ring-2 ring-white/20`} />
                                            <span className={`font-medium ${morph === option.value ? 'text-amber-400' : 'text-zinc-300'}`}>
                                                {option.label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* 분위기 선택 */}
                            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-sm text-purple-300">3</span>
                                    원하는 분위기
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {moodOptions.map((option) => (
                                        <motion.button
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setMood(option.value)}
                                            className={`
                                                py-4 px-4 rounded-xl border-2 transition-all duration-200
                                                flex flex-col items-center gap-2
                                                ${mood === option.value
                                                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                                                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-purple-500/50'
                                                }
                                            `}
                                        >
                                            <span className="text-2xl">{option.emoji}</span>
                                            <span className="font-medium">{option.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* 이름 짓기 버튼 */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button
                                    onClick={generateNames}
                                    disabled={!mood}
                                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    이름 짓기
                                </Button>
                                {!mood && (
                                    <p className="text-center text-zinc-500 text-sm mt-2">
                                        * 분위기를 선택해주세요
                                    </p>
                                )}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* 로딩 애니메이션 */}
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                }}
                                className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30"
                            >
                                <Egg className="w-12 h-12 text-white" />
                            </motion.div>
                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-xl text-purple-300 font-medium"
                            >
                                이름을 짓는 중...
                            </motion.p>
                            <p className="text-zinc-500 text-sm mt-2">마법의 알에서 이름이 부화하고 있어요</p>
                        </motion.div>
                    )}

                    {/* Step 2: 결과 */}
                    {step === 2 && !isLoading && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* 결과 헤더 */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4 shadow-lg shadow-amber-500/30"
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    추천 이름이 도착했어요!
                                </h2>
                                <p className="text-zinc-400">
                                    마음에 드는 이름을 클릭해서 복사하세요
                                </p>
                            </div>

                            {/* 결과 카드들 */}
                            <div className="space-y-4">
                                {results.map((result, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.15 }}
                                        className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-amber-400/50 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm text-purple-400 font-mono">#{index + 1}</span>
                                                    <h3 className="text-2xl font-bold text-amber-400">
                                                        {result.name}
                                                    </h3>
                                                    <span className="text-lg text-zinc-400">
                                                        {result.nameKr}
                                                    </span>
                                                </div>
                                                <p className="text-zinc-400 leading-relaxed">
                                                    &ldquo;{result.desc}&rdquo;
                                                </p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleCopy(result.name, index)}
                                                className="p-3 rounded-xl bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                {copiedIndex === index ? (
                                                    <Check className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* 다시하기 버튼 */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex gap-4 pt-4"
                            >
                                <Button
                                    onClick={generateNames}
                                    variant="outline"
                                    className="flex-1 py-5 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 rounded-xl"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    다른 이름 보기
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    className="flex-1 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-xl"
                                >
                                    처음부터 다시
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
