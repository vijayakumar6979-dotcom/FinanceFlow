import { cn } from '@/utils/cn';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    text?: string;
    spacing?: 'sm' | 'md' | 'lg';
}

const spacings = {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-8',
};

export function Divider({
    orientation = 'horizontal',
    text,
    spacing = 'md',
    className,
    ...props
}: DividerProps) {
    if (orientation === 'vertical') {
        return (
            <div
                className={cn("inline-block w-[1px] h-full bg-gray-200 dark:bg-gray-700 mx-2 self-stretch", className)}
                role="separator"
                aria-orientation="vertical"
                {...props}
            />
        );
    }

    return (
        <div className={cn("flex items-center w-full", spacings[spacing], className)} role="separator" {...props}>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            {text && (
                <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-medium">
                    {text}
                </span>
            )}
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
        </div>
    );
}
