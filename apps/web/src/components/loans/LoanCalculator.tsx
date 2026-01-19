import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calculator, DollarSign, Percent, Calendar, TrendingDown, Sparkles } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface LoanCalculatorProps {
    currentLoan?: {
        principal: number
        interestRate: number
        termMonths: number
        monthlyPayment: number
    }
}

export function LoanCalculator({ currentLoan }: LoanCalculatorProps) {
    const [principal, setPrincipal] = useState(currentLoan?.principal || 100000)
    const [interestRate, setInterestRate] = useState(currentLoan?.interestRate || 5.5)
    const [termYears, setTermYears] = useState(currentLoan ? currentLoan.termMonths / 12 : 20)
    const [extraPayment, setExtraPayment] = useState(0)

    // Calculate monthly payment
    const calculateMonthlyPayment = (p: number, r: number, n: number) => {
        const monthlyRate = r / 100 / 12
        const numPayments = n * 12
        return (p * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1)
    }

    const monthlyPayment = calculateMonthlyPayment(principal, interestRate, termYears)
    const totalMonthlyPayment = monthlyPayment + extraPayment

    // Calculate payoff details
    const calculatePayoffDetails = (extraPmt: number) => {
        let balance = principal
        const monthlyRate = interestRate / 100 / 12
        let totalInterest = 0
        let months = 0
        const schedule: any[] = []

        while (balance > 0 && months < 360) {
            const interest = balance * monthlyRate
            const principalPayment = Math.min(monthlyPayment + extraPmt - interest, balance)

            balance -= principalPayment
            totalInterest += interest
            months++

            if (months % 12 === 0 || balance <= 0) {
                schedule.push({
                    year: Math.ceil(months / 12),
                    balance: Math.max(0, balance),
                    totalInterest
                })
            }
        }

        return {
            months,
            years: (months / 12).toFixed(1),
            totalInterest,
            totalPaid: principal + totalInterest,
            schedule
        }
    }

    const standardPayoff = calculatePayoffDetails(0)
    const acceleratedPayoff = calculatePayoffDetails(extraPayment)

    const savings = {
        interest: standardPayoff.totalInterest - acceleratedPayoff.totalInterest,
        time: standardPayoff.months - acceleratedPayoff.months
    }

    return (
        <div className="space-y-6">
            {/* Calculator Header */}
            <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loan Calculator</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Calculate payments and see the impact of extra payments
                        </p>
                    </div>
                </div>
            </Card>

            {/* Input Fields */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Loan Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Principal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Loan Amount (RM)
                        </label>
                        <input
                            type="number"
                            value={principal}
                            onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white font-semibold text-lg"
                        />
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Percent className="w-4 h-4 inline mr-1" />
                            Interest Rate (% per year)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white font-semibold text-lg"
                        />
                    </div>

                    {/* Term */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Loan Term (years)
                        </label>
                        <input
                            type="number"
                            value={termYears}
                            onChange={(e) => setTermYears(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white font-semibold text-lg"
                        />
                    </div>

                    {/* Extra Payment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <TrendingDown className="w-4 h-4 inline mr-1" />
                            Extra Monthly Payment (RM)
                        </label>
                        <input
                            type="number"
                            value={extraPayment}
                            onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white font-semibold text-lg"
                        />
                    </div>
                </div>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Standard Payment */}
                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Standard Payment</h4>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Payment</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                RM {monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Interest</p>
                                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                                    RM {standardPayoff.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payoff Time</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {standardPayoff.years} years
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount Paid</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                RM {standardPayoff.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* With Extra Payments */}
                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">With Extra Payments</h4>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Payment</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                RM {totalMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Interest</p>
                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    RM {acceleratedPayoff.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payoff Time</p>
                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {acceleratedPayoff.years} years
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount Paid</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                RM {acceleratedPayoff.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Savings Summary */}
            {extraPayment > 0 && (
                <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Savings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interest Saved</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        RM {savings.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Saved</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {Math.floor(savings.time / 12)} years {savings.time % 12} months
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-3">
                                By paying an extra RM {extraPayment.toLocaleString()} per month, you'll save{' '}
                                <strong>RM {savings.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in interest
                                and become debt-free <strong>{(savings.time / 12).toFixed(1)} years earlier</strong>!
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Payoff Chart */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Loan Balance Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="year" stroke="#9CA3AF" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Line
                            data={standardPayoff.schedule}
                            type="monotone"
                            dataKey="balance"
                            stroke="#EF4444"
                            strokeWidth={2}
                            name="Standard Payment"
                            dot={{ fill: '#EF4444', r: 4 }}
                        />
                        {extraPayment > 0 && (
                            <Line
                                data={acceleratedPayoff.schedule}
                                type="monotone"
                                dataKey="balance"
                                stroke="#10B981"
                                strokeWidth={2}
                                name="With Extra Payments"
                                dot={{ fill: '#10B981', r: 4 }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}
