import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, CreditCard, Wallet, Banknote, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BankSelector } from '@/components/accounts/BankSelector';
import { accountService } from '@/services/account.service';
import { Institution } from '@financeflow/shared';

// Reusing types from previous impl or defining locally
type Step = 'type_selection' | 'details' | 'confirmation';
type AccountType = 'bank' | 'credit_card' | 'ewallet' | 'cash';

export default function CreateAccountPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('type_selection');
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        accountNumber: '',
        creditLimit: '',
        linkedPhone: '',
        // Credit card specific fields
        statementDate: '',
        paymentDueDate: '',
        minimumPaymentPercentage: '5',
        interestRate: '',
        annualFee: '',
        cardNetwork: 'Visa',
    });

    const handleTypeSelect = (type: AccountType) => {
        setAccountType(type);
        setStep('details');
        if (type === 'cash') {
            setFormData(prev => ({ ...prev, name: 'Cash on Hand' }));
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const newAccount = {
                type: accountType === 'bank' ? 'bank_checking' : accountType, // Adapt type mapping if needed
                name: formData.name,
                balance: parseFloat(formData.balance) || 0,
                currency: 'MYR',
                institution: institution ? {
                    name: institution.name,
                    logo: institution.logo,
                    color: institution.color
                } : undefined,
                ...(accountType === 'credit_card' && {
                    creditLimit: parseFloat(formData.creditLimit) || 0,
                    statement_date: formData.statementDate ? parseInt(formData.statementDate) : undefined,
                    payment_due_date: formData.paymentDueDate ? parseInt(formData.paymentDueDate) : undefined,
                    minimum_payment_percentage: parseFloat(formData.minimumPaymentPercentage) || 5.0,
                    interest_rate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
                    annual_fee: formData.annualFee ? parseFloat(formData.annualFee) : undefined,
                    card_network: formData.cardNetwork,
                }),
                accountNumber: formData.accountNumber || undefined,
                linked_phone: formData.linkedPhone || undefined,
                isFavorite: false
            };

            // Assuming accountService.create adapts this structure correctly to DB columns
            // The service.create call expects: Partial<AccountProps> & { type: string, institutionName?: string }
            // Let's ensure we match what service expects.
            await accountService.create(newAccount as any);

            navigate('/accounts');
        } catch (error) {
            console.error('Failed to create account:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTypeSelection = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
                { id: 'bank', label: 'Bank Account', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard, color: 'text-red-400', bg: 'bg-red-400/10' },
                { id: 'ewallet', label: 'E-Wallet', icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-green-400', bg: 'bg-green-400/10' }
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleTypeSelect(item.id as AccountType)}
                    className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-blue-500 dark:hover:border-white/10 transition-all gap-4 group shadow-sm dark:shadow-none"
                >
                    <div className={`p-4 rounded-xl ${item.bg}`}>
                        <item.icon className={`w-10 h-10 ${item.color}`} />
                    </div>
                    <span className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    );

    const renderDetailsForm = () => {
        const isBank = accountType === 'bank';
        const isCard = accountType === 'credit_card';
        const isWallet = accountType === 'ewallet';

        return (
            <div className="space-y-8 max-w-2xl mx-auto">
                {(isBank || isCard || isWallet) && (
                    <div className="space-y-3">
                        <label className="text-base font-medium text-slate-900 dark:text-gray-300">
                            {isBank ? 'Select Bank' : isCard ? 'Card Provider' : 'E-Wallet Provider'}
                        </label>
                        <div className="border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 p-4">
                            <BankSelector
                                type={isCard ? 'card' : isWallet ? 'ewallet' : 'bank'}
                                value={institution?.id}
                                onChange={setInstitution}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <Input
                        label="Account Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={isCard ? "e.g., Maybank Visa Platinum" : "e.g., Savings Account"}
                    />

                    {(isBank || isCard) && (
                        <Input
                            label={isCard ? "Card Number (Last 4 digits)" : "Account Number"}
                            value={formData.accountNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                            placeholder="****"
                        />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input
                            label={isCard ? "Current Balance (Outstanding)" : "Current Balance"}
                            type="number"
                            value={formData.balance}
                            onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
                            placeholder="0.00"
                        />
                        {isCard && (
                            <Input
                                label="Credit Limit"
                                type="number"
                                value={formData.creditLimit}
                                onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                                placeholder="0.00"
                            />
                        )}
                        {isWallet && (
                            <Input
                                label="Linked Phone"
                                type="tel"
                                value={formData.linkedPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, linkedPhone: e.target.value }))}
                                placeholder="+60..."
                            />
                        )}
                    </div>

                    {/* Credit Card Configuration Section */}
                    {isCard && (
                        <div className="space-y-6 border-t border-gray-200 dark:border-white/10 pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Credit Card Configuration
                            </h3>

                            {/* Statement & Payment Dates */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Statement Date (Day of Month)
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={formData.statementDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, statementDate: e.target.value }))}
                                        placeholder="e.g., 1"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Day your statement is generated</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Payment Due Date (Day of Month)
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={formData.paymentDueDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentDueDate: e.target.value }))}
                                        placeholder="e.g., 15"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Day your payment is due</p>
                                </div>
                            </div>

                            {/* Interest Rate & Minimum Payment */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Interest Rate (APR %)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={formData.interestRate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                                        placeholder="e.g., 18.00"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Annual percentage rate (optional)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Minimum Payment (%)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        max="100"
                                        value={formData.minimumPaymentPercentage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, minimumPaymentPercentage: e.target.value }))}
                                        placeholder="5.00"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum payment percentage (default 5%)</p>
                                </div>
                            </div>

                            {/* Card Network & Annual Fee */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Card Network
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={formData.cardNetwork}
                                        onChange={(e) => setFormData(prev => ({ ...prev, cardNetwork: e.target.value }))}
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Mastercard</option>
                                        <option value="American Express">American Express</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Annual Fee (Optional)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.annualFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, annualFee: e.target.value }))}
                                        placeholder="e.g., 150.00"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave blank if no annual fee</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2" onClick={() => navigate('/accounts')}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {step === 'type_selection' ? 'Add New Account' : 'Account Details'}
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400">
                        {step === 'type_selection' ? 'Choose the type of account you want to add' : 'Enter your account information'}
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#121629] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-10 shadow-sm dark:shadow-xl"
            >
                {step === 'type_selection' ? renderTypeSelection() : renderDetailsForm()}

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex justify-between">
                    {step !== 'type_selection' && (
                        <Button variant="ghost" onClick={() => setStep('type_selection')}>
                            Back
                        </Button>
                    )}

                    {/* Spacer */}
                    {step === 'type_selection' && <div />}

                    {step !== 'type_selection' && (
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8"
                            onClick={handleSave}
                            disabled={isLoading ||
                                !formData.name ||
                                (!formData.balance && accountType !== 'credit_card') ||
                                ((accountType === 'bank' || accountType === 'credit_card' || accountType === 'ewallet') && !institution)
                            }
                        >
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
