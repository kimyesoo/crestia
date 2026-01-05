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
import { Scale, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface WeightInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    geckoId: string;
    geckoName: string;
}

export function WeightInputModal({
    isOpen,
    onClose,
    onSuccess,
    geckoId,
    geckoName
}: WeightInputModalProps) {
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const weightValue = parseFloat(weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            toast.error('올바른 체중을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('weight_logs')
                .insert({
                    gecko_id: geckoId,
                    weight: weightValue,
                    notes: notes || null,
                    measured_at: new Date().toISOString()
                });

            if (error) throw error;

            toast.success(`${geckoName}의 체중 ${weightValue}g을 기록했어요! ⚖️`);
            setWeight('');
            setNotes('');
            onSuccess();
        } catch (error) {
            console.error('Error saving weight:', error);
            toast.error('체중 기록에 실패했어요. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                            <Scale className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-[#D4AF37]">
                                체중 기록하기
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                {geckoName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* 체중 입력 */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            체중 (g)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="200"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="45.5"
                                className="w-full px-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-2xl font-bold text-center placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                                autoFocus
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
                                g
                            </span>
                        </div>
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
                            placeholder="탈피 직후, 아침 급식 전..."
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !weight}
                            className="flex-1 bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                '기록하기'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
