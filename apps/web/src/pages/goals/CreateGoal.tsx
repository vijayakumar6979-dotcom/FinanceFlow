import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Target, Calendar, RefreshCw, Loader2, Sparkles, Layout, TrendingUp, PiggyBank, CreditCard, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Goal, GoalService } from '@financeflow/shared';
import confetti from 'canvas-confetti';
import { supabase } from '@/services/supabase';


const STEPS = [
    { id: 1, title: 'Purpose', icon: <Layout size={18} /> },
    { id: 2, title: 'Ambition', icon: <Target size={18} /> },
    { id: 3, title: 'Engine', icon: <RefreshCw size={18} /> },
];

export default function CreateGoal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Goal>>({
        currency: 'MYR',
        priority: 'medium',
        auto_contribute_enabled: false,
        status: 'active',
        emoji: '🎯'
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feasibilityResult, setFeasibilityResult] = useState<any>(null);

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) loadGoal();
    }, [id]);

    const loadGoal = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setFormData(data);
            if (error) throw error;
        } catch (error) {
            console.error("Failed to load goal", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            const goalService = new GoalService(supabase);

            const payload: any = {
                ...formData,
                user_id: user.id,
                status: formData.status || 'active',
                current_amount: formData.current_amount || 0,
                target_amount: formData.target_amount || 0,
                target_date: formData.target_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
            };

            if (isEdit) {
                await goalService.updateGoal(id!, payload);
            } else {
                await goalService.createGoal(payload);
            }

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.7 },
                colors: ['#0066FF', '#8B5CF6', '#EC4899']
            });

            navigate('/goals');
        } catch (error) {
            console.error("Failed to save goal", error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof Goal, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Trigger feasibility analysis if relevant fields change
        if (field === 'target_amount' || field === 'target_date') {
            // We'll call this explicitly via a debounced button or on demand to avoid excessive API calls
        }
    };

    const handleAnalyzeFeasibility = async () => {
        if (!formData.target_amount || !formData.target_date) return;

        setIsAnalyzing(true);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-goal-feasibility');
            if (error) throw error;

            if (data) {
                setFeasibilityResult(data);
            }
        } catch (error) {
            console.error("Feasibility analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-medium italic">Sculpting your future...</p>
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
                    onClick={() => navigate('/goals')}
                >
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isEdit ? 'Refine Objective' : 'Architect Goal'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {isEdit ? 'Adjust your milestones for peak performance' : 'Transform your aspirations into actionable targets'}
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
                                backgroundColor: step >= s.id ? '#8B5CF6' : 'rgba(255,255,255,0.05)',
                                scale: step === s.id ? 1.2 : 1,
                                boxShadow: step === s.id ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                                borderColor: step >= s.id ? '#8B5CF6' : 'rgba(255,255,255,0.1)'
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
                            step >= s.id ? "text-purple-500" : "text-slate-500"
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
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Define Purpose</h2>
                                    <p className="text-slate-500 font-medium">What category does this milestone fall into?</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: 'savings', name: 'Savings Accelerator', icon: <PiggyBank size={24} />, desc: 'Building dynamic liquidity', color: 'bg-emerald-500' },
                                        { id: 'debt_payoff', name: 'Debt Eradication', icon: <CreditCard size={24} />, desc: 'Breaking clinical thresholds', color: 'bg-red-500' },
                                        { id: 'investment', name: 'Wealth Generation', icon: <TrendingUp size={24} />, desc: 'Compounding future value', color: 'bg-blue-500' },
                                        { id: 'custom', name: 'Moonshot Objective', icon: <Rocket size={24} />, desc: 'Custom strategic target', color: 'bg-purple-500' },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => updateField('goal_type', type.id)}
                                            className={cn(
                                                "text-left p-6 rounded-2xl border-2 transition-all group relative overflow-hidden",
                                                formData.goal_type === type.id
                                                    ? "bg-purple-500/10 border-purple-500"
                                                    : "bg-white/5 border-white/10 hover:border-purple-500/40 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                                    formData.goal_type === type.id ? "bg-purple-500 text-white" : "bg-white/5 text-slate-500 group-hover:text-slate-200"
                                                )}>
                                                    {type.icon}
                                                </div>
                                                <span className={cn("font-black tracking-tight", formData.goal_type === type.id ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                                                    {type.name}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{type.desc}</p>
                                            {formData.goal_type === type.id && (
                                                <motion.div layoutId="goal-active" className="absolute top-0 right-0 p-3">
                                                    <Check size={16} className="text-purple-500" />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Goal Designation</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="e.g., Retirement Alpha"
                                            className="w-full h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Visual Marker (Emoji)</label>
                                        <div className="flex gap-2">
                                            {['🎯', '💎', '📈', '🚀', '🏖️', '🏠'].map(e => (
                                                <button
                                                    key={e}
                                                    onClick={() => updateField('emoji', e)}
                                                    className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all",
                                                        formData.emoji === e ? "bg-purple-500 border-purple-500" : "bg-white/5 border-white/10 hover:border-white/20"
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
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Financial Ambition</h2>
                                    <p className="text-slate-500 font-medium">Define your target and timeline for achievement.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col">
                                            <span className="text-xs font-black text-slate-500 uppercase leading-none mb-1">Target</span>
                                            <span className="text-2xl font-black text-purple-500">RM</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={formData.target_amount || ''}
                                            onChange={(e) => updateField('target_amount', Number(e.target.value))}
                                            className="w-full h-32 bg-white/5 border-white/10 rounded-[2.5rem] pl-32 pr-10 text-6xl font-black text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none font-mono"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            <Target size={40} className="text-white/5 group-focus-within:text-purple-500/20 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Target Achievement Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.target_date?.split('T')[0] || ''}
                                                    onChange={(e) => updateField('target_date', e.target.value)}
                                                    className="w-full h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-6 font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Initial Starting Capital</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">RM</span>
                                                <input
                                                    type="number"
                                                    value={formData.current_amount || ''}
                                                    onChange={(e) => updateField('current_amount', Number(e.target.value))}
                                                    className="w-full h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-6 font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Card className="p-6 bg-purple-500/10 border-purple-500/20 shadow-none relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Sparkles size={100} />
                                    </div>
                                    <div className="flex gap-5 relative z-10">
                                        <div className="p-3 bg-purple-500/20 rounded-2xl h-fit">
                                            {isAnalyzing ? <Loader2 className="text-purple-400 animate-spin" size={24} /> : <Sparkles className="text-purple-400" size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-black text-white tracking-tight">Feasibility Analysis</h4>
                                                {!feasibilityResult && (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={handleAnalyzeFeasibility}
                                                        disabled={isAnalyzing || !formData.target_amount || !formData.target_date}
                                                        className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-500/20 px-3 h-7 rounded-lg"
                                                    >
                                                        Run AI Audit
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                                {feasibilityResult
                                                    ? (feasibilityResult.analysis?.find((a: any) => a.goal_name.toLowerCase() === (formData.name?.toLowerCase() || ''))?.advice || feasibilityResult.strategic_move)
                                                    : `Saving RM ${formData.target_amount?.toLocaleString() || '---'} by ${formData.target_date || 'TBD'} requires RM ${(formData.target_amount && formData.target_date) ? Math.ceil(formData.target_amount / 12).toLocaleString() : '---'}/month.`
                                                }
                                            </p>
                                            {feasibilityResult && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${feasibilityResult.feasibility_score || 50}%` }}
                                                            className={cn(
                                                                "h-full",
                                                                (feasibilityResult.feasibility_score || 50) > 70 ? "bg-emerald-500" : (feasibilityResult.feasibility_score || 50) > 40 ? "bg-amber-500" : "bg-red-500"
                                                            )}
                                                        />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest",
                                                        (feasibilityResult.feasibility_score || 50) > 70 ? "text-emerald-500" : (feasibilityResult.feasibility_score || 50) > 40 ? "text-amber-500" : "text-red-500"
                                                    )}>
                                                        {(feasibilityResult.feasibility_score || 50) > 70 ? 'High' : (feasibilityResult.feasibility_score || 50) > 40 ? 'Moderate' : 'Challenging'} Confidence
                                                    </span>
                                                </div>
                                            )}
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
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Automation Engine</h2>
                                    <p className="text-slate-500 font-medium">Configure your contribution recurring rules.</p>
                                </div>

                                <div className="space-y-6">
                                    <RuleToggle
                                        icon={<RefreshCw size={20} />}
                                        label="Autonomous Inflow"
                                        desc="Enable programmatic contributions to this goal"
                                        checked={!!formData.auto_contribute_enabled}
                                        onChange={(c) => updateField('auto_contribute_enabled', c)}
                                        color="purple"
                                    />

                                    {formData.auto_contribute_enabled && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="grid grid-cols-2 gap-6 p-8 rounded-[2rem] bg-white/5 border border-white/10"
                                        >
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Contribution Interval</label>
                                                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                                                    {['weekly', 'monthly'].map(p => (
                                                        <button
                                                            key={p}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                updateField('auto_contribute_frequency', p);
                                                            }}
                                                            className={cn(
                                                                "flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                                formData.auto_contribute_frequency === p ? "bg-white/10 text-white" : "text-slate-500"
                                                            )}
                                                        >
                                                            {p}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Quantum per Inflow</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">RM</span>
                                                    <input
                                                        type="number"
                                                        value={formData.auto_contribute_amount || ''}
                                                        onChange={(e) => updateField('auto_contribute_amount', Number(e.target.value))}
                                                        className="w-full h-11 bg-white/5 border-white/10 rounded-xl pl-12 pr-6 font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono text-sm"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <Rocket size={120} />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div>
                                            <p className="text-white/70 text-sm font-black uppercase tracking-[0.3em] mb-2">Strategy Summary</p>
                                            <h3 className="text-4xl font-black tracking-tight leading-none mb-4">
                                                RM {formData.target_amount?.toLocaleString()} <span className="text-xl opacity-60 font-medium">Goal</span>
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.name}</span>
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.auto_contribute_enabled ? 'Auto-Flow ON' : 'Manual Flow'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSaving}
                                            className="w-full md:w-auto h-16 px-10 bg-white text-purple-600 hover:bg-purple-50 rounded-2xl font-black text-lg shadow-xl"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" /> : (isEdit ? 'Update Strategy' : 'Ignite Goal')}
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
                        disabled={step === 1 || isSaving}
                        className="px-8 h-12 rounded-xl text-slate-500 font-bold hover:bg-white/5"
                    >
                        Previous
                    </Button>
                    {step < 3 && (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && (!formData.goal_type || !formData.name)) ||
                                (step === 2 && !formData.target_amount)
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white px-10 h-12 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                        >
                            Continue <ArrowRight size={18} className="ml-2" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

function RuleToggle({ icon, label, desc, checked, onChange, color }: { icon: any, label: string, desc: string, checked: boolean, onChange: (v: boolean) => void, color: 'purple' | 'blue' }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "w-full p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all group",
                checked
                    ? (color === 'purple' ? "bg-purple-500/10 border-purple-500" : "bg-primary-500/10 border-primary-500")
                    : "bg-white/5 border-white/5 hover:border-white/20"
            )}
        >
            <div className="flex items-center gap-5 text-left">
                <div className={cn(
                    "p-3 rounded-2xl transition-all",
                    checked
                        ? (color === 'purple' ? "bg-purple-500 text-white" : "bg-primary-500 text-white")
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
                checked ? (color === 'purple' ? "bg-purple-500" : "bg-primary-500") : "bg-slate-700"
            )}>
                <motion.div
                    animate={{ x: checked ? 26 : 4 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                />
            </div>
        </button>
    );
}
