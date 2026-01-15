import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Settings, Filter, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BillCard } from '@/components/bills/BillCard';
import { BillsSummary } from '@/components/bills/BillsSummary';
import { BillService, Bill, BillProvider, MALAYSIAN_BILL_PROVIDERS } from '@financeflow/shared';
import { supabase } from '@/services/supabase';

export default function BillsDashboard() {
    const navigate = useNavigate();
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        try {
            const billService = new BillService(supabase);
            const data = await billService.getBills();

            // Use DB data if available, otherwise fallback to mock for demo
            if (data && data.length > 0) {
                setBills(data);
            } else {
                // Fallback Mock Data
                const dummyBills: Bill[] = MALAYSIAN_BILL_PROVIDERS.slice(0, 5).map((p, i) => ({
                    id: `bill-${i}`,
                    user_id: 'user-1',
                    provider_id: p.id,
                    provider_name: p.name,
                    provider_category: p.category,
                    provider_logo: p.logo,
                    bill_name: `${p.name} Bill`,
                    account_number_masked: `**** ${1000 + i}`,
                    is_variable: p.isVariable,
                    fixed_amount: p.isVariable ? undefined : p.averageAmount,
                    estimated_amount: p.isVariable ? p.averageAmount : undefined,
                    currency: 'MYR',
                    due_day: (i * 5) + 1, // 1st, 6th, 11th...
                    auto_pay_enabled: i % 2 === 0,
                    auto_sync_budget: true,
                    status: i === 0 ? 'overdue' : i === 1 ? 'paid' : 'unpaid',
                    days_until_due: i === 0 ? -2 : i === 1 ? 0 : 5
                }));
                setBills(dummyBills);
            }
        } catch (error) {
            console.error('Failed to load bills', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        totalMonthly: bills.reduce((sum, b) => sum + (b.fixed_amount || b.estimated_amount || 0), 0),
        dueAmount: bills.filter(b => b.status === 'unpaid' && (b.days_until_due || 0) <= 7).reduce((sum, b) => sum + (b.fixed_amount || b.estimated_amount || 0), 0),
        paidAmount: bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.fixed_amount || b.estimated_amount || 0), 0),
        overdueAmount: bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + (b.fixed_amount || b.estimated_amount || 0), 0),
        dueCount: bills.filter(b => b.status === 'unpaid' && (b.days_until_due || 0) <= 7).length,
        paidCount: bills.filter(b => b.status === 'paid').length,
        overdueCount: bills.filter(b => b.status === 'overdue').length,
    };

    const filteredBills = bills.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'paid') return b.status === 'paid';
        if (filter === 'unpaid') return b.status !== 'paid';
        return true;
    });

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <DashboardHeader
                    title="Bills & Payments"
                    subtitle="Manage recurring bills and never miss a payment"
                />
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => { }}>
                        <Calendar size={18} /> Calendar
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/bills/new')}>
                        <Plus size={18} /> Add Bill
                    </Button>
                </div>
            </div>

            <BillsSummary {...stats} />

            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'unpaid', 'paid'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === f
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'
                            }`}
                    >
                        {f} Bills
                    </button>
                ))}
            </div>

            {/* Bills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredBills.map(bill => (
                    <BillCard
                        key={bill.id}
                        bill={bill}
                        onPay={() => { alert('Opening payment modal...'); }}
                    />
                ))}
            </div>

            {filteredBills.length === 0 && (
                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Receipt size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No bills found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">You don't have any bills matching this filter.</p>
                    <Button onClick={() => setFilter('all')}>Clear Filter</Button>
                </div>
            )}
        </div>
    );
}
