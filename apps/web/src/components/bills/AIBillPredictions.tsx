import { Card } from '@/components/ui/Card'
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BillPrediction {
    billId: string
    billName: string
    provider: string
    historicalData: {
        month: string
        amount: number
    }[]
    predictedAmount: number
    confidence: number
    trend: 'increasing' | 'decreasing' | 'stable'
    anomalyDetected: boolean
    recommendation: string
}

interface AIBillPredictionsProps {
    predictions: BillPrediction[]
}

export function AIBillPredictions({ predictions }: AIBillPredictionsProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Bill Predictions</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Smart forecasts for variable bills based on historical patterns
                        </p>
                    </div>
                </div>
            </Card>

            {/* Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {predictions.map((prediction) => {
                    const lastAmount = prediction.historicalData[prediction.historicalData.length - 1]?.amount || 0
                    const difference = prediction.predictedAmount - lastAmount
                    const percentChange = lastAmount > 0 ? (difference / lastAmount) * 100 : 0

                    return (
                        <Card key={prediction.billId} className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            {/* Bill Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{prediction.provider}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.billName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        RM {prediction.predictedAmount.toFixed(2)}
                                    </p>
                                    <div className={`flex items-center gap-1 justify-end ${difference >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                        }`}>
                                        {difference >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        <span className="text-sm font-medium">
                                            {difference >= 0 ? '+' : ''}RM {Math.abs(difference).toFixed(2)} ({percentChange.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Confidence Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${prediction.confidence >= 80
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : prediction.confidence >= 60
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    }`}>
                                    {prediction.confidence}% Confidence
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${prediction.trend === 'increasing'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        : prediction.trend === 'decreasing'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    }`}>
                                    {prediction.trend === 'increasing' ? '↑' : prediction.trend === 'decreasing' ? '↓' : '→'} {prediction.trend}
                                </div>
                            </div>

                            {/* Historical Chart */}
                            <div className="mb-4">
                                <ResponsiveContainer width="100%" height={150}>
                                    <LineChart data={prediction.historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                        <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#8B5CF6"
                                            strokeWidth={2}
                                            dot={{ fill: '#8B5CF6', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Anomaly Alert */}
                            {prediction.anomalyDetected && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Anomaly Detected</p>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                This bill shows unusual patterns. Review carefully.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Recommendation */}
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">AI Recommendation</p>
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            {prediction.recommendation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Summary Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Prediction Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Predicted</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            RM {predictions.reduce((sum, p) => sum + p.predictedAmount, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Anomalies Detected</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {predictions.filter(p => p.anomalyDetected).length}
                        </p>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Confidence</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length).toFixed(0)}%
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
