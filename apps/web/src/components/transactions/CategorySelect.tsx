import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TransactionCategory } from '@financeflow/shared';
import { ChevronDown, Search, X } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { cn } from '@/utils/cn';

interface CategorySelectProps {
    categories: TransactionCategory[];
    value: string;
    onChange: (categoryId: string) => void;
    placeholder?: string;
    className?: string;
}

export function CategorySelect({ categories, value, onChange, placeholder = "Select Category", className }: CategorySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState({});

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate position for portal
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: `${rect.bottom + 8}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                maxHeight: '300px', // Limit height
                zIndex: 9999 // Ensure it's on top of modal
            });
        }
    }, [isOpen]);

    // Close on click outside (handling both container and portal)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        // Handle scrolling closes dropdown
        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleScroll); // Close on resize
        // Optional: close on scroll to avoid position drift
        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleScroll);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Focus search on open
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const selectedCategory = categories.find(c => c.id === value);

    const groupedCategories = useMemo(() => {
        const filtered = categories.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.group_name && c.group_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const groups: Record<string, TransactionCategory[]> = {};
        const noGroup: TransactionCategory[] = [];

        filtered.forEach(c => {
            if (c.group_name) {
                if (!groups[c.group_name]) groups[c.group_name] = [];
                groups[c.group_name].push(c);
            } else {
                noGroup.push(c);
            }
        });

        return { groups, noGroup };
    }, [categories, searchTerm]);

    const dropdownContent = (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
            {/* Search Header */}
            <div className="p-2 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-dark-base rounded-lg border border-gray-200 dark:border-white/10 focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar max-h-[250px]">
                {Object.entries(groupedCategories.groups).map(([group, items]) => (
                    <div key={group} className="mb-2">
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 bg-white dark:bg-dark-surface z-10">
                            {group}
                        </div>
                        <div className="space-y-1">
                            {items.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onChange(category.id);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                        value === category.id
                                            ? "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                            : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        value === category.id ? "bg-white dark:bg-blue-500/20" : "bg-gray-100 dark:bg-white/10"
                                    )}>
                                        <CategoryIcon iconName={category.icon} color={category.color} size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Ungrouped Items */}
                {groupedCategories.noGroup.length > 0 && (
                    <div className="mb-2">
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-dark-surface/95 z-10">
                            Other
                        </div>
                        <div className="space-y-1">
                            {groupedCategories.noGroup.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onChange(category.id);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                        value === category.id
                                            ? "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                            : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        value === category.id ? "bg-white dark:bg-blue-500/20" : "bg-gray-100 dark:bg-white/10"
                                    )}>
                                        <CategoryIcon iconName={category.icon} color={category.color} size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {groupedCategories.noGroup.length === 0 && Object.keys(groupedCategories.groups).length === 0 && (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <Search size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No categories found</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 px-3 flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface focus:ring-2 focus:ring-blue-500 transition-all text-left"
            >
                {selectedCategory ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                            <CategoryIcon iconName={selectedCategory.icon} color={selectedCategory.color} size={14} />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">{selectedCategory.name}</span>
                    </div>
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
                )}
                <ChevronDown size={18} className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {/* Use Portal for Dropdown */}
            {isOpen && createPortal(dropdownContent, document.body)}
        </div>
    );
}
