'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface DataExportBtnProps {
    geckoId: string;
    geckoName: string;
    className?: string;
    variant?: 'default' | 'compact';
}

interface ExportRow {
    날짜: string;
    종류: string;
    상세내용: string;
    수치: string;
    메모: string;
}

/**
 * 엑셀 데이터 내보내기 버튼 컴포넌트
 * 
 * weight_logs와 feeding_logs 데이터를 통합하여 엑셀 파일로 다운로드
 */
export function DataExportBtn({
    geckoId,
    geckoName,
    className,
    variant = 'default'
}: DataExportBtnProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const supabase = createClient();

    const handleExport = async () => {
        setIsLoading(true);
        setIsDone(false);

        try {
            // 1. 체중 기록 조회
            const { data: weightLogs, error: weightError } = await supabase
                .from('weight_logs')
                .select('*')
                .eq('gecko_id', geckoId)
                .order('measured_at', { ascending: false });

            if (weightError) throw weightError;

            // 2. 급식 기록 조회
            const { data: feedingLogs, error: feedingError } = await supabase
                .from('feeding_logs')
                .select('*')
                .eq('gecko_id', geckoId)
                .order('fed_at', { ascending: false });

            if (feedingError) throw feedingError;

            // 3. 데이터 통합 및 가공
            const exportData: ExportRow[] = [];

            // 체중 데이터 추가
            weightLogs?.forEach(log => {
                exportData.push({
                    날짜: formatDate(log.measured_at),
                    종류: '체중 기록',
                    상세내용: '체중 측정',
                    수치: `${log.weight}g`,
                    메모: log.notes || ''
                });
            });

            // 급식 데이터 추가
            feedingLogs?.forEach(log => {
                const feedingType = log.feeding_type === 'insect' ? '🦗 충식' : '🥣 CGD';
                const quantity = log.quantity
                    ? (log.feeding_type === 'insect' ? `${log.quantity}마리` : `${log.quantity}g`)
                    : '-';

                exportData.push({
                    날짜: formatDate(log.fed_at),
                    종류: '급식 기록',
                    상세내용: feedingType,
                    수치: quantity,
                    메모: log.notes || ''
                });
            });

            // 날짜순 정렬 (최신순)
            exportData.sort((a, b) =>
                new Date(b.날짜).getTime() - new Date(a.날짜).getTime()
            );

            // 데이터가 없는 경우
            if (exportData.length === 0) {
                toast.error('내보낼 데이터가 없습니다.');
                setIsLoading(false);
                return;
            }

            // 4. 엑셀 워크북 생성
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // 컬럼 너비 설정
            worksheet['!cols'] = [
                { wch: 12 },  // 날짜
                { wch: 10 },  // 종류
                { wch: 15 },  // 상세내용
                { wch: 10 },  // 수치
                { wch: 30 },  // 메모
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, geckoName);

            // 5. 파일 다운로드
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const fileName = `Crestia_Care_Log_${geckoName}_${today}.xlsx`;

            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            saveAs(blob, fileName);

            setIsDone(true);
            toast.success(`${exportData.length}개의 기록을 내보냈습니다! 📥`);

            // 3초 후 상태 초기화
            setTimeout(() => setIsDone(false), 3000);

        } catch (error) {
            console.error('Export error:', error);
            toast.error('데이터 내보내기에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isLoading}
            variant="outline"
            className={`
                border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 
                hover:border-[#D4AF37]/50 transition-all
                ${isDone ? 'border-green-500/50 text-green-400' : ''}
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {variant === 'compact' ? '준비 중...' : '데이터 준비 중...'}
                </>
            ) : isDone ? (
                <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {variant === 'compact' ? '완료!' : '다운로드 완료!'}
                </>
            ) : (
                <>
                    <Download className="w-4 h-4 mr-2" />
                    {variant === 'compact' ? '백업' : '📥 엑셀로 백업하기'}
                </>
            )}
        </Button>
    );
}

/**
 * 날짜 포맷 함수 (YYYY-MM-DD HH:mm 형식)
 */
function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
