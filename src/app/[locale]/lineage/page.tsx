'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PedigreeChart, PedigreeNode } from '@/components/lineage/PedigreeChart';
import { Navbar } from '@/components/layout/Navbar';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Search, Loader2, AlertCircle, ChevronDown } from 'lucide-react';

interface Gecko {
    id: string;
    name: string;
    morph: string;
    gender: string;
    image_url: string | null;
    sire_name: string | null;
    dam_name: string | null;
    sire_id: string | null;
    dam_id: string | null;
}

export default function LineagePage() {
    const [user, setUser] = useState<User | null>(null);
    const [geckos, setGeckos] = useState<Gecko[]>([]);
    const [filteredGeckos, setFilteredGeckos] = useState<Gecko[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGecko, setSelectedGecko] = useState<Gecko | null>(null);
    const [geckoData, setGeckoData] = useState<PedigreeNode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingLineage, setIsLoadingLineage] = useState(false);
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

            const { data: geckosData, error } = await supabase
                .from('geckos')
                .select('id, name, morph, gender, image_url, sire_name, dam_name, sire_id, dam_id')
                .eq('owner_id', user.id)
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching geckos:', error);
            } else {
                setGeckos(geckosData || []);
                setFilteredGeckos(geckosData || []);
            }

            setIsLoading(false);
        };

        checkAuthAndLoadGeckos();
    }, [router, supabase]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredGeckos(geckos);
        } else {
            const filtered = geckos.filter(gecko =>
                gecko.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                gecko.morph?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredGeckos(filtered);
        }
    }, [searchQuery, geckos]);

    const loadLineage = async (gecko: Gecko) => {
        setSelectedGecko(gecko);
        setIsLoadingLineage(true);
        setIsDropdownOpen(false);

        const { data, error } = await supabase
            .from('geckos')
            .select(`
                id, name, morph, gender, image_url, sire_name, dam_name,
                sire:sire_id ( 
                    id, name, morph, gender, image_url, sire_name, dam_name,
                    sire:sire_id ( id, name, morph, gender, image_url ),
                    dam:dam_id ( id, name, morph, gender, image_url )
                ),
                dam:dam_id ( 
                    id, name, morph, gender, image_url, sire_name, dam_name,
                    sire:sire_id ( id, name, morph, gender, image_url ),
                    dam:dam_id ( id, name, morph, gender, image_url )
                )
            `)
            .eq('id', gecko.id)
            .single();

        if (error) {
            console.error('Lineage Fetch Error:', error);
            setGeckoData(null);
        } else if (data) {
            const buildNode = (geckoNode: any, manualName?: string | null): PedigreeNode | null => {
                if (geckoNode && geckoNode.id) {
                    return {
                        id: geckoNode.id,
                        name: geckoNode.name,
                        morph: geckoNode.morph,
                        gender: geckoNode.gender,
                        image_url: geckoNode.image_url,
                        is_verified: true,
                        sire: buildNode(geckoNode.sire, geckoNode.sire_name),
                        dam: buildNode(geckoNode.dam, geckoNode.dam_name),
                    };
                }
                if (manualName) {
                    return {
                        id: '',
                        name: manualName,
                        morph: 'User Declared',
                        gender: 'Unknown',
                        is_verified: false,
                        sire: null,
                        dam: null
                    };
                }
                return null;
            };

            setGeckoData({
                id: data.id,
                name: data.name,
                morph: data.morph,
                gender: data.gender,
                image_url: data.image_url,
                is_verified: true,
                sire: buildNode(data.sire, data.sire_name),
                dam: buildNode(data.dam, data.dam_name),
            });
        }

        setIsLoadingLineage(false);
    };

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
        <div className="min-h-screen bg-black text-white">
            <Navbar user={user} />

            <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-2">
                            Lineage Explorer
                        </h1>
                        <p className="text-zinc-500">Trace the bloodlines of your elite geckos.</p>
                    </div>

                    {/* Gecko Selector with Search */}
                    {geckos.length > 0 && (
                        <div className="w-full md:w-[320px] relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    placeholder="Search by name..."
                                    className="w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                                />
                                <ChevronDown
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-transform cursor-pointer ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                    {filteredGeckos.length > 0 ? (
                                        filteredGeckos.map((gecko) => (
                                            <button
                                                key={gecko.id}
                                                onClick={() => loadLineage(gecko)}
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
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-zinc-500 text-sm">No geckos found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-8 min-h-[600px] flex items-center justify-center relative backdrop-blur-sm">
                    {isLoadingLineage ? (
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-4" />
                            <p className="text-zinc-400">Loading lineage...</p>
                        </div>
                    ) : geckoData ? (
                        <PedigreeChart gecko={geckoData} />
                    ) : geckos.length === 0 ? (
                        <div className="text-center space-y-4">
                            <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
                            <h3 className="text-xl font-serif text-white">No Geckos Registered</h3>
                            <p className="text-zinc-500 max-w-md">
                                Register your geckos in the dashboard first to view their lineage.
                            </p>
                            <a
                                href="/ko/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#b08d22] transition-colors mt-4"
                            >
                                Go to Dashboard
                            </a>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
                                <Search className="h-8 w-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-serif text-white">Select a Gecko</h3>
                            <p className="text-zinc-500 max-w-md">
                                Search for a gecko by name above to view its full 3-generation pedigree tree.
                            </p>
                        </div>
                    )}
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
                    <p className="text-[10px] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                        Disclaimer: The information above is based on user-submitted data. 'System Matched' indicates a link exists within the Crestia database, not a guarantee of biological parentage.
                        Crestia verifies connection integrity but does not physically verify the authenticity of stated lineages.
                    </p>
                </div>
            </div>
        </div>
    );
}
