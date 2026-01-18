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
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-500"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredList.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(item)}
                        className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all h-full min-h-[120px] justify-center",
                            value === item.id
                                ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 ring-1 ring-blue-500"
                                : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-blue-300 dark:hover:border-white/20"
                        )}
                    >
                        <div className="w-12 h-12 relative flex items-center justify-center p-2 bg-white rounded-lg shadow-sm">
                            <img
                                src={item.logo}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = '0.5';
                                }}
                            />
                            {value === item.id && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-black shrink-0 shadow-sm">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-center font-medium text-slate-700 dark:text-gray-300 line-clamp-2">
                            {item.name}
                        </span>
                    </motion.button>
                ))}
            </div>

            {filteredList.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-gray-500 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                    <p>No results found</p>
                </div>
            )}
        </div>
    );
}
