import { useState } from 'react';
import { X, Calendar, Tag, DollarSign, Filter } from 'lucide-react';

interface TransactionFiltersProps {
    filters: any;
    onFiltersChange: (filters: any) => void;
}

export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        onFiltersChange(localFilters);
    };

    const handleReset = () => {
        setLocalFilters({});
        onFiltersChange({});
    };

    return (
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.18)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Advanced Filters
                </h3>
                <button
                    onClick={handleReset}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors"
                >
                    Reset All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Type
                    </label>
                    <select
                        value={localFilters.type || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value || undefined })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                {/* Date Range */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={localFilters.startDate || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value || undefined })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={localFilters.endDate || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value || undefined })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    />
                </div>

                {/* Amount Range */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Min Amount
                    </label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={localFilters.minAmount || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value || undefined })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    />
                </div>

                {/* Linked Module */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Linked To
                    </label>
                    <select
                        value={localFilters.linkedModule || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, linkedModule: e.target.value || undefined })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    >
                        <option value="">All</option>
                        <option value="bill">Bills</option>
                        <option value="loan">Loans</option>
                        <option value="goal">Goals</option>
                        <option value="investment">Investments</option>
                    </select>
                </div>

                {/* Has Receipt */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Receipt
                    </label>
                    <select
                        value={localFilters.hasReceipt?.toString() || ''}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            hasReceipt: e.target.value === '' ? undefined : e.target.value === 'true'
                        })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    >
                        <option value="">All</option>
                        <option value="true">With Receipt</option>
                        <option value="false">No Receipt</option>
                    </select>
                </div>

                {/* Is Anomaly */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Anomaly
                    </label>
                    <select
                        value={localFilters.isAnomaly?.toString() || ''}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            isAnomaly: e.target.value === '' ? undefined : e.target.value === 'true'
                        })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    >
                        <option value="">All</option>
                        <option value="true">Unusual Only</option>
                        <option value="false">Normal Only</option>
                    </select>
                </div>

                {/* Limit */}
                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Results Limit
                    </label>
                    <select
                        value={localFilters.limit || '50'}
                        onChange={(e) => setLocalFilters({ ...localFilters, limit: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white focus:outline-none focus:border-[#0066FF] transition-all"
                    >
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={handleReset}
                    className="px-6 py-2 rounded-xl bg-[#1A1F3A] text-white hover:bg-[#252B4A] transition-all"
                >
                    Reset
                </button>
                <button
                    onClick={handleApply}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
