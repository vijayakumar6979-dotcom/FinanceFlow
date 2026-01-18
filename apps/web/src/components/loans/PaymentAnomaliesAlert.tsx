import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';

interface PaymentAnomaly {
    loanId: string;
    loanName: string;
    anomalyType: 'missed_payment' | 'late_payment' | 'unusual_amount' | 'payment_pattern_change' | 'high_utilization';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
    detectedAt: string;
    metadata?: Record<string, any>;
}

export function PaymentAnomaliesAlert() {
    const [anomalies, setAnomalies] = useState<PaymentAnomaly[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadAnomalies();
    }, []);

    const loadAnomalies = async () => {
        try {
            const { data, error } = await supabase.functions.invoke('detect-payment-issues');

            if (error) {
                console.error('Failed to load anomalies:', error);
                return;
            }

            if (data?.anomalies) {
                setAnomalies(data.anomalies);
            }
        } catch (error) {
            console.error('Error loading anomalies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSeverityConfig = (severity: PaymentAnomaly['severity']) => {
        switch (severity) {
            case 'critical':
                return {
                    icon: AlertTriangle,
                    color: 'text-red-600 dark:text-red-400',
                    bg: 'bg-red-50 dark:bg-red-500/10',
                    border: 'border-red-200 dark:border-red-500/30',
                    badge: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                };
            case 'high':
                return {
                    icon: AlertCircle,
                    color: 'text-orange-600 dark:text-orange-400',
                    bg: 'bg-orange-50 dark:bg-orange-500/10',
                    border: 'border-orange-200 dark:border-orange-500/30',
                    badge: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'
                };
            case 'medium':
                return {
                    icon: AlertCircle,
                    color: 'text-yellow-600 dark:text-yellow-400',
                    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
                    border: 'border-yellow-200 dark:border-yellow-500/30',
                    badge: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                };
            default:
                return {
                    icon: Info,
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-500/10',
                    border: 'border-blue-200 dark:border-blue-500/30',
                    badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                };
        }
    };

    const getAnomalyIcon = (type: PaymentAnomaly['anomalyType']) => {
        switch (type) {
            case 'missed_payment':
                return Clock;
            case 'late_payment':
                return Clock;
            case 'unusual_amount':
                return DollarSign;
            case 'payment_pattern_change':
                return TrendingDown;
            case 'high_utilization':
                return AlertTriangle;
            default:
                return Info;
        }
    };

    const handleDismiss = (anomaly: PaymentAnomaly) => {
        const id = `${anomaly.loanId}-${anomaly.anomalyType}`;
        setDismissedIds(prev => new Set([...prev, id]));
    };

    const visibleAnomalies = anomalies.filter(anomaly => {
        const id = `${anomaly.loanId}-${anomaly.anomalyType}`;
        return !dismissedIds.has(id);
    });

    const criticalCount = visibleAnomalies.filter(a => a.severity === 'critical').length;
    const highCount = visibleAnomalies.filter(a => a.severity === 'high').length;

    if (isLoading) {
        return null;
    }

    if (visibleAnomalies.length === 0) {
        return null;
    }

    // Show compact view if not expanded
    if (!isExpanded) {
        const topAnomaly = visibleAnomalies[0];
        const config = getSeverityConfig(topAnomaly.severity);
        const Icon = config.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <Card className={`p-4 ${config.bg} ${config.border} border-2`}>
                    <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 ${config.color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className={`font-bold ${config.color}`}>
                                    {criticalCount > 0 && `${criticalCount} Critical Issue${criticalCount > 1 ? 's' : ''}`}
                                    {criticalCount === 0 && highCount > 0 && `${highCount} Important Alert${highCount > 1 ? 's' : ''}`}
                                    {criticalCount === 0 && highCount === 0 && 'Payment Alerts'}
                                </p>
                                {visibleAnomalies.length > 1 && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>
                                        +{visibleAnomalies.length - 1} more
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm ${config.color}`}>
                                {topAnomaly.description}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsExpanded(true)}
                            className="flex-shrink-0"
                        >
                            View All
                        </Button>
                    </div>
                </Card>
            </motion.div>
        );
    }

    // Expanded view
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Payment Alerts
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            {visibleAnomalies.length} issue{visibleAnomalies.length > 1 ? 's' : ''} detected
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsExpanded(false)}
                    >
                        Collapse
                    </Button>
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {visibleAnomalies.map((anomaly, index) => {
                            const config = getSeverityConfig(anomaly.severity);
                            const Icon = config.icon;
                            const TypeIcon = getAnomalyIcon(anomaly.anomalyType);
                            const id = `${anomaly.loanId}-${anomaly.anomalyType}`;

                            return (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 rounded-lg ${config.bg} ${config.border} border`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Icon className={`w-5 h-5 ${config.color}`} />
                                            <TypeIcon className={`w-4 h-4 ${config.color}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={`font-semibold ${config.color}`}>
                                                    {anomaly.loanName}
                                                </p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge} uppercase font-medium`}>
                                                    {anomaly.severity}
                                                </span>
                                            </div>

                                            <p className={`text-sm ${config.color} mb-2`}>
                                                {anomaly.description}
                                            </p>

                                            <div className={`text-xs ${config.color} bg-white dark:bg-white/10 rounded px-3 py-2 border ${config.border}`}>
                                                <span className="font-semibold">💡 Recommendation: </span>
                                                {anomaly.recommendation}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDismiss(anomaly)}
                                            className={`p-1 rounded hover:bg-white/20 dark:hover:bg-black/20 transition-colors flex-shrink-0`}
                                        >
                                            <X className={`w-4 h-4 ${config.color}`} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    );
}
