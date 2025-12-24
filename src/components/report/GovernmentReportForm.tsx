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

    // Inline styles
    const font = '"Batang", "BatangChe", "Malgun Gothic", serif';

    // Cell styles with INLINE border for each side
    const td: React.CSSProperties = {
        borderTop: '1px solid #000',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        borderLeft: '1px solid #000',
        padding: '6px 8px',
        fontFamily: font,
        fontSize: '11px',
        color: '#000',
        backgroundColor: '#fff',
        textAlign: 'center',
        verticalAlign: 'middle',
    };

    const gray: React.CSSProperties = {
        ...td,
        backgroundColor: '#dcdcdc',
    };

    const thickTd: React.CSSProperties = {
        ...td,
        borderTop: '2px solid #000',
    };

    const thickGray: React.CSSProperties = {
        ...gray,
        borderTop: '2px solid #000',
    };

    const left: React.CSSProperties = { textAlign: 'left' };

    return (
        <div
            ref={ref}
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '15mm',
                fontFamily: font,
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box',
            }}
        >
            {/* Header */}
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>
                ■ 야생생물 보호 및 관리에 관한 법률 시행규칙 [별지 제31호의9서식]
            </div>

            {/* Title */}
            <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ] 양도 [ {isYangsu ? '√' : ' '} ] 양수 [ {isBogan ? '√' : ' '} ] 보관 신고서(신고확인증)
            </h1>

            {/* Note */}
            <div style={{ fontSize: '10px', marginBottom: '8px' }}>
                ※ 색상이 어두운 칸은 신고인이 작성하지 않으며, [ ]에는 해당되는 곳에 √표시를 합니다.
            </div>

            {/* Table 1: Receipt */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
                <tbody>
                    <tr>
                        <td style={{ ...thickGray, width: '15%' }}>접수번호</td>
                        <td style={{ ...thickGray, width: '25%' }}>&nbsp;</td>
                        <td style={{ ...thickGray, width: '15%' }}>접수일</td>
                        <td style={{ ...thickGray, width: '25%' }}>&nbsp;</td>
                        <td style={{ ...thickGray, width: '12%' }}>처리기간</td>
                        <td style={{ ...thickGray, width: '8%' }}>7일</td>
                    </tr>
                </tbody>
            </table>

            {/* Table 2: 양도인 */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
                <tbody>
                    <tr>
                        <td style={{ ...thickGray, width: '13%' }} rowSpan={2}>양도인</td>
                        <td style={{ ...thickTd, width: '12%' }}>상호(성명)</td>
                        <td style={{ ...thickTd, width: '35%', ...left }}>{isYangdo ? reportInfo.name : ''}</td>
                        <td style={{ ...thickTd, width: '12%' }}>연락처</td>
                        <td style={{ ...thickTd, width: '28%', ...left }}>{isYangdo ? reportInfo.contact : ''}</td>
                    </tr>
                    <tr>
                        <td style={td}>주소</td>
                        <td colSpan={3} style={{ ...td, ...left }}>{isYangdo ? reportInfo.address : ''}</td>
                    </tr>
                </tbody>
            </table>

            {/* Table 3: 양수인(보관인) */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
                <tbody>
                    <tr>
                        <td style={{ ...thickGray, width: '13%' }} rowSpan={2}>양수인<br />(보관인)</td>
                        <td style={{ ...thickTd, width: '12%' }}>상호(성명)</td>
                        <td style={{ ...thickTd, width: '35%', ...left }}>{!isYangdo ? reportInfo.name : ''}</td>
                        <td style={{ ...thickTd, width: '12%' }}>연락처</td>
                        <td style={{ ...thickTd, width: '28%', ...left }}>{!isYangdo ? reportInfo.contact : ''}</td>
                    </tr>
                    <tr>
                        <td style={td}>주소</td>
                        <td colSpan={3} style={{ ...td, ...left }}>{!isYangdo ? reportInfo.address : ''}</td>
                    </tr>
                </tbody>
            </table>

            {/* Table 4: 야생동물 정보 */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
                <tbody>
                    <tr>
                        <td style={{ ...thickGray, width: '13%', fontSize: '10px', lineHeight: '1.3' }} rowSpan={filledData.length + 1}>
                            <div style={{ fontWeight: 'bold' }}>지정관리</div>
                            <div style={{ fontWeight: 'bold' }}>야생동물</div>
                            <div style={{ fontWeight: 'bold' }}>정보</div>
                            <div style={{ fontSize: '8px', color: '#666', marginTop: '4px' }}>※ 기재내용이</div>
                            <div style={{ fontSize: '8px', color: '#666' }}>많은 경우 별</div>
                            <div style={{ fontSize: '8px', color: '#666' }}>지로 작성</div>
                        </td>
                        <td style={{ ...thickTd, width: '27%', fontWeight: 'bold' }}>학명</td>
                        <td style={{ ...thickTd, width: '12%', fontWeight: 'bold' }}>수량</td>
                        <td style={{ ...thickTd, width: '18%', fontWeight: 'bold' }}>용도</td>
                        <td style={{ ...thickTd, width: '30%', fontWeight: 'bold' }}>양도사유(보관사유)</td>
                    </tr>
                    {filledData.map((r, i) => (
                        <tr key={i}>
                            <td style={{ ...td, fontStyle: 'italic', ...left }}>{r['학명'] || r['학명(자동생성)'] || ''}</td>
                            <td style={td}>{r['수량'] || (r['학명'] ? 1 : '')}</td>
                            <td style={td}>{r['학명'] ? '반려용' : ''}</td>
                            <td style={{ ...td, ...left }}>{r['학명'] ? reportInfo.reason : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Declaration */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', lineHeight: '1.6' }}>
                「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에<br />
                따라 위와 같이 지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고합니다.
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '14px' }}>
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', paddingRight: '40px', fontSize: '12px' }}>
                <span style={{ marginRight: '24px' }}>신고인</span>
                <span style={{ marginRight: '24px', fontWeight: 'bold' }}>{reportInfo.name}</span>
                <span>(서명 또는 인)</span>
            </div>

            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
                시장 · 군수 · 구청장 <span style={{ fontSize: '12px', fontWeight: 'normal' }}>귀하</span>
            </div>

            {/* Cut Line */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <div style={{ borderTop: '1px dashed #000', flex: 1 }}></div>
                <div style={{ margin: '0 16px', fontSize: '11px' }}>자르는 선</div>
                <div style={{ borderTop: '1px dashed #000', flex: 1 }}></div>
            </div>

            {/* Certificate */}
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>제 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 호</div>

            <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ]양도 [ {isYangsu ? '√' : ' '} ]양수 [ {isBogan ? '√' : ' '} ]보관 신고확인증
            </h2>

            <div style={{ textAlign: 'center', fontSize: '12px', lineHeight: '1.6', marginBottom: '16px' }}>
                「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에 따라<br />
                지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고하였음을 확인합니다.
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '14px' }}>
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            {/* Seal */}
            <div style={{ position: 'relative', textAlign: 'right', paddingRight: '24px', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>시장 · 군수 · 구청장</span>
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '-10px',
                    width: '45px',
                    height: '45px',
                    border: '2px solid #e11d48',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    opacity: 0.7,
                    color: '#e11d48'
                }}>직인</div>
            </div>

            <div style={{ fontSize: '12px', marginBottom: '16px' }}>귀하</div>

            {/* Processing Flow */}
            <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '1px solid #000' }}>
                <tbody>
                    <tr>
                        <td colSpan={9} style={{ textAlign: 'center', fontSize: '11px', padding: '8px 0 4px', border: 'none' }}>처리절차</td>
                    </tr>
                    <tr style={{ fontSize: '10px' }}>
                        <td style={td}>신고서 작성</td>
                        <td style={{ border: 'none', textAlign: 'center' }}>→</td>
                        <td style={td}>접수</td>
                        <td style={{ border: 'none', textAlign: 'center' }}>→</td>
                        <td style={td}>검토</td>
                        <td style={{ border: 'none', textAlign: 'center' }}>→</td>
                        <td style={td}>결재</td>
                        <td style={{ border: 'none', textAlign: 'center' }}>→</td>
                        <td style={td}>신고확인증<br />작성·발급</td>
                    </tr>
                    <tr>
                        <td colSpan={4} style={{ border: 'none', fontSize: '9px', color: '#666', textAlign: 'center', paddingTop: '4px' }}>신고인</td>
                        <td colSpan={5} style={{ border: 'none', fontSize: '9px', color: '#666', textAlign: 'center', paddingTop: '4px' }}>처리기관: 시 · 군 · 구</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

GovernmentReportForm.displayName = 'GovernmentReportForm';
