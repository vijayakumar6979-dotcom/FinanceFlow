import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { currencies } from '@financeflow/shared';

interface CurrencySelectorProps {
    value: string;
    onChange: (currencyCode: string) => void;
    label?: string;
    description?: string;
}

export function CurrencySelector({ value, onChange, label = "Currency", description }: CurrencySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

    return (
        <div className="space-y-1">
            {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
            {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg">
                            {selectedCurrency.flag}
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-white">{selectedCurrency.code}</p>
                            <p className="text-xs text-gray-400">{selectedCurrency.name}</p>
                        </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#121629] border border-white/10 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar"
                            >
                                {currencies.map((currency) => (
                                    <button
                                        key={currency.code}
                                        type="button"
                                        onClick={() => {
                                            onChange(currency.code);
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{currency.flag}</span>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                                    {currency.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {currency.code} ({currency.symbol})
                                                </p>
                                            </div>
                                        </div>
                                        {value === currency.code && (
                                            <Check className="w-4 h-4 text-blue-400" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
