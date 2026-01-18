import React, { useState, useEffect } from 'react'
import { Wallet } from 'lucide-react'
import { Widget3D } from '../Widget3D'
import { CountUp } from '../../ui/CountUp'
import { useNavigate } from 'react-router-dom'
import { accountService } from '@/services/account.service'
import { AccountProps } from '@/components/accounts/AccountCard'

export const AccountsWidget: React.FC = () => {
    const [expanded, setExpanded] = useState(false)
    const [accounts, setAccounts] = useState<AccountProps[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await accountService.getAll();
                setAccounts(data);
            } catch (error) {
                console.error("Failed to fetch accounts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const totalBalance = accounts.reduce((acc, curr) => acc + (curr.type !== 'credit_card' ? (curr.balance || 0) : 0), 0)

    if (isLoading) {
        return (
            <Widget3D title="Accounts" icon={<Wallet size={20} />} gradient="from-blue-500/20 to-purple-500/20">
                <div className="animate-pulse space-y-3">
                    <div className="h-20 bg-white/5 rounded-xl"></div>
                    <div className="h-16 bg-white/5 rounded-xl"></div>
                </div>
            </Widget3D>
        )
    }

    if (accounts.length === 0) {
        return (
            <Widget3D title="Accounts" icon={<Wallet size={20} />} gradient="from-blue-500/20 to-purple-500/20">
                <div className="text-center py-6 text-gray-400">
                    <p>No accounts found.</p>
                    <button
                        onClick={() => navigate('/accounts')}
                        className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                        Add Account
                    </button>
                </div>
            </Widget3D>
        )
    }

    return (
        <Widget3D
            title="Accounts"
            icon={<Wallet size={20} />}
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            gradient="from-blue-500/20 to-purple-500/20"
        >
            {/* Total Balance */}
            <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                <h3 className="text-4xl font-bold text-white font-mono">
                    <CountUp end={totalBalance} duration={2} prefix="RM " separator="," />
                </h3>
            </div>

            {/* Account List */}
            <div className="space-y-3">
                {accounts.slice(0, expanded ? accounts.length : 3).map((account) => (
                    <div
                        key={account.id}
                        onClick={() => navigate(`/accounts`)} // Redirect to accounts page mostly, or detail if implemented
                        className="
              flex items-center gap-3 p-3 rounded-xl
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:border-white/20
              transition-all duration-300
              cursor-pointer
            "
                    >
                        {/* Bank Logo */}
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                            {account.institution?.logo ? (
                                <img src={account.institution.logo} alt={account.name} className="w-6 h-6 object-contain" />
                            ) : (
                                <Wallet className="w-6 h-6 text-white/50" />
                            )}
                        </div>

                        {/* Account Info */}
                        <div className="flex-1">
                            <p className="text-white font-medium text-sm">{account.name}</p>
                            <p className="text-gray-400 text-xs capitalize">{account.type.replace('_', ' ')}</p>
                        </div>

                        {/* Balance */}
                        <div className="text-right">
                            <p className="text-white font-semibold">
                                {account.currency || 'RM'} {account.balance.toLocaleString()}
                            </p>
                            {/* Change not available in DB yet, hiding */}
                            {/* <p className={`text-xs ${account.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {account.change > 0 ? '+' : ''}{account.change}%
                            </p> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* View All */}
            {!expanded && accounts.length > 3 && (
                <button
                    onClick={() => setExpanded(true)}
                    className="w-full mt-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                    View {accounts.length - 3} more accounts
                </button>
            )}
        </Widget3D>
    )
}
