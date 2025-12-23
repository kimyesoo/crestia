"use client";

import React from "react";

interface GeckoCardContentProps {
    side: 'front' | 'back';
    gecko: any;
    localImageBase64: string | null;
    is3D: boolean;
}

// ★ 프리미엄 골드 디자인 스타일 (CSS로 패턴 구현)
const CARD_STYLE = {
    width: "700px",
    height: "440px",
    backgroundColor: "#0a0a0a",
    backgroundImage: `
    linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px),
    radial-gradient(circle at 50% 50%, #222 0%, #000 100%)
  `,
    backgroundSize: "4px 4px, 4px 4px, 100% 100%", // 카본 느낌 패턴
    border: "4px solid #D4AF37", // 굵은 골드 테두리
    boxShadow: "inset 0 0 30px #000",
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: "15px",
};

// --- 공통 스타일 ---
const styles = {
    goldText: { color: '#D4AF37', fontFamily: 'serif' },
    goldTitle: {
        background: 'linear-gradient(to bottom, #FBF5b7, #D4AF37, #aa771c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold', fontFamily: 'serif'
    },
    label: { color: '#D4AF37', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '2px', opacity: 0.8 },
    value: { color: '#FFF', fontSize: '14px', fontWeight: 'bold' },
    pedigreeBox: {
        border: '1px solid #D4AF37',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FBF5b7',
        padding: '5px',
        textAlign: 'center' as const,
        fontSize: '11px',
        width: '100px',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
};

export default function GeckoCardContent({ side, gecko, localImageBase64, is3D }: GeckoCardContentProps) {
    // Normalize Lineage Names
    const sireName = gecko.sire_name || gecko.sire?.name || 'Unknown';
    const damName = gecko.dam_name || gecko.dam?.name || 'Unknown';

    return (
        <div style={{
            ...CARD_STYLE,
            // 3D 모드일 때만 뒷면 회전 적용. is3D=false(다운로드용)일 때는 항상 정면(0deg)
            transform: is3D && side === 'back' ? 'rotateY(180deg)' : 'none',
            backfaceVisibility: is3D ? 'hidden' : 'visible',
            position: is3D ? 'absolute' : 'relative',
            top: 0, left: 0
        }}>
            {/* 헤더 바 */}
            <div style={{ height: '60px', background: 'linear-gradient(to bottom, #D4AF37, #8a6e18)', borderBottom: '2px solid #FBF5b7', display: 'flex', alignItems: 'center', padding: '0 30px' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#000', fontFamily: 'serif' }}>CRESTIA</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#333', marginLeft: 'auto', letterSpacing: '2px' }}>
                    {side === 'front' ? "OFFICIAL ID CARD" : "PEDIGREE CERTIFICATE"}
                </span>
            </div>

            {/* 컨텐츠 영역 */}
            <div style={{ padding: '30px', height: 'calc(100% - 60px)', display: 'flex' }}>

                {side === 'front' ? (
                    // === [앞면] ===
                    <>
                        {/* 사진 영역 */}
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ padding: '5px', background: 'linear-gradient(45deg, #D4AF37, #FFF, #D4AF37)', borderRadius: '4px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                                <div style={{ width: '240px', height: '240px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {localImageBase64 || gecko.image_url ? (
                                        // Use local base64 if available, otherwise original URL (fallback)
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={localImageBase64 || gecko.image_url} alt="Gecko" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <span style={{ fontSize: '10px', color: '#D4AF37' }}>NO IMAGE</span>}
                                </div>
                            </div>
                        </div>
                        {/* 정보 영역 */}
                        <div style={{ width: '55%', paddingLeft: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ marginBottom: '30px' }}>
                                <div style={styles.label}>HATCH NAME</div>
                                <div style={{ fontSize: '42px', lineHeight: '1', ...styles.goldTitle }}>{gecko.name}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div><div style={styles.label}>GENDER</div><div style={styles.value}>{gecko.gender}</div></div>
                                <div><div style={styles.label}>HATCH DATE</div><div style={styles.value}>{gecko.birth_date || '-'}</div></div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={styles.label}>REGISTRATION ID</div>
                                    <div style={{ fontFamily: 'monospace', color: '#FBF5b7', fontSize: '14px' }}>{gecko.id?.toString().toUpperCase()}</div>
                                </div>
                            </div>
                            {/* 씰 */}
                            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-15deg)', background: 'rgba(0,0,0,0.3)' }}>
                                <div style={{ textAlign: 'center', lineHeight: '1.2' }}>
                                    <div style={{ fontSize: '8px', color: '#D4AF37' }}>OFFICIAL</div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFF' }}>SEAL</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // === [뒷면] 가계도 ===
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>

                            {/* 1열: 부모 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
                                <div><div style={styles.label}>SIRE</div><div style={styles.pedigreeBox}>{sireName}</div></div>
                                <div><div style={styles.label}>DAM</div><div style={styles.pedigreeBox}>{damName}</div></div>
                            </div>

                            {/* 연결선 1 */}
                            <div style={{ width: '20px', height: '140px', borderTop: '1px solid #D4AF37', borderBottom: '1px solid #D4AF37', borderRight: '1px solid #D4AF37', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}></div>
                            <div style={{ width: '20px', borderBottom: '1px solid #D4AF37' }}></div>

                            {/* 2열: 본인 */}
                            <div style={{ padding: '15px 30px', border: '2px solid #D4AF37', borderRadius: '10px', background: '#000', boxShadow: '0 0 15px rgba(212,175,55,0.3)' }}>
                                <div style={{ fontSize: '18px', ...styles.goldTitle }}>{gecko.name}</div>
                            </div>

                            {/* 연결선 2 */}
                            <div style={{ width: '20px', borderBottom: '1px solid #D4AF37' }}></div>
                            <div style={{ width: '20px', height: '220px', borderTop: '1px solid #D4AF37', borderBottom: '1px solid #D4AF37', borderLeft: '1px solid #D4AF37', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', borderBottom: '1px solid #D4AF37' }}></div>
                            </div>

                            {/* 3열: 조부모 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div style={styles.pedigreeBox}>G-Sire</div>
                                <div style={styles.pedigreeBox}>G-Dam</div>
                                <div style={{ height: '10px' }}></div>
                                <div style={styles.pedigreeBox}>G-Sire</div>
                                <div style={styles.pedigreeBox}>G-Dam</div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
