import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { Budget, BudgetPeriod } from '@financeflow/shared';

interface BudgetOverviewChartProps {
    budgets: Budget[];
    periods: BudgetPeriod[];
}

export function BudgetOverviewChart({ budgets, periods }: BudgetOverviewChartProps) {
    // Transform data for chart
    const data = budgets.map((budget, index) => {
        const period = periods.find(p => p.budget_id === budget.id);
        return {
            name: budget.name || `Budget ${index + 1}`,
            value: budget.amount,
            spent: period?.spent_amount || 0,
            color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][index % 5]
        };
    });

    const totalBudget = data.reduce((acc, curr) => acc + curr.value, 0);
    const totalSpent = data.reduce((acc, curr) => acc + curr.spent, 0);

    return (
        <div className="h-[350px] flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Budget Overview</h3>

            <div className="flex-1 min-h-0 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            formatter={(value: any) => `RM ${value.toLocaleString()}`}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text - Moved lower */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        {Math.round((totalSpent / totalBudget) * 100) || 0}%
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Used</span>
                </div>
            </div>
        </div>
    );
}
