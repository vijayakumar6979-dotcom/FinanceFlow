import { BentoSidebar } from './BentoSidebar'
import { DashboardHeader } from './DashboardHeader'
import { NetWorthCard } from './NetWorthCard'
import { MiniChartCard } from './MiniChartCard'
import { AssetsDonutCard } from './AssetsDonutCard'
import { NotificationCard } from './NotificationCard'
import { Home, User, Car } from 'lucide-react' // Icons for spendings categories

export function BentoLayout() {
    // Mock Data for charts
    const sparkData = Array.from({ length: 10 }, (_, i) => ({ value: Math.random() * 100 + 50 }))
    const incomeData = Array.from({ length: 10 }, (_, i) => ({ value: Math.random() * 100 + 100 }))

    return (
        <div className="flex h-screen w-full bg-[#0F1221] overflow-hidden font-sans">
            {/* 1. Sidebar (Fixed) */}
            <BentoSidebar />

            {/* 2. Main Content (Scrollable if absolutely needed, but fitting to screen as requested) */}
            <main className="flex-1 p-8 h-full flex flex-col overflow-hidden">
                <DashboardHeader />

                {/* 3. The Grid Container */}
                <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6 min-h-0">

                    {/* [Row 1-2] Net Worth (Big Orange Card) */}
                    <div className="col-span-12 md:col-span-4 row-span-2">
                        <NetWorthCard />
                    </div>

                    {/* [Row 1] Spendings Sparkline */}
                    <div className="col-span-12 md:col-span-4 row-span-1">
                        <MiniChartCard
                            title="Spendings"
                            amount="$9,794"
                            data={sparkData}
                            color="#F87171"
                        />
                    </div>

                    {/* [Row 1-2] Spendings Categories (List) */}
                    <div className="col-span-12 md:col-span-4 row-span-2 bg-[#1D203E] rounded-3xl p-6">
                        <h3 className="text-[#6E7399] text-xs font-medium mb-4">Spendings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#7B61FF] flex items-center justify-center text-white"><Home size={18} /></div>
                                <div className="flex-1">
                                    <p className="text-[#6E7399] text-xs">Housing</p>
                                    <p className="text-white font-bold">$3,798</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#EC4899] flex items-center justify-center text-white"><User size={18} /></div>
                                <div className="flex-1">
                                    <p className="text-[#6E7399] text-xs">Personal</p>
                                    <p className="text-white font-bold">$45,581</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white"><Car size={18} /></div>
                                <div className="flex-1">
                                    <p className="text-[#6E7399] text-xs">Transportation</p>
                                    <p className="text-white font-bold">$2,190</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* [Row 2] Income Source Bar Chart (Placeholder for now, using MiniChart style) */}
                    <div className="col-span-12 md:col-span-4 row-span-2 bg-[#1D203E] rounded-3xl p-6 relative">
                        <h3 className="text-[#6E7399] text-xs font-medium mb-4">Income Source</h3>
                        {/* Simple Bar Visualization */}
                        <div className="flex items-end justify-between h-32 gap-2">
                            {/* Bar 1 */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-white font-bold text-xs">$1,900</span>
                                <div className="w-8 bg-[#2D3154] rounded-t-lg h-12"></div>
                                <span className="text-[#6E7399] text-[10px]">EcCom</span>
                            </div>
                            {/* Bar 2 */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-white font-bold text-xs">$1,230</span>
                                <div className="w-8 bg-[#2D3154] rounded-t-lg h-8"></div>
                                <span className="text-[#6E7399] text-[10px]">Ads</span>
                            </div>
                            {/* Bar 3 */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-white font-bold text-xs">$3,700</span>
                                <div className="w-8 bg-[#2D3154] rounded-t-lg h-20"></div>
                                <span className="text-[#6E7399] text-[10px]">Shop</span>
                            </div>
                            {/* Bar 4 (High) */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-white font-bold text-xs">$13,000</span>
                                <div className="w-8 bg-[#10B981] rounded-t-lg h-28 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                                <span className="text-[#6E7399] text-[10px]">Salary</span>
                            </div>
                        </div>
                    </div>

                    {/* [Row 2] Income Sparkline (Under Spendings Sparkline) */}
                    <div className="col-span-12 md:col-span-4 row-span-1 col-start-5">
                        <MiniChartCard
                            title="Income"
                            amount="$19,830"
                            data={incomeData}
                            color="#F97316"
                        />
                    </div>

                    {/* [Row 3-4] Bottom Left Chart (Income & Expenses) */}
                    <div className="col-span-12 md:col-span-4 row-span-2 bg-[#1D203E] rounded-3xl p-6">
                        <h3 className="text-[#6E7399] text-xs font-medium mb-4">Income & Expenses</h3>
                        {/* Placeholder for dual line chart */}
                        <div className="h-full w-full flex items-center justify-center border border-dashed border-[#2D3154] rounded-xl">
                            <span className="text-[#6E7399] text-xs">Detailed Chart Area</span>
                        </div>
                    </div>

                    {/* [Row 3-4] Assets Donut */}
                    <div className="col-span-12 md:col-span-4 row-span-2">
                        <AssetsDonutCard />
                    </div>

                    {/* [Row 1-2 Right Stack] Goal Progress & Notifications */}
                    <div className="col-span-12 md:col-span-4 row-span-1 bg-[#1D203E] rounded-3xl p-6">
                        <h3 className="text-[#7B61FF] text-xs font-bold mb-1">67%</h3>
                        <p className="text-white text-sm font-bold mb-3">Income Goal</p>
                        <div className="w-full h-2 bg-[#2D3154] rounded-full overflow-hidden">
                            <div className="w-[67%] h-full bg-[#7B61FF]"></div>
                        </div>
                    </div>

                    {/* Notification below Goal */}
                    <div className="col-span-12 md:col-span-4 row-span-1">
                        <NotificationCard />
                    </div>

                    {/* [Row 3-4 Right Stack] Expenses for Dogs/Cats */}
                    <div className="col-span-12 md:col-span-4 row-span-2 bg-[#1D203E] rounded-3xl p-6 flex gap-4 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-white text-xs font-bold mb-2">Expenses for My Dogs and Cats</h3>
                            <div className="flex justify-between">
                                <span className="text-white font-bold text-sm">140</span>
                                <span className="text-[#6E7399] text-xs">Routine Vet</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white font-bold text-sm">950</span>
                                <span className="text-[#6E7399] text-xs">Food</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white font-bold text-sm">231</span>
                                <span className="text-[#6E7399] text-xs">Food Treats</span>
                            </div>
                        </div>
                        {/* Dog Illustration Placeholder */}
                        <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center text-4xl">
                            🐶
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
