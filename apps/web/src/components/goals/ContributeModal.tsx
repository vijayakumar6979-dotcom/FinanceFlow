import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useContributeToGoal } from '@/hooks/useGoals';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';

interface ContributeModalProps {
    goalId: string;
    goalName: string;
    currentAmount: number;
    targetAmount: number;
    isOpen: boolean;
    onClose: () => void;
}

const QUICK_AMOUNTS = [50, 100, 200, 500];

export function ContributeModal({
    goalId,
    goalName,
    currentAmount,
    targetAmount,
    isOpen,
    onClose,
}: ContributeModalProps) {
    const [amount, setAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [note, setNote] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const contributeToGoal = useContributeToGoal();

    // Fetch user accounts
    const { data: accounts = [] } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id)
                .order('name');

            if (error) throw error;
            return data || [];
        },
        enabled: isOpen,
    });

    const handleQuickAmount = (quickAmount: number) => {
        setAmount(quickAmount.toString());
    };

    const handleContribute = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            return;
        }

        await contributeToGoal.mutateAsync({
            goal_id: goalId,
            amount: parseFloat(amount),
            source_account_id: selectedAccount || undefined,
            notes: note || undefined,
            contribution_date: new Date().toISOString().split('T')[0],
            user_id: '', // Will be set by the hook
        });

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
            setAmount('');
            setNote('');
            setSelectedAccount('');
        }, 2000);
    };

    const remaining = targetAmount - currentAmount;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-800 overflow-hidden">
                            {/* Success Animation */}
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        className="absolute inset-0 bg-emerald-500 flex items-center justify-center z-10"
                                    >
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                            >
                                                <Check className="w-20 h-20 text-white mx-auto" />
                                            </motion.div>
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-white text-xl font-bold mt-4"
                                            >
                                                Contribution Added! 💰
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Header */}
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Contribute to Goal</h2>
                                        <p className="text-sm text-slate-400 mt-1">{goalName}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Progress */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>Current: RM {currentAmount.toLocaleString()}</span>
                                        <span>Remaining: RM {remaining.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                                            style={{ width: `${Math.min((currentAmount / targetAmount) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Amount Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Contribution Amount
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            RM
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Quick Amounts */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Quick Amounts
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {QUICK_AMOUNTS.map((quickAmount) => (
                                            <button
                                                key={quickAmount}
                                                onClick={() => handleQuickAmount(quickAmount)}
                                                className={`py-2 px-3 rounded-lg border transition-all ${amount === quickAmount.toString()
                                                        ? 'bg-primary-500 border-primary-400 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-primary-500'
                                                    }`}
                                            >
                                                RM {quickAmount}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Source Account */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Source Account (Optional)
                                    </label>
                                    <select
                                        value={selectedAccount}
                                        onChange={(e) => setSelectedAccount(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="">Select account...</option>
                                        {accounts.map((account: any) => (
                                            <option key={account.id} value={account.id}>
                                                {account.name} - RM {account.balance?.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Note (Optional)
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a note about this contribution..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-800 flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleContribute}
                                    disabled={!amount || parseFloat(amount) <= 0 || contributeToGoal.isPending}
                                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                                >
                                    {contributeToGoal.isPending ? 'Contributing...' : 'Contribute'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
