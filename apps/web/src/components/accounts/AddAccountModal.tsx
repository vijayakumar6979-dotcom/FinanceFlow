import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Building2, CreditCard, Wallet, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BankSelector } from './BankSelector';
import { CurrencySelector } from '@/components/settings/CurrencySelector';
import { Institution } from '@financeflow/shared';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (account: any) => void;
}

type Step = 'type_selection' | 'details' | 'confirmation';
type AccountType = 'bank' | 'credit_card' | 'ewallet' | 'cash';

export function AddAccountModal({ isOpen, onClose, onSave }: AddAccountModalProps) {
    const [step, setStep] = useState<Step>('type_selection');
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        currency: 'MYR',
        accountNumber: '',
        creditLimit: '',
        linkedPhone: '',
    });

    const reset = () => {
        setStep('type_selection');
        setAccountType(null);
        setInstitution(null);
        setFormData({ name: '', balance: '', currency: 'MYR', accountNumber: '', creditLimit: '', linkedPhone: '' });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleTypeSelect = (type: AccountType) => {
        setAccountType(type);
        setStep('details');
        if (type === 'cash') {
            setFormData(prev => ({ ...prev, name: 'Cash on Hand' }));
        }
    };

    const handleSave = () => {
        const newAccount = {
            id: Math.random().toString(36).substr(2, 9),
            type: accountType === 'bank' ? 'bank_checking' : accountType,
            name: formData.name,
            balance: parseFloat(formData.balance) || 0,
            currency: formData.currency,
            institution: institution ? {
                name: institution.name,
                logo: institution.logo,
                color: institution.color
            } : undefined,
            ...(accountType === 'credit_card' && {
                creditLimit: parseFloat(formData.creditLimit) || 0,
                usage: 0
            }),
            ...(formData.accountNumber && { accountNumber: formData.accountNumber }),
            ...(formData.linkedPhone && { linked_phone: formData.linkedPhone })
        };
        onSave(newAccount);
        handleClose();
    };

    const renderTypeSelection = () => (
        <div className="grid grid-cols-2 gap-4">
            {[
                { id: 'bank', label: 'Bank Account', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard, color: 'text-red-400', bg: 'bg-red-400/10' },
                { id: 'ewallet', label: 'E-Wallet', icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-green-400', bg: 'bg-green-400/10' }
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleTypeSelect(item.id as AccountType)}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-3 group"
                >
                    <div className={`p-4 rounded-xl ${item.bg}`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
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
            <div className="space-y-6">
                {(isBank || isCard || isWallet) && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            {isBank ? 'Select Bank' : isCard ? 'Card Provider' : 'E-Wallet Provider'}
                        </label>
                        <div className="h-64 border border-white/10 rounded-xl overflow-hidden bg-black/20">
                            <BankSelector
                                type={isCard ? 'card' : isWallet ? 'ewallet' : 'bank'}
                                value={institution?.id}
                                onChange={setInstitution}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={isCard ? "Current Balance (Outstanding)" : "Current Balance"}
                            type="number"
                            value={formData.balance}
                            onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
                            placeholder="0.00"
                        />
                    </div>

                    <CurrencySelector
                        value={formData.currency}
                        onChange={(code) => setFormData(prev => ({ ...prev, currency: code }))}
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121629] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">
                        {step === 'type_selection' ? 'Select Account Type' : 'Account Details'}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {step === 'type_selection' ? renderTypeSelection() : renderDetailsForm()}
                </div>

                <div className="p-6 border-t border-white/10 flex justify-between bg-[#0A0E27]">

                    {step !== 'type_selection' ? (
                        <Button variant="ghost" onClick={() => setStep('type_selection')}>
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step !== 'type_selection' && (
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600"
                            onClick={handleSave}
                            disabled={
                                !formData.name ||
                                (!formData.balance && accountType !== 'credit_card') ||
                                ((accountType === 'bank' || accountType === 'credit_card' || accountType === 'ewallet') && !institution)
                            }
                        >
                            Create Account
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
