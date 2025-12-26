'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx-js-style';
import { jsPDF } from 'jspdf';
import { Navbar } from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { GovernmentReportForm } from '@/components/report/GovernmentReportForm';
import AdBanner from '@/components/ads/AdBanner';
import { loadKoreanFont } from '@/lib/pdf/koreanFont';

// --- Styles from GeckoCard ---
const carbonFiberStyle: React.CSSProperties = {
    backgroundColor: "#111111",
    backgroundImage: `
  linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000),
  linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000)
`,
    backgroundSize: "30px 30px",
    backgroundPosition: "0 0, 15px 15px",
};

// --- Logic ---

const SPECIES_MAP: Record<string, { sci: string; kor: string }> = {
    // Crested Gecko
    '크레': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '상관': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '릴리': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '카푸': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '아잔': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '세이블': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '프라푸': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },
    '익스': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' },

    // Leopard Gecko
    '레오파드': { sci: 'Eublepharis macularius', kor: '표범도마뱀붙이' },
    '레게': { sci: 'Eublepharis macularius', kor: '표범도마뱀붙이' },
    '블랙나이트': { sci: 'Eublepharis macularius', kor: '표범도마뱀붙이' },
    '블나': { sci: 'Eublepharis macularius', kor: '표범도마뱀붙이' },

    // Gargoyle Gecko
    '가고일': { sci: 'Rhacodactylus auriculatus', kor: '가고일도마뱀붙이' },

    // Fat-tailed Gecko
    '팻테일': { sci: 'Hemitheconyx caudicinctus', kor: '아프리카살찐꼬리도마뱀붙이' },
    '펫테일': { sci: 'Hemitheconyx caudicinctus', kor: '아프리카살찐꼬리도마뱀붙이' },
};

