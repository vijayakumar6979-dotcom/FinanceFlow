import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, Loan, LoanService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';

interface MakePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onPaymentSuccess: () => void;
}

export function MakePaymentModal({ isOpen, onClose, loan, onPaymentSuccess }: MakePaymentModalProps) {
    const [amount, setAmount] = useState(loan.monthly_payment.toString());
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentType, setPaymentType] = useState<'regular' | 'extra' | 'lump_sum'>('regular');
    const [isLoading, setIsLoading] = useState(false);
    const loanService = new LoanService(supabase);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            // In a real app, this would create a transaction AND update the amortization schedule
            // For now we just update the loan balance primarily
            const paymentAmount = parseFloat(amount);
            const interestPortion = loan.current_balance * (loan.interest_rate / 100 / 12);
            const principalPortion = paymentAmount - interestPortion;

            const newBalance = Math.max(0, loan.current_balance - principalPortion);

            await loanService.updateLoan(loan.id, {
                current_balance: newBalance
            });

            // TODO: Create Transaction Record via transaction service

            onPaymentSuccess();
            onClose();
        } catch (error) {
            console.error('Payment failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121629] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Make Payment</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-sm text-blue-300 mb-1">Current Balance</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(loan.current_balance)}</p>
                    </div>

                    <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                        {(['regular', 'extra', 'lump_sum'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setPaymentType(type)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentType === type
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {type === 'regular' ? 'Regular' : type === 'extra' ? 'Extra' : 'Lump Sum'}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Amount (MYR)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            icon={<DollarSign className="w-5 h-5" />}
                        />
                        <Input
                            label="Payment Date"
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            icon={<Calendar className="w-5 h-5" />}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#0A0E27]">
                    <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 h-12 text-lg"
                        onClick={handlePayment}
                        disabled={isLoading || !amount || parseFloat(amount) <= 0}
                    >
                        {isLoading ? 'Processing...' : `Pay ${formatCurrency(parseFloat(amount) || 0)}`}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
