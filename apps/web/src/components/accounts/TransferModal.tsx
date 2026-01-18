import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AccountProps } from '@/components/accounts/AccountCard';
import { accountService } from '@/services/account.service';
import { createTransactionService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { formatCurrency } from '@financeflow/shared';

const transactionService = createTransactionService(supabase);

interface TransferModalProps {
    sourceAccount: AccountProps;
    onClose: () => void;
    onSuccess: () => void;
}

export function TransferModal({ sourceAccount, onClose, onSuccess }: TransferModalProps) {
    const [amount, setAmount] = useState('');
    const [destinationAccountId, setDestinationAccountId] = useState('');
    const [notes, setNotes] = useState('');
    const [availableAccounts, setAvailableAccounts] = useState<AccountProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAvailableAccounts();
    }, []);

    const loadAvailableAccounts = async () => {
        try {
            const accounts = await accountService.getAll();
            // Filter out the source account and credit cards
            const eligible = accounts.filter(
                acc => acc.id !== sourceAccount.id && acc.type !== 'credit_card'
            );
            setAvailableAccounts(eligible);
            if (eligible.length > 0) {
                setDestinationAccountId(eligible[0].id);
            }
        } catch (error) {
            console.error('Failed to load accounts:', error);
            setError('Failed to load destination accounts');
        }
    };

    const handleTransfer = async () => {
        try {
            setIsLoading(true);
            setError('');

            const transferAmount = parseFloat(amount);

            if (!transferAmount || transferAmount <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            if (!destinationAccountId) {
                setError('Please select a destination account');
                return;
            }

            if (transferAmount > sourceAccount.balance) {
                setError('Insufficient funds');
                return;
            }

            const destinationAccount = availableAccounts.find(acc => acc.id === destinationAccountId);
            if (!destinationAccount) {
                setError('Destination account not found');
                return;
            }

            // Create debit transaction for source account
            await transactionService.create({
                account_id: sourceAccount.id,
                category_id: undefined, // No category needed for transfer transactions
                type: 'transfer',
                amount: transferAmount,
                description: `Transfer to ${destinationAccount.name}`,
                date: new Date().toISOString(),
                notes: notes || undefined,
            });

            // Create credit transaction for destination account
            await transactionService.create({
                account_id: destinationAccountId,
                category_id: undefined, // No category needed for transfer transactions
                type: 'transfer',
                amount: transferAmount,
                description: `Transfer from ${sourceAccount.name}`,
                date: new Date().toISOString(),
                notes: notes || undefined,
            });

            // Update source account balance
            const newSourceBalance = sourceAccount.balance - transferAmount;
            await accountService.updateBalance(sourceAccount.id, newSourceBalance);

            // Update destination account balance
            const newDestinationBalance = destinationAccount.balance + transferAmount;
            await accountService.updateBalance(destinationAccountId, newDestinationBalance);

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Transfer failed:', error);
            setError('Transfer failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#121629] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transfer Money</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Transfer Direction Visualization */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">From</p>
                            <p className="font-semibold text-slate-900 dark:text-white">{sourceAccount.name}</p>
                            <p className="text-sm text-slate-500 dark:text-gray-400">
                                {formatCurrency(sourceAccount.balance, sourceAccount.currency)}
                            </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">To</p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                {availableAccounts.find(acc => acc.id === destinationAccountId)?.name || 'Select account'}
                            </p>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <Input
                        label="Transfer Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        max={sourceAccount.balance.toString()}
                    />

                    {/* Destination Account Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Destination Account</label>
                        {availableAccounts.length === 0 ? (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                    No other accounts available for transfer
                                </p>
                            </div>
                        ) : (
                            <select
                                value={destinationAccountId}
                                onChange={(e) => setDestinationAccountId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {availableAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Notes */}
                    <Input
                        label="Notes (Optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add a note for this transfer"
                    />

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
                            onClick={handleTransfer}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                            disabled={isLoading || availableAccounts.length === 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Transfer'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
