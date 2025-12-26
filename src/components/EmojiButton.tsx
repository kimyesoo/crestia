'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData, Theme, Categories } from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmojiButtonProps {
    onEmojiSelect: (emoji: string) => void;
}

export function EmojiButton({ onEmojiSelect }: EmojiButtonProps) {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPicker]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onEmojiSelect(emojiData.emoji);
        setShowPicker(false);
    };

    return (
        <div className="relative" ref={pickerRef}>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPicker(!showPicker)}
                className="text-zinc-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
                <Smile className="w-5 h-5" />
            </Button>

            {showPicker && (
                <div className="absolute bottom-12 right-0 z-50">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={Theme.DARK}
                        width={320}
                        height={400}
                        searchPlaceholder="이모지 검색..."
                        categories={[
                            { category: Categories.SUGGESTED, name: '자주 사용' },
                            { category: Categories.SMILEYS_PEOPLE, name: '표정' },
                            { category: Categories.ANIMALS_NATURE, name: '동물' },
                            { category: Categories.FOOD_DRINK, name: '음식' },
                            { category: Categories.ACTIVITIES, name: '활동' },
                            { category: Categories.TRAVEL_PLACES, name: '여행' },
                            { category: Categories.OBJECTS, name: '사물' },
                            { category: Categories.SYMBOLS, name: '기호' },
                        ]}
                        previewConfig={{
                            showPreview: false
                        }}
                    />
                </div>
            )}
        </div>
    );
}