export default function RegistrationHelperPage() {
    const [data, setData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    // 1. Report Info State
    const [reportInfo, setReportInfo] = useState({
        type: '보관', // 양도, 양수, 보관
        name: '',
        contact: '',
        address: '',
        reason: '개인 사육 및 보관',
    });

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    const processFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws);

            const processed = jsonData.map((row: any) => {
                const nameKey = Object.keys(row).find(k =>
                    k.includes('품종') || k.includes('모프') || k.includes('이름') || k.includes('종류')
                ) || '';

                const nameVal = nameKey ? String(row[nameKey]) : '';

                let mapped = { sci: '', kor: '' };

                for (const [key, val] of Object.entries(SPECIES_MAP)) {
                    if (nameVal.includes(key)) {
                        mapped = val;
                        break;
                    }
                }

                return {
                    ...row,
                    '국명(자동생성)': mapped.kor || '직접 입력 필요',
                    '학명(자동생성)': mapped.sci || '직접 입력 필요',
                    '수량': row['수량'] || 1,
                    '취득일': row['취득일'] || row['해칭일'] || row['입양일'] || new Date().toISOString().split('T')[0],
                };
            });

            setData(processed);
            setFileName(file.name);
        };
        reader.readAsBinaryString(file);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDownload = () => {
        const newWs = XLSX.utils.json_to_sheet(data);
        const newWb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWb, newWs, "신고용데이터");
        XLSX.writeFile(newWb, `신고용변환_${fileName || 'data'}`);
    };

    const handleDownloadTemplate = () => {
        const headers = ['품종', '모프', '아이디(이름)', '성별', '해칭일', '입양처'];
        const example = ['크레스티드 게코', '릴리 화이트', 'Example-001', 'Su', '2025-01-01', 'Self'];

        const ws = XLSX.utils.aoa_to_sheet([headers, example]);

        ws['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "입력양식");
        XLSX.writeFile(wb, "Crestia_신고용_양식.xlsx");
    };

    const handleDownloadReport = () => {
        const sheetData = [
            ["■ 지정관리 야생동물 [" + (reportInfo.type === '양도' ? 'V' : ' ') + "]양도  [" + (reportInfo.type === '양수' ? 'V' : ' ') + "]양수  [" + (reportInfo.type === '보관' ? 'V' : ' ') + "]보관 신고서", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["접수번호", "", "접수일", "", "처리기간", "7일"],
            ["신고인\n(양도인)", "성명(상호)", reportInfo.name, "", "연락처", reportInfo.contact],
            ["", "주소", reportInfo.address, "", "", ""],
            ["양수인\n(보관인)", "성명(상호)", "직접 기재 필요", "", "연락처", "직접 기재 필요"],
            ["", "주소", "직접 기재 필요", "", "", ""],
            ["[ 신고 대상 개체 목록 ]", "", "", "", "", ""],
            ["연번", "학명 (Scientific Name)", "국명", "수량", "용도", "양도(보관) 사유"],
        ];

        data.forEach((row, index) => {
            sheetData.push([
                index + 1,
                row['학명'] || row['Scientific Name'] || row['학명(자동생성)'] || '',
                row['국명'] || row['국명(자동생성)'] || '',
                row['수량'] || 1,
                "반려용",
                reportInfo.reason
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        };

        const baseStyle = {
            font: { name: "Malgun Gothic", sz: 10 },
            alignment: { vertical: "center", horizontal: "center", wrapText: true },
            border: borderStyle
        };

        const range = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;

                ws[cellAddress].s = { ...baseStyle };

                if (R === 0) {
                    ws[cellAddress].s = {
                        ...baseStyle,
                        font: { name: "Malgun Gothic", sz: 14, bold: true },
                        border: {}
                    };
                }
                if (R === 8 || (C === 0 && R > 2)) {
                    ws[cellAddress].s.font = { ...baseStyle.font, bold: true };
                }
            }
        }

        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
            { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
            { s: { r: 3, c: 2 }, e: { r: 3, c: 3 } },
            { s: { r: 4, c: 2 }, e: { r: 4, c: 5 } },
            { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } },
            { s: { r: 5, c: 2 }, e: { r: 5, c: 3 } },
            { s: { r: 6, c: 2 }, e: { r: 6, c: 5 } },
            { s: { r: 7, c: 0 }, e: { r: 7, c: 5 } },
        ];

        ws['!cols'] = [
            { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 25 }
        ];
        ws['!rows'] = [
            { hpt: 30 }, { hpt: 10 }, { hpt: 25 }, { hpt: 30 }, { hpt: 30 }, { hpt: 30 }, { hpt: 30 }, { hpt: 25 }, { hpt: 30 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "신고서");
        XLSX.writeFile(wb, `지정관리야생동물_${reportInfo.type}신고서_${reportInfo.name}.xlsx`);
    };

    // Korean PDF with NanumGothic font
    const handleDownloadPDF = async () => {
        if (isGeneratingPDF) return;

        setIsGeneratingPDF(true);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Load Korean font
            await loadKoreanFont(pdf);

            const pageWidth = 210;
            const margin = 15;
            const contentWidth = pageWidth - margin * 2;

            let y = margin;

            // Helper function for drawing cells with Korean text
            const drawCell = (x: number, w: number, h: number, text: string, options: { fill?: boolean, align?: 'left' | 'center', fontSize?: number, bold?: boolean } = {}) => {
                if (options.fill) {
                    pdf.setFillColor(220, 220, 220);
                    pdf.rect(x, y, w, h, 'F');
                }
                pdf.setDrawColor(0);
                pdf.rect(x, y, w, h, 'S');
                pdf.setFontSize(options.fontSize || 9);
                pdf.setFont('NanumGothic', options.bold ? 'bold' : 'normal');
                const textX = options.align === 'center' ? x + w / 2 : x + 2;
                pdf.text(text, textX, y + h / 2 + 1.5, { align: options.align || 'left', maxWidth: w - 4 });
            };

            // === HEADER ===
            pdf.setFont('NanumGothic', 'bold');
            pdf.setFontSize(8);
            pdf.text('■ 야생생물 보호 및 관리에 관한 법률 시행규칙 [별지 제31호의9서식]', margin, y);
            y += 8;

            // === TITLE ===
            const isYangdo = reportInfo.type === '양도';
            const isYangsu = reportInfo.type === '양수';
            const isBogan = reportInfo.type === '보관' || (!isYangdo && !isYangsu);

            pdf.setFontSize(16);
            pdf.setFont('NanumGothic', 'bold');
            const check = (checked: boolean) => checked ? '√' : ' ';
            pdf.text(
                `지정관리 야생동물 [ ${check(isYangdo)} ] 양도 [ ${check(isYangsu)} ] 양수 [ ${check(isBogan)} ] 보관 신고서`,
                pageWidth / 2, y, { align: 'center' }
            );
            y += 8;

            pdf.setFontSize(7);
            pdf.setFont('NanumGothic', 'normal');
            pdf.text('※ 색상이 어두운 칸은 신고인이 작성하지 않으며, [ ]에는 해당되는 곳에 √표시를 합니다.', margin, y);
            y += 6;

            // === TABLE 1: Receipt Info ===
            const col1 = contentWidth * 0.15;
            const col2 = contentWidth * 0.25;
            const col3 = contentWidth * 0.15;
            const col4 = contentWidth * 0.25;
            const col5 = contentWidth * 0.12;
            const col6 = contentWidth * 0.08;
            const rowH = 8;

            let x = margin;
            drawCell(x, col1, rowH, '접수번호', { fill: true, align: 'center' }); x += col1;
            drawCell(x, col2, rowH, '', { fill: true, align: 'center' }); x += col2;
            drawCell(x, col3, rowH, '접수일', { fill: true, align: 'center' }); x += col3;
            drawCell(x, col4, rowH, '', { fill: true, align: 'center' }); x += col4;
            drawCell(x, col5, rowH, '처리기간', { fill: true, align: 'center' }); x += col5;
            drawCell(x, col6, rowH, '7일', { fill: true, align: 'center' });
            y += rowH;

            // === TABLE 2: 양도인 ===
            x = margin;
            const labelW = contentWidth * 0.13;
            const fieldLabelW = contentWidth * 0.12;
            const fieldValueW = contentWidth * 0.35;
            const contactLabelW = contentWidth * 0.12;
            const contactValueW = contentWidth * 0.28;

            drawCell(x, labelW, rowH * 2, '양도인', { fill: true, align: 'center' });
            drawCell(x + labelW, fieldLabelW, rowH, '상호(성명)', { align: 'center' });
            drawCell(x + labelW + fieldLabelW, fieldValueW, rowH, isYangdo ? reportInfo.name : '');
            drawCell(x + labelW + fieldLabelW + fieldValueW, contactLabelW, rowH, '연락처', { align: 'center' });
            drawCell(x + labelW + fieldLabelW + fieldValueW + contactLabelW, contactValueW, rowH, isYangdo ? reportInfo.contact : '');
            y += rowH;
            drawCell(x + labelW, fieldLabelW, rowH, '주소', { align: 'center' });
            drawCell(x + labelW + fieldLabelW, fieldValueW + contactLabelW + contactValueW, rowH, isYangdo ? reportInfo.address : '');
            y += rowH;

            // === TABLE 3: 양수인(보관인) ===
            drawCell(x, labelW, rowH * 2, '양수인\n(보관인)', { fill: true, align: 'center' });
            drawCell(x + labelW, fieldLabelW, rowH, '상호(성명)', { align: 'center' });
            drawCell(x + labelW + fieldLabelW, fieldValueW, rowH, !isYangdo ? reportInfo.name : '');
            drawCell(x + labelW + fieldLabelW + fieldValueW, contactLabelW, rowH, '연락처', { align: 'center' });
            drawCell(x + labelW + fieldLabelW + fieldValueW + contactLabelW, contactValueW, rowH, !isYangdo ? reportInfo.contact : '');
            y += rowH;
            drawCell(x + labelW, fieldLabelW, rowH, '주소', { align: 'center' });
            drawCell(x + labelW + fieldLabelW, fieldValueW + contactLabelW + contactValueW, rowH, !isYangdo ? reportInfo.address : '');
            y += rowH;

            // === TABLE 4: 야생동물 정보 ===
            const listLabelW = contentWidth * 0.13;
            const nameW = contentWidth * 0.32;
            const qtyW = contentWidth * 0.10;
            const purposeW = contentWidth * 0.15;
            const reasonW = contentWidth * 0.30;

            const minRows = 5;
            const filledData = [...data];
            while (filledData.length < minRows) {
                filledData.push({});
            }
            const listHeight = rowH * (filledData.length + 1);

            drawCell(x, listLabelW, listHeight, '지정관리\n야생동물\n정보', { fill: true, align: 'center' });

            const listX = x + listLabelW;
            drawCell(listX, nameW, rowH, '학명', { align: 'center', fontSize: 8, bold: true });
            drawCell(listX + nameW, qtyW, rowH, '수량', { align: 'center', fontSize: 8, bold: true });
            drawCell(listX + nameW + qtyW, purposeW, rowH, '용도', { align: 'center', fontSize: 8, bold: true });
            drawCell(listX + nameW + qtyW + purposeW, reasonW, rowH, '양도사유(보관사유)', { align: 'center', fontSize: 8, bold: true });
            y += rowH;

            filledData.forEach((row) => {
                const sciName = row['학명'] || row['학명(자동생성)'] || '';
                const qty = row['수량'] || (sciName ? '1' : '');
                const purpose = sciName ? '반려용' : '';
                const reason = sciName ? reportInfo.reason : '';

                drawCell(listX, nameW, rowH, sciName, { fontSize: 8 });
                drawCell(listX + nameW, qtyW, rowH, String(qty), { align: 'center', fontSize: 8 });
                drawCell(listX + nameW + qtyW, purposeW, rowH, purpose, { align: 'center', fontSize: 8 });
                drawCell(listX + nameW + qtyW + purposeW, reasonW, rowH, reason, { fontSize: 8 });
                y += rowH;
            });

            y += 8;

            // === DECLARATION ===
            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            pdf.text(
                '「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에',
                pageWidth / 2, y, { align: 'center' }
            );
            y += 5;
            pdf.text(
                `따라 위와 같이 지정관리 야생동물의 [ ${check(isYangdo)} ]양도, [ ${check(isYangsu)} ]양수, [ ${check(isBogan)} ]보관을 신고합니다.`,
                pageWidth / 2, y, { align: 'center' }
            );
            y += 12;

            const today = new Date();
            pdf.setFontSize(12);
            pdf.text(`${today.getFullYear()}년  ${today.getMonth() + 1}월  ${today.getDate()}일`, pageWidth / 2, y, { align: 'center' });
            y += 12;

            pdf.setFontSize(10);
            pdf.text(`신고인   ${reportInfo.name}   (서명 또는 인)`, pageWidth - margin, y, { align: 'right' });
            y += 12;

            pdf.setFontSize(14);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('시장 · 군수 · 구청장  귀하', margin, y);
            y += 15;

            // === Cut Line ===
            pdf.setLineDashPattern([2, 2], 0);
            pdf.line(margin, y, pageWidth - margin, y);
            pdf.setFontSize(8);
            pdf.setFont('NanumGothic', 'normal');
            pdf.text('자르는 선', pageWidth / 2, y - 2, { align: 'center' });
            pdf.setLineDashPattern([], 0);
            y += 10;

            // === CERTIFICATE ===
            pdf.setFontSize(10);
            pdf.text('제          호', margin, y);
            y += 8;

            pdf.setFontSize(14);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text(
                `지정관리 야생동물 [ ${check(isYangdo)} ]양도 [ ${check(isYangsu)} ]양수 [ ${check(isBogan)} ]보관 신고확인증`,
                pageWidth / 2, y, { align: 'center' }
            );
            y += 12;

            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            pdf.text(
                '「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에 따라',
                pageWidth / 2, y, { align: 'center' }
            );
            y += 5;
            pdf.text(
                `지정관리 야생동물의 [ ${check(isYangdo)} ]양도, [ ${check(isYangsu)} ]양수, [ ${check(isBogan)} ]보관을 신고하였음을 확인합니다.`,
                pageWidth / 2, y, { align: 'center' }
            );
            y += 12;

            pdf.setFontSize(12);
            pdf.text(`${today.getFullYear()}년  ${today.getMonth() + 1}월  ${today.getDate()}일`, pageWidth / 2, y, { align: 'center' });
            y += 15;

            pdf.setFontSize(14);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('시장 · 군수 · 구청장', pageWidth - margin - 35, y, { align: 'right' });

            // Draw seal circle
            pdf.setDrawColor(200, 50, 50);
            pdf.circle(pageWidth - margin - 12, y - 5, 10, 'S');
            pdf.setFontSize(8);
            pdf.setTextColor(200, 50, 50);
            pdf.text('직인', pageWidth - margin - 12, y - 5, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
            y += 10;

            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            pdf.text('귀하', margin, y);

            pdf.save(`지정관리야생동물_${reportInfo.type}신고서_${reportInfo.name}.pdf`);
        } catch (err) {
            console.error('PDF 생성 오류:', err);
            alert('PDF 생성 중 오류가 발생했습니다. 폰트 로딩에 실패했을 수 있습니다.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };


    return (
        <div
            className="min-h-screen text-white font-sans"
            style={carbonFiberStyle}
        >
            <Navbar user={user} />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="flex flex-col items-center mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-4 tracking-tight drop-shadow-lg p-2">
                        WIMS REGISTRATION HELPER
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Automatically convert your gecko inventory into the official government wildlife registration format.
                        Drag & drop your Excel file below.
                    </p>
                </div>

                {/* Step 1: Report Info Input */}
                <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-700 mb-8 shadow-2xl">
                    <h3 className="text-xl text-[#D4AF37] mb-4 font-bold tracking-wider">1. REPORT INFO (신고인 정보)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-zinc-400 uppercase tracking-widest">Type (구분)</label>
                            <select
                                className="bg-black border border-zinc-600 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                value={reportInfo.type}
                                onChange={(e) => setReportInfo({ ...reportInfo, type: e.target.value })}
                            >
                                <option value="보관">보관 (기존 보유)</option>
                                <option value="양도">양도 (판매/분양)</option>
                                <option value="양수">양수 (입양/구매)</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-zinc-400 uppercase tracking-widest">Name (성명/상호)</label>
                            <input
                                type="text"
                                className="bg-black border border-zinc-600 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="홍길동"
                                onChange={(e) => setReportInfo({ ...reportInfo, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-zinc-400 uppercase tracking-widest">Contact (연락처)</label>
                            <input
                                type="text"
                                className="bg-black border border-zinc-600 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="010-1234-5678"
                                onChange={(e) => setReportInfo({ ...reportInfo, contact: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-zinc-400 uppercase tracking-widest">Address (주소)</label>
                            <input
                                type="text"
                                className="bg-black border border-zinc-600 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="서울시 강남구..."
                                onChange={(e) => setReportInfo({ ...reportInfo, address: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs text-zinc-400 uppercase tracking-widest">Reason (사유)</label>
                            <input
                                type="text"
                                className="bg-black border border-zinc-600 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                value={reportInfo.reason}
                                onChange={(e) => setReportInfo({ ...reportInfo, reason: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* --- [NEW] Action Section --- */}
                <div className="flex flex-col gap-8 mb-12 max-w-2xl mx-auto w-full">

                    {/* Step 1: Download Template */}
                    <div className="flex flex-col gap-4 p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
                        <h3 className="text-xl font-bold text-white">STEP 2. 양식 받기</h3>
                        <p className="text-sm text-gray-400">
                            아래 표준 양식을 다운로드하여 개체 정보를 입력해주세요.<br />
                            (예시 데이터는 지우고 입력하세요)
                        </p>
                        <button
                            onClick={handleDownloadTemplate}
                            className="mt-auto w-full py-3 border border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition flex justify-center items-center gap-2"
                        >
                            📥 양식 엑셀 다운로드
                        </button>
                    </div>

                    {/* ADVERTISEMENT BANNER */}
                    <AdBanner dataAdSlot="1234567890" />

                    {/* Step 3: Upload File */}
                    <div
                        className={`flex flex-col gap-4 p-6 border border-dashed rounded-xl transition relative group ${isDragOver ? 'border-[#D4AF37] bg-zinc-900/80 scale-[1.02]' : 'border-[#D4AF37] bg-black hover:bg-zinc-900/30'}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <h3 className="text-xl font-bold text-[#D4AF37]">STEP 3. 변환하기</h3>
                        <p className="text-sm text-gray-400">
                            작성한 엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.
                        </p>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="mt-auto w-full py-3 bg-[#D4AF37]/10 text-[#D4AF37] font-bold rounded-lg group-hover:bg-[#D4AF37] group-hover:text-black transition text-center border border-[#D4AF37]">
                            📂 엑셀 파일 업로드
                        </div>
                    </div>

                </div>

                {/* Preview Area */}
                {data.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-[#D4AF37] pl-4">
                                Data Preview <span className="text-sm font-normal text-zinc-500 ml-2">({data.length} rows)</span>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleDownloadReport}
                                    className="bg-[#D4AF37] text-black font-bold py-3 px-6 rounded-full hover:bg-[#F2C94C] transition shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
                                >
                                    <span>📊</span>
                                    <span>EXCEL</span>
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isGeneratingPDF}
                                    className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{isGeneratingPDF ? '⏳' : '📄'}</span>
                                    <span>{isGeneratingPDF ? 'PDF 생성중...' : 'PDF (한글)'}</span>
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="border border-[#D4AF37] text-[#D4AF37] font-bold py-3 px-4 rounded-full hover:bg-[#D4AF37]/10 transition flex items-center gap-2"
                                >
                                    <span>💾</span>
                                    <span>RAW</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-zinc-700 shadow-2xl bg-[#111]">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-[#D4AF37] uppercase bg-zinc-900 border-b border-zinc-700">
                                    <tr>
                                        {Object.keys(data[0]).map((key) => (
                                            <th key={key} className="px-6 py-4 whitespace-nowrap">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, idx) => (
                                        <tr key={idx} className="bg-black/50 border-b border-zinc-800 hover:bg-zinc-900/50 transition">
                                            {Object.values(row).map((val: any, i) => (
                                                <td key={i} className="px-6 py-4 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Hidden Government Form for PDF Generation */}
            <div
                className="fixed top-0 left-0"
                style={{
                    zIndex: -100,
                    opacity: 0,
                    pointerEvents: 'none'
                }}
            >
                {/* @ts-ignore */}
                <GovernmentReportForm ref={pdfRef} reportInfo={reportInfo} data={data} />
            </div>
        </div>
    );
}
