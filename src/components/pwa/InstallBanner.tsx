'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed as PWA
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
        setIsStandalone(isStandaloneMode);

        if (isStandaloneMode) return;

        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
        setIsIOS(isIOSDevice);

        // For Android/Chrome - listen for beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS - show after a delay if not installed
        if (isIOSDevice) {
            const hasSeenIOSPrompt = localStorage.getItem('crestia-ios-prompt-seen');
            if (!hasSeenIOSPrompt) {
                setTimeout(() => {
                    setShowIOSGuide(true);
                }, 3000);
            }
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallBanner(false);
        }
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
        setShowIOSGuide(false);
        if (isIOS) {
            localStorage.setItem('crestia-ios-prompt-seen', 'true');
        }
    };

    // Don't render if already in standalone mode
    if (isStandalone) return null;

    // Android/Chrome install banner
    if (showInstallBanner && deferredPrompt) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-t border-gold-400/30 shadow-lg animate-in slide-in-from-bottom duration-300">
                <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center">
                            <Download className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">앱으로 설치하기</p>
                            <p className="text-sm text-zinc-400">홈 화면에서 바로 접속하세요</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-gradient-to-r from-gold-400 to-amber-500 text-black font-semibold rounded-lg hover:from-gold-500 hover:to-amber-600 transition-all"
                        >
                            설치
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="p-2 text-zinc-400 hover:text-white transition-colors"
                            aria-label="닫기"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // iOS install guide
    if (showIOSGuide && isIOS) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-t border-gold-400/30 shadow-lg animate-in slide-in-from-bottom duration-300">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                                <Share className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">홈 화면에 추가하기</p>
                                <p className="text-sm text-zinc-400 mt-1">
                                    하단의 <Share className="inline w-4 h-4 mx-1" /> 버튼을 누른 후,<br />
                                    <span className="text-gold-400 font-medium">&quot;홈 화면에 추가&quot;</span>를 선택하세요
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-2 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                            aria-label="닫기"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
