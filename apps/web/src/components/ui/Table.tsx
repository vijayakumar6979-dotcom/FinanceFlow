import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';
import { Checkbox } from './Checkbox';

export interface Column<T> {
    key: keyof T | string;
    title: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    onSort?: (key: string, direction: 'asc' | 'desc') => void;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    className?: string;
}

export function Table<T>({
    columns,
    data,
    keyExtractor,
    isLoading = false,
    onSort,
    selectable = false,
    onSelectionChange,
    className
}: TableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            setSortDirection(newDirection);
            onSort?.(key, newDirection);
        } else {
            setSortKey(key);
            setSortDirection('asc');
            onSort?.(key, 'asc');
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = data.map(keyExtractor);
            setSelectedIds(allIds);
            onSelectionChange?.(allIds);
        } else {
            setSelectedIds([]);
            onSelectionChange?.([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        let newSelected: string[];
        if (checked) {
            newSelected = [...selectedIds, id];
        } else {
            newSelected = selectedIds.filter(selectedId => selectedId !== id);
        }
        setSelectedIds(newSelected);
        onSelectionChange?.(newSelected);
    };

    return (
        <div className={cn("w-full overflow-x-auto", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10">
                        {selectable && (
                            <th className="py-3 px-4 w-[50px]">
                                <Checkbox
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={cn(
                                    "py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none",
                                    column.sortable && "cursor-pointer hover:text-gray-700 dark:hover:text-gray-200",
                                    column.align === 'center' && "text-center",
                                    column.align === 'right' && "text-right",
                                )}
                                style={{ width: column.width }}
                                onClick={() => column.sortable && handleSort(String(column.key))}
                            >
                                <div className={cn("flex items-center gap-1",
                                    column.align === 'center' && "justify-center",
                                    column.align === 'right' && "justify-end"
                                )}>
                                    {column.title}
                                    {sortKey === String(column.key) && (
                                        sortDirection === 'asc'
                                            ? <ChevronUp size={14} />
                                            : <ChevronDown size={14} />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                                {selectable && <td className="py-4 px-4"><Skeleton className="w-5 h-5 rounded" /></td>}
                                {columns.map((_, j) => (
                                    <td key={j} className="py-4 px-4">
                                        <Skeleton className="h-5 w-full rounded" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        data.map((item) => {
                            const id = keyExtractor(item);
                            const isSelected = selectedIds.includes(id);
                            return (
                                <tr
                                    key={id}
                                    className={cn(
                                        "group transition-colors",
                                        isSelected
                                            ? "bg-primary-50 dark:bg-primary-900/10"
                                            : "hover:bg-gray-50/50 dark:hover:bg-white/5"
                                    )}
                                >
                                    {selectable && (
                                        <td className="py-4 px-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(checked) => handleSelectRow(id, checked)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className={cn(
                                                "py-3 px-4 text-sm text-gray-700 dark:text-gray-300",
                                                column.align === 'center' && "text-center",
                                                column.align === 'right' && "text-right",
                                            )}
                                        >
                                            {column.render ? column.render(item) : (item as any)[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
