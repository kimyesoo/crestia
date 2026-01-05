'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { FeedingType } from '@/lib/care-data';

interface FeedingQuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    geckoId: string;
    geckoName: string;
}

const FEEDING_OPTIONS: { type: FeedingType; label: string; emoji: string; description: string }[] = [
    {
        type: 'insect',
        label: '충식',
        emoji: '🦗',
        description: '귀뚜라미, 밀웜, 두비아 등'
    },
    {
        type: 'cgd',
        label: 'CGD (슈퍼푸드)',
        emoji: '🥣',
        description: '크레스티드 게코 다이어트'
    }
];

export function FeedingQuickMenu({
    isOpen,
    onClose,
    onSuccess,
    geckoId,
    geckoName
}: FeedingQuickMenuProps) {
    const [selectedType, setSelectedType] = useState<FeedingType | null>(null);
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleQuickSave = async (type: FeedingType) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('feeding_logs')
                .insert({
                    gecko_id: geckoId,
                    feeding_type: type,
                    fed_at: new Date().toISOString()
                });

            if (error) throw error;

            const emoji = type === 'insect' ? '🦗' : '🥣';
            const label = type === 'insect' ? '충식' : 'CGD';
            toast.success(`${geckoName}에게 ${label} 급식 완료! ${emoji}`);
            resetForm();
            onSuccess();
        } catch (error) {
            console.error('Error saving feeding:', error);
            toast.error('급식 기록에 실패했어요. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetailSave = async () => {
        if (!selectedType) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('feeding_logs')
                .insert({
                    gecko_id: geckoId,
                    feeding_type: selectedType,
                    quantity: quantity ? parseInt(quantity) : null,
                    notes: notes || null,
                    fed_at: new Date().toISOString()
                });

            if (error) throw error;

            const emoji = selectedType === 'insect' ? '🦗' : '🥣';
            const label = selectedType === 'insect' ? '충식' : 'CGD';
            toast.success(`${geckoName}에게 ${label} 급식 완료! ${emoji}`);
            resetForm();
            onSuccess();
        } catch (error) {
            console.error('Error saving feeding:', error);
            toast.error('급식 기록에 실패했어요. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedType(null);
        setQuantity('');
        setNotes('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                        <span>🦗</span> 급식 기록하기
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {geckoName}에게 밥 줄 시간!
                    </DialogDescription>
                </DialogHeader>

                {!selectedType ? (
                    // 급식 종류 선택
                    <div className="space-y-3 mt-4">
                        <p className="text-sm text-zinc-400">
                            빠른 기록 (탭하면 바로 저장)
                        </p>

                        {FEEDING_OPTIONS.map((option) => (
                            <button
                                key={option.type}
                                onClick={() => handleQuickSave(option.type)}
                                disabled={isLoading}
                                className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500/50 rounded-xl transition-all flex items-center gap-4 group disabled:opacity-50"
                            >
                                <span className="text-4xl group-hover:scale-110 transition-transform">
                                    {option.emoji}
                                </span>
                                <div className="text-left">
                                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {option.label}
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        {option.description}
                                    </div>
                                </div>
                                {isLoading && (
                                    <Loader2 className="w-5 h-5 animate-spin ml-auto text-emerald-400" />
                                )}
                            </button>
                        ))}

                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-xs text-zinc-500 mb-3">
                                상세 기록을 원하시면 아래 버튼을 눌러주세요
                            </p>
                            <div className="flex gap-2">
                                {FEEDING_OPTIONS.map((option) => (
                                    <Button
                                        key={option.type}
                                        variant="outline"
                                        onClick={() => setSelectedType(option.type)}
                                        className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    >
                                        {option.emoji} 상세 입력
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // 상세 입력 폼
                    <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                            <span className="text-3xl">
                                {selectedType === 'insect' ? '🦗' : '🥣'}
                            </span>
                            <span className="font-medium">
                                {selectedType === 'insect' ? '충식' : 'CGD (슈퍼푸드)'}
                            </span>
                        </div>

                        {/* 수량 */}
                        <div>
                            <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                수량 {selectedType === 'insect' ? '(마리)' : '(g)'} (선택)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder={selectedType === 'insect' ? '5' : '10'}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        {/* 메모 */}
                        <div>
                            <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                메모 (선택)
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="거부 없이 잘 먹음, 일부만 먹음..."
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setSelectedType(null)}
                                className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                                뒤로
                            </Button>
                            <Button
                                onClick={handleDetailSave}
                                disabled={isLoading}
                                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 font-bold disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    '기록하기'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
