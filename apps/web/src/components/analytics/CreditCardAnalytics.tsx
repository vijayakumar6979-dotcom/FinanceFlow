import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';

const MOCK_DATA = [
    { name: 'Dining', value: 850, color: '#F59E0B' },
    { name: 'Shopping', value: 1200, color: '#EC4899' },
    { name: 'Travel', value: 300, color: '#06B6D4' },
    { name: 'Utilities', value: 150, color: '#10B981' },
];

export function CreditCardAnalytics() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Spending Chart */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Spending Breakdown</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={MOCK_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {MOCK_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1F3A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* AI Insights */}
                <Card className="p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                    </div>

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3"
                        >
                            <TrendingUp className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-white">High Dining Spend</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Your dining expenses are 25% higher than last month. Consider cooking at home this weekend.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3"
                        >
                            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-white">Utilization Alert</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    You've used 45% of your credit limit. Keep it under 30% to improve your credit score.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
