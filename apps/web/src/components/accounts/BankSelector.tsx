import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { malaysianBanks, ewalletProviders, creditCardProviders, Institution } from '@financeflow/shared';
import { cn } from '@/utils/cn';

interface BankSelectorProps {
    type: 'bank' | 'card' | 'ewallet';
    value?: string;
    onChange: (institution: Institution) => void;
}

export function BankSelector({ type, value, onChange }: BankSelectorProps) {
    const [search, setSearch] = useState('');

    const getList = () => {
        switch (type) {
            case 'card': return creditCardProviders;
            case 'ewallet': return ewalletProviders;
            default: return malaysianBanks;
        }
    };

    const filteredList = getList().filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full max-h-[400px]">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search banks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {filteredList.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(item)}
                        className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                            value === item.id
                                ? "bg-blue-600/20 border-blue-500 ring-1 ring-blue-500"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                        )}
                    >
                        <div className="w-10 h-10 relative">
                            <img
                                src={item.logo}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = '0.5';
                                }}
                            />
                            {value === item.id && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-black">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-center font-medium text-gray-300">
                            {item.name}
                        </span>
                    </motion.button>
                ))}
            </div>

            {filteredList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No results found
                </div>
            )}
        </div>
    );
}
