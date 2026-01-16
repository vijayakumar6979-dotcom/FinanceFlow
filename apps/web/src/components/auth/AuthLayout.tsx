import React from 'react';
import { Wallet, CheckCircle2 } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-[#0A0E27]">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">FinanceFlow AI</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight">
                            Master Your Money<br />
                            <span className="text-blue-200">With AI Intelligence</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-md">
                            Experience the next generation of personal finance management. Smart tracking, AI insights, and goal achievement all in one place.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                'Smart Expense Tracking',
                                'AI-Powered Financial Insights',
                                'Automated Budget Planning',
                                'Secure & Private'
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    <span className="text-blue-50 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-blue-200/60">
                        © 2024 FinanceFlow AI. Secure & Encrypted.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {title}
                        </h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
