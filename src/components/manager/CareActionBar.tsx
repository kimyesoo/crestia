'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Utensils } from 'lucide-react';
import { WeightInputModal } from './WeightInputModal';
import { FeedingQuickMenu } from './FeedingQuickMenu';

interface CareActionBarProps {
    geckoId: string;
    geckoName: string;
    onDataAdded: () => void;
}

export function CareActionBar({ geckoId, geckoName, onDataAdded }: CareActionBarProps) {
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showFeedingMenu, setShowFeedingMenu] = useState(false);

    const handleWeightAdded = () => {
        setShowWeightModal(false);
        onDataAdded();
    };

    const handleFeedingAdded = () => {
        setShowFeedingMenu(false);
        onDataAdded();
    };

    return (
        <>
            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-safe">
                <div className="max-w-lg mx-auto flex gap-3">
                    {/* 체중 버튼 */}
                    <Button
                        onClick={() => setShowWeightModal(true)}
                        className="flex-1 h-14 bg-gradient-to-r from-[#D4AF37] to-[#b08d22] text-black font-bold text-base hover:from-[#b08d22] hover:to-[#8a6e1a] shadow-lg shadow-[#D4AF37]/20"
                    >
                        <Scale className="w-5 h-5 mr-2" />
                        ⚖️ 체중 잴 시간
                    </Button>

                    {/* 급식 버튼 */}
                    <Button
                        onClick={() => setShowFeedingMenu(true)}
                        className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-base hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/20"
                    >
                        <Utensils className="w-5 h-5 mr-2" />
                        🦗 밥 줄 시간
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <WeightInputModal
                isOpen={showWeightModal}
                onClose={() => setShowWeightModal(false)}
                onSuccess={handleWeightAdded}
                geckoId={geckoId}
                geckoName={geckoName}
            />

            <FeedingQuickMenu
                isOpen={showFeedingMenu}
                onClose={() => setShowFeedingMenu(false)}
                onSuccess={handleFeedingAdded}
                geckoId={geckoId}
                geckoName={geckoName}
            />
        </>
    );
}
