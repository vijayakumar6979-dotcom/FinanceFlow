
import { format } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Download, Filter } from 'lucide-react'

// interface DateRange { ... } removed

export function DashboardHeader() {
    /* const [dateRange, setDateRange] = useState<DateRange>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    }) */

    const dateRangePresets = [
        { label: 'Today', value: 'today' },
        { label: 'Last 7 Days', value: 'week' },
        { label: 'Last 30 Days', value: 'month' },
        { label: 'Last 90 Days', value: 'quarter' },
        { label: 'This Year', value: 'year' },
        { label: 'Custom Range', value: 'custom' },
    ]

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: Greeting */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back, John! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400">
                        Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <Select
                        options={dateRangePresets}
                        value="month"
                        onChange={(value) => console.log('Date range changed:', value)}
                        className="w-40 md:w-48"
                    />

                    <Button variant="outline" icon={<Filter size={20} />}>
                        Filter
                    </Button>

                    <Button variant="outline" icon={<Download size={20} />}>
                        Export
                    </Button>
                </div>
            </div>
        </div>
    )
}
