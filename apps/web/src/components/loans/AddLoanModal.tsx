import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Car, User, GraduationCap, Briefcase, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, Loan, LoanType } from '@financeflow/shared';
import { loanService } from '@/services/loan.service';

interface AddLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (loan: Loan) => void;
}

type Step = 'type' | 'lender' | 'amounts' | 'terms' | 'review';

const LOAN_TYPES: { id: LoanType; name: string; icon: any; color: string }[] = [
    { id: 'home', name: 'Home Loan', icon: Home, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'auto', name: 'Auto Loan', icon: Car, color: 'text-red-500 bg-red-500/10' },
    { id: 'personal', name: 'Personal Loan', icon: User, color: 'text-green-500 bg-green-500/10' },
    { id: 'education', name: 'Education Loan', icon: GraduationCap, color: 'text-yellow-500 bg-yellow-500/10' },
    { id: 'business', name: 'Business Loan', icon: Briefcase, color: 'text-purple-500 bg-purple-500/10' },
    { id: 'islamic', name: 'Islamic Financing', icon: Star, color: 'text-cyan-500 bg-cyan-500/10' },
];

const MALAYSIAN_BANKS = [
    { id: 'maybank', name: 'Maybank', color: '#FFD700', logo: 'https://www.google.com/s2/favicons?sz=64&domain=maybank2u.com.my' },
    { id: 'cimb', name: 'CIMB Bank', color: '#E31837', logo: 'https://www.google.com/s2/favicons?sz=64&domain=cimb.com.my' },
    { id: 'public', name: 'Public Bank', color: '#ED1C24', logo: 'https://www.google.com/s2/favicons?sz=64&domain=pbebank.com' },
    { id: 'rhb', name: 'RHB Bank', color: '#003DA5', logo: 'https://www.google.com/s2/favicons?sz=64&domain=rhbgroup.com' },
    { id: 'hongleong', name: 'Hong Leong Bank', color: '#0047AB', logo: 'https://www.google.com/s2/favicons?sz=64&domain=hlb.com.my' },
    { id: 'ambank', name: 'AmBank', color: '#C8102E', logo: 'https://www.google.com/s2/favicons?sz=64&domain=ambank.com.my' },
    { id: 'islam', name: 'Bank Islam', color: '#00A651', logo: 'https://www.google.com/s2/favicons?sz=64&domain=bankislam.com.my' },
    { id: 'rakyat', name: 'Bank Rakyat', color: '#F37021', logo: 'https://www.google.com/s2/favicons?sz=64&domain=bankrakyat.com.my' },
];

