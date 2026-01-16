import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn, signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        try {
            if (provider === 'google') await signInWithGoogle();
            // Apple impl
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to access your finance dashboard"
        >
            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        icon={<Mail size={18} />}
                        required
                    />
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={<Lock size={18} />}
                            required
                        />
                        <div className="flex justify-between items-center mt-2">
                            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                Remember me
                            </label>
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign In
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 dark:bg-[#0A0E27] text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="font-medium text-gray-700 dark:text-gray-200">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent"
                    >
                        <svg className="w-5 h-5 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.13-.6-3.13-.05-1.02.56-2.24.61-3.23-.42C6.46 19.06 4 14.39 4 10.5 4 6.78 6.06 4.3 8.5 4.3c1.07 0 2.17.61 2.92.61.73 0 2.05-.68 3.25-.68 2.08.06 3.52 1.35 3.96 2.02-.91.56-1.5 1.58-1.5 2.89 0 2.27 1.94 3.09 1.98 3.11-.03.11-.42 1.48-1.42 2.93-.85 1.25-1.74 2.49-3.05 2.49h-.01l.02.01zM11.96 4.26c.55-1.39 1.87-2.26 3.18-2.26.24 1.55-1.16 3.2-2.73 3.26-.2 0-.41-.01-.61-.05.02-1.33.56-2.61 1.16-3.21z" />
                        </svg>
                        <span className="font-medium text-gray-700 dark:text-gray-200">Apple</span>
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account?{' '}
                    <Link to="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
