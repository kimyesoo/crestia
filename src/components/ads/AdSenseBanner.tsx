'use client';

import { useEffect, useRef } from 'react';

// AdSense 타입 선언
declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface AdSenseBannerProps {
    /** 광고 단위 ID (AdSense에서 생성) */
    slot: string;
    /** 광고 포맷 */
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    /** 반응형 광고 여부 */
    responsive?: boolean;
    /** 추가 스타일 */
    style?: React.CSSProperties;
    /** 추가 클래스 */
    className?: string;
}

/**
 * Google AdSense 배너 컴포넌트
 * 
 * 사용법:
 * <AdSenseBanner slot="1234567890" format="auto" />
 * 
 * 주의: 실제 사용 시 layout.tsx에 AdSense 스크립트가 로드되어 있어야 합니다.
 */
export function AdSenseBanner({
    slot,
    format = 'auto',
    responsive = true,
    style,
    className = '',
}: AdSenseBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const isProduction = process.env.NODE_ENV === 'production';

    useEffect(() => {
        // 프로덕션 환경에서만 광고 로드
        if (isProduction && adRef.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                console.error('AdSense error:', error);
            }
        }
    }, [isProduction]);

    // 개발 환경에서는 테스트 박스 표시
    if (!isProduction) {
        return (
            <div
                className={`bg-zinc-800/50 border border-dashed border-zinc-600 rounded-lg flex items-center justify-center text-zinc-500 text-sm ${className}`}
                style={{
                    minHeight: format === 'horizontal' ? '90px' : format === 'rectangle' ? '250px' : '100px',
                    ...style
                }}
            >
                <div className="text-center p-4">
                    <p className="font-medium">📢 광고 영역 (Test)</p>
                    <p className="text-xs text-zinc-600 mt-1">Slot: {slot}</p>
                </div>
            </div>
        );
    }

    // 프로덕션 환경: 실제 AdSense 광고
    return (
        <ins
            ref={adRef}
            className={`adsbygoogle ${className}`}
            style={{
                display: 'block',
                ...style
            }}
            data-ad-client="ca-pub-0000000000000000" // TODO: 실제 Client ID로 교체
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
        />
    );
}

/**
 * 인피드 광고 컴포넌트 (리스트 중간에 삽입)
 */
export function AdSenseInFeed({
    slot,
    layoutKey = '-fb+5w+4e-db+86',
    className = '',
}: {
    slot: string;
    layoutKey?: string;
    className?: string;
}) {
    const adRef = useRef<HTMLModElement>(null);
    const isProduction = process.env.NODE_ENV === 'production';

    useEffect(() => {
        if (isProduction && adRef.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                console.error('AdSense InFeed error:', error);
            }
        }
    }, [isProduction]);

    if (!isProduction) {
        return (
            <div className={`bg-zinc-800/50 border border-dashed border-zinc-600 rounded-lg p-6 text-center text-zinc-500 ${className}`}>
                <p className="font-medium">📰 인피드 광고 (Test)</p>
                <p className="text-xs text-zinc-600 mt-1">Slot: {slot}</p>
            </div>
        );
    }

    return (
        <ins
            ref={adRef}
            className={`adsbygoogle ${className}`}
            style={{ display: 'block' }}
            data-ad-client="ca-pub-0000000000000000" // TODO: 실제 Client ID로 교체
            data-ad-slot={slot}
            data-ad-format="fluid"
            data-ad-layout-key={layoutKey}
        />
    );
}
