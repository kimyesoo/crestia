'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface DeleteGeckoButtonProps {
    geckoId: string;
    geckoName: string;
}

export function DeleteGeckoButton({ geckoId, geckoName }: DeleteGeckoButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `정말로 "${geckoName}" 개체를 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.\n관련된 모든 데이터(혈통 정보, ID카드 등)가 함께 삭제됩니다.`
        );

        if (!confirmed) return;

        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('geckos')
                .delete()
                .eq('id', geckoId);

            if (error) throw error;

            toast.success(`"${geckoName}" 개체가 삭제되었습니다.`);
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('개체 삭제에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            title="삭제"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
