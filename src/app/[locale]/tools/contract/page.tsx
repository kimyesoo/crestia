'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, FileDown, Printer, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ContractData {
    transactionDate: string;
    sellerName: string;
    sellerPhone: string;
    sellerAddress: string;
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    geckoMorph: string;
    geckoGender: string;
    geckoPrice: string;
    geckoFeatures: string;
    specialTerms: string;
}

const initialData: ContractData = {
    transactionDate: new Date().toISOString().split('T')[0],
    sellerName: '',
    sellerPhone: '',
    sellerAddress: '',
    buyerName: '',
    buyerPhone: '',
    buyerAddress: '',
    geckoMorph: '',
    geckoGender: '',
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
                <title>분양 계약서 - Crestia</title>
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

    const handleDownloadPDF = async () => {
        const printContent = previewRef.current;
        if (!printContent) return;

        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(printContent, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`분양계약서_${data.transactionDate || 'draft'}.pdf`);
        } catch (error) {
            console.error('PDF 생성 오류:', error);
            alert('PDF 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGeneratingPDF(false);
        }
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

    return (
        <div className="bg-background">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/tools" className="text-zinc-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">분양 계약서 생성기</h1>
                            <p className="text-sm text-zinc-500">Sales Contract Generator</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} variant="outline" className="gap-2">
                            <Printer className="w-4 h-4" />
                            인쇄하기
                        </Button>
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPDF}
                            className="gap-2 bg-[#D4AF37] hover:bg-[#C5A028] text-black"
                        >
                            {isGeneratingPDF ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileDown className="w-4 h-4" />
                            )}
                            {isGeneratingPDF ? 'PDF 생성 중...' : 'PDF 다운로드'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Input Form */}
                    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4">
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
                            <h3 className="text-sm font-medium text-[#D4AF37]">판매자 (양도인) 정보</h3>
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
                            <h3 className="text-sm font-medium text-[#D4AF37]">구매자 (양수인) 정보</h3>
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
                                    <Label className="text-zinc-300">모프 (Morph)</Label>
                                    <Input
                                        placeholder="Lilly White Extreme Harlequin"
                                        value={data.geckoMorph}
                                        onChange={(e) => handleChange('geckoMorph', e.target.value)}
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
                                            <SelectItem value="unsexed">미확인 (Unsexed)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">분양가 (원)</Label>
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
                                    placeholder="체중 45g, 약 12개월, 건강 상태 양호..."
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
                                placeholder="분양 후 7일간 폐사 무상 교환..."
                                value={data.specialTerms}
                                onChange={(e) => handleChange('specialTerms', e.target.value)}
                                className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                            />
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                        <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4 mb-6">
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
                                    도마뱀붙이 분양 계약서
                                </h1>

                                {/* Contract Body */}
                                <div className="space-y-4 text-sm">
                                    <p>
                                        아래 당사자들은 {formatDate(data.transactionDate)}에 다음과 같이
                                        도마뱀붙이의 소유권 이전에 관한 계약을 체결한다.
                                    </p>

                                    {/* Article 1 */}
                                    <div>
                                        <h3 className="font-bold mb-1">제1조 (목적)</h3>
                                        <p>
                                            본 계약은 "갑"이 소유한 도마뱀붙이(이하 "개체"라 함)를 "을"에게
                                            양도함에 있어 필요한 제반 사항을 정함을 목적으로 한다.
                                        </p>
                                    </div>

                                    {/* Article 2 */}
                                    <div>
                                        <h3 className="font-bold mb-1">제2조 (개체 정보)</h3>
                                        <table className="w-full border-collapse border border-gray-400 text-xs">
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 w-24 font-bold">모프</td>
                                                    <td className="border border-gray-400 p-1">{data.geckoMorph || '_________________'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">성별</td>
                                                    <td className="border border-gray-400 p-1">
                                                        {data.geckoGender === 'male' ? '수컷' :
                                                            data.geckoGender === 'female' ? '암컷' :
                                                                data.geckoGender === 'unsexed' ? '미확인' : '_____'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-400 bg-gray-100 p-1 font-bold">분양가</td>
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
                                            "을"은 본 계약 체결과 동시에 분양 대금 금 {formatPrice(data.geckoPrice)}원 정을
                                            "갑"에게 지급한다.
                                        </p>
                                    </div>

                                    {/* Special Terms */}
                                    {data.specialTerms && (
                                        <div>
                                            <h3 className="font-bold mb-1">제4조 (특약 사항)</h3>
                                            <p className="whitespace-pre-wrap">{data.specialTerms}</p>
                                        </div>
                                    )}

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
                                        <div className="font-bold text-center mb-3">[갑] 양도인 (판매자)</div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">성명:</span>
                                            <span className="flex-1 border-b border-gray-400">{data.sellerName || ''}</span>
                                            <span className="ml-2">(인)</span>
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
                                        <div className="font-bold text-center mb-3">[을] 양수인 (구매자)</div>
                                        <div className="flex">
                                            <span className="w-16 font-bold">성명:</span>
                                            <span className="flex-1 border-b border-gray-400">{data.buyerName || ''}</span>
                                            <span className="ml-2">(인)</span>
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
