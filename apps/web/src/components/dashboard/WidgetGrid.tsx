import { useState, useEffect, useMemo } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, Plus, LayoutGrid, Pin, PinOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface WidgetConfig {
    id: string
    name: string
    component: React.ComponentType<any>
    defaultSize: { w: number; h: number }
    minSize: { w: number; h: number }
    category: string
}

interface WidgetGridProps {
    availableWidgets: WidgetConfig[]
    onLayoutChange?: (layout: any) => void
}

export function WidgetGrid({ availableWidgets, onLayoutChange }: WidgetGridProps) {
    const [layout, setLayout] = useState<any[]>([])
    const [activeWidgets, setActiveWidgets] = useState<string[]>([])
    const [pinnedWidgets, setPinnedWidgets] = useState<string[]>([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [showWidgetPicker, setShowWidgetPicker] = useState(false)
    const [isTouch, setIsTouch] = useState(false)

    // Using WidthProvider for automatic container width management
    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), [])

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }, [])

    // Load saved layout from localStorage
    useEffect(() => {
        const savedLayout = localStorage.getItem('dashboard-layout')
        const savedWidgets = localStorage.getItem('dashboard-widgets')
        const savedPinned = localStorage.getItem('dashboard-pinned')

        if (savedLayout) {
            setLayout(JSON.parse(savedLayout))
        } else {
            const defaultWidgets = [
                'recent-transactions',
                'budget-progress',
                'spending-category',
                'upcoming-bills'
            ]
            setLayout(getDefaultLayout(defaultWidgets))
        }

        if (savedWidgets) {
            setActiveWidgets(JSON.parse(savedWidgets))
        } else {
            setActiveWidgets([
                'recent-transactions',
                'budget-progress',
                'spending-category',
                'upcoming-bills'
            ])
        }

        if (savedPinned) {
            setPinnedWidgets(JSON.parse(savedPinned))
        }
    }, [])

    // Synchronize layout with active widgets
    useEffect(() => {
        if (activeWidgets.length === 0) return

        // Ensure all active widgets have layout items
        const layoutIds = new Set(layout.map((item: any) => item.i))
        const missingWidgets = activeWidgets.filter(id => !layoutIds.has(id))

        if (missingWidgets.length > 0) {
            const maxY = layout.length > 0 ? Math.max(...layout.map((item: any) => item.y + item.h)) : 0
            const newItems = missingWidgets.map((widgetId, index) => {
                const widget = availableWidgets.find(w => w.id === widgetId)
                const { w, h } = widget?.defaultSize || { w: 6, h: 4 }
                return {
                    i: widgetId,
                    x: (index % 2) * 6,
                    y: maxY + Math.floor(index / 2) * 4,
                    w,
                    h
                }
            })
            setLayout([...layout, ...newItems])
        }

        // Remove layout items for widgets that are no longer active
        const activeSet = new Set(activeWidgets)
        const filteredLayout = layout.filter((item: any) => activeSet.has(item.i))
        if (filteredLayout.length !== layout.length) {
            setLayout(filteredLayout)
        }
    }, [activeWidgets, availableWidgets])

    const getDefaultLayout = (widgets: string[]) => {
        let currentY = 0
        return widgets.map((widgetId, index) => {
            const widget = availableWidgets.find(w => w.id === widgetId)
            if (!widget) return { i: widgetId, x: 0, y: 0, w: 6, h: 4 }

            const { w, h } = widget.defaultSize
            const x = (index % 2) * 6 // Alternate between left (0) and right (6) columns

            if (index % 2 === 0 && index > 0) {
                currentY += 4 // Move to next row after every 2 widgets
            }

            return {
                i: widgetId,
                x,
                y: currentY,
                w,
                h
            }
        })
    }

    const handleLayoutChange = (newLayout: any) => {
        setLayout(newLayout)
        if (onLayoutChange) {
            onLayoutChange(newLayout)
        }
    }

    const saveLayout = () => {
        localStorage.setItem('dashboard-layout', JSON.stringify(layout))
        localStorage.setItem('dashboard-widgets', JSON.stringify(activeWidgets))
        localStorage.setItem('dashboard-pinned', JSON.stringify(pinnedWidgets))
        setIsEditMode(false)
    }

    const resetLayout = () => {
        const defaultWidgets = [
            'recent-transactions',
            'budget-progress',
            'spending-category',
            'upcoming-bills'
        ]
        setLayout(getDefaultLayout(defaultWidgets))
        setActiveWidgets(defaultWidgets)
    }

    const addWidget = (widgetId: string) => {
        if (!activeWidgets.includes(widgetId)) {
            setActiveWidgets([...activeWidgets, widgetId])
            setShowWidgetPicker(false)
        }
    }

    const removeWidget = (widgetId: string) => {
        setActiveWidgets(activeWidgets.filter((id: string) => id !== widgetId))
        setPinnedWidgets(pinnedWidgets.filter((id: string) => id !== widgetId))
    }

    const togglePin = (widgetId: string) => {
        setPinnedWidgets((prev: string[]) =>
            prev.includes(widgetId)
                ? prev.filter((id: string) => id !== widgetId)
                : [...prev, widgetId]
        )
    }

    const renderWidget = (widgetId: string) => {
        const widget = availableWidgets.find(w => w.id === widgetId)
        if (!widget) return null

        const WidgetComponent = widget.component

        return (
            <div key={widgetId}>
                <Card className="h-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 overflow-hidden">
                    {isEditMode && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); togglePin(widgetId); }}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${pinnedWidgets.includes(widgetId) ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                            >
                                {pinnedWidgets.includes(widgetId) ? <Pin size={12} /> : <Pin size={12} />}
                            </button>
                            <button
                                onClick={() => removeWidget(widgetId)}
                                className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {!isEditMode && pinnedWidgets.includes(widgetId) && (
                        <div className="absolute top-2 right-2 z-10 pointer-events-none">
                            <Pin size={12} className="text-primary-400 fill-primary-400" />
                        </div>
                    )}
                    <div className="h-full overflow-auto p-1">
                        <WidgetComponent />
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Widgets</h2>
                <div className="flex items-center gap-2">
                    {isEditMode ? (
                        <>
                            <Button onClick={() => setShowWidgetPicker(true)} variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Widget
                            </Button>
                            <Button onClick={resetLayout} variant="outline" size="sm">
                                Reset Layout
                            </Button>
                            <Button onClick={saveLayout} size="sm" className="gap-2">
                                Save Layout
                            </Button>
                            <Button onClick={() => setIsEditMode(false)} variant="outline" size="sm">
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditMode(true)} variant="outline" size="sm" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Customize
                        </Button>
                    )}
                </div>
            </div>

            {/* Edit Mode Banner */}
            {isEditMode && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100">Edit Mode Active</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Drag widgets to rearrange, resize by dragging corners, or remove widgets with the × button
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Widget Grid */}
            <div className="min-h-[500px]">
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: layout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    draggableHandle=".react-grid-item"
                    isDraggable={isEditMode}
                    isResizable={isEditMode}
                    onLayoutChange={(newLayout, allLayouts) => handleLayoutChange(allLayouts.lg || newLayout)}
                    margin={[16, 16]}
                >
                    {activeWidgets.map(widgetId => renderWidget(widgetId))}
                </ResponsiveGridLayout>
            </div>

            {/* Widget Picker Modal */}
            {showWidgetPicker && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto p-6 bg-white dark:bg-dark-elevated">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Widget</h3>
                            <button
                                onClick={() => setShowWidgetPicker(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <span className="text-2xl">×</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableWidgets.map(widget => {
                                const isActive = activeWidgets.includes(widget.id)
                                return (
                                    <button
                                        key={widget.id}
                                        onClick={() => !isActive && addWidget(widget.id)}
                                        disabled={isActive}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${isActive
                                            ? 'border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed'
                                            : 'border-gray-200 dark:border-white/10 hover:border-primary-500 hover:shadow-lg'
                                            }`}
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{widget.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{widget.category}</p>
                                        {isActive && (
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Already added</p>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