export function AddLoanModal({ isOpen, onClose, onSave }: AddLoanModalProps) {
    const [step, setStep] = useState<Step>('type');
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [loanType, setLoanType] = useState<LoanType | null>(null);
    const [lender, setLender] = useState<typeof MALAYSIAN_BANKS[0] | null>(null);
    const [details, setDetails] = useState({
        name: '',
        originalAmount: '',
        currentBalance: '',
        interestRate: '',
        termMonths: '12', // default
        startDate: new Date().toISOString().split('T')[0],
        paymentDay: '1',
        monthlyPayment: ''
    });

    const reset = () => {
        setStep('type');
        setLoanType(null);
        setLender(null);
        setDetails({
            name: '',
            originalAmount: '',
            currentBalance: '',
            interestRate: '',
            termMonths: '60',
            startDate: new Date().toISOString().split('T')[0],
            paymentDay: '1',
            monthlyPayment: ''
        });
        setIsLoading(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const autoCalculatePayment = () => {
        const principal = parseFloat(details.originalAmount);
        const rate = parseFloat(details.interestRate) / 100 / 12;
        const months = parseInt(details.termMonths);

        if (principal && rate && months) {
            const pmt = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
            setDetails(prev => ({ ...prev, monthlyPayment: pmt.toFixed(2) }));
        }
    };

    useEffect(() => {
        // Auto-calculate payment when dependencies change if payment is empty or seemingly auto-generated
        if (['amounts', 'terms'].includes(step)) {
            autoCalculatePayment();
        }
    }, [details.originalAmount, details.interestRate, details.termMonths]);

    const handleSave = async () => {
        if (!loanType || !lender) return;
        setIsLoading(true);

        try {
            console.log('Attempting to create loan with details:', {
                ...details,
                lender,
                loanType
            });
            const payload = {
                name: details.name || `${lender.name} ${loanType}`,
                lender_id: lender.id,
                lender_name: lender.name,
                lender_logo: lender.logo,
                loan_type: loanType,
                original_amount: parseFloat(details.originalAmount),
                current_balance: parseFloat(details.currentBalance) || parseFloat(details.originalAmount),
                interest_rate: parseFloat(details.interestRate),
                start_date: details.startDate,
                term_months: parseInt(details.termMonths),
                monthly_payment: parseFloat(details.monthlyPayment),
                payment_day: parseInt(details.paymentDay),
                status: 'active' as const // Explicitly cast to literal type
            };
            console.log('Sending payload:', payload);

            const newLoan = await loanService.create(payload);
            console.log('Loan created successfully:', newLoan);
            onSave(newLoan);
            handleClose();
        } catch (error) {
            console.error('Failed to create loan - Full Error:', error);
            alert(`Failed to create loan: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 'type') setStep('lender');
        else if (step === 'lender') setStep('amounts');
        else if (step === 'amounts') setStep('terms');
        else if (step === 'terms') setStep('review');
    };

    const prevStep = () => {
        if (step === 'lender') setStep('type');
        else if (step === 'amounts') setStep('lender');
        else if (step === 'terms') setStep('amounts');
        else if (step === 'review') setStep('terms');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121629] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0A0E27]">
                    <div>
                        <h2 className="text-xl font-bold text-white">Add New Loan</h2>
                        <p className="text-sm text-gray-400">Step {['type', 'lender', 'amounts', 'terms', 'review'].indexOf(step) + 1} of 5</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <AnimatePresence mode="wait">
                        {step === 'type' && (
                            <motion.div
                                key="type"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                {LOAN_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => { setLoanType(type.id); nextStep(); }}
                                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-4 group text-center"
                                    >
                                        <div className={`p-4 rounded-xl ${type.color}`}>
                                            <type.icon className="w-8 h-8" />
                                        </div>
                                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                            {type.name}
                                        </span>
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {step === 'lender' && (
                            <motion.div
                                key="lender"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <Input label="Search Bank" placeholder="Search bank..." className="mb-4" />
                                <div className="grid grid-cols-2 gap-4">
                                    {MALAYSIAN_BANKS.map((bank) => (
                                        <button
                                            key={bank.id}
                                            onClick={() => { setLender(bank); nextStep(); }}
                                            className="flex items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-3 text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
                                                {/* Use Bank Logo URL or fallback */}
                                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                                                    {bank.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            </div>
                                            <span className="font-medium text-white">{bank.name}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setLender({ id: 'other', name: 'Other Lender', color: '#666', logo: '' }); nextStep(); }}
                                        className="flex items-center p-4 rounded-xl bg-white/5 border border-dashed border-white/20 hover:bg-white/10 transition-all gap-3 text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Plus className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <span className="font-medium text-gray-300">Other Lender</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'amounts' && (
                            <motion.div
                                key="amounts"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Input
                                    label="Loan Name (Optional)"
                                    placeholder={`${lender?.name} ${LOAN_TYPES.find(t => t.id === loanType)?.name || 'Loan'}`}
                                    value={details.name}
                                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                />
                                <Input
                                    label="Original Loan Amount (MYR)"
                                    type="number"
                                    placeholder="0.00"
                                    value={details.originalAmount}
                                    onChange={(e) => setDetails({ ...details, originalAmount: e.target.value })}
                                />
                                <Input
                                    label="Current Balance (MYR)"
                                    type="number"
                                    placeholder="Same as original if new"
                                    value={details.currentBalance}
                                    onChange={(e) => setDetails({ ...details, currentBalance: e.target.value })}
                                />
                                <Input
                                    label="Annual Interest Rate (%)"
                                    type="number"
                                    placeholder="e.g. 4.5"
                                    value={details.interestRate}
                                    onChange={(e) => setDetails({ ...details, interestRate: e.target.value })}
                                />
                            </motion.div>
                        )}

                        {step === 'terms' && (
                            <motion.div
                                key="terms"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Loan Term (Months)"
                                        type="number"
                                        value={details.termMonths}
                                        onChange={(e) => setDetails({ ...details, termMonths: e.target.value })}
                                    />
                                    <Input
                                        label="Start Date"
                                        type="date"
                                        value={details.startDate}
                                        onChange={(e) => setDetails({ ...details, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Monthly Payment (MYR)"
                                        type="number"
                                        value={details.monthlyPayment}
                                        onChange={(e) => setDetails({ ...details, monthlyPayment: e.target.value })}
                                    />
                                    <Input
                                        label="Payment Day"
                                        type="number"
                                        min="1" max="31"
                                        value={details.paymentDay}
                                        onChange={(e) => setDetails({ ...details, paymentDay: e.target.value })}
                                    />
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <p className="text-sm text-blue-300">
                                        Based on your inputs, this loan will be paid off by{' '}
                                        <span className="font-bold">
                                            {new Date(new Date(details.startDate).setMonth(new Date(details.startDate).getMonth() + parseInt(details.termMonths || '0'))).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </span>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                            {/* Logo placeholder */}
                                            <div className="text-black font-bold">{lender?.name.substring(0, 2)}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{details.name || `${lender?.name} ${loanType}`}</h3>
                                            <p className="text-gray-400">{lender?.name} • {LOAN_TYPES.find(t => t.id === loanType)?.name}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <div>
                                            <p className="text-gray-500">Original Amount</p>
                                            <p className="text-white font-medium text-lg">{formatCurrency(parseFloat(details.originalAmount))}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Current Balance</p>
                                            <p className="text-white font-medium text-lg">{formatCurrency(parseFloat(details.currentBalance || details.originalAmount))}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Interest Rate</p>
                                            <p className="text-white font-medium">{details.interestRate}% APR</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Monthly Payment</p>
                                            <p className="text-white font-medium">{formatCurrency(parseFloat(details.monthlyPayment))}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Term</p>
                                            <p className="text-white font-medium">{details.termMonths} Months</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Next Payment</p>
                                            <p className="text-white font-medium">Day {details.paymentDay} of month</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between bg-[#0A0E27]">
                    {step !== 'type' ? (
                        <Button variant="ghost" onClick={prevStep} disabled={isLoading}>
                            Back
                        </Button>
                    ) : <div></div>}

                    {step === 'review' ? (
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 w-32"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Loan'}
                        </Button>
                    ) : (
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 w-32"
                            onClick={nextStep}
                            disabled={
                                (step === 'type' && !loanType) ||
                                (step === 'amounts' && (!details.originalAmount || !details.interestRate)) ||
                                (step === 'terms' && !details.monthlyPayment)
                            }
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
