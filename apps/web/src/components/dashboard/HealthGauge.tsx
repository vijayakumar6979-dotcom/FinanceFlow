import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

const data = [
    { name: 'Assets', value: 142000, color: '#10B981' }, // Emerald
    { name: 'Liabilities', value: 45000, color: '#F43F5E' }, // Rose
];

export const HealthGauge = () => {
    // Health Score: Assets / (Assets + Liabilities) * 100
    // Real formula usually involves more, but ratio is good for simple visual
    const total = data[0].value + data[1].value;
    const healthScore = Math.round((data[0].value / total) * 100);

    return (
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl relative">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Financial Health
                </h3>
            </div>

            <div className="h-[200px] relative -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="85%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number | undefined) => formatCurrency(value || 0)}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 top-auto bottom-8 flex flex-col items-center justify-center">
                    <div className="text-4xl font-black text-white">{healthScore}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Health Score</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                    <div className="text-emerald-400 text-xs font-bold uppercase mb-1">Assets</div>
                    <div className="text-white font-bold font-mono">{formatCurrency(data[0].value)}</div>
                </div>
                <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
                    <div className="text-rose-400 text-xs font-bold uppercase mb-1">Liabilities</div>
                    <div className="text-white font-bold font-mono">{formatCurrency(data[1].value)}</div>
                </div>
            </div>
        </Card>
    );
};
