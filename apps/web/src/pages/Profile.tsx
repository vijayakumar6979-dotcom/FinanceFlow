import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Mail, Globe, Shield, Lock, LogOut } from 'lucide-react';
import { CurrencySelector } from '@/components/settings/CurrencySelector';
import { SecuritySettings, PrivacySettings } from '@/components/settings/SecurityPrivacySettings';
import { supabase } from '@/services/supabase';
import { toast } from 'react-hot-toast';

type TabType = 'profile' | 'preferences' | 'security' | 'privacy';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const [currency, setCurrency] = useState('MYR');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    useEffect(() => {
        if (user) loadProfile();
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('preferred_currency')
                .eq('id', user?.id)
                .single();

            if (data) setCurrency(data.preferred_currency || 'MYR');
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const updateCurrency = async (newCurrency: string) => {
        try {
            setIsLoading(true);
            const { error } = await supabase
                .from('profiles')
                .update({ preferred_currency: newCurrency })
                .eq('id', user?.id);

            if (error) throw error;
            setCurrency(newCurrency);
            toast.success('Currency preference updated');
        } catch (error) {
            console.error('Error updating currency:', error);
            toast.error('Failed to update currency');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'profile' as TabType, label: 'Profile Information', icon: User },
        { id: 'preferences' as TabType, label: 'Preferences', icon: Globe },
        { id: 'security' as TabType, label: 'Security', icon: Shield },
        { id: 'privacy' as TabType, label: 'Privacy', icon: Lock },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-white shadow-lg">
                                {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                            </div>
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {user?.user_metadata?.full_name || 'User'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.email}
                            </p>
                        </div>
                    </Card>

                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive
                                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10">
                        <Button
                            variant="danger"
                            className="w-full justify-start gap-3"
                            onClick={() => signOut()}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'profile' && (
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>

                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                                        <div className="px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                            {user?.user_metadata?.full_name || 'Not set'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                            <Mail size={14} className="text-gray-400" />
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button disabled>Edit Profile (Coming Soon)</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'preferences' && (
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
                            <div className="space-y-6">
                                <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
                                    <CurrencySelector
                                        value={currency}
                                        onChange={updateCurrency}
                                        label="Default Currency"
                                        description="Select your preferred currency for display across the app."
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-white/10 opacity-50 pointer-events-none">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</p>
                                    <div className="p-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white">English (Default)</div>
                                </div>

                                <div className="opacity-50 pointer-events-none">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</p>
                                    <div className="p-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white">Dark (Default)</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && <SecuritySettings />}

                    {activeTab === 'privacy' && <PrivacySettings />}
                </div>
            </div>
        </div>
    );
}
