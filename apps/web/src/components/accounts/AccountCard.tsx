import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Banknote, Building2, MoreVertical, Star, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
    usage?: number; // percentage 0-100
    linked_phone?: string;
    linked_email?: string;
    isFavorite?: boolean;
}

interface AccountCardProps {
    account: AccountProps;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
}

export function AccountCard({ account, onEdit, onDelete, onView }: AccountCardProps) {
    const [showNumber, setShowNumber] = React.useState(false);

    const getIcon = () => {
        switch (account.type) {
            case 'credit_card': return <CreditCard className="w-6 h-6 text-white" />;
            case 'ewallet': return <Wallet className="w-6 h-6 text-white" />;
            case 'cash': return <Banknote className="w-6 h-6 text-white" />;
            default: return <Building2 className="w-6 h-6 text-white" />;
        }
    };

    const getTypeColor = () => {
        return accountTypeColors[account.type] || '#64748B';
    };

    const formatAccountNumber = (num: string) => {
        if (!num) return '';
        if (showNumber) return num;
        return `•••• •••• •••• ${num.slice(-4)}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="relative overflow-hidden group h-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                {/* Background Gradient Accent */}
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ background: account.institution?.color || getTypeColor() }}
                />

                <div className="p-1">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center backdrop-blur-sm border border-gray-200 dark:border-white/10">
                                {account.institution?.logo ? (
                                    <img
                                        src={account.institution.logo}
                                        alt={account.institution.name}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={cn("hidden", !account.institution?.logo && "block")}>
                                    {getIcon()}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{account.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">
                                    {account.institution?.name || account.type.replace('_', ' ').toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit?.(account.id)}>
                                <Edit2 className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete?.(account.id)}>
                                <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Current Balance</p>
                            <div className={cn(
                                "text-2xl font-bold font-mono",
                                account.balance >= 0 ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"
                            )}>
                                {formatCurrency(account.balance, account.currency)}
                            </div>
                        </div>

                        {account.accountNumber && (
                            <div className="flex items-center gap-2 group/number">
                                <p className="text-sm text-slate-500 dark:text-gray-500 font-mono tracking-wider">
                                    {formatAccountNumber(account.accountNumber)}
                                </p>
                                <button
                                    onClick={() => setShowNumber(!showNumber)}
                                    className="opacity-0 group-hover/number:opacity-100 transition-opacity"
                                >
                                    {showNumber ?
                                        <EyeOff className="w-3 h-3 text-slate-400 dark:text-gray-500" /> :
                                        <Eye className="w-3 h-3 text-slate-400 dark:text-gray-500" />
                                    }
                                </button>
                            </div>
                        )}

                        {account.type === 'credit_card' && account.creditLimit && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 dark:text-gray-400">Utilization</span>
                                    <span className={cn(
                                        "font-medium",
                                        (account.usage || 0) > 70 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                                    )}>{account.usage}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            (account.usage || 0) > 70 ? "bg-red-500" :
                                                (account.usage || 0) > 30 ? "bg-yellow-500" : "bg-green-500"
                                        )}
                                        style={{ width: `${Math.min(account.usage || 0, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-gray-500">
                                    <span>Limit: {formatCurrency(account.creditLimit, account.currency)}</span>
                                    <span>Available: {formatCurrency(account.creditLimit - Math.abs(account.balance), account.currency)}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                variant="outline"
                                className="w-full border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-slate-700 dark:text-white"
                                onClick={() => onView?.(account.id)}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
