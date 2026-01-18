import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wallet, CreditCard, Building2, Banknote, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AccountCard, AccountProps } from '@/components/accounts/AccountCard';
// import { AddAccountModal } from '@/components/accounts/AddAccountModal'; // Removed
import { formatCurrency } from '@financeflow/shared';

// import from account.service
import { accountService } from '@/services/account.service';
import { Loader2 } from 'lucide-react';

export default function AccountsPage() {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    // const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Removed
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<AccountProps[]>([]);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const data = await accountService.getAll();
            setAccounts(data);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Derived State
    const filteredAccounts = accounts.filter(account => {
        const matchesType = filterType === 'all' ||
            (filterType === 'banks' && account.type.startsWith('bank')) ||
            (filterType === 'cards' && account.type === 'credit_card') ||
            (filterType === 'ewallets' && account.type === 'ewallet') ||
            (filterType === 'cash' && account.type === 'cash');

        const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesType && matchesSearch;
    });

    const totalAssets = accounts
        .filter(a => a.type !== 'credit_card')
        .reduce((sum, a) => sum + a.balance, 0);

    const totalDebt = accounts
        .filter(a => a.type === 'credit_card')
        .reduce((sum, a) => sum + Math.abs(a.balance), 0);

    const netWorth = totalAssets - totalDebt;

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Accounts</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your financial accounts and assets</p>
                        {isLoading && (
                            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Refreshing...
                            </span>
                        )}
                    </div>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                    onClick={() => navigate('/accounts/new')}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Account
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Net Worth"
                    amount={netWorth}
                    icon={<Wallet className="w-5 h-5 text-blue-400" />}
                    trend="+2.5%"
                />
                <SummaryCard
                    title="Bank Assets"
                    amount={accounts.filter(a => a.type.startsWith('bank')).reduce((s, a) => s + a.balance, 0)}
                    icon={<Building2 className="w-5 h-5 text-green-400" />}
                    count={accounts.filter(a => a.type.startsWith('bank')).length}
                />
                <SummaryCard
                    title="Credit Card Debt"
                    amount={totalDebt}
                    isDebt
                    icon={<CreditCard className="w-5 h-5 text-red-400" />}
                    count={accounts.filter(a => a.type === 'credit_card').length}
                />
                <SummaryCard
                    title="E-Wallets"
                    amount={accounts.filter(a => a.type === 'ewallet').reduce((s, a) => s + a.balance, 0)}
                    icon={<Banknote className="w-5 h-5 text-purple-400" />}
                    count={accounts.filter(a => a.type === 'ewallet').length}
                />
            </div>

            {/* Filters & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2">
                    {['all', 'banks', 'cards', 'ewallets', 'cash'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterType === type
                                ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30 border'
                                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAccounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onEdit={(id) => console.log('Edit', id)}
                            onDelete={(id) => console.log('Delete', id)}
                            onView={(id) => window.location.href = `/accounts/${id}`} // Using simple navigation for now, typically use navigate from router
                        />
                    ))}
                </AnimatePresence>

                {/* Add New Card Placeholder */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="h-full min-h-[220px] rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:border-blue-400 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group bg-transparent"
                    onClick={() => navigate('/accounts/new')}
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-600/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Add New Account</span>
                </motion.button>
            </div>
        </div>
    );
}

function SummaryCard({ title, amount, icon, trend, count, isDebt }: any) {
    return (
        <Card className="p-5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                        }`}>
                        {trend}
                    </span>
                )}
                {count !== undefined && (
                    <span className="text-xs font-medium text-slate-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full">
                        {count} {count === 1 ? 'Account' : 'Accounts'}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">{title}</p>
                <h3 className={`text-2xl font-bold font-mono ${isDebt ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {formatCurrency(amount)}
                </h3>
            </div>
        </Card>
    );
}
