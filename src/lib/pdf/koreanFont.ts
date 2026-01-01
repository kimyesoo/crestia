// Korean font loader for jsPDF
// Uses NanumGothic font from Google Fonts CDN

export async function loadKoreanFont(pdf: any): Promise<void> {
    try {
        // Use reliable CDN sources for NanumGothic
        const fontSources = [
            'https://cdn.jsdelivr.net/gh/niceit/NanumGothic-Font@main/NanumGothic-Regular.ttf',
            'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
            'https://fastly.jsdelivr.net/gh/niceit/NanumGothic-Font@main/NanumGothic-Regular.ttf'
        ];

        let fontBuffer: ArrayBuffer | null = null;
        let lastError: Error | null = null;

        for (const fontUrl of fontSources) {
            try {
                const response = await fetch(fontUrl, {
                    mode: 'cors',
                    cache: 'force-cache'
                });
                if (response.ok) {
                    fontBuffer = await response.arrayBuffer();
                    break;
                }
            } catch (e) {
                lastError = e as Error;
                continue;
            }
        }

        if (!fontBuffer) {
            console.warn('Could not load Korean font from any source, using fallback');
            // Use helvetica as fallback (won't display Korean properly but won't crash)
            return;
        }

        const fontBase64 = arrayBufferToBase64(fontBuffer);

        // Add font to jsPDF
        pdf.addFileToVFS('NanumGothic.ttf', fontBase64);
        pdf.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
        pdf.addFont('NanumGothic.ttf', 'NanumGothic', 'bold'); // Use same font for bold

    } catch (error) {
        console.error('Failed to load Korean font:', error);
        // Don't throw - allow PDF generation to continue with default font
    }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
