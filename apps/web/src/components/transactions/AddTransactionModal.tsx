import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { CategorySelect } from './CategorySelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    ArrowRightLeft,
    TrendingUp,
    TrendingDown,
    Repeat,
    Split,
    Sparkles,
    FileText,
    Wallet
} from 'lucide-react';
import { createTransactionService, createAccountService, CreateTransactionDTO, TransactionCategory, Account } from '@financeflow/shared';
import { supabase } from '@/services/supabase';

const transactionService = createTransactionService(supabase);
const accountService = createAccountService(supabase);

interface AddTransactionModalProps {
    onClose: () => void;
    onSave?: () => void;
}

export function AddTransactionModal({ onClose, onSave }: AddTransactionModalProps) {
    const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);

    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false); // Kept for future use
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoadingCategories(true);
        try {
            const [cats, accs] = await Promise.all([
                transactionService.getCategories(),
                accountService.getAll()
            ]);
            setCategories(cats);
            setAccounts(accs);

            // Default to first account if available
            if (accs.length > 0) {
                setAccountId(accs[0].id);
            } else {
                // If no accounts, maybe create a default one or just warn?
                // For now, let's keep it empty and require user to add one via other flow, 
                // BUT we should probably handle the "no account" case more gracefully.
                // Assuming user has accounts or we'll prompt.
            }
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleSave = async () => {
        if (!accountId) {
            alert("Please create an account first!"); // Simple validation
            return;
        }

        setIsSaving(true);
        try {
            const payload: CreateTransactionDTO = {
                type,
                amount: parseFloat(amount),
                description,
                category_id: categoryId,
                account_id: accountId,
                date: new Date().toISOString(),
                is_recurring: isRecurring,
                is_split: false
            };

            await transactionService.create(payload);
            onSave?.();
            onClose();
        } catch (error) {
            console.error('Failed to save transaction', error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <Modal isOpen={true} onClose={onClose} title="Add Transaction" size="lg">
            <ModalBody className="space-y-6">
                {/* Type Selector */}
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    {(['income', 'expense', 'transfer'] as const).map((t) => (
                        <motion.button
                            key={t}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setType(t)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${type === t
                                ? t === 'income' ? 'bg-green-100 text-green-700 shadow-sm' :
                                    t === 'expense' ? 'bg-red-100 text-red-700 shadow-sm' :
                                        'bg-blue-100 text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {t === 'income' && <TrendingUp size={18} />}
                            {t === 'expense' && <TrendingDown size={18} />}
                            {t === 'transfer' && <ArrowRightLeft size={18} />}
                            <span className="capitalize">{t}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Amount */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">RM</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-8 text-4xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-white/10 focus:border-blue-500 outline-none text-center text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700"
                        autoFocus
                    />
                </div>

                {/* Main Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        icon={<FileText size={18} />}
                    />

                    <div className="relative mb-4">
                        <label className="text-xs text-gray-500 dark:text-gray-400 absolute top-1 left-3 z-10">Category</label>
                        <CategorySelect
                            categories={filteredCategories}
                            value={categoryId}
                            onChange={(id) => setCategoryId(id)}
                            className="mt-1"
                        />
                    </div>

                    {/* Account Selector */}
                    <div className="relative mb-4">
                        <label className="text-xs text-gray-500 dark:text-gray-400 absolute top-1 left-3 z-10">Account</label>
                        <select
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="w-full h-12 pt-4 px-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface appearance-none outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                            <option value="" disabled>Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id} className="bg-white dark:bg-dark-surface">{acc.name} ({acc.currency})</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Wallet size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Advanced Options Toggles */}
                <div className="flex gap-4 pt-2">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsRecurring(!isRecurring)}
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${isRecurring ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                    >
                        <Repeat size={16} /> Recurring
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        <Split size={16} /> Split
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        <Sparkles size={16} /> AI Auto-fill
                    </motion.button>
                </div>

            </ModalBody>
            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} loading={isSaving} disabled={!amount || !description || !categoryId || !accountId}>
                    Save Transaction
                </Button>
            </ModalFooter>
        </Modal>
    );
}
