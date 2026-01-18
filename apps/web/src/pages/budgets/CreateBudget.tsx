import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, DollarSign, Calendar, Bell, Loader2, Sparkles, Layout, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Budget, TransactionCategory, createTransactionService } from '@financeflow/shared';
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets';
import confetti from 'canvas-confetti';
import { supabase } from '@/services/supabase';
import { MASTER_BUDGET_CATEGORIES } from '@/constants/budget-categories';


const STEPS = [
    { id: 1, title: 'Identity', icon: <Layout size={18} /> },
    { id: 2, title: 'Limit', icon: <DollarSign size={18} /> },
    { id: 3, title: 'Rules', icon: <Bell size={18} /> },
];

export default function CreateBudget() {
    const { id } = useParams();
    const navigate = useNavigate();
    const createBudget = useCreateBudget();
    const updateBudget = useUpdateBudget();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<Budget>>({
        currency: 'MYR',
        period: 'monthly',
        rollover_enabled: false,
        notifications_enabled: true,
        alert_thresholds: [80, 100],
        emoji: '💰'
    });
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
    const [aiInsight, setAiInsight] = useState<string>('');

    // Category Selection State
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    const isEdit = !!id;

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const transactionService = createTransactionService(supabase);
            const fetchedCategories = await transactionService.getCategories();
            setCategories(fetchedCategories.filter((c: TransactionCategory) => c.type === 'expense'));

            if (isEdit) {
                const { data, error } = await supabase
                    .from('budgets')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data) setFormData(data);
                if (error) throw error;
            }
        } catch (error) {
            console.error("Failed to load initial data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('Please log in to create a budget');
                return;
            }

            // Build payload WITHOUT category_id for now (temporary fix)
            const payload: any = {
                name: formData.name || 'My Budget',
                amount: formData.amount,
                currency: formData.currency || 'MYR',
                period: formData.period || 'monthly',
                emoji: formData.emoji || '💰',
                rollover_enabled: formData.rollover_enabled || false,
                notifications_enabled: formData.notifications_enabled ?? true,
                alert_thresholds: formData.alert_thresholds || [80, 100],
                user_id: user.id,
                is_active: true,
                start_date: formData.start_date || new Date().toISOString(),
                rollover_amount: 0
            };

            // DO NOT include category_id at all (temporary workaround)
            // This creates a general budget not tied to any category

            console.log('Saving budget with payload:', payload);

            if (isEdit) {
                await updateBudget.mutateAsync({ id: id!, ...payload });
            } else {
                await createBudget.mutateAsync(payload);
            }

            // Success confetti
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.7 },
                colors: ['#0066FF', '#8B5CF6', '#EC4899']
            });

            navigate('/budgets');
        } catch (error: any) {
            console.error("Failed to save budget", error);
            console.error("Error details:", error.message, error.details);
            alert(`Failed to save budget: ${error.message || 'Unknown error'}`);
        }
    };

    const updateField = (field: keyof Budget, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateAI = async () => {
        setIsGeneratingAI(true);
        try {
            const { data, error } = await supabase.functions.invoke('generate-budget-recommendations');
            if (error) throw error;

            if (data.recommendations) {
                setAiRecommendations(data.recommendations);
                setAiInsight(data.insight);

                // If we are in step 1 and have a category selected, find matches
                if (formData.category_id) {
                    const match = data.recommendations.find((r: any) => r.category_id === formData.category_id);
                    if (match) {
                        // We'll show this in Step 2
                    }
                }
            }
        } catch (error) {
            console.error("AI Generation failed", error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleCategorySelect = async (subCategoryName: string, groupName: string, icon: string) => {
        // 1. Check if category exists
        const existing = categories.find(c => c.name === subCategoryName);

        if (existing) {
            updateField('category_id', existing.id);
            updateField('name', existing.name);
            updateField('emoji', existing.icon || icon);
        } else {
            // 2. Create if not exists
            try {
                const transactionService = createTransactionService(supabase);
                const newCategory = await transactionService.createCategory({
                    name: subCategoryName,
                    type: 'expense',
                    group_name: groupName,
                    icon: icon,
                    color: MASTER_BUDGET_CATEGORIES.find(g => g.name === groupName)?.color || 'bg-slate-500'
                });

                if (newCategory && newCategory.id) {
                    setCategories(prev => [...prev, newCategory]);
                    updateField('category_id', newCategory.id);
                    updateField('name', newCategory.name);
                    updateField('emoji', icon);
                } else {
                    // Category creation failed, use without category_id
                    console.warn('Category creation returned no ID, creating general budget');
                    updateField('category_id', null);
                    updateField('name', subCategoryName);
                    updateField('emoji', icon);
                }
            } catch (error) {
                console.error("Failed to create category", error);
                // Allow budget creation without category_id
                updateField('category_id', null);
                updateField('name', subCategoryName);
                updateField('emoji', icon);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-medium italic">Loading budget configuration...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-6 mb-12">
                <Button
                    variant="ghost"
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                    onClick={() => navigate('/budgets')}
                >
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isEdit ? 'Refine Budget' : 'Design Budget'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {isEdit ? 'Adjust your limits for better accuracy' : 'Set your financial boundaries with precision'}
                    </p>
                </div>
            </div>

            {/* Premium Steps Indicator */}
            <div className="flex justify-between items-center mb-12 relative px-4">
                <div className="absolute left-8 right-8 top-[1.125rem] h-0.5 bg-slate-100 dark:bg-white/5 -z-10" />
                {STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-3 relative z-10">
                        <motion.div
                            initial={false}
                            animate={{
                                backgroundColor: step >= s.id ? '#0066FF' : 'rgba(255,255,255,0.05)',
                                scale: step === s.id ? 1.2 : 1,
                                boxShadow: step === s.id ? '0 0 20px rgba(0, 102, 255, 0.4)' : 'none',
                                borderColor: step >= s.id ? '#0066FF' : 'rgba(255,255,255,0.1)'
                            }}
                            className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-500",
                                step >= s.id ? "text-white" : "text-slate-500"
                            )}
                        >
                            {step > s.id ? <Check size={18} strokeWidth={3} /> : s.id}
                        </motion.div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em]",
                            step >= s.id ? "text-primary-500" : "text-slate-500"
                        )}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Wizard Content */}
            <Card className="p-0 overflow-hidden border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                <div className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Categorize Path</h2>
                                            <p className="text-slate-500 font-medium">Which area of spending are we monitoring?</p>
                                        </div>
                                        <Button
                                            onClick={handleGenerateAI}
                                            disabled={isGeneratingAI}
                                            className="bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 border border-primary-500/20 px-4 h-11 rounded-xl font-bold flex gap-2 transition-all"
                                        >
                                            {isGeneratingAI ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                            AI Suggest
                                        </Button>
                                    </div>
                                    {aiInsight && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-primary-500/5 border border-primary-500/10 p-4 rounded-xl mt-4"
                                        >
                                            <p className="text-xs text-primary-400 font-medium leading-relaxed italic">
                                                "{aiInsight}"
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {selectedGroup && (
                                    <button
                                        onClick={() => setSelectedGroup(null)}
                                        className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-4 hover:text-primary-500 transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Back to Groups
                                    </button>
                                )}

                                {!selectedGroup ? (
                                    // Level 1: Main Groups
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {MASTER_BUDGET_CATEGORIES.map(group => (
                                            <button
                                                key={group.id}
                                                onClick={() => setSelectedGroup(group.name)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group relative overflow-hidden h-32",
                                                    "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                                                )}
                                            >
                                                <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                                    {group.icon}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight text-slate-300 group-hover:text-white">
                                                    {group.name}
                                                </span>
                                                <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-50", group.color)} />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    // Level 2: Subcategories
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        {MASTER_BUDGET_CATEGORIES.find(g => g.name === selectedGroup)?.subcategories.map(sub => (
                                            <button
                                                key={sub.name}
                                                onClick={() => handleCategorySelect(sub.name, selectedGroup, sub.icon)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group relative overflow-hidden h-28",
                                                    formData.name === sub.name
                                                        ? "bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/30"
                                                        : "bg-white/5 border-white/10 hover:border-primary-500/50 hover:bg-white/10 text-slate-400"
                                                )}
                                            >
                                                <span className="text-2xl mb-2">
                                                    {(sub as any).image ? (
                                                        <img
                                                            src={(sub as any).image}
                                                            alt={sub.name}
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                    ) : (
                                                        sub.icon
                                                    )}
                                                </span>
                                                <span className="text-[10px] font-bold text-center leading-tight">
                                                    {sub.name}
                                                </span>
                                                {formData.name === sub.name && (
                                                    <motion.div
                                                        layoutId="cat-active"
                                                        className="absolute inset-0 bg-primary-500 -z-10"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Budget Name</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="e.g., Weekend Coffee"
                                            className="w-full h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Visual Icon (Emoji)</label>
                                        <div className="flex gap-2">
                                            {['💰', '🍔', '🚗', '🏠', '🎬', '✈️'].map(e => (
                                                <button
                                                    key={e}
                                                    onClick={() => updateField('emoji', e)}
                                                    className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all",
                                                        formData.emoji === e ? "bg-primary-500 border-primary-500" : "bg-white/5 border-white/10 hover:border-white/20"
                                                    )}
                                                >
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Set Expenditure Limit</h2>
                                    <p className="text-slate-500 font-medium">Define your boundary for this period.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col">
                                            <span className="text-xs font-black text-slate-500 uppercase leading-none mb-1">Currency</span>
                                            <span className="text-2xl font-black text-primary-500">RM</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={formData.amount || ''}
                                            onChange={(e) => updateField('amount', Number(e.target.value))}
                                            className="w-full h-32 bg-white/5 border-white/10 rounded-[2.5rem] pl-32 pr-10 text-6xl font-black text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-mono"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            <DollarSign size={40} className="text-white/5 group-focus-within:text-primary-500/20 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Frequency</label>
                                            <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
                                                {['weekly', 'monthly', 'yearly'].map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => updateField('period', p)}
                                                        className={cn(
                                                            "flex-1 h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                                            formData.period === p ? "bg-white/10 text-white shadow-inner" : "text-slate-500 hover:text-slate-300"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Effective Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.start_date?.split('T')[0] || new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => updateField('start_date', e.target.value)}
                                                    className="w-full h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-6 font-bold text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Card className="p-6 bg-primary-500/10 border-primary-500/20 shadow-none relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Sparkles size={100} />
                                    </div>
                                    <div className="flex gap-5 relative z-10">
                                        <div className="p-3 bg-primary-500/20 rounded-2xl h-fit">
                                            <Sparkles className="text-primary-400" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white tracking-tight">
                                                {aiRecommendations.find(r => r.category_id === formData.category_id) ? 'AI Optimized Limit' : 'Smart Suggestion'}
                                            </h4>
                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                                {aiRecommendations.find(r => r.category_id === formData.category_id)
                                                    ? aiRecommendations.find(r => r.category_id === formData.category_id).reason
                                                    : `Based on your trajectory, a limit of RM 1,200 would place you in the top 10% of savers in your region.`
                                                }
                                            </p>
                                            <Button
                                                variant="ghost"
                                                className="text-primary-400 font-bold p-0 mt-3 hover:bg-transparent hover:text-primary-300 underline underline-offset-4 decoration-2"
                                                onClick={() => {
                                                    const rec = aiRecommendations.find(r => r.category_id === formData.category_id);
                                                    updateField('amount', rec ? rec.suggested_amount : 1200);
                                                }}
                                            >
                                                Apply {aiRecommendations.find(r => r.category_id === formData.category_id) ? `RM ${aiRecommendations.find(r => r.category_id === formData.category_id).suggested_amount}` : 'RM 1,200'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Governance Rules</h2>
                                    <p className="text-slate-500 font-medium">Configure how this budget behaves over time.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <RuleToggle
                                            icon={<RefreshCw size={20} />}
                                            label="Rollover Surplus"
                                            desc="Carry over remaining balance to next period"
                                            checked={!!formData.rollover_enabled}
                                            onChange={(c) => updateField('rollover_enabled', c)}
                                            color="blue"
                                        />
                                        <RuleToggle
                                            icon={<Bell size={20} />}
                                            label="Active Monitoring"
                                            desc="Real-time alerts for spend trajectories"
                                            checked={!!formData.notifications_enabled}
                                            onChange={(c) => updateField('notifications_enabled', c)}
                                            color="magenta"
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Alert Thresholds (%)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {[50, 75, 80, 90, 100].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => {
                                                            const current = formData.alert_thresholds || [];
                                                            const next = current.includes(t)
                                                                ? current.filter(x => x !== t)
                                                                : [...current, t].sort((a, b) => a - b);
                                                            updateField('alert_thresholds', next);
                                                        }}
                                                        className={cn(
                                                            "px-4 py-2 rounded-xl text-xs font-black transition-all border-2",
                                                            formData.alert_thresholds?.includes(t)
                                                                ? "bg-magenta-500 border-magenta-500 text-white shadow-lg shadow-magenta-500/20"
                                                                : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                                                        )}
                                                    >
                                                        {t}%
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-500 italic mt-2">Recommended: 80% and 100%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-purple-700 text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <Check size={120} />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div>
                                            <p className="text-white/70 text-sm font-black uppercase tracking-[0.3em] mb-2">Configuration Summary</p>
                                            <h3 className="text-4xl font-black tracking-tight leading-none mb-4">
                                                RM {formData.amount?.toLocaleString()} <span className="text-xl opacity-60 font-medium">/ {formData.period}</span>
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.name}</span>
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.rollover_enabled ? 'Rollover ON' : 'Rollover OFF'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={createBudget.isPending || updateBudget.isPending}
                                            className="w-full md:w-auto h-16 px-10 bg-white text-primary-600 hover:bg-primary-50 rounded-2xl font-black text-lg shadow-xl"
                                        >
                                            {(createBudget.isPending || updateBudget.isPending) ? <Loader2 className="animate-spin" /> : (isEdit ? 'Save Changes' : 'Manifest Budget')}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Wizard Footer Controls */}
                <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || createBudget.isPending || updateBudget.isPending}
                        className="px-8 h-12 rounded-xl text-slate-500 font-bold hover:bg-white/5"
                    >
                        Previous
                    </Button>
                    {step < 3 && (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && (!formData.category_id || !formData.name)) ||
                                (step === 2 && !formData.amount)
                            }
                            className="bg-primary-600 hover:bg-primary-700 text-white px-10 h-12 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20"
                        >
                            Continue <ArrowRight size={18} className="ml-2" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

function RuleToggle({ icon, label, desc, checked, onChange, color }: { icon: any, label: string, desc: string, checked: boolean, onChange: (v: boolean) => void, color: 'blue' | 'magenta' }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "w-full p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all group",
                checked
                    ? (color === 'blue' ? "bg-primary-500/10 border-primary-500" : "bg-magenta-500/10 border-magenta-500")
                    : "bg-white/5 border-white/5 hover:border-white/20"
            )}
        >
            <div className="flex items-center gap-5 text-left">
                <div className={cn(
                    "p-3 rounded-2xl transition-all",
                    checked
                        ? (color === 'blue' ? "bg-primary-500 text-white" : "bg-magenta-500 text-white")
                        : "bg-white/5 text-slate-500 group-hover:bg-white/10"
                )}>
                    {icon}
                </div>
                <div>
                    <h4 className={cn("font-black tracking-tight", checked ? "text-white" : "text-slate-400 group-hover:text-slate-300")}>{label}</h4>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">{desc}</p>
                </div>
            </div>
            <div className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-500",
                checked ? (color === 'blue' ? "bg-primary-500" : "bg-magenta-500") : "bg-slate-700"
            )}>
                <motion.div
                    animate={{ x: checked ? 26 : 4 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                />
            </div>
        </button>
    );
}
