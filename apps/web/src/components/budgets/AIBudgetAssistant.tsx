import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils'; // Assuming global util exists

interface Insight {
    id: string;
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    action?: string;
}

export function AIBudgetAssistant({ insights = [], onAskAI }: { insights?: Insight[], onAskAI: (query: string) => void }) {
    const [query, setQuery] = useState('');
    const [activeInsight, setActiveInsight] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onAskAI(query);
            setQuery('');
        }
    };

    const nextInsight = () => setActiveInsight((prev) => (prev + 1) % insights.length);

    return (
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 text-white shadow-2xl shadow-indigo-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left: Interactive Chat / Command */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
                            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                AI Financial Advisor
                            </h2>
                            <p className="text-indigo-200 text-sm">Powered by Grok Beta</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg font-light text-indigo-100 leading-relaxed">
                            "You're saving
                            <span className="font-bold text-emerald-300 mx-1.5 bg-emerald-500/10 px-1 rounded">12% more</span>
                            on dining this month compared to average. Keep it up!"
                        </p>

                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
                            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-1.5 focus-within:bg-white/15 transition-all">
                                <MessageSquare className="ml-2 text-indigo-300 w-5 h-5 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask for budget advice..."
                                    className="flex-1 bg-transparent border-none text-white placeholder-indigo-300/50 focus:ring-0 px-3 py-2 font-medium min-w-0"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-lg shadow-lg flex-shrink-0"
                                >
                                    Ask
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Insights Carousel */}
                <div className="relative h-48 lg:h-full min-h-[180px]">
                    <AnimatePresence mode="wait">
                        {insights.length > 0 ? (
                            <motion.div
                                key={activeInsight}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer group" onClick={nextInsight}>
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-200">
                                                <Zap className="w-4 h-4 text-yellow-400" />
                                                Insight #{activeInsight + 1}
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 group-hover:bg-indigo-400 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{insights[activeInsight].title}</h3>
                                        <p className="text-indigo-100/80 text-sm leading-relaxed">{insights[activeInsight].description}</p>
                                    </div>

                                    {insights[activeInsight].action && (
                                        <div className="flex items-center gap-2 text-sm font-bold text-pink-300 group-hover:text-pink-200 transition-colors mt-4">
                                            {insights[activeInsight].action} <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <Lightbulb className="w-12 h-12 text-indigo-300/50 mb-4" />
                                <p className="text-indigo-200">Analyzing your spending habits...</p>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Carousel Dots */}
                    <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
                        {insights.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                    idx === activeInsight ? "bg-white w-4" : "bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
