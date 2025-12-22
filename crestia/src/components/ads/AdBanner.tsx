'use client';

import { useEffect } from 'react';

export default function AdBanner({ dataAdSlot }: { dataAdSlot: string }) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="w-full my-8 flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Advertisement</span>
            <div className="overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-md w-full flex justify-center">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', minWidth: '300px', maxWidth: '100%' }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Placeholder ID
                    data-ad-slot={dataAdSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
}
