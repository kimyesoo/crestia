'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, GitFork, AlertCircle, Sparkles, Info, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ========== MOCK DATABASE (확장됨) ==========
const MOCK_DB: Record<string, any> = {
    // ===== 내 개체 (사용자 테스트용) =====
    'my-gecko-01': {
        id: 'my-gecko-01',
        name: 'My First Gecko',
        morph: 'Lilly White',
        image: 'https://images.unsplash.com/photo-1599580669865-c7e63b655f41?w=500&h=500&fit=crop',
        sireId: 'gecko-02',
        damId: 'gecko-03',
        offspring: []
    },
    'my-gecko-02': {
        id: 'my-gecko-02',
        name: 'Lucky',
        morph: 'Phantom',
        image: null,
        sireId: null,
        damId: null,
        offspring: ['my-gecko-03']
    },
    'my-gecko-03': {
        id: 'my-gecko-03',
        name: 'Baby Star',
        morph: 'Lilly White het Phantom',
        image: null,
        sireId: 'my-gecko-02',
        damId: null,
        offspring: []
    },

    // ===== 기존 개체 =====
    'gecko-01': {
        id: 'gecko-01',
        name: 'Seorak The King',
        morph: 'Super Cappuccino',
        image: 'https://images.unsplash.com/photo-1599580669865-c7e63b655f41?w=500&h=500&fit=crop',
        sireId: 'gecko-02',
        damId: 'gecko-03',
        offspring: ['gecko-04', 'gecko-05']
    },
    'gecko-02': {
        id: 'gecko-02',
        name: 'Thunder',
        morph: 'Cappuccino',
        image: null,
        sireId: 'gecko-06',
        damId: 'gecko-07',
        offspring: ['gecko-01', 'my-gecko-01']
    },
    'gecko-03': {
        id: 'gecko-03',
        name: 'Rose',
        morph: 'Lilly White',
        image: null,
        sireId: null,
        damId: null,
        offspring: ['gecko-01', 'my-gecko-01']
    },
    'gecko-04': {
        id: 'gecko-04',
        name: 'Prince',
        morph: 'Cappuccino het Lilly',
        image: null,
        sireId: 'gecko-01',
        damId: 'unknown',
        offspring: []
    },
    'gecko-05': {
        id: 'gecko-05',
        name: 'Princess',
        morph: 'Sable',
        image: null,
        sireId: 'gecko-01',
        damId: 'unknown',
        offspring: []
    },
    'gecko-06': {
        id: 'gecko-06',
        name: 'Storm',
        morph: 'Tricolor',
        image: null,
        sireId: null,
        damId: null,
        offspring: ['gecko-02']
    },
    'gecko-07': {
        id: 'gecko-07',
        name: 'Honey',
        morph: 'Bicolor',
        image: null,
        sireId: null,
        damId: null,
        offspring: ['gecko-02']
    },
    'gecko-08': {
        id: 'gecko-08',
        name: 'Blaze',
        morph: 'Axanthic',
        image: null,
        sireId: null,
        damId: null,
        offspring: []
    },
    'gecko-09': {
        id: 'gecko-09',
        name: 'Luna',
        morph: 'Phantom Lilly',
        image: null,
        sireId: null,
        damId: null,
        offspring: []
    },
};

