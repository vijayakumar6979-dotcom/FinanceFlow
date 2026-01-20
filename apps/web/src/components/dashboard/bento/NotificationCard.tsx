import { AlertTriangle } from 'lucide-react'

export function NotificationCard() {
    return (
        <div className="w-full h-full bg-[#1D203E] rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-medium">Notification</h3>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                </div>
            </div>

            <div className="flex-1 flex items-center">
                <div className="flex gap-4">
                    <div className="w-1 bg-[#FF9966] rounded-full self-stretch"></div>
                    <div className="flex-1">
                        <p className="text-white font-medium leading-relaxed">
                            3 Bills are past Due, Pay soon to avoid late fees.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
