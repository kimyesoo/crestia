'use client';

import React, { useState, useEffect } from 'react';
import { GeckoCardFinal, GeckoDetails } from '@/components/gecko/GeckoCardFinal';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ChevronDown, Loader2, AlertCircle, CreditCard } from 'lucide-react';

interface Gecko {
    id: string;
    name: string;
    morph: string;
    hatch_date: string | null;
    image_url: string | null;
    breeder_name: string | null;
    sire_name: string | null;
    dam_name: string | null;
    sire_id: string | null;
    dam_id: string | null;
}

export default function CardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [geckos, setGeckos] = useState<Gecko[]>([]);
    const [selectedGecko, setSelectedGecko] = useState<Gecko | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuthAndLoadGeckos = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/ko/login');
                return;
            }

            setUser(user);

            // Fetch user's geckos
            const { data: geckosData, error } = await supabase
                .from('geckos')
                .select('id, name, morph, hatch_date, image_url, breeder_name, sire_name, dam_name, sire_id, dam_id')
                .eq('owner_id', user.id)
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching geckos:', error);
            } else {
                setGeckos(geckosData || []);
                if (geckosData && geckosData.length > 0) {
                    setSelectedGecko(geckosData[0]);
                }
            }

            setIsLoading(false);
        };

        checkAuthAndLoadGeckos();
    }, [router, supabase]);

    const geckoDetails: GeckoDetails | null = selectedGecko ? {
        id: selectedGecko.id,
        name: selectedGecko.name || 'UNNAMED',
        morph: selectedGecko.morph || 'Unknown',
        hatchDate: selectedGecko.hatch_date || 'Unknown',
        breeder: selectedGecko.breeder_name || 'Unknown',
        imageUrl: selectedGecko.image_url || '/images/placeholder.png',
        sireName: selectedGecko.sire_name || 'Unknown',
        damName: selectedGecko.dam_name || 'Unknown',
        pedigree: {
            sire: { id: selectedGecko.sire_id || 'unknown', name: selectedGecko.sire_name || 'Unknown' },
            dam: { id: selectedGecko.dam_id || 'unknown', name: selectedGecko.dam_name || 'Unknown' },
            grandSires: [{ id: 'unknown', name: 'Unknown' }, { id: 'unknown', name: 'Unknown' }],
            grandDams: [{ id: 'unknown', name: 'Unknown' }, { id: 'unknown', name: 'Unknown' }]
        }
    } : null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar user={user} />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                    <p className="text-zinc-400 mt-4">Loading your geckos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar user={user} />

            <div className="flex flex-col items-center pt-28 pb-20 px-4">
                <h1 className="text-3xl text-[#D4AF37] font-bold mb-2 tracking-widest font-serif">
                    ID CARD GENERATOR
                </h1>
                <p className="text-zinc-500 text-sm mb-8">
                    Generate a premium ID card for your gecko
                </p>

                {/* Gecko Selector */}
                {geckos.length > 0 ? (
                    <div className="w-full max-w-xs mb-10 relative">
                        <label className="text-zinc-400 text-sm mb-2 block">Select Gecko</label>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:border-[#D4AF37]/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {selectedGecko?.image_url && (
                                    <img
                                        src={selectedGecko.image_url}
                                        alt={selectedGecko.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                                <span>{selectedGecko?.name || 'Select a gecko'}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                {geckos.map((gecko) => (
                                    <button
                                        key={gecko.id}
                                        onClick={() => {
                                            setSelectedGecko(gecko);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left ${selectedGecko?.id === gecko.id ? 'bg-zinc-800 text-[#D4AF37]' : 'text-white'
                                            }`}
                                    >
                                        {gecko.image_url && (
                                            <img
                                                src={gecko.image_url}
                                                alt={gecko.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium">{gecko.name || 'Unnamed'}</div>
                                            <div className="text-xs text-zinc-500">{gecko.morph}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center mb-10">
                        <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No Geckos Registered</h3>
                        <p className="text-zinc-500 text-sm mb-4">
                            Register your geckos in the dashboard first to generate ID cards.
                        </p>
                        <a
                            href="/ko/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#b08d22] transition-colors"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                )}

                {/* Card Preview */}
                {geckoDetails && (
                    <GeckoCardFinal gecko={geckoDetails} />
                )}

                <p className="text-gray-500 mt-8 text-sm">
                    * This preview uses the final high-resolution print format.
                </p>
            </div>
        </div>
    );
}
