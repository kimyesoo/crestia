'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx-js-style';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Navbar } from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { GovernmentReportForm } from '@/components/report/GovernmentReportForm';
import AdBanner from '@/components/ads/AdBanner';

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
    '상관': { sci: 'Correlophus ciliatus', kor: '볏도마뱀붙이' }, // crested -> 상(crest) 관(crown)
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
                // Simple heuristic to find the name/morph column
                // Search keys for '품종', '모프', '이름', '종류'
                const nameKey = Object.keys(row).find(k =>
                    k.includes('품종') || k.includes('모프') || k.includes('이름') || k.includes('종류')
                ) || '';

                const nameVal = nameKey ? String(row[nameKey]) : '';

                // Default Mapping
                let mapped = { sci: '', kor: '' };

                // 1. Exact or partial match from map
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

        // Column widths
        ws['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "입력양식");
        XLSX.writeFile(wb, "Crestia_신고용_양식.xlsx");
    };

    const handleDownloadReport = () => {
        // ... (Keep existing Excel Logic 100% intact, it's good backup)
        // 1. Grid Data Construction (Columns A-F)
        const sheetData = [
            // Row 0: Title
            ["■ 지정관리 야생동물 [" + (reportInfo.type === '양도' ? 'V' : ' ') + "]양도  [" + (reportInfo.type === '양수' ? 'V' : ' ') + "]양수  [" + (reportInfo.type === '보관' ? 'V' : ' ') + "]보관 신고서", "", "", "", "", ""],

            // Row 1: Spacing
            ["", "", "", "", "", ""],

            // Row 2: Receipt Info
            ["접수번호", "", "접수일", "", "처리기간", "7일"],

            // Row 3-4: Reporter (Seller)
            ["신고인\n(양도인)", "성명(상호)", reportInfo.name, "", "연락처", reportInfo.contact],
            ["", "주소", reportInfo.address, "", "", ""],

            // Row 5-6: Receiver (Buyer)
            ["양수인\n(보관인)", "성명(상호)", "직접 기재 필요", "", "연락처", "직접 기재 필요"],
            ["", "주소", "직접 기재 필요", "", "", ""],

            // Row 7: List Header
            ["[ 신고 대상 개체 목록 ]", "", "", "", "", ""],
            ["연번", "학명 (Scientific Name)", "국명", "수량", "용도", "양도(보관) 사유"],
        ];

        // 2. Add Gecko List
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

        // 3. Create Worksheet
        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        // 4. Style Definitions
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

        // 5. Apply Styles Loop
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
                        border: {} // No border for title box
                    };
                }
                if (R === 8 || (C === 0 && R > 2)) {
                    ws[cellAddress].s.font = { ...baseStyle.font, bold: true };
                }
            }
        }

        // 6. Cell Merges
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

        // 7. Dimensions
        ws['!cols'] = [
            { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 25 }
        ];
        ws['!rows'] = [
            { hpt: 30 }, { hpt: 10 }, { hpt: 25 }, { hpt: 30 }, { hpt: 30 }, { hpt: 30 }, { hpt: 30 }, { hpt: 25 }, { hpt: 30 }
        ];

        // 8. Download
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "신고서");
        XLSX.writeFile(wb, `지정관리야생동물_${reportInfo.type}신고서_${reportInfo.name}.xlsx`);
    };

    const handleDownloadPDF = async () => {
        if (!pdfRef.current) return;

        try {
            // Wait for fonts to render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(pdfRef.current, {
                scale: 2, // High resolution for print
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff', // Force white background
                onclone: (clonedDoc, element) => {
                    // 1. Inject comprehensive CSS override
                    const styleEl = clonedDoc.createElement('style');
                    styleEl.textContent = `
                        /* Override Tailwind CSS lab()/oklab()/oklch() colors with HEX equivalents */
                        :root, *, *::before, *::after {
                            --tw-text-opacity: 1 !important;
                            --tw-bg-opacity: 1 !important;
                            --tw-border-opacity: 1 !important;
                        }
                        
                        /* White/Black */
                        .text-white, [class*="text-white"] { color: #ffffff !important; }
                        .text-black, [class*="text-black"] { color: #000000 !important; }
                        .bg-white, [class*="bg-white"] { background-color: #ffffff !important; }
                        .bg-black, [class*="bg-black"] { background-color: #000000 !important; }
                        
                        /* Zinc scale */
                        .text-zinc-400 { color: #a1a1aa !important; }
                        .text-zinc-500 { color: #71717a !important; }
                        .text-zinc-600 { color: #52525b !important; }
                        .bg-zinc-900 { background-color: #18181b !important; }
                        .bg-zinc-800 { background-color: #27272a !important; }
                        
                        /* Gray scale */
                        .text-gray-400 { color: #9ca3af !important; }
                        .text-gray-500 { color: #6b7280 !important; }
                        
                        /* Custom colors */
                        .bg-\\[\\#dcdcdc\\] { background-color: #dcdcdc !important; }
                        
                        /* Force the report form wrapper to use safe colors */
                        [class*="bg-white"], .relative { 
                            background-color: #ffffff !important;
                            color: #000000 !important;
                        }
                        
                        /* Override any gradient background */
                        [class*="bg-gradient"] { 
                            background-image: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleEl);

                    // 2. Force inline styles on the main element
                    element.style.backgroundColor = '#ffffff';
                    element.style.color = '#000000';

                    // 3. Traverse ALL elements and replace any lab/oklab/oklch colors
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el) => {
                        if (el instanceof HTMLElement) {
                            const computed = clonedDoc.defaultView?.getComputedStyle(el);
                            if (computed) {
                                const bgColor = computed.backgroundColor;
                                const textColor = computed.color;
                                const borderColor = computed.borderColor;

                                // Replace any lab/oklab/oklch colors with safe HEX fallbacks
                                if (bgColor && (bgColor.includes('lab(') || bgColor.includes('oklab(') || bgColor.includes('oklch('))) {
                                    el.style.backgroundColor = '#ffffff';
                                }
                                if (textColor && (textColor.includes('lab(') || textColor.includes('oklab(') || textColor.includes('oklch('))) {
                                    el.style.color = '#000000';
                                }
                                if (borderColor && (borderColor.includes('lab(') || borderColor.includes('oklab(') || borderColor.includes('oklch('))) {
                                    el.style.borderColor = '#000000';
                                }
                            }
                        }
                    });
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calc ratio to fit width exactly, but ensure it fits height too
            const widthRatio = pdfWidth / imgWidth;
            const heightRatio = pdfHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio);

            const finalWidth = imgWidth * ratio;
            const finalHeight = imgHeight * ratio;

            // Center horizontally if scaled down by height
            const xOffset = (pdfWidth - finalWidth) / 2;

            pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
            pdf.save(`지정관리야생동물_${reportInfo.type}신고서_${reportInfo.name}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-[#D4AF37] pl-4">
                                Data Preview <span className="text-sm font-normal text-zinc-500 ml-2">({data.length} rows)</span>
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownloadReport}
                                    className="bg-[#D4AF37] text-black font-bold py-3 px-6 rounded-full hover:bg-[#F2C94C] transition shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
                                >
                                    <span>📊</span>
                                    <span>EXCEL</span>
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2"
                                >
                                    <span>📄</span>
                                    <span>PDF (OFFICIAL)</span>
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

            {/* Hidden Government Form for PDF Generation 
                Fixed positioning with negative z-index to stay in viewport but hidden.
            */}
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
