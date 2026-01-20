import { LayoutDashboard, Wallet, Receipt, TrendingDown, Target, BarChart2, Calendar } from 'lucide-react'

export function BentoSidebar() {
    const navItems = [
        { icon: LayoutDashboard, active: true, label: "Dashboard" },
        { icon: Calendar, label: "Jan" },
        { icon: Calendar, label: "Feb" },
        { icon: Calendar, active: true, label: "Mar", color: "text-orange-400" },
        { icon: Calendar, label: "Apr" },
        { icon: Calendar, label: "May" },
        { icon: Calendar, label: "Jun" },
        { icon: Calendar, label: "Jul" },
    ]

    return (
        <aside className="w-20 bg-[#0F1221] flex flex-col items-center py-8 border-r border-[#1D203E] h-full">
            {/* Logo */}
            <div className="mb-10 w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center">
                <span className="font-bold text-black text-xl">L</span>
            </div>

            {/* Nav Items (mimicking the months list from reference) */}
            <div className="flex flex-col gap-6 w-full items-center flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-8 text-sm font-medium text-[#6E7399]">
                    <span className="hover:text-white cursor-pointer relative group">
                        Jan
                    </span>
                    <span className="hover:text-white cursor-pointer relative group">
                        Feb
                    </span>
                    <span className="text-orange-400 font-bold cursor-pointer relative">
                        Mar
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-orange-400 rounded-r-full"></div>
                    </span>
                    <span className="hover:text-white cursor-pointer relative group">Apr</span>
                    <span className="hover:text-white cursor-pointer relative group">May</span>
                    <span className="hover:text-white cursor-pointer relative group">Jun</span>
                    <span className="hover:text-white cursor-pointer relative group">Jul</span>
                    <span className="hover:text-white cursor-pointer relative group">Aug</span>
                    <span className="hover:text-white cursor-pointer relative group">Sep</span>
                    <span className="hover:text-white cursor-pointer relative group">Oct</span>
                    <span className="hover:text-white cursor-pointer relative group">Nov</span>
                    <span className="hover:text-white cursor-pointer relative group">Dec</span>
                </div>
            </div>

            {/* Bottom Graphic */}
            <div className="mt-auto opacity-50 grayscale hover:grayscale-0 transition-all">
                {/* Placeholder for the little house/snow graphic in reference */}
                <div className="text-2xl">🏠</div>
            </div>
        </aside>
    )
}
