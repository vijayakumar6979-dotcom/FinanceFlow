import React, { useState } from 'react'
import { Wallet, ChevronRight } from 'lucide-react'
import { Widget3D } from '../Widget3D'
import { CountUp } from '../../ui/CountUp'
import { useNavigate } from 'react-router-dom'

// Mock Data
const MOCK_ACCOUNTS = [
    {
        id: '1',
        name: 'Maybank Savings',
        type: 'Bank',
        balance: 12450.50,
        change: 12.5,
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=maybank2u.com.my'
    },
    {
        id: '2',
        name: 'Maybank Visa',
        type: 'Credit Card',
        balance: -2450.00,
        change: -5.4,
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=maybank2u.com.my'
    },
    {
        id: '3',
        name: 'GrabPay',
        type: 'E-Wallet',
        balance: 150.00,
        change: 2.1,
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=grab.com'
    },
    {
        id: '4',
        name: 'Cash',
        type: 'Cash',
        balance: 450.00,
        change: 0,
        logo: 'https://ui-avatars.com/api/?name=Cash&background=10B981&color=fff'
    }
]

export const AccountsWidget: React.FC = () => {
    const [expanded, setExpanded] = useState(false)
    const navigate = useNavigate()

    const accounts = MOCK_ACCOUNTS
    const totalBalance = accounts.reduce((acc, curr) => acc + (curr.type !== 'Credit Card' ? curr.balance : 0), 0)

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
                        onClick={() => navigate(`/accounts/${account.id}`)}
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
                            <img src={account.logo} alt={account.name} className="w-6 h-6 object-contain" />
                        </div>

                        {/* Account Info */}
                        <div className="flex-1">
                            <p className="text-white font-medium text-sm">{account.name}</p>
                            <p className="text-gray-400 text-xs">{account.type}</p>
                        </div>

                        {/* Balance */}
                        <div className="text-right">
                            <p className="text-white font-semibold">
                                RM {account.balance.toLocaleString()}
                            </p>
                            <p className={`text-xs ${account.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {account.change > 0 ? '+' : ''}{account.change}%
                            </p>
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
