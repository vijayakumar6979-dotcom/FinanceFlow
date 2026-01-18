import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BillService, Bill, MALAYSIAN_BILL_PROVIDERS } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { toast } from 'react-hot-toast';

export default function EditBill() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState<Bill | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [billName, setBillName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [isVariable, setIsVariable] = useState(false);
    const [fixedAmount, setFixedAmount] = useState(0);
    const [estimatedAmount, setEstimatedAmount] = useState(0);
    const [dueDay, setDueDay] = useState(1);
    const [autoPayEnabled, setAutoPayEnabled] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (id) {
            loadBill(id);
        }
    }, [id]);

    const loadBill = async (billId: string) => {
        try {
            setIsLoading(true);
            const billService = new BillService(supabase);
            const billData = await billService.getBillById(billId);

            if (billData) {
                setBill(billData);
                // Populate form
                setBillName(billData.bill_name);
                setAccountNumber(billData.account_number || '');
                setIsVariable(billData.is_variable);
                setFixedAmount(billData.fixed_amount || 0);
                setEstimatedAmount(billData.estimated_amount || 0);
                setDueDay(billData.due_day);
                setAutoPayEnabled(billData.auto_pay_enabled);
                setNotes(billData.notes || '');
            }
        } catch (error) {
            console.error('Failed to load bill:', error);
            toast.error('Failed to load bill');
            navigate('/bills');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSaving(true);
        try {
            const billService = new BillService(supabase);
            await billService.updateBill(id, {
                bill_name: billName,
                account_number: accountNumber || undefined,
                is_variable: isVariable,
                fixed_amount: isVariable ? undefined : fixedAmount,
                estimated_amount: isVariable ? estimatedAmount : undefined,
                due_day: dueDay,
                auto_pay_enabled: autoPayEnabled,
                notes: notes || undefined,
            });

            toast.success('Bill updated successfully!');
            navigate('/bills');
        } catch (error) {
            console.error('Failed to update bill:', error);
            toast.error('Failed to update bill');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading bill...</p>
                </div>
            </div>
        );
    }

    if (!bill) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bill not found</h2>
                <p className="text-slate-500 mb-6">The bill you're trying to edit doesn't exist.</p>
                <Button onClick={() => navigate('/bills')}>Back to Bills</Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/bills')} className="gap-2">
                    <ArrowLeft size={18} />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Bill</h1>
                    <p className="text-slate-500">{bill.provider_name}</p>
                </div>
            </div>

            {/* Form */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bill Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Bill Name *
                        </label>
                        <input
                            type="text"
                            value={billName}
                            onChange={(e) => setBillName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Account Number
                        </label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Bill Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Bill Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!isVariable}
                                    onChange={() => setIsVariable(false)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-slate-900 dark:text-white">Fixed Amount</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={isVariable}
                                    onChange={() => setIsVariable(true)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-slate-900 dark:text-white">Variable Amount</span>
                            </label>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {isVariable ? 'Estimated Amount' : 'Fixed Amount'} *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                {bill.currency}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                value={isVariable ? estimatedAmount : fixedAmount}
                                onChange={(e) => isVariable
                                    ? setEstimatedAmount(parseFloat(e.target.value))
                                    : setFixedAmount(parseFloat(e.target.value))
                                }
                                className="w-full pl-16 pr-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Due Day */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Due Day of Month *
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={dueDay}
                            onChange={(e) => setDueDay(parseInt(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">Day of the month when this bill is due (1-31)</p>
                    </div>

                    {/* Auto-Pay */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Auto-Pay Enabled</p>
                            <p className="text-sm text-slate-500">Automatically pay this bill</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoPayEnabled}
                                onChange={(e) => setAutoPayEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Add any notes about this bill..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/bills')}
                            className="flex-1"
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            disabled={isSaving}
                        >
                            <Save size={18} />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
