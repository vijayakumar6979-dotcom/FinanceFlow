import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AccountProps } from '@/components/accounts/AccountCard';
import { accountService } from '@/services/account.service';
import { createTransactionService, TransactionCategory } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { formatCurrency } from '@financeflow/shared';

const transactionService = createTransactionService(supabase);

interface AddMoneyModalProps {
    account: AccountProps;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddMoneyModal({ account, onClose, onSuccess }: AddMoneyModalProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const allCategories = await transactionService.getCategories();
            // Filter for income categories
            const incomeCategories = allCategories.filter(cat => cat.type === 'income');
            setCategories(incomeCategories);
            if (incomeCategories.length > 0) {
                setCategoryId(incomeCategories[0].id);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
            setError('Failed to load transaction categories');
        }
    };

    const handleAddMoney = async () => {
        try {
            setIsLoading(true);
            setError('');

            const depositAmount = parseFloat(amount);

            if (!depositAmount || depositAmount <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            if (!description.trim()) {
                setError('Please enter a description');
                return;
            }

            if (!categoryId) {
                setError('Please select a category');
                return;
            }

            // Create income transaction
            await transactionService.create({
                account_id: account.id,
                category_id: categoryId,
                type: 'income',
                amount: depositAmount,
                description: description.trim(),
                date: new Date().toISOString(),
            });

            // Update account balance
            const newBalance = account.balance + depositAmount;
            await accountService.updateBalance(account.id, newBalance);

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Add money failed:', error);
            setError('Failed to add money. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#121629] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Money</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Account Info */}
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Adding to</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{account.name}</p>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
                            Current Balance: {formatCurrency(account.balance, account.currency)}
                        </p>
                    </div>

                    {/* Amount Input */}
                    <Input
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                    />

                    {/* Description Input */}
                    <Input
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Salary, Gift, Bonus"
                    />

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Category</label>
                        {categories.length === 0 ? (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                    No income categories available
                                </p>
                            </div>
                        ) : (
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMoney}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Add Money'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
