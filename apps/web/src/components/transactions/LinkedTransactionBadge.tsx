import { Link } from 'react-router-dom';
import { Receipt, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface LinkedTransactionBadgeProps {
    transactionId: string;
    amount: number;
    date: string;
    type?: 'income' | 'expense';
    description?: string;
}

/**
 * Reusable component to show linked transaction with navigation
 * Used in Bills, Loans, Goals, Credit Cards, and Investments detail pages
 */
export function LinkedTransactionBadge({
    transactionId,
    amount,
    date,
    type = 'expense',
    description
}: LinkedTransactionBadgeProps) {
    return (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                {/* Left Side - Icon & Info */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Auto-Created Transaction
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className={`text-sm font-bold font-['JetBrains_Mono'] ${type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {type === 'income' ? '+' : '-'}RM {amount.toFixed(2)}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {format(new Date(date), 'MMM d, yyyy')}
                            </p>
                        </div>
                        {description && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side - Action Button */}
                <Link
                    to={`/transactions/${transactionId}`}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
