import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AccountProps } from '@/components/accounts/AccountCard';
import { accountService } from '@/services/account.service';
import { createTransactionService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { formatCurrency } from '@financeflow/shared';

const transactionService = createTransactionService(supabase);

interface PaymentModalProps {
    creditCardAccount: AccountProps;
    onClose: () => void;
    onSuccess: () => void;
}

type PaymentType = 'minimum' | 'full' | 'custom';

export function PaymentModal({ creditCardAccount, onClose, onSuccess }: PaymentModalProps) {
    const [paymentType, setPaymentType] = useState<PaymentType>('full');
    const [customAmount, setCustomAmount] = useState('');
    const [sourceAccountId, setSourceAccountId] = useState('');
    const [availableAccounts, setAvailableAccounts] = useState<AccountProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const outstandingBalance = Math.abs(creditCardAccount.balance);
    const minimumPayment = Math.max(
        outstandingBalance * ((creditCardAccount.minimum_payment_percentage || 5.0) / 100),
        25
    );

    useEffect(() => {
        loadAvailableAccounts();
    }, []);

    const loadAvailableAccounts = async () => {
        try {
            const accounts = await accountService.getAll();
            // Filter out credit cards and the current account, show only accounts with positive balance
            const eligible = accounts.filter(
                acc => acc.id !== creditCardAccount.id &&
                    acc.type !== 'credit_card' &&
                    acc.balance > 0
            );
            setAvailableAccounts(eligible);
            if (eligible.length > 0) {
                setSourceAccountId(eligible[0].id);
            }
        } catch (error) {
            console.error('Failed to load accounts:', error);
            setError('Failed to load payment accounts');
        }
    };

    const getPaymentAmount = (): number => {
        switch (paymentType) {
            case 'minimum':
                return minimumPayment;
            case 'full':
                return outstandingBalance;
            case 'custom':
                return parseFloat(customAmount) || 0;
            default:
                return 0;
        }
    };

    const handlePayment = async () => {
        try {
            setIsLoading(true);
            setError('');

            const paymentAmount = getPaymentAmount();

            if (paymentAmount <= 0) {
                setError('Payment amount must be greater than 0');
                return;
            }

            if (!sourceAccountId) {
                setError('Please select a payment account');
                return;
            }

            const sourceAccount = availableAccounts.find(acc => acc.id === sourceAccountId);
            if (!sourceAccount) {
                setError('Source account not found');
                return;
            }

            if (sourceAccount.balance < paymentAmount) {
                setError('Insufficient funds in selected account');
                return;
            }

            if (paymentAmount > outstandingBalance) {
                setError('Payment amount cannot exceed outstanding balance');
                return;
            }

            // Create transaction for the payment
            await transactionService.create({
                account_id: creditCardAccount.id,
                category_id: undefined, // No category needed for payment transactions
                type: 'income', // Payment reduces credit card debt (income for credit card account)
                amount: paymentAmount,
                description: `Credit Card Payment - ${creditCardAccount.name}`,
                date: new Date().toISOString(),
                notes: `Payment from ${sourceAccount.name}`,
            });

            // Create corresponding debit transaction for source account
            await transactionService.create({
                account_id: sourceAccountId,
                category_id: undefined, // No category needed for payment transactions
                type: 'expense',
                amount: paymentAmount,
                description: `Credit Card Payment - ${creditCardAccount.name}`,
                date: new Date().toISOString(),
                notes: `Payment to ${creditCardAccount.name}`,
            });

            // Update credit card balance (reduce debt)
            // Credit cards have negative balances (e.g., -1000 means RM1000 owed)
            // To reduce debt, we SUBTRACT the payment (make it less negative)
            const newCreditCardBalance = creditCardAccount.balance - paymentAmount;
            await accountService.updateBalance(creditCardAccount.id, newCreditCardBalance);

            // Update source account balance
            const newSourceBalance = sourceAccount.balance - paymentAmount;
            await accountService.updateBalance(sourceAccountId, newSourceBalance);

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Payment failed:', error);
            setError('Payment failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#121629] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Make Payment</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Credit Card Info */}
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Paying to</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{creditCardAccount.name}</p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            Outstanding: {formatCurrency(outstandingBalance, creditCardAccount.currency)}
                        </p>
                    </div>

                    {/* Payment Type Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Payment Amount</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setPaymentType('minimum')}
                                className={`p-3 rounded-xl border-2 transition-all ${paymentType === 'minimum'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300'
                                    }`}
                            >
                                <p className="text-xs text-slate-500 dark:text-gray-400">Minimum</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(minimumPayment, creditCardAccount.currency)}</p>
                            </button>
                            <button
                                onClick={() => setPaymentType('full')}
                                className={`p-3 rounded-xl border-2 transition-all ${paymentType === 'full'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300'
                                    }`}
                            >
                                <p className="text-xs text-slate-500 dark:text-gray-400">Full</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(outstandingBalance, creditCardAccount.currency)}</p>
                            </button>
                            <button
                                onClick={() => setPaymentType('custom')}
                                className={`p-3 rounded-xl border-2 transition-all ${paymentType === 'custom'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300'
                                    }`}
                            >
                                <p className="text-xs text-slate-500 dark:text-gray-400">Custom</p>
                                <p className="font-semibold text-slate-900 dark:text-white">Amount</p>
                            </button>
                        </div>
                    </div>

                    {/* Custom Amount Input */}
                    {paymentType === 'custom' && (
                        <Input
                            label="Payment Amount"
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            max={outstandingBalance.toString()}
                        />
                    )}

                    {/* Source Account Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Pay from</label>
                        {availableAccounts.length === 0 ? (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                    No accounts available with sufficient funds
                                </p>
                            </div>
                        ) : (
                            <select
                                value={sourceAccountId}
                                onChange={(e) => setSourceAccountId(e.target.value)}
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
                            onClick={handlePayment}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                            disabled={isLoading || availableAccounts.length === 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay ${formatCurrency(getPaymentAmount(), creditCardAccount.currency)}`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
