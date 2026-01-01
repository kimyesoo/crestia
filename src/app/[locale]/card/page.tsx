'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GeckoCardFinal, GeckoDetails } from '@/components/gecko/GeckoCardFinal';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ChevronDown, Loader2, CreditCard, Download, Sparkles, LogIn, Upload, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface FormData {
    name: string;
    morph: string;
    hatchDate: string;
    breeder: string;
    imageUrl: string;
    sireName: string;
    damName: string;
}

const DEFAULT_FORM_DATA: FormData = {
    name: '',
    morph: '',
    hatchDate: '',
    breeder: '',
    imageUrl: '',
    sireName: '',
    damName: '',
};

export default function CardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const supabase = useMemo(() => createClient(), []);

    // Check auth status (but don't redirect if not logged in)
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };

        checkAuth();
    }, [supabase]);

    // Data recovery from localStorage (for login redirect flow)
    useEffect(() => {
        if (!isLoading) {
            const savedData = localStorage.getItem('temp_card_data');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData) as FormData;
                    setFormData(parsedData);
                    setShowPreview(true);
                    localStorage.removeItem('temp_card_data');
                    toast.success('이전에 입력하신 정보가 복구되었습니다!');
                } catch (e) {
                    console.error('Failed to parse saved data:', e);
                    localStorage.removeItem('temp_card_data');
                }
            }
        }
    }, [isLoading]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePreview = () => {
        if (!formData.name.trim()) {
            toast.error('게코 이름을 입력해주세요.');
            return;
        }
        setShowPreview(true);
    };

    const handleDownload = async () => {
        console.log('handleDownload called, user:', user ? 'logged in' : 'not logged in');

        // Check if user is logged in
        if (!user) {
            // Save form data to localStorage before redirecting
            localStorage.setItem('temp_card_data', JSON.stringify(formData));

            // Show toast notification and redirect
            toast.info('로그인 후 다운로드가 가능합니다. 로그인 페이지로 이동합니다!', {
                duration: 2000,
            });

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push('/login?redirect=/card');
            }, 1500);
            return;
        }

        // User is logged in - proceed with download
        console.log('cardRef.current:', cardRef.current);
        if (!cardRef.current) {
            console.error('cardRef.current is null');
            toast.error('카드를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }

        setIsDownloading(true);

        try {
            console.log('Starting toPng...');
            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#000000',
                cacheBust: true,
            });
            console.log('toPng success, dataUrl length:', dataUrl.length);

            const link = document.createElement('a');
            link.download = `${formData.name || 'gecko'}_id_card.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('ID 카드가 다운로드되었습니다!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('다운로드에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsDownloading(false);
        }
    };

    const geckoDetails: GeckoDetails = {
        id: 'preview',
        name: formData.name || 'GECKO NAME',
        morph: formData.morph || 'Unknown Morph',
        hatchDate: formData.hatchDate || 'Unknown',
        breeder: formData.breeder || 'Unknown Breeder',
        imageUrl: formData.imageUrl || '/images/placeholder.png',
        sireName: formData.sireName || 'Unknown',
        damName: formData.damName || 'Unknown',
        pedigree: {
            sire: { id: 'unknown', name: formData.sireName || 'Unknown' },
            dam: { id: 'unknown', name: formData.damName || 'Unknown' },
            grandSires: [{ id: 'unknown', name: 'Unknown' }, { id: 'unknown', name: 'Unknown' }],
            grandDams: [{ id: 'unknown', name: 'Unknown' }, { id: 'unknown', name: 'Unknown' }]
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar user={user} />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                    <p className="text-zinc-400 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">
            <Navbar user={user} />

            <div className="flex flex-col items-center pt-28 pb-20 px-4 overflow-x-hidden">
                {/* SEO Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl text-[#D4AF37] font-bold mb-2 tracking-widest font-serif">
                        ID CARD GENERATOR
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        프리미엄 게코 ID 카드를 무료로 만들어보세요
                    </p>
                    {!user && (
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm">
                            <Sparkles className="w-4 h-4" />
                            회원가입 없이 미리보기 가능!
                        </div>
                    )}
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form - second on mobile, first on desktop */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 order-last lg:order-first">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                            게코 정보 입력
                        </h2>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">
                                    게코 이름 <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="예: Goldie"
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>

                            {/* Morph */}
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">모프</label>
                                <Input
                                    value={formData.morph}
                                    onChange={(e) => handleInputChange('morph', e.target.value)}
                                    placeholder="예: Lilly White het Axanthic"
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>

                            {/* Hatch Date */}
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">해칭일</label>
                                <Input
                                    type="date"
                                    value={formData.hatchDate}
                                    onChange={(e) => handleInputChange('hatchDate', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                                />
                            </div>

                            {/* Breeder */}
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">브리더</label>
                                <Input
                                    value={formData.breeder}
                                    onChange={(e) => handleInputChange('breeder', e.target.value)}
                                    placeholder="예: Crestia Reptiles"
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">게코 사진</label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer
                                        ${formData.imageUrl
                                            ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5'
                                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                                        }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const file = e.dataTransfer.files[0];
                                        if (file && file.type.startsWith('image/')) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                handleInputChange('imageUrl', event.target?.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    onClick={() => {
                                        const input = document.getElementById('image-upload') as HTMLInputElement;
                                        input?.click();
                                    }}
                                >
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    handleInputChange('imageUrl', event.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />

                                    {formData.imageUrl ? (
                                        <div className="relative">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInputChange('imageUrl', '');
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <p className="text-zinc-500 text-xs mt-2">클릭하여 다른 사진 선택</p>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                            <p className="text-zinc-400 text-sm">사진을 여기에 드래그하거나</p>
                                            <p className="text-[#D4AF37] text-sm font-medium mt-1">클릭하여 업로드</p>
                                            <p className="text-zinc-600 text-xs mt-2">JPG, PNG, WebP 지원</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Parents */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Sire (부)</label>
                                    <Input
                                        value={formData.sireName}
                                        onChange={(e) => handleInputChange('sireName', e.target.value)}
                                        placeholder="부 이름"
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-zinc-400 text-sm mb-2 block">Dam (모)</label>
                                    <Input
                                        value={formData.damName}
                                        onChange={(e) => handleInputChange('damName', e.target.value)}
                                        placeholder="모 이름"
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>

                            {/* Preview Button */}
                            <Button
                                onClick={handlePreview}
                                className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                미리보기
                            </Button>
                        </div>
                    </div>

                    {/* Preview Section - shows first on mobile, last on desktop */}
                    <div className="flex flex-col items-center order-first lg:order-last">
                        {showPreview ? (
                            <>
                                <div ref={cardRef}>
                                    <GeckoCardFinal gecko={geckoDetails} />
                                </div>

                                {/* Download Button */}
                                <Button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="mt-6 bg-gradient-to-r from-[#B38728] to-[#FCF6BA] text-black font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            다운로드 중...
                                        </>
                                    ) : user ? (
                                        <>
                                            <Download className="w-5 h-5 mr-2" />
                                            고해상도 다운로드
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5 mr-2" />
                                            로그인하고 다운로드
                                        </>
                                    )}
                                </Button>

                                {!user && (
                                    <p className="text-zinc-500 text-xs mt-2 text-center">
                                        * 로그인하면 고해상도 이미지를 다운로드할 수 있습니다
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-xl p-12 text-center">
                                <CreditCard className="w-16 h-16 text-zinc-700 mb-4" />
                                <p className="text-zinc-500">
                                    폼을 채우고 미리보기를 눌러주세요
                                </p>
                                <p className="text-zinc-600 text-sm mt-2">
                                    프리미엄 ID 카드를 생성할 수 있습니다
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-gray-600 mt-8 text-xs text-center max-w-md">
                    * ID 카드는 프리미엄 디자인으로 생성되며, 분양 시 개체 정보 전달용으로 활용할 수 있습니다.
                </p>
            </div>
        </div>
    );
}
