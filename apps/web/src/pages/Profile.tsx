import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Mail, Globe, Shield, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-blue-600 dark:text-white">
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
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                            <User size={18} />
                            Profile Information
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <Globe size={18} />
                            Preferences
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <Shield size={18} />
                            Security
                        </button>
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
                                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white opacity-70">
                                        <Mail size={14} />
                                        {user?.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button disabled>Edit Profile (Coming Soon)</Button>
                        </div>
                    </Card>

                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
                        <div className="space-y-4 text-gray-500 dark:text-gray-400">
                            <p>Currency: MYR</p>
                            <p>Language: English</p>
                            <p>Theme: Dark</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
