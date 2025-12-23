'use client';

import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface CommunityTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function CommunityTabs({ tabs, activeTab, onTabChange }: CommunityTabsProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                        activeTab === tab.id
                            ? "bg-[#D4AF37] text-black"
                            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                    )}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
