
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Coffee, DollarSign, Car, ShoppingBag, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => {
    switch (name) {
        case 'coffee': return <Coffee size={size} color={color} />;
        case 'dollar-sign': return <DollarSign size={size} color={color} />;
        case 'car': return <Car size={size} color={color} />;
        case 'shopping-bag': return <ShoppingBag size={size} color={color} />;
        case 'briefcase': return <Briefcase size={size} color={color} />;
        default: return null;
    }
}

export function RecentTransactions() {
    const navigate = useNavigate()

    const transactions = [
        {
            id: '1',
            description: 'Starbucks Coffee',
            amount: 12.50,
            type: 'expense',
            category: { name: 'Food & Dining', icon: 'coffee', color: '#FF6B6B' },
            date: new Date(),
        },
        {
            id: '2',
            description: 'Monthly Salary',
            amount: 5000,
            type: 'income',
            category: { name: 'Salary', icon: 'dollar-sign', color: '#10B981' },
            date: new Date(),
        },
        {
            id: '3',
            description: 'Uber Ride',
            amount: 25.80,
            type: 'expense',
            category: { name: 'Transportation', icon: 'car', color: '#4ECDC4' },
            date: new Date(),
        },
        {
            id: '4',
            description: 'Amazon Purchase',
            amount: 89.99,
            type: 'expense',
            category: { name: 'Shopping', icon: 'shopping-bag', color: '#FF8B94' },
            date: new Date(),
        },
        {
            id: '5',
            description: 'Freelance Project',
            amount: 1200,
            type: 'income',
            category: { name: 'Business', icon: 'briefcase', color: '#FFA502' },
            date: new Date(),
        },
    ]

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                    onClick={() => navigate('/transactions')}
                >
                    View All
                </Button>
            </div>

            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                        {/* Icon */}
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${transaction.category.color}20` }}
                        >
                            <Icon
                                name={transaction.category.icon}
                                size={20}
                                color={transaction.category.color}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <p className="text-slate-900 dark:text-white font-medium group-hover:text-blue-500 transition-colors">
                                {transaction.description}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {transaction.category.name} • {format(transaction.date, 'MMM dd, hh:mm a')}
                            </p>
                        </div>

                        {/* Amount */}
                        <span
                            className={`font-bold font-mono ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                }`}
                        >
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    )
}