export default function LineagePage() {
    const searchParams = useSearchParams();
    const geckoIdFromUrl = searchParams.get('gecko');

    const [searchTerm, setSearchTerm] = useState('');
    const [currentId, setCurrentId] = useState<string>('gecko-01');
    const [errorMsg, setErrorMsg] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [dbGecko, setDbGecko] = useState<any>(null); // DB에서 가져온 개체
    const [isLoadingDb, setIsLoadingDb] = useState(false);

    // URL 파라미터로 개체 ID가 전달되면 DB에서 검색
    useEffect(() => {
        if (geckoIdFromUrl) {
            fetchGeckoFromDb(geckoIdFromUrl);
        }
    }, [geckoIdFromUrl]);

    // Supabase DB에서 개체 정보 가져오기
    const fetchGeckoFromDb = async (id: string) => {
        setIsLoadingDb(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('geckos')
                .select(`
                    *,
                    profiles (shop_name),
                    sire:sire_id (id, name, morph, image_url),
                    dam:dam_id (id, name, morph, image_url)
                `)
                .eq('id', id)
                .single();

            if (data && !error) {
                setDbGecko(data);
            }
        } catch (err) {
            console.error('DB fetch error:', err);
        } finally {
            setIsLoadingDb(false);
        }
    };

    // Mock DB 또는 실제 DB 개체 사용
    const currentGecko = dbGecko || MOCK_DB[currentId];

    // ========== 강화된 검색 알고리즘 ==========
    // 대소문자 무시 + 부분 일치 + 이름/모프/ID 모두 검색
    const searchResults = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return [];

        return Object.values(MOCK_DB).filter((gecko: any) => {
            const nameMatch = gecko.name.toLowerCase().includes(term);
            const morphMatch = gecko.morph.toLowerCase().includes(term);
            const idMatch = gecko.id.toLowerCase().includes(term);
            return nameMatch || morphMatch || idMatch;
        });
    }, [searchTerm]);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            setErrorMsg('검색어를 입력해주세요.');
            setShowSearchResults(false);
            return;
        }

        if (searchResults.length === 0) {
            setErrorMsg(`'${searchTerm}'에 해당하는 개체를 찾을 수 없습니다. 다른 검색어를 시도해보세요.`);
            setShowSearchResults(false);
        } else if (searchResults.length === 1) {
            // 결과가 1개면 바로 이동
            setCurrentId(searchResults[0].id);
            setErrorMsg('');
            setShowSearchResults(false);
            setSearchTerm('');
        } else {
            // 여러 결과가 있으면 목록 표시
            setShowSearchResults(true);
            setErrorMsg('');
        }
    };

    const handleSelectResult = (id: string) => {
        setCurrentId(id);
        setErrorMsg('');
        setShowSearchResults(false);
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
        if (e.key === 'Escape') setShowSearchResults(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setErrorMsg('');
        if (e.target.value.length > 0) {
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    };

    // ========== 카드 컴포넌트 ==========
    const GeckoCard = ({ id, role, geckoData }: { id?: string | null; role: string; geckoData?: any }) => {
        // geckoData가 직접 전달되면 사용, 아니면 MOCK_DB에서 조회
        const data = geckoData || (id ? MOCK_DB[id] : null);

        if (!data) {
            return (
                <div className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-800 rounded-xl h-32 w-28 sm:h-40 sm:w-40 opacity-50">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">{role}</p>
                    <span className="text-gray-600 text-xs">Unregistered</span>
                </div>
            );
        }

        const isMyGecko = data.id?.startsWith('my-');
        const isDbGecko = !MOCK_DB[data.id]; // DB에서 온 개체인지 확인
        const imageUrl = data.image || data.image_url; // Mock vs DB 필드 호환

        return (
            <div
                onClick={() => {
                    if (isDbGecko) {
                        fetchGeckoFromDb(data.id);
                    } else {
                        setCurrentId(data.id);
                    }
                    setDbGecko(null);
                    setErrorMsg('');
                }}
                className={`relative flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer w-28 sm:w-40 bg-[#1a1a1a]
          ${(currentId === data.id || dbGecko?.id === data.id)
                        ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] scale-105 z-10'
                        : 'border-gray-800 hover:border-yellow-500/50 hover:scale-105'
                    }`}
            >
                {/* 내 개체 뱃지 */}
                {isMyGecko && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                        MY
                    </div>
                )}

                {/* DB 개체 뱃지 */}
                {isDbGecko && !isMyGecko && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                        DB
                    </div>
                )}

                <p className="text-[10px] text-yellow-500 uppercase tracking-wider mb-2 font-bold">{role}</p>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-900 mb-2 border border-gray-700">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt={data.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">No Img</div>
                    )}
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-white text-center truncate w-full">{data.name}</h3>
                <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full mt-1 truncate max-w-full">
                    {data.morph}
                </span>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24 w-full min-h-screen text-white">

            {/* 헤더 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <GitFork className="text-yellow-500" /> Lineage Registry
                    </h1>
                    <p className="text-gray-400 text-sm">
                        등록된 개체의 부모, 조부모 정보를 연결하여 보여주는 공공 데이터베이스입니다.
                    </p>
                </div>

                {/* 검색창 영역 */}
                <div className="w-full md:w-96 relative">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="이름, 모프, ID로 검색..."
                                className="w-full bg-[#111] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 text-sm"
                                value={searchTerm}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => searchTerm && setShowSearchResults(true)}
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-yellow-500 text-black font-bold px-4 py-3 rounded-lg hover:bg-yellow-400 text-sm whitespace-nowrap"
                        >
                            검색
                        </button>
                    </div>

                    {/* 실시간 검색 결과 드롭다운 */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-14 left-0 right-0 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                            <div className="p-2 border-b border-gray-800 text-xs text-gray-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {searchResults.length}개의 결과를 찾았습니다
                            </div>
                            {searchResults.map((gecko: any) => (
                                <button
                                    key={gecko.id}
                                    onClick={() => handleSelectResult(gecko.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition text-left border-b border-gray-800 last:border-b-0"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-900 flex-shrink-0">
                                        {gecko.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={gecko.image} alt={gecko.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-[8px]">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {gecko.name}
                                            {gecko.id.startsWith('my-') && (
                                                <span className="ml-2 text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">MY</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{gecko.morph} · {gecko.id}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 에러 메시지 */}
                    {errorMsg && (
                        <div className="absolute top-14 left-0 right-0 text-red-400 text-xs flex items-center gap-1 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errorMsg}
                        </div>
                    )}

                    {/* 검색 힌트 */}
                    <div className="mt-2 text-xs text-gray-500 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-yellow-600" />
                        <span>
                            <span className="text-yellow-600">Tip:</span>{' '}
                            <span
                                className="text-gray-300 cursor-pointer hover:text-white underline decoration-dashed"
                                onClick={() => { setSearchTerm('Lilly'); setShowSearchResults(true); }}
                            >
                                &quot;Lilly&quot;
                            </span>, {' '}
                            <span
                                className="text-gray-300 cursor-pointer hover:text-white underline decoration-dashed"
                                onClick={() => { setSearchTerm('Seorak'); setShowSearchResults(true); }}
                            >
                                &quot;Seorak&quot;
                            </span>, {' '}
                            <span
                                className="text-gray-300 cursor-pointer hover:text-white underline decoration-dashed"
                                onClick={() => { setSearchTerm('My'); setShowSearchResults(true); }}
                            >
                                &quot;My&quot;
                            </span>, {' '}
                            <span
                                className="text-gray-300 cursor-pointer hover:text-white underline decoration-dashed"
                                onClick={() => { setSearchTerm('Cappuccino'); setShowSearchResults(true); }}
                            >
                                &quot;Cappuccino&quot;
                            </span>
                            {' '}등으로 검색해보세요.
                        </span>
                    </div>
                </div>
            </div>

            {/* 트리 뷰어 컨테이너 */}
            <div className="relative flex flex-col items-center py-16 bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden min-h-[600px]">

                {/* 배경 장식 (Grid Pattern) */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* 현재 선택된 개체 정보 */}
                {currentGecko && (
                    <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs border border-gray-800 z-20">
                        <span className="text-gray-400">현재 보기:</span>{' '}
                        <span className="text-white font-medium">{currentGecko.name}</span>
                        {currentGecko.id?.startsWith('my-') && (
                            <span className="ml-1 bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded text-[10px]">MY</span>
                        )}
                        {dbGecko && (
                            <span className="ml-1 bg-green-500/20 text-green-400 px-1 py-0.5 rounded text-[10px]">DB</span>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isLoadingDb && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                        <div className="text-yellow-500 animate-pulse">Loading...</div>
                    </div>
                )}

                {/* 1. 조부모 (Grand Parents) - DB 개체일 때는 비표시 */}
                {!dbGecko && (
                    <div className="flex gap-8 sm:gap-24 relative z-10 mb-8">
                        {/* 연결선 (Horizontal) */}
                        <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-gray-800 -z-10"></div>

                        <div className="flex gap-2 sm:gap-4">
                            <GeckoCard id={currentGecko?.sireId ? MOCK_DB[currentGecko.sireId]?.sireId : null} role="Grand Sire" />
                            <GeckoCard id={currentGecko?.sireId ? MOCK_DB[currentGecko.sireId]?.damId : null} role="Grand Dam" />
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                            <GeckoCard id={currentGecko?.damId ? MOCK_DB[currentGecko.damId]?.sireId : null} role="Grand Sire" />
                            <GeckoCard id={currentGecko?.damId ? MOCK_DB[currentGecko.damId]?.damId : null} role="Grand Dam" />
                        </div>
                    </div>
                )}

                {/* 연결선 (Vertical to Parents) */}
                <div className="h-8 w-px bg-gray-700 mb-2"></div>

                {/* 2. 부모 (Parents) */}
                <div className="flex gap-16 sm:gap-32 relative z-10 mb-8">
                    <div className="absolute top-1/2 left-[25%] right-[25%] h-px bg-gray-700 -z-10"></div>
                    {dbGecko ? (
                        <>
                            <GeckoCard geckoData={dbGecko.sire} role="Sire (부)" />
                            <GeckoCard geckoData={dbGecko.dam} role="Dam (모)" />
                        </>
                    ) : (
                        <>
                            <GeckoCard id={currentGecko?.sireId} role="Sire (부)" />
                            <GeckoCard id={currentGecko?.damId} role="Dam (모)" />
                        </>
                    )}
                </div>

                {/* 연결선 (Vertical to Target) */}
                <div className="h-10 w-0.5 bg-gradient-to-b from-gray-700 to-yellow-500 mb-2"></div>

                {/* 3. 본인 (Target) */}
                <div className="relative z-20 mb-8">
                    <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-2xl"></div>
                    {dbGecko ? (
                        <GeckoCard geckoData={dbGecko} role="Target (본인)" />
                    ) : (
                        <GeckoCard id={currentId} role="Target (본인)" />
                    )}
                </div>

                {/* 4. 자손 (Offspring) */}
                {currentGecko?.offspring && currentGecko.offspring.length > 0 ? (
                    <>
                        <div className="h-10 w-0.5 bg-gradient-to-b from-yellow-500 to-gray-700"></div>
                        <div className="w-full border-t border-gray-800 relative mt-4 pt-8">
                            <p className="text-center text-xs text-gray-500 mb-4">자손 ({currentGecko.offspring.length}마리)</p>
                            <div className="flex flex-wrap justify-center gap-4 px-4">
                                {currentGecko.offspring.map((childId: string) => (
                                    <GeckoCard key={childId} id={childId} role="Offspring" />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-4 text-xs text-gray-600">자손 정보 없음</div>
                )}

            </div>

            {/* 등록된 개체 목록 (Quick Access) */}
            <div className="mt-8 p-6 bg-[#0a0a0a] rounded-2xl border border-gray-800">
                <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    등록된 개체 ({Object.keys(MOCK_DB).length}마리)
                </h3>
                <div className="flex flex-wrap gap-2">
                    {Object.values(MOCK_DB).map((gecko: any) => (
                        <button
                            key={gecko.id}
                            onClick={() => { setCurrentId(gecko.id); setDbGecko(null); setErrorMsg(''); }}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all
                                ${gecko.id === currentId && !dbGecko
                                    ? 'bg-yellow-500 text-black font-bold'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }
                                ${gecko.id.startsWith('my-') ? 'ring-1 ring-purple-500/50' : ''}
                            `}
                        >
                            {gecko.name}
                            {gecko.id.startsWith('my-') && <span className="ml-1 text-purple-400">★</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
