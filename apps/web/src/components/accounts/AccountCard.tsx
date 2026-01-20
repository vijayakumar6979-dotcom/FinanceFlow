import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { CreditCard, Wallet, Banknote, Building2, Eye, EyeOff, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency, accountTypeColors } from '@financeflow/shared';
import { cn } from '@/utils/cn';

export interface AccountProps {
    id: string;
    name: string;
    type: 'bank_checking' | 'bank_savings' | 'credit_card' | 'ewallet' | 'cash';
    balance: number;
    currency?: string;
    institution?: {
        name: string;
        logo: string;
        color: string;
    };
    accountNumber?: string;
    creditLimit?: number;
    usage?: number;
    linked_phone?: string;
    linked_email?: string;
    isFavorite?: boolean;
    card_network?: string;
    minimum_payment_percentage?: number;
    payment_due_date?: number;
    statement_date?: number;
    interest_rate?: number;
    annual_fee?: number;
}

interface AccountCardProps {
    account: AccountProps;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
}

export function AccountCard({ account, onEdit, onDelete, onView }: AccountCardProps) {
    const [showNumber, setShowNumber] = useState(false);

    // 3D Tilt Effect
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    const transform = useMotionTemplate`perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;

    const getIcon = () => {
        switch (account.type) {
            case 'credit_card': return <CreditCard className="w-5 h-5" />;
            case 'ewallet': return <Wallet className="w-5 h-5" />;
            case 'cash': return <Banknote className="w-5 h-5" />;
            default: return <Building2 className="w-5 h-5" />;
        }
    };

    const gradient = account.institution?.color
        ? `linear-gradient(135deg, ${account.institution.color}40 0%, ${account.institution.color}10 100%)`
        : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={() => onView?.(account.id)}
            style={{ transformStyle: "preserve-3d", transform: window.innerWidth > 768 ? transform : "none" }}
            className="relative group h-full min-h-[220px] cursor-pointer"
        >
            <div
                className="absolute inset-0 rounded-2xl transition-all duration-300 group-hover:blur-md"
                style={{ background: account.institution?.color || '#3b82f6', opacity: 0.15 }}
            />

            <div
                className={cn(
                    "relative h-full rounded-2xl border border-white/10 p-6 flex flex-col justify-between backdrop-blur-xl overflow-hidden transition-all duration-300",
                    "hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10"
                )}
                style={{ background: gradient }}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                {/* Header */}
                <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-lg">
                            {account.institution?.logo ? (
                                <img src={account.institution.logo} alt={account.institution.name} className="w-6 h-6 object-contain" />
                            ) : getIcon()}
                        </div>
                        <div>
                            <h3 className="font-bold text-white tracking-wide text-sm">{account.name}</h3>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                {account.institution?.name || account.type.replace('_', ' ')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit?.(account.id); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete?.(account.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Balance Section */}
                <div className="relative z-10 py-6">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Total Balance</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className={cn("text-2xl font-black tracking-tight", account.balance < 0 ? "text-rose-400" : "text-white")}>
                            {formatCurrency(Math.abs(account.balance), account.currency)}
                        </h2>
                        {account.type === 'credit_card' && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white/80">
                                {account.balance < 0 ? 'DUE' : 'CR'}
                            </span>
                        )}
                    </div>

                    {account.accountNumber && (
                        <div
                            className="flex items-center gap-2 mt-2 group/number cursor-pointer w-fit"
                            onClick={(e) => { e.stopPropagation(); setShowNumber(!showNumber); }}
                        >
                            <p className="font-mono text-xs text-white/40 tracking-[0.2em] group-hover/number:text-white/60 transition-colors">
                                {showNumber ? account.accountNumber : `••••  ••••  ••••  ${account.accountNumber.slice(-4)}`}
                            </p>
                            {showNumber ? <EyeOff className="w-3 h-3 text-white/20" /> : <Eye className="w-3 h-3 text-white/20" />}
                        </div>
                    )}
                </div>

                {/* Footer/Stats */}
                <div className="relative z-10">
                    {account.type === 'credit_card' && account.creditLimit ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                                <span>Used</span>
                                <span>{account.usage}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(account.usage || 0, 100)}%` }}
                                    className={cn("h-full", (account.usage || 0) > 70 ? "bg-rose-500" : "bg-emerald-500")}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-white/30 font-medium">
                                <span>Limit: {formatCurrency(account.creditLimit)}</span>
                                <span>Left: {formatCurrency(account.creditLimit - Math.abs(account.balance))}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/btn">
                            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">View History</span>
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Add these to global CSS or Tailwind config if missing
// .preserve-3d { transform-style: preserve-3d; }
