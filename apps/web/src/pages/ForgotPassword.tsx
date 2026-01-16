import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent you instructions to reset your password"
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    <p className="text-gray-600 dark:text-gray-300">
                        We sent a password reset link to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                        Please check your inbox and spam folder.
                    </p>

                    <div className="pt-4">
                        <Link to="/auth/login">
                            <Button variant="outline" className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>

                    <button
                        onClick={() => setSuccess(false)}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Click here if you didn't receive an email
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive reset instructions"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon={<Mail size={18} />}
                    required
                />

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Send Reset Link
                </Button>

                <div className="text-center">
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
