import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Check, ArrowRight, User, Globe, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const STEPS = [
    { id: 1, title: 'Profile Setup', icon: User },
    { id: 2, title: 'Preferences', icon: Globe },
    { id: 3, title: 'Complete', icon: Check }
];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { updateProfile, user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        currency: 'MYR',
        budgetStartDay: 1
    });

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            await handleFinish();
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            await updateProfile({
                full_name: formData.fullName,
                currency: formData.currency,
                budget_start_day: formData.budgetStartDay,
                updated_at: new Date().toISOString()
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to complete onboarding', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0E27] p-4">
            <Card className="w-full max-w-2xl min-h-[500px] flex flex-col p-0 overflow-hidden bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl">
                {/* Progress Bar */}
                <div className="flex border-b border-gray-200 dark:border-white/10">
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={`flex-1 flex items-center justify-center p-4 gap-2 text-sm font-medium transition-colors ${step === s.id
                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                                : step > s.id
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-400'
                                }`}
                        >
                            {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
                            <span className="hidden sm:inline">{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1 p-8 flex flex-col items-center justify-center">
                    {step === 1 && (
                        <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Let's verify your details</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    Confirm your personal information to get started.
                                </p>
                            </div>

                            <Input
                                label="Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Regional Settings</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    Set up your currency and budget preferences.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Default Currency
                                    </label>
                                    <select
                                        className="w-full h-11 px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="MYR">MYR - Malaysian Ringgit</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="SGD">SGD - Singapore Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Budget Start Day
                                    </label>
                                    <select
                                        className="w-full h-11 px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                                        value={formData.budgetStartDay}
                                        onChange={(e) => setFormData({ ...formData, budgetStartDay: parseInt(e.target.value) })}
                                    >
                                        <option value="1">1st of the month</option>
                                        <option value="15">15th of the month</option>
                                        <option value="25">25th of the month</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="w-full max-w-sm space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">You're All Set!</h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Your account has been configured successfully. Ready to master your money?
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    <Button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {step === 3 ? 'Get Started' : 'Continue'}
                        {step !== 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
