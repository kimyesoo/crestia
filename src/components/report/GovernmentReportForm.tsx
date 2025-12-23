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

    // --- Visual Constants (ALL HEX colors - no Tailwind) ---
    const fontMain = '"Batang", "BatangChe", "Malgun Gothic", serif';
    const colorBlack = '#000000';
    const colorWhite = '#ffffff';
    const colorGray = '#dcdcdc';
    const colorDarkGray = '#444444';
    const colorRed = '#e11d48';

    const borderBlack = `1px solid ${colorBlack}`;
    const borderThick = `2px solid ${colorBlack}`;
    const borderDouble = `3px double ${colorBlack}`;

    // Base Cell Style
    const cellBase: React.CSSProperties = {
        border: borderBlack,
        padding: '0 4px',
        fontFamily: fontMain,
        fontSize: '11px',
        verticalAlign: 'middle',
        boxSizing: 'border-box',
        backgroundColor: colorWhite,
        color: colorBlack,
    };

    const cellCenter: React.CSSProperties = {
        ...cellBase,
        textAlign: 'center',
    };

    const cellLabel: React.CSSProperties = {
        ...cellCenter,
        backgroundColor: colorGray,
        fontWeight: 'normal',
    };

    // Flexbox helper styles (inline only, no Tailwind)
    const flexCenter: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const flexCol: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm 15mm',
                fontFamily: fontMain,
                boxSizing: 'border-box',
                backgroundColor: colorWhite,
                color: colorBlack,
            }}
        >
            {/* 1. Document Header Info */}
            <div style={{ fontSize: '10px', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '-0.5px', color: colorBlack }}>
                ■ 야생생물 보호 및 관리에 관한 법률 시행규칙 [별지 제31호의9서식]
            </div>

            {/* 2. Main Title */}
            <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px', marginBottom: '8px', lineHeight: '1.2', color: colorBlack }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ] 양도 [ {isYangsu ? '√' : ' '} ] 양수 [ {isBogan ? '√' : ' '} ] 보관 신고서(신고확인증)
            </h1>

            {/* 3. Instructions */}
            <div style={{ fontSize: '10px', marginBottom: '4px', textAlign: 'left', letterSpacing: '-0.5px', color: colorBlack }}>
                ※ 색상이 어두운 칸은 신고인이 작성하지 않으며, [ ]에는 해당되는 곳에 √표시를 합니다.
            </div>

            {/* 4. Receipt Header Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: borderThick, borderBottom: borderDouble }}>
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
                        <td style={{ ...cellBase, backgroundColor: colorGray }}></td>
                        <td style={cellLabel}>접수일</td>
                        <td style={{ ...cellBase, backgroundColor: colorGray }}></td>
                        <td style={cellLabel}>처리기간</td>
                        <td style={{ ...cellCenter, backgroundColor: colorGray }}>7일</td>
                    </tr>
                </tbody>
            </table>

            {/* 5. Person Info Tables */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2px', borderTop: borderBlack }}>
                <colgroup>
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '44%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <tbody>
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

                    <tr style={{ height: '4px', border: 'none' }}>
                        <td colSpan={5} style={{ borderLeft: 'none', borderRight: 'none', borderTop: borderDouble, borderBottom: 'none', height: '4px', padding: 0 }}></td>
                    </tr>

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
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2px', borderTop: borderDouble, borderBottom: borderBlack }}>
                <colgroup>
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '27%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '27%' }} />
                </colgroup>
                <thead>
                    <tr style={{ height: '30px' }}>
                        <td rowSpan={Math.max(minRows, filledData.length) + 1} style={{ ...cellLabel, backgroundColor: colorWhite, lineHeight: '1.4' }}>
                            <div style={{ ...flexCol, ...flexCenter, height: '100%' }}>
                                <span style={{ marginBottom: '8px', fontWeight: 'bold', color: colorBlack }}>지정관리<br />야생동물<br />정 미</span>
                                <span style={{ fontSize: '9px', fontWeight: 'normal', color: colorDarkGray }}>
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
            <div style={{ marginTop: '24px', marginBottom: '16px', textAlign: 'center', fontSize: '12px', lineHeight: '1.6', color: colorBlack }}>
                <p>
                    「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에<br />
                    따라 위와 같이 지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고합니다.
                </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px', color: colorBlack }}>
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px', paddingRight: '40px', fontSize: '12px', color: colorBlack }}>
                <span style={{ marginRight: '32px' }}>신고인</span>
                <span style={{ marginRight: '32px', fontWeight: 'bold' }}>{reportInfo.name}</span>
                <span>(서명 또는 인)</span>
            </div>

            <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: colorBlack }}>
                시장 · 군수 · 구청장 <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '8px' }}>귀하</span>
            </div>

            {/* 8. Cut Line */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0' }}>
                <div style={{ borderTop: `1px dashed ${colorBlack}`, flexGrow: 1 }}></div>
                <div style={{ margin: '0 16px', fontSize: '11px', color: colorBlack }}>자르는 선</div>
                <div style={{ borderTop: `1px dashed ${colorBlack}`, flexGrow: 1 }}></div>
            </div>

            {/* 9. Certificate Header */}
            <div style={{ fontSize: '12px', marginBottom: '8px', color: colorBlack }}>
                제 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 호
            </div>

            <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px', marginBottom: '16px', color: colorBlack }}>
                지정관리 야생동물 [ {isYangdo ? '√' : ' '} ]양도 [ {isYangsu ? '√' : ' '} ]양수 [ {isBogan ? '√' : ' '} ]보관 신고확인증
            </h1>

            <div style={{ marginTop: '16px', marginBottom: '32px', textAlign: 'center', fontSize: '12px', lineHeight: '1.6', padding: '0 16px', color: colorBlack }}>
                <p>
                    「야생생물 보호 및 관리에 관한 법률」 제22조의4제2항 전단 및 같은 법 시행규칙 제29조의6제1항에 따라<br />
                    지정관리 야생동물의 [ {isYangdo ? '√' : ' '} ]양도, [ {isYangsu ? '√' : ' '} ]양수, [ {isBogan ? '√' : ' '} ]보관을 신고하였음을 확인합니다.
                </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px', fontSize: '14px', color: colorBlack }}>
                {year}년 &nbsp; {month}월 &nbsp; {day}일
            </div>

            {/* 10. Seal */}
            <div style={{ position: 'relative', textAlign: 'right', paddingRight: '24px', marginBottom: '32px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '18px', marginRight: '16px', color: colorBlack }}>시장 · 군수 · 구청장</span>
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '-15px',
                    width: '60px',
                    height: '60px',
                    border: `3px solid ${colorRed}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    opacity: 0.7,
                    transform: 'rotate(-10deg)',
                    color: colorRed
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '2px',
                        border: `1px solid ${colorRed}`
                    }}>
                        직인
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'left', fontSize: '12px', marginBottom: '16px', color: colorBlack }}>귀하</div>

            {/* 11. Footer Flowchart */}
            <div style={{ border: borderBlack, backgroundColor: colorWhite }}>
                {/* Header Bar */}
                <div style={{ backgroundColor: colorGray, borderBottom: borderBlack, textAlign: 'center', padding: '4px 0', fontSize: '11px', fontWeight: 'bold', color: colorBlack }}>
                    처리절차
                </div>

                {/* Flow Diagram */}
                <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: '10px', backgroundColor: colorWhite }}>
                    {/* Step 1 */}
                    <div style={{ ...flexCol, alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '35px', border: borderBlack, ...flexCenter, backgroundColor: colorWhite, marginBottom: '8px', color: colorBlack }}>
                            신고서 작성
                        </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: colorBlack }}>→</span>

                    {/* Step 2 */}
                    <div style={{ ...flexCol, alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '35px', border: borderBlack, ...flexCenter, backgroundColor: colorWhite, marginBottom: '8px', color: colorBlack }}>
                            접수
                        </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: colorBlack }}>→</span>

                    {/* Step 3 */}
                    <div style={{ ...flexCol, alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '35px', border: borderBlack, ...flexCenter, backgroundColor: colorWhite, marginBottom: '8px', color: colorBlack }}>
                            검토
                        </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: colorBlack }}>→</span>

                    {/* Step 4 */}
                    <div style={{ ...flexCol, alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '35px', border: borderBlack, ...flexCenter, backgroundColor: colorWhite, marginBottom: '8px', color: colorBlack }}>
                            결재
                        </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: colorBlack }}>→</span>

                    {/* Step 5 */}
                    <div style={{ ...flexCol, alignItems: 'center' }}>
                        <div style={{ width: '90px', height: '35px', border: borderBlack, ...flexCol, ...flexCenter, backgroundColor: colorWhite, lineHeight: 1, marginBottom: '8px', color: colorBlack }}>
                            <span>신고확인증</span>
                            <span>작성 · 발급</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Roles */}
                <div style={{ borderTop: borderBlack, display: 'flex', fontSize: '9px', backgroundColor: colorWhite }}>
                    <div style={{ flex: 1, padding: '4px 0', textAlign: 'center', borderRight: borderBlack, color: colorBlack }}>신고인</div>
                    <div style={{ flex: 4, padding: '4px 0', textAlign: 'center', color: colorBlack }}>처리기관: 시 · 군 · 구</div>
                </div>
            </div>
            {/* Bottom thick line */}
            <div style={{ borderBottom: borderThick }}></div>
        </div>
    );
});

GovernmentReportForm.displayName = 'GovernmentReportForm';

