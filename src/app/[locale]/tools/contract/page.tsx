'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, FileDown, Printer, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import { loadKoreanFont } from '@/lib/pdf/koreanFont';

interface ContractData {
    transactionDate: string;
    sellerName: string;
    sellerBirthDate: string;
    sellerPhone: string;
    sellerAddress: string;
    buyerName: string;
    buyerBirthDate: string;
    buyerPhone: string;
    buyerAddress: string;
    geckoName: string;
    geckoMorph: string;
    geckoGender: string;
    geckoHatchDate: string;
    geckoPrice: string;
    geckoFeatures: string;
    specialTerms: string;
}

const initialData: ContractData = {
    transactionDate: new Date().toISOString().split('T')[0],
    sellerName: '',
    sellerBirthDate: '',
    sellerPhone: '',
    sellerAddress: '',
    buyerName: '',
    buyerBirthDate: '',
    buyerPhone: '',
    buyerAddress: '',
    geckoName: '',
    geckoMorph: '',
    geckoGender: '',
    geckoHatchDate: '',
    geckoPrice: '',
    geckoFeatures: '',
    specialTerms: '',
};

export default function ContractPage() {
    const [data, setData] = useState<ContractData>(initialData);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleChange = (field: keyof ContractData, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePrint = () => {
        const printContent = previewRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>양도양수 계약서 - Crestia</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Malgun Gothic', sans-serif; }
                    @page { size: A4; margin: 20mm; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '____년 __월 __일';
        const date = new Date(dateStr);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const formatPrice = (price: string) => {
        if (!price) return '___________';
        return Number(price).toLocaleString('ko-KR');
    };

    const getGenderText = (gender: string) => {
        switch (gender) {
            case 'male': return '수컷 (Male)';
            case 'female': return '암컷 (Female)';
            case 'unsexed': return '미확인';
            case 'unknown': return '확인불가 (유체)';
            default: return '_____';
        }
    };

    // Pure jsPDF approach - no html2canvas, no lab() color issues
    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Load Korean font
            await loadKoreanFont(pdf);

            const pageWidth = 210;
            const margin = 20;
            const contentWidth = pageWidth - margin * 2;

            let y = margin;

            const drawTableRow = (label: string, value: string, rowHeight: number = 8) => {
                const labelWidth = 25;
                pdf.setFillColor(240, 240, 240);
                pdf.rect(margin, y, labelWidth, rowHeight, 'F');
                pdf.setDrawColor(150);
                pdf.rect(margin, y, labelWidth, rowHeight, 'S');
                pdf.rect(margin + labelWidth, y, contentWidth - labelWidth, rowHeight, 'S');

                pdf.setFontSize(9);
                pdf.setFont('NanumGothic', 'bold');
                pdf.text(label, margin + 2, y + rowHeight / 2 + 1.5);

                pdf.setFont('NanumGothic', 'normal');
                pdf.text(value || '_________________', margin + labelWidth + 2, y + rowHeight / 2 + 1.5);

                y += rowHeight;
            };

            // === Watermark ===
            pdf.setTextColor(200, 200, 200);
            pdf.setFontSize(20);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('CRESTIA', pageWidth / 2, y, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
            y += 10;

            // === Title ===
            pdf.setFontSize(18);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('크레스티드 게코 양도양수 계약서', pageWidth / 2, y, { align: 'center' });
            y += 3;
            pdf.setLineWidth(0.5);
            pdf.line(margin + 20, y, pageWidth - margin - 20, y);
            y += 10;

            // === Intro ===
            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            const introText = `아래 당사자들은 ${formatDate(data.transactionDate)}에 다음과 같이 크레스티드 게코의 소유권 이전에 관한 계약을 체결한다.`;
            const introLines = pdf.splitTextToSize(introText, contentWidth);
            pdf.text(introLines, margin, y);
            y += introLines.length * 5 + 5;

            // === Article 1 ===
            pdf.setFontSize(11);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('제1조 (목적)', margin, y);
            y += 5;
            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            const art1Text = '본 계약은 "갑"이 소유한 크레스티드 게코(이하 "개체"라 함)를 "을"에게 양도함에 있어 필요한 제반 사항을 정함을 목적으로 한다.';
            const art1Lines = pdf.splitTextToSize(art1Text, contentWidth);
            pdf.text(art1Lines, margin, y);
            y += art1Lines.length * 5 + 8;

            // === Article 2 ===
            pdf.setFontSize(11);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('제2조 (개체 정보)', margin, y);
            y += 6;

            drawTableRow('이름', data.geckoName);
            drawTableRow('모프', data.geckoMorph);
            drawTableRow('해칭일', formatDate(data.geckoHatchDate));
            drawTableRow('성별', getGenderText(data.geckoGender));
            drawTableRow('양도가', `₩ ${formatPrice(data.geckoPrice)} 원`);
            drawTableRow('특징', data.geckoFeatures);
            y += 5;

            // === Article 3 ===
            pdf.setFontSize(11);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('제3조 (대금 및 지급)', margin, y);
            y += 5;
            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            const art3Text = `"을"은 본 계약 체결과 동시에 양도 대금 금 ${formatPrice(data.geckoPrice)}원 정을 "갑"에게 지급한다.`;
            const art3Lines = pdf.splitTextToSize(art3Text, contentWidth);
            pdf.text(art3Lines, margin, y);
            y += art3Lines.length * 5 + 8;

            // === Article 4 (Special Terms) - Always show ===
            pdf.setFontSize(11);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('제4조 (특약 사항)', margin, y);
            y += 5;
            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'normal');
            const specialTermsText = data.specialTerms || '없음';
            const specialLines = pdf.splitTextToSize(specialTermsText, contentWidth);
            pdf.text(specialLines, margin, y);
            y += specialLines.length * 5 + 8;

            // === Agreement text ===
            y += 5;
            pdf.setFontSize(9);
            pdf.text('위 계약을 증명하기 위하여 본 계약서 2통을 작성하여 각자 서명 날인 후 1통씩 보관한다.', pageWidth / 2, y, { align: 'center' });
            y += 10;

            // === Date ===
            pdf.setFontSize(12);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text(formatDate(data.transactionDate), pageWidth / 2, y, { align: 'center' });
            y += 15;

            // === Signature Section ===
            const sigStartY = y;
            const halfWidth = contentWidth / 2 - 5;

            // Seller (양도인)
            pdf.setFontSize(10);
            pdf.setFont('NanumGothic', 'bold');
            pdf.text('[갑] 양도인', margin + halfWidth / 2, y, { align: 'center' });
            y += 8;
            pdf.setFont('NanumGothic', 'normal');
            pdf.setFontSize(9);
            pdf.text(`성명: ${data.sellerName || '_______________'} (인)`, margin, y);
            y += 6;
            pdf.text(`생년월일: ${formatDate(data.sellerBirthDate)}`, margin, y);
            y += 6;
            pdf.text(`연락처: ${data.sellerPhone || '_______________'}`, margin, y);
            y += 6;
            pdf.text(`주소: ${data.sellerAddress || '_______________'}`, margin, y, { maxWidth: halfWidth });

            // Buyer (양수인)
            y = sigStartY;
            const rightX = margin + halfWidth + 10;
            pdf.setFont('NanumGothic', 'bold');
            pdf.setFontSize(10);
            pdf.text('[을] 양수인', rightX + halfWidth / 2, y, { align: 'center' });
            y += 8;
            pdf.setFont('NanumGothic', 'normal');
            pdf.setFontSize(9);
            pdf.text(`성명: ${data.buyerName || '_______________'} (인)`, rightX, y);
            y += 6;
            pdf.text(`생년월일: ${formatDate(data.buyerBirthDate)}`, rightX, y);
            y += 6;
            pdf.text(`연락처: ${data.buyerPhone || '_______________'}`, rightX, y);
            y += 6;
            pdf.text(`주소: ${data.buyerAddress || '_______________'}`, rightX, y, { maxWidth: halfWidth });

            // === Footer ===
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text('Generated by Crestia - Premium Gecko Pedigree Platform', pageWidth / 2, 285, { align: 'center' });

            pdf.save(`크레스티드게코_양도양수계약서_${data.transactionDate || 'draft'}.pdf`);
        } catch (error) {
            console.error('PDF 생성 오류:', error);
            alert('PDF 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className="bg-background">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/tools" className="text-zinc-400 hover:text-white transition">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white">양도양수 계약서</h1>
                                <p className="text-xs sm:text-sm text-zinc-500 hidden sm:block">Crested Gecko Transfer Contract</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={handlePrint} variant="outline" size="sm" className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm">
                                <Printer className="w-4 h-4" />
                                <span className="hidden sm:inline">인쇄하기</span>
                                <span className="sm:hidden">인쇄</span>
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                disabled={isGeneratingPDF}
                                size="sm"
                                className="flex-1 sm:flex-none gap-2 bg-[#D4AF37] hover:bg-[#C5A028] text-black text-xs sm:text-sm"
                            >
                                {isGeneratingPDF ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FileDown className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">{isGeneratingPDF ? 'PDF 생성 중...' : 'PDF 다운로드'}</span>
                                <span className="sm:hidden">{isGeneratingPDF ? '생성중...' : 'PDF'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Input Form */}
                    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <h2 className="text-base sm:text-lg font-semibold text-white border-b border-zinc-800 pb-3 sm:pb-4">
                            계약 정보 입력
                        </h2>

                        {/* Transaction Date */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">거래 일자</Label>
                            <Input
                                type="date"
                                value={data.transactionDate}
                                onChange={(e) => handleChange('transactionDate', e.target.value)}
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>

                        {/* Seller Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-[#D4AF37]">양도인 (판매자) 정보</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">이름</Label>
                                    <Input
                                        placeholder="홍길동"
                                        value={data.sellerName}
                                        onChange={(e) => handleChange('sellerName', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">생년월일</Label>
                                    <Input
                                        type="date"
                                        value={data.sellerBirthDate}
                                        onChange={(e) => handleChange('sellerBirthDate', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">연락처</Label>
                                    <Input
                                        placeholder="010-1234-5678"
                                        value={data.sellerPhone}
                                        onChange={(e) => handleChange('sellerPhone', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">주소</Label>
                                <Input
                                    placeholder="서울시 강남구..."
                                    value={data.sellerAddress}
                                    onChange={(e) => handleChange('sellerAddress', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-[#D4AF37]">양수인 (구매자) 정보</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">이름</Label>
                                    <Input
                                        placeholder="김철수"
                                        value={data.buyerName}
                                        onChange={(e) => handleChange('buyerName', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">생년월일</Label>
                                    <Input
                                        type="date"
                                        value={data.buyerBirthDate}
                                        onChange={(e) => handleChange('buyerBirthDate', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">연락처</Label>
                                    <Input
                                        placeholder="010-9876-5432"
                                        value={data.buyerPhone}
                                        onChange={(e) => handleChange('buyerPhone', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">주소</Label>
                                <Input
                                    placeholder="서울시 서초구..."
                                    value={data.buyerAddress}
                                    onChange={(e) => handleChange('buyerAddress', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                        </div>

                        {/* Gecko Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-[#D4AF37]">개체 정보</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">개체 이름</Label>
                                    <Input
                                        placeholder="Luna"
                                        value={data.geckoName}
                                        onChange={(e) => handleChange('geckoName', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">모프 (Morph)</Label>
                                    <Input
                                        placeholder="Lilly White Extreme Harlequin"
                                        value={data.geckoMorph}
                                        onChange={(e) => handleChange('geckoMorph', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">해칭일 (출생일)</Label>
                                    <Input
                                        type="date"
                                        value={data.geckoHatchDate}
                                        onChange={(e) => handleChange('geckoHatchDate', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">성별</Label>
                                    <Select
                                        value={data.geckoGender}
                                        onValueChange={(value) => handleChange('geckoGender', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                            <SelectValue placeholder="선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">수컷 (Male)</SelectItem>
                                            <SelectItem value="female">암컷 (Female)</SelectItem>
                                            <SelectItem value="unsexed">미확인</SelectItem>
                                            <SelectItem value="unknown">확인불가 (유체)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">양도가 (원)</Label>
                                <Input
                                    type="number"
                                    placeholder="500000"
                                    value={data.geckoPrice}
                                    onChange={(e) => handleChange('geckoPrice', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">특징 / 비고</Label>
                                <Textarea
                                    placeholder="체중 45g, 건강 상태 양호, 식욕 왕성..."
                                    value={data.geckoFeatures}
                                    onChange={(e) => handleChange('geckoFeatures', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                                />
                            </div>
                        </div>

                        {/* Special Terms */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">특약 사항</Label>
                            <Textarea
                                placeholder="예: 양도 후 7일간 폐사 시 무상 교환, 사육환경 점검 필수 등..."
                                value={data.specialTerms}
                                onChange={(e) => handleChange('specialTerms', e.target.value)}
                                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                            />
                            <p className="text-xs text-zinc-500">* 양도인과 양수인 간의 특별 합의 사항을 기재하세요.</p>
                        </div>
                    </div>

                    {/* Right: Preview - Hidden on mobile, shown on lg+ */}
                    <div className="hidden lg:block bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                        <h2 className="text-base sm:text-lg font-semibold text-white border-b border-zinc-800 pb-4 mb-6">
                            미리보기
                        </h2>

                        {/* A4 Preview Container */}
                        <div className="flex justify-center">
                            <div
                                ref={previewRef}
                                className="w-full max-w-[210mm] bg-white text-black p-8 shadow-xl"
                                style={{
                                    aspectRatio: '210 / 297',
                                    fontFamily: '"Malgun Gothic", sans-serif',
                                    fontSize: '12px',
                                    lineHeight: '1.6',
                                }}
                            >
                                {/* Watermark */}
                                <div className="text-center mb-4 opacity-30">
                                    <div className="text-2xl font-bold tracking-widest text-gray-400">CRESTIA</div>
                                </div>

                                {/* Title */}
                                <h1 className="text-center text-xl font-bold mb-6 border-b-2 border-black pb-2">
                                    크레스티드 게코 양도양수 계약서
                                </h1>

                                {/* Contract Body */}
                                <div className="space-y-4 text-sm">
                                    <p>
                                        아래 당사자들은 {formatDate(data.transactionDate)}에 다음과 같이
                                        크레스티드 게코의 소유권 이전에 관한 계약을 체결한다.
                                    </p>

                                    {/* Article 1 */}
                                    <div>
                                        <h3 className="font-bold mb-1">제1조 (목적)</h3>
                                        <p>
                                            본 계약은 &quot;갑&quot;이 소유한 크레스티드 게코(이하 &quot;개체&quot;라 함)를 &quot;을&quot;에게
                                            양도함에 있어 필요한 제반 사항을 정함을 목적으로 한다.
                                        </p>
                                    </div>

                                    {/* Article 2 */}
                                    <div>
                                        <h3 className="font-bold mb-1">제2조 (개체 정보)</h3>
                                        <table className="w-full border-collapse border border-gray-400 text-xs">
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 w-20 font-bold">이름</td>
                                                    <td className="border border-gray-400 p-1">{data.geckoName || '_________________'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">모프</td>
                                                    <td className="border border-gray-400 p-1">{data.geckoMorph || '_________________'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">해칭일</td>
                                                    <td className="border border-gray-400 p-1">{formatDate(data.geckoHatchDate)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">성별</td>
                                                    <td className="border border-gray-400 p-1">{getGenderText(data.geckoGender)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">양도가</td>
                                                    <td className="border border-gray-400 p-1">₩ {formatPrice(data.geckoPrice)} 원</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">특징</td>
                                                    <td className="border border-gray-400 p-1">{data.geckoFeatures || '_________________'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Article 3 */}
                                    <div>
                                        <h3 className="font-bold mb-1">제3조 (대금 및 지급)</h3>
                                        <p>
                                            &quot;을&quot;은 본 계약 체결과 동시에 양도 대금 금 {formatPrice(data.geckoPrice)}원 정을
                                            &quot;갑&quot;에게 지급한다.
                                        </p>
                                    </div>

                                    {/* Special Terms - Always show */}
                                    <div>
                                        <h3 className="font-bold mb-1">제4조 (특약 사항)</h3>
                                        <p className="whitespace-pre-wrap">{data.specialTerms || '없음'}</p>
                                    </div>

                                    {/* Agreement */}
                                    <p className="mt-6 text-center text-xs">
                                        위 계약을 증명하기 위하여 본 계약서 2통을 작성하여 각자 서명 날인 후 1통씩 보관한다.
                                    </p>

                                    {/* Date */}
                                    <p className="text-center font-bold mt-4">
                                        {formatDate(data.transactionDate)}
                                    </p>
                                </div>

                                {/* Signature Section */}
                                <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
                                    {/* Seller */}
                                    <div className="space-y-2">
                                        <div className="font-bold text-center mb-3">[갑] 양도인</div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">성명:</span>
                                            <span className="flex-1 border-b border-gray-400">{data.sellerName || ''}</span>
                                            <span className="ml-2">(인)</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">생년월일:</span>
                                            <span className="flex-1 border-b border-gray-400">{formatDate(data.sellerBirthDate)}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">연락처:</span>
                                            <span className="flex-1 border-b border-gray-400">{data.sellerPhone || ''}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">주소:</span>
                                            <span className="flex-1 border-b border-gray-400 text-[10px]">{data.sellerAddress || ''}</span>
                                        </div>
                                    </div>

                                    {/* Buyer */}
                                    <div className="space-y-2">
                                        <div className="font-bold text-center mb-3">[을] 양수인</div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">성명:</span>
                                            <span className="flex-1 border-b border-gray-400">{data.buyerName || ''}</span>
                                            <span className="ml-2">(인)</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">생년월일:</span>
                                            <span className="flex-1 border-b border-gray-400">{formatDate(data.buyerBirthDate)}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">연락처:</span>
                                            <span className="flex-1 border-b border-gray-400">{data.buyerPhone || ''}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">주소:</span>
                                            <span className="flex-1 border-b border-gray-400 text-[10px]">{data.buyerAddress || ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 text-center text-[10px] text-gray-400 opacity-50">
                                    Generated by Crestia - Premium Gecko Pedigree Platform
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
