import { Skeleton } from '@/components/ui/Skeleton'

interface WidgetSkeletonProps {
    type?: 'card' | 'list' | 'chart' | 'stats'
}

export function WidgetSkeleton({ type = 'card' }: WidgetSkeletonProps) {
    if (type === 'list') {
        return (
            <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="flex-1 space-y-2">
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="40%" />
                        </div>
                        <Skeleton variant="text" width={80} />
                    </div>
                ))}
            </div>
        )
    }

    if (type === 'chart') {
        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={80} height={20} />
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rectangular"
                            className="flex-1"
                            height={`${Math.random() * 60 + 40}%`}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (type === 'stats') {
        return (
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1">
                        <Skeleton variant="text" width="40%" className="mb-2" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <Skeleton variant="text" width="50%" className="mb-2" />
                            <Skeleton variant="text" width="70%" height={32} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Default card skeleton
    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1">
                    <Skeleton variant="text" width="40%" className="mb-2" />
                    <Skeleton variant="text" width="60%" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
            </div>
        </div>
    )
}
