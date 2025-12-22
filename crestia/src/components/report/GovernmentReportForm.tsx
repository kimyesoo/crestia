import React, { forwardRef } from 'react';

interface ReportInfo {
    type: string;
    name: string;
    contact: string;
    address: string;
    reason: string;
}

interface GovernmentReportFormProps {
    reportInfo: ReportInfo;
    data: any[];
}

export const GovernmentReportForm = forwardRef<HTMLDivElement, GovernmentReportFormProps>(({ reportInfo, data }, ref) => {
    const isYangdo = reportInfo.type === '양도';
    const isYangsu = reportInfo.type === '양수';
    const isBogan = reportInfo.type === '보관' || (!isYangdo && !isYangsu);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const minRows = 5;
    const filledData = [...data];
    while (filledData.length < minRows) {
        filledData.push({});
    }

    // --- Visual Constants to match the Reference Image ---
    const fontMain = '"Batang", "BatangChe", "Malgun Gothic", serif';
    const borderBlack = '1px solid #000000';
    const borderThick = '2px solid #000000'; // The top/bottom heavy lines
    const borderDouble = '3px double #000000'; // Section separators
    const bgHeader = '#dcdcdc'; // Light gray for headers

    // Base Cell Style
    const cellBase: React.CSSProperties = {
        border: borderBlack,
        padding: '0 4px',
        fontFamily: fontMain,
        fontSize: '11px', // 10-11px seems to match the tight print look
        verticalAlign: 'middle',
        boxSizing: 'border-box',
    };

    const cellCenter: React.CSSProperties = {
        ...cellBase,
        textAlign: 'center',
    };

    const cellLabel: React.CSSProperties = {
        ...cellCenter,
        backgroundColor: bgHeader,
        fontWeight: 'normal', // Official forms often use normal weight for labels, but visual weight comes from font
    };

    return (
        <div
            ref={ref}
            className="relative bg-white text-black"
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm 15mm', // Standard Margin
                fontFamily: fontMain,
                boxSizing: 'border-box',
                color: '#000000'
            }}
        >
            {/* 1. Document Header Info */}
            <div className="text-[10px] mb-2 font-bold" style={{ letterSpacing: '-0.5px' }}>
                ■ 야생생물 보호 및 관리에 관한 법률 시행규칙 [별지 제31호의9서식]
            </div>

            {/* 2. Main Title */}
            <h1 className="text-center text-[20px] font-bold tracking-tight mb-2" style={{ lineHeight: '1.2' }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ] 양도 [ {isYangsu ? '√' : ' '} ] 양수 [ {isBogan ? '√' : ' '} ] 보관 신고서(신고확인증)
            </h1>

            {/* 3. Instructions */}
            <div className="text-[10px] mb-1 text-left" style={{ letterSpacing: '-0.5px' }}>
                ※ 색상이 어두운 칸은 신고인이 작성하지 않으며, [ ]에는 해당되는 곳에 √표시를 합니다.
            </div>

            {/* 4. Receipt Header Table (Thick Top, Double Bottom) */}
            <table className="w-full border-collapse" style={{ borderTop: borderThick, borderBottom: borderDouble }}>
                <colgroup>
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '27%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '27%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '7%' }} />
                </colgroup>
                <tbody>
                    <tr style={{ height: '32px' }}>
                        <td style={cellLabel}>접수번호</td>
                        <td style={{ ...cellBase, backgroundColor: bgHeader }}></td> {/* Dark input */}
                        <td style={cellLabel}>접수일</td>
                        <td style={{ ...cellBase, backgroundColor: bgHeader }}></td> {/* Dark input */}
                        <td style={cellLabel}>처리기간</td>
                        <td style={{ ...cellCenter, backgroundColor: bgHeader }}>7일</td>
                    </tr>
                </tbody>
            </table>

            {/* 5. Person Info Tables */}
            <table className="w-full border-collapse" style={{ marginTop: '2px', borderTop: borderBlack }}>
                <colgroup>
                    <col style={{ width: '13%' }} /> {/* Role Label */}
                    <col style={{ width: '13%' }} /> {/* Field Label */}
                    <col style={{ width: '44%' }} /> {/* Field Input */}
                    <col style={{ width: '10%' }} /> {/* Phone Label */}
                    <col style={{ width: '20%' }} /> {/* Phone Input */}
                </colgroup>
                <tbody>
                    {/* Yangdoin Section */}
                    <tr style={{ height: '30px' }}>
                        <td rowSpan={2} style={cellLabel}>양도인</td>
                        <td style={{ ...cellBase, textAlign: 'center' }}>상호(성명)</td>
                        <td style={cellBase}>{isYangdo ? reportInfo.name : ''}</td>
                        <td style={{ ...cellBase, textAlign: 'center' }}>연락처</td>
                        <td style={cellBase}>{isYangdo ? reportInfo.contact : ''}</td>
                    </tr>
                    <tr style={{ height: '30px' }}>
                        <td style={{ ...cellBase, textAlign: 'center' }}>주소</td>
                        <td colSpan={3} style={cellBase}>{isYangdo ? reportInfo.address : ''}</td>
                    </tr>

                    {/* Separator Row (Double Line) */}
                    <tr style={{ height: '4px', border: 'none' }}>
                        <td colSpan={5} style={{ borderLeft: 'none', borderRight: 'none', borderTop: borderDouble, borderBottom: 'none', height: '4px', padding: 0 }}></td>
                    </tr>

                    {/* Yangsuin Section */}
                    <tr style={{ height: '30px' }}>
                        <td rowSpan={2} style={cellLabel}>
                            양수인<br />(보관인)
                        </td>
                        <td style={{ ...cellBase, textAlign: 'center' }}>상호(성명)</td>
                        <td style={cellBase}>{isYangdo ? '' : reportInfo.name}</td>
                        <td style={{ ...cellBase, textAlign: 'center' }}>연락처</td>
                        <td style={cellBase}>{isYangdo ? '' : reportInfo.contact}</td>
                    </tr>
                    <tr style={{ height: '30px' }}>
                        <td style={{ ...cellBase, textAlign: 'center' }}>주소</td>
                        <td colSpan={3} style={cellBase}>{isYangdo ? '' : reportInfo.address}</td>
                    </tr>
                </tbody>
            </table>

            {/* 6. Gecko List Table */}
            <table className="w-full border-collapse" style={{ marginTop: '2px', borderTop: borderDouble, borderBottom: borderBlack }}>
                <colgroup>
                    <col style={{ width: '13%' }} /> {/* Side Header */}
                    <col style={{ width: '27%' }} /> {/* Name */}
                    <col style={{ width: '13%' }} /> {/* Qty */}
                    <col style={{ width: '20%' }} /> {/* Purpose */}
                    <col style={{ width: '27%' }} /> {/* Reason */}
                </colgroup>
                <thead>
                    <tr style={{ height: '30px' }}>
                        <td rowSpan={Math.max(minRows, filledData.length) + 1} style={{ ...cellLabel, backgroundColor: '#ffffff', lineHeight: '1.4' }}>
                            <div className="flex flex-col items-center justify-center h-full">
                                <span className="mb-2 font-bold">지정관리<br />야생동물<br />정 미</span>
                                <span style={{ fontSize: '9px', fontWeight: 'normal', color: '#444' }}>
                                    ※ 기재내용이<br />많은 경우 별<br />지로 작성
                                </span>
                            </div>
                        </td>
                        <td style={cellCenter}>학명</td>
                        <td style={cellCenter}>수량</td>
                        <td style={cellCenter}>용도</td>
                        <td style={cellCenter}>양도사유(보관사유)</td>
                    </tr>
                </thead>
                <tbody>
                    {filledData.map((row, idx) => (
                        <tr key={idx} style={{ height: '28px' }}>
                            <td style={{ ...cellBase, textAlign: 'left', paddingLeft: '8px', fontStyle: 'italic' }}>
                                {row['학명'] || row['Scientific Name'] || row['학명(자동생성)'] || ''}
                            </td>
                            <td style={cellCenter}>
                                {row['수량'] || (row['학명'] ? 1 : '')}
                            </td>
                            <td style={cellCenter}>
                                {row['학명'] ? '반려용' : ''}
                            </td>
                            <td style={{ ...cellBase, textAlign: 'left', paddingLeft: '8px' }}>
                                {row['학명'] ? reportInfo.reason : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 7. Declaration */}
            <div className="mt-6 mb-4 text-center text-[12px] leading-relaxed">
                <p>
                    「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에<br />
                    따라 위와 같이 지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고합니다.
                </p>
            </div>

            <div className="text-center mb-6 text-[14px]">
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            <div className="flex justify-end items-center mb-6 pr-10 text-[12px]">
                <span className="mr-8">신고인</span>
                <span className="mr-8 font-bold">{reportInfo.name}</span>
                <span>(서명 또는 인)</span>
            </div>

            <div className="text-left font-bold text-[18px] mb-4">
                시장 · 군수 · 구청장 <span className="text-[14px] font-normal ml-2">귀하</span>
            </div>

            {/* 8. Cut Line */}
            <div className="flex items-center justify-center my-6">
                <div style={{ borderTop: '1px dashed #000', flexGrow: 1 }}></div>
                <div className="mx-4 text-[11px]">자르는 선</div>
                <div style={{ borderTop: '1px dashed #000', flexGrow: 1 }}></div>
            </div>

            {/* 9. Certificate Header */}
            <div className="text-[12px] mb-2">
                제 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 호
            </div>

            <h1 className="text-center text-[20px] font-bold tracking-tight mb-4">
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ]양도 [ {isYangsu ? '√' : ' '} ]양수 [ {isBogan ? '√' : ' '} ]보관 신고확인증
            </h1>

            <div className="mt-4 mb-8 text-center text-[12px] leading-relaxed px-4">
                <p>
                    「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에 따라<br />
                    지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고하였음을 확인합니다.
                </p>
            </div>

            <div className="text-center mb-10 text-[14px]">
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            {/* 10. Seal */}
            <div className="relative text-right pr-6 mb-8">
                <span className="font-bold text-[18px] mr-4">시장 · 군수 · 구청장</span>
                <div className="absolute right-0 top-[-15px] w-[60px] h-[60px] border-[3px] rounded-full flex items-center justify-center text-[12px] opacity-70" style={{ transform: 'rotate(-10deg)', borderColor: '#e11d48', color: '#e11d48' }}>
                    <div className="w-[40px] h-[40px] flex items-center justify-center rounded-sm" style={{ border: '1px solid #e11d48' }}>
                        직인
                    </div>
                </div>
            </div>

            <div className="text-left text-[12px] mb-4">귀하</div>

            {/* 11. Footer Flowchart */}
            <div className="border border-black bg-white">
                {/* Header Bar */}
                <div className="bg-[#dcdcdc] border-b border-black text-center py-1 text-[11px] font-bold">
                    처리절차
                </div>

                {/* Flow Diagram */}
                <div className="h-[70px] flex items-center justify-between px-6 text-[10px]">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-[80px] h-[35px] border border-black flex items-center justify-center bg-white mb-2">
                            신고서 작성
                        </div>
                    </div>
                    <span className="text-[14px] font-bold">→</span>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-[80px] h-[35px] border border-black flex items-center justify-center bg-white mb-2">
                            접수
                        </div>
                    </div>
                    <span className="text-[14px] font-bold">→</span>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-[80px] h-[35px] border border-black flex items-center justify-center bg-white mb-2">
                            검토
                        </div>
                    </div>
                    <span className="text-[14px] font-bold">→</span>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                        <div className="w-[80px] h-[35px] border border-black flex items-center justify-center bg-white mb-2">
                            결재
                        </div>
                    </div>
                    <span className="text-[14px] font-bold">→</span>

                    {/* Step 5 */}
                    <div className="flex flex-col items-center">
                        <div className="w-[90px] h-[35px] border border-black flex flex-col items-center justify-center bg-white leading-none mb-2">
                            <span>신고확인증</span>
                            <span>작성 · 발급</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Roles */}
                <div className="border-t border-black flex text-[9px]">
                    <div className="flex-1 py-1 text-center border-r border-black">신고인</div>
                    <div className="flex-[4] py-1 text-center">처리기관: 시 · 군 · 구</div>
                </div>
            </div>
            {/* Bottom thick line of the form logic */}
            <div style={{ borderBottom: borderThick }}></div>
        </div>
    );
});

GovernmentReportForm.displayName = 'GovernmentReportForm';
