import { LayoutGrid, FileSpreadsheet, Calendar as CalendarIcon } from 'lucide-react'

export function DashboardHeader() {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-[#6E7399] text-sm">Personal Finance Tracker</p>
                <h1 className="text-3xl font-bold text-white mb-1">Available Balance</h1>
                <p className="text-3xl font-bold text-[#4ADE80]">$10,036</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Toggle Buttons */}
                <div className="flex bg-[#1D203E] rounded-xl p-1">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#2D3154] text-white rounded-lg text-sm font-medium">
                        <LayoutGrid size={16} />
                        Dashboard
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-[#6E7399] hover:text-white rounded-lg text-sm font-medium transition-colors">
                        <FileSpreadsheet size={16} />
                        Spreadsheet
                    </button>
                </div>

                {/* Date Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1D203E] rounded-xl text-[#6E7399] text-sm">
                    <CalendarIcon size={16} />
                    <span>Sunday, February 5, 2023</span>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 ml-4">
                    <div className="text-right hidden md:block">
                        <p className="text-white text-sm font-bold">Simon K. Jimmy</p>
                        <p className="text-[#6E7399] text-xs">Mortgage consultant</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500 overflow-hidden border-2 border-[#1D203E]">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Simon" alt="User" />
                    </div>
                </div>
            </div>
        </div>
    )
}
