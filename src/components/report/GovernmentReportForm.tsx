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

    // --- Styles using box-shadow for borders (html2canvas compatible) ---
    const fontMain = '"Batang", "BatangChe", "Malgun Gothic", serif';

    // Use box-shadow instead of border for better html2canvas support
    const cellBorder = 'inset 0 0 0 1px #000000';
    const thickBorder = 'inset 0 0 0 2px #000000';

    const baseCell: React.CSSProperties = {
        padding: '8px',
        fontFamily: fontMain,
        fontSize: '11px',
        color: '#000000',
        backgroundColor: '#ffffff',
        boxShadow: cellBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        minHeight: '28px',
    };

    const grayCell: React.CSSProperties = {
        ...baseCell,
        backgroundColor: '#dcdcdc',
    };

    const thickCell: React.CSSProperties = {
        ...baseCell,
        boxShadow: thickBorder,
    };

    const thickGrayCell: React.CSSProperties = {
        ...grayCell,
        boxShadow: thickBorder,
    };

    const row: React.CSSProperties = {
        display: 'flex',
        width: '100%',
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width: '210mm',
                minHeight: '297mm',
                padding: '15mm',
                fontFamily: fontMain,
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#000000',
            }}
        >
            {/* 1. Header */}
            <div style={{ fontSize: '10px', marginBottom: '8px', fontWeight: 'bold', color: '#000000' }}>
                ■ 야생생물 보호 및 관리에 관한 법률 시행규칙 [별지 제31호의9서식]
            </div>

            {/* 2. Title */}
            <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ] 양도 [ {isYangsu ? '√' : ' '} ] 양수 [ {isBogan ? '√' : ' '} ] 보관 신고서(신고확인증)
            </h1>

            {/* 3. Note */}
            <div style={{ fontSize: '10px', marginBottom: '8px', color: '#000000' }}>
                ※ 색상이 어두운 칸은 신고인이 작성하지 않으며, [ ]에는 해당되는 곳에 √표시를 합니다.
            </div>

            {/* 4. Receipt Header Row */}
            <div style={row}>
                <div style={{ ...thickGrayCell, width: '15%' }}>접수번호</div>
                <div style={{ ...thickGrayCell, width: '25%' }}></div>
                <div style={{ ...thickGrayCell, width: '15%' }}>접수일</div>
                <div style={{ ...thickGrayCell, width: '25%' }}></div>
                <div style={{ ...thickGrayCell, width: '12%' }}>처리기간</div>
                <div style={{ ...thickGrayCell, width: '8%' }}>7일</div>
            </div>

            {/* 5. 양도인 Row 1 */}
            <div style={row}>
                <div style={{ ...thickGrayCell, width: '13%', minHeight: '32px' }}>양도인</div>
                <div style={{ ...thickCell, width: '12%' }}>상호(성명)</div>
                <div style={{ ...thickCell, width: '35%', justifyContent: 'flex-start' }}>{isYangdo ? reportInfo.name : ''}</div>
                <div style={{ ...thickCell, width: '12%' }}>연락처</div>
                <div style={{ ...thickCell, width: '28%', justifyContent: 'flex-start' }}>{isYangdo ? reportInfo.contact : ''}</div>
            </div>

            {/* 5. 양도인 Row 2 */}
            <div style={row}>
                <div style={{ ...grayCell, width: '13%' }}></div>
                <div style={{ ...baseCell, width: '12%' }}>주소</div>
                <div style={{ ...baseCell, width: '75%', justifyContent: 'flex-start' }}>{isYangdo ? reportInfo.address : ''}</div>
            </div>

            {/* 6. 양수인(보관인) Row 1 */}
            <div style={row}>
                <div style={{ ...thickGrayCell, width: '13%', minHeight: '32px', flexDirection: 'column', fontSize: '10px' }}>
                    <span>양수인</span>
                    <span>(보관인)</span>
                </div>
                <div style={{ ...thickCell, width: '12%' }}>상호(성명)</div>
                <div style={{ ...thickCell, width: '35%', justifyContent: 'flex-start' }}>{!isYangdo ? reportInfo.name : ''}</div>
                <div style={{ ...thickCell, width: '12%' }}>연락처</div>
                <div style={{ ...thickCell, width: '28%', justifyContent: 'flex-start' }}>{!isYangdo ? reportInfo.contact : ''}</div>
            </div>

            {/* 6. 양수인(보관인) Row 2 */}
            <div style={row}>
                <div style={{ ...grayCell, width: '13%' }}></div>
                <div style={{ ...baseCell, width: '12%' }}>주소</div>
                <div style={{ ...baseCell, width: '75%', justifyContent: 'flex-start' }}>{!isYangdo ? reportInfo.address : ''}</div>
            </div>

            {/* 7. 야생동물 정보 Header */}
            <div style={row}>
                <div style={{ ...thickGrayCell, width: '13%', minHeight: '70px', flexDirection: 'column', fontSize: '10px', lineHeight: '1.3' }}>
                    <span style={{ fontWeight: 'bold' }}>지정관리</span>
                    <span style={{ fontWeight: 'bold' }}>야생동물</span>
                    <span style={{ fontWeight: 'bold' }}>정보</span>
                    <span style={{ fontSize: '8px', color: '#666', marginTop: '4px' }}>※ 기재내용이</span>
                    <span style={{ fontSize: '8px', color: '#666' }}>많은 경우 별</span>
                    <span style={{ fontSize: '8px', color: '#666' }}>지로 작성</span>
                </div>
                <div style={{ ...thickCell, width: '27%', fontWeight: 'bold' }}>학명</div>
                <div style={{ ...thickCell, width: '12%', fontWeight: 'bold' }}>수량</div>
                <div style={{ ...thickCell, width: '18%', fontWeight: 'bold' }}>용도</div>
                <div style={{ ...thickCell, width: '30%', fontWeight: 'bold' }}>양도사유(보관사유)</div>
            </div>

            {/* 7. 야생동물 정보 Data Rows */}
            {filledData.map((r, idx) => (
                <div key={idx} style={row}>
                    <div style={{ ...grayCell, width: '13%' }}></div>
                    <div style={{ ...baseCell, width: '27%', justifyContent: 'flex-start', fontStyle: 'italic' }}>
                        {r['학명'] || r['Scientific Name'] || r['학명(자동생성)'] || ''}
                    </div>
                    <div style={{ ...baseCell, width: '12%' }}>
                        {r['수량'] || (r['학명'] ? 1 : '')}
                    </div>
                    <div style={{ ...baseCell, width: '18%' }}>
                        {r['학명'] ? '반려용' : ''}
                    </div>
                    <div style={{ ...baseCell, width: '30%', justifyContent: 'flex-start' }}>
                        {r['학명'] ? reportInfo.reason : ''}
                    </div>
                </div>
            ))}

            {/* 8. Declaration */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', lineHeight: '1.6', color: '#000000' }}>
                「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에<br />
                따라 위와 같이 지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고합니다.
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '14px', color: '#000000' }}>
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', paddingRight: '40px', fontSize: '12px', color: '#000000' }}>
                <span style={{ marginRight: '24px' }}>신고인</span>
                <span style={{ marginRight: '24px', fontWeight: 'bold' }}>{reportInfo.name}</span>
                <span>(서명 또는 인)</span>
            </div>

            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '20px', color: '#000000' }}>
                시장 · 군수 · 구청장 <span style={{ fontSize: '12px', fontWeight: 'normal' }}>귀하</span>
            </div>

            {/* 9. Cut Line */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <div style={{ borderTop: '1px dashed #000000', flex: 1 }}></div>
                <div style={{ margin: '0 16px', fontSize: '11px', color: '#000000' }}>자르는 선</div>
                <div style={{ borderTop: '1px dashed #000000', flex: 1 }}></div>
            </div>

            {/* 10. Certificate */}
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>제 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 호</div>

            <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#000000' }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ]양도 [ {isYangsu ? '√' : ' '} ]양수 [ {isBogan ? '√' : ' '} ]보관 신고확인증
            </h2>

            <div style={{ textAlign: 'center', fontSize: '12px', lineHeight: '1.6', color: '#000000', marginBottom: '16px' }}>
                「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에 따라<br />
                지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고하였음을 확인합니다.
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '14px', color: '#000000' }}>
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            {/* 11. Seal */}
            <div style={{ position: 'relative', textAlign: 'right', paddingRight: '24px', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>시장 · 군수 · 구청장</span>
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

            {/* 12. Processing Flow */}
            <div style={{ borderTop: '1px solid #000', paddingTop: '12px' }}>
                <div style={{ textAlign: 'center', fontSize: '11px', marginBottom: '8px' }}>처리절차</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>
                    <div style={{ boxShadow: cellBorder, padding: '6px 12px', backgroundColor: '#fff' }}>신고서 작성</div>
                    <span style={{ margin: '0 6px' }}>→</span>
                    <div style={{ boxShadow: cellBorder, padding: '6px 12px', backgroundColor: '#fff' }}>접수</div>
                    <span style={{ margin: '0 6px' }}>→</span>
                    <div style={{ boxShadow: cellBorder, padding: '6px 12px', backgroundColor: '#fff' }}>검토</div>
                    <span style={{ margin: '0 6px' }}>→</span>
                    <div style={{ boxShadow: cellBorder, padding: '6px 12px', backgroundColor: '#fff' }}>결재</div>
                    <span style={{ margin: '0 6px' }}>→</span>
                    <div style={{ boxShadow: cellBorder, padding: '6px 12px', backgroundColor: '#fff', textAlign: 'center' }}>신고확인증<br />작성·발급</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '9px', marginTop: '4px', color: '#666' }}>
                    <span style={{ marginRight: '60px' }}>신고인</span>
                    <span>처리기관: 시 · 군 · 구</span>
                </div>
            </div>
        </div>
    );
});

GovernmentReportForm.displayName = 'GovernmentReportForm';
