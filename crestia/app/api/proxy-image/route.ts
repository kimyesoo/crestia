import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const blob = await response.blob();
        const headers = new Headers();

        // ★ 핵심: CORS 및 Content-Type 설정
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new NextResponse(blob, { status: 200, headers });
    } catch (error) {
        console.error('Proxy Error:', error);
        // 에러 발생 시 500 리턴
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}