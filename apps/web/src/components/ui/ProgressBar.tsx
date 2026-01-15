
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressBarVariants = cva(
    "h-full rounded-full transition-all duration-300 ease-in-out",
    {
        variants: {
            color: {
                default: "bg-blue-500",
                blue: "bg-blue-500",
                green: "bg-green-500",
                red: "bg-red-500",
                yellow: "bg-yellow-500",
                purple: "bg-purple-500",
                pink: "bg-pink-500",
                orange: "bg-orange-500",
                teal: "bg-teal-500",
            },
            size: {
                sm: "h-1.5",
                md: "h-2.5",
                lg: "h-4",
            },
        },
        defaultVariants: {
            color: "default",
            size: "md",
        },
    }
)

export interface ProgressBarProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof progressBarVariants> {
    value: number
    max?: number
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, color, size, value, max = 100, ...props }, ref) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100))

        return (
            <div
                ref={ref}
                className={cn(
                    "w-full rounded-full bg-white/10 dark:bg-white/5",
                    size === 'sm' ? "h-1.5" : size === 'lg' ? "h-4" : "h-2.5",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(progressBarVariants({ color, size }))}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        )
    }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar, progressBarVariants }
