import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Search, Calendar, DollarSign, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Bill, MALAYSIAN_BILL_PROVIDERS, BillService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import confetti from 'canvas-confetti';

const STEPS = [
    { id: 1, title: 'Provider', icon: <Search size={18} /> },
    { id: 2, title: 'Details', icon: <DollarSign size={18} /> },
    { id: 3, title: 'Schedule', icon: <Calendar size={18} /> },
];

export default function CreateBill() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Bill>>({
        currency: 'MYR',
        auto_pay_enabled: false,
        is_variable: false,
        due_day: 1
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const billService = new BillService(supabase);

            // Ensure necessary fields are present and correct types
            const billData: Partial<Bill> = {
                ...formData,
                currency: formData.currency || 'MYR',
                auto_pay_enabled: formData.auto_pay_enabled || false,
                is_variable: formData.is_variable || false,
                due_day: formData.due_day || 1,
                auto_sync_budget: formData.auto_sync_budget || false,
                provider_logo: formData.provider_logo
            };

            await billService.createBill(billData);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            console.log('Created Bill:', billData);
            navigate('/bills');
        } catch (error) {
            console.error('Error creating bill:', error);
            // In a real app we'd show a toast here
            alert('Failed to save bill. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: keyof Bill, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectProvider = (providerId: string) => {
        const provider = MALAYSIAN_BILL_PROVIDERS.find(p => p.id === providerId);
        if (provider) {
            setFormData(prev => ({
                ...prev,
                provider_id: provider.id,
                provider_name: provider.name,
                provider_category: provider.category,
                provider_logo: provider.logo,
                is_variable: provider.isVariable,
                bill_name: `${provider.name} Bill`,
                estimated_amount: provider.averageAmount
            }));
            handleNext();
        }
    };

    const filteredProviders = MALAYSIAN_BILL_PROVIDERS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2" onClick={() => navigate('/bills')}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Bill</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your recurring payments</p>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10" />
                {STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#0A0E27] px-2">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                            step >= s.id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                        )}>
                            {step > s.id ? <Check size={14} /> : s.id}
                        </div>
                        <span className={cn("text-xs font-medium", step >= s.id ? "text-blue-600 dark:text-blue-400" : "text-gray-500")}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            <Card className="p-6 min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SELECT PROVIDER */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Provider</h2>
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search TNB, TIME, Astro..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                    {filteredProviders.map(provider => (
                                        <button
                                            key={provider.id}
                                            onClick={() => selectProvider(provider.id)}
                                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-center"
                                        >
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold overflow-hidden" style={{ backgroundColor: provider.logo ? 'white' : provider.color }}>
                                                {provider.logo ? (
                                                    <img src={provider.logo} alt={provider.name} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    provider.name[0]
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{provider.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white overflow-hidden" style={{
                                    backgroundColor: formData.provider_logo ? 'white' : (MALAYSIAN_BILL_PROVIDERS.find(p => p.id === formData.provider_id)?.color || '#666')
                                }}>
                                    {formData.provider_logo ? (
                                        <img src={formData.provider_logo} alt={formData.provider_name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                        formData.provider_name?.[0]
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{formData.provider_name}</h3>
                                    <p className="text-xs text-slate-500">{formData.provider_category}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Bill Name</label>
                                <input
                                    type="text"
                                    value={formData.bill_name || ''}
                                    onChange={(e) => updateField('bill_name', e.target.value)}
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Account Number (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.account_number || ''}
                                    onChange={(e) => updateField('account_number', e.target.value)}
                                    placeholder="e.g. 2200 1234 5678"
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Type</label>
                                    <select
                                        value={formData.is_variable ? 'variable' : 'fixed'}
                                        onChange={(e) => updateField('is_variable', e.target.value === 'variable')}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-3 text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="fixed">Fixed Amount</option>
                                        <option value="variable">Variable Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        {formData.is_variable ? 'Est. Amount' : 'Amount'}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RM</span>
                                        <input
                                            type="number"
                                            value={formData.is_variable ? formData.estimated_amount : formData.fixed_amount}
                                            onChange={(e) => updateField(formData.is_variable ? 'estimated_amount' : 'fixed_amount', Number(e.target.value))}
                                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SCHEDULE & CONFIRM */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Due Date (Day of Month)</label>
                                <div className="flex items-center gap-4">
                                    <Calendar className="text-slate-400" />
                                    <select
                                        value={formData.due_day}
                                        onChange={(e) => updateField('due_day', Number(e.target.value))}
                                        className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none"
                                    >
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                            <option key={day} value={day}>{day}{['st', 'nd', 'rd'][((day + 90) % 100 - 10) % 10 - 1] || 'th'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Auto Pay</h4>
                                    <p className="text-xs text-slate-500">Mark as paid automatically?</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.auto_pay_enabled}
                                    onChange={(e) => updateField('auto_pay_enabled', e.target.checked)}
                                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Budget Sync</h4>
                                    <p className="text-xs text-slate-500">Include in monthly budget</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.auto_sync_budget}
                                    onChange={(e) => updateField('auto_sync_budget', e.target.checked)}
                                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Buttons */}
                <div className="flex justify-between pt-6 mt-6 border-t border-gray-100 dark:border-white/5">
                    <Button variant="secondary" onClick={handleBack} disabled={step === 1} className="w-24">
                        Back
                    </Button>
                    {step < 3 ? (
                        <Button onClick={handleNext} disabled={step === 1 && !formData.provider_id} className="w-24 bg-blue-600 hover:bg-blue-700 text-white">
                            Next <ArrowRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isLoading} className="w-32 bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? 'Saving...' : 'Save Bill'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
