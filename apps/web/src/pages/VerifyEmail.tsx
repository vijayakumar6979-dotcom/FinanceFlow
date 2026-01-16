import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Mail, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
    return (
        <AuthLayout
            title="Check your inbox"
            subtitle="Verify your email to continue"
        >
            <div className="text-center space-y-8">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-500/20 rounded-full animate-ping opacity-20" />
                    <div className="relative w-full h-full bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                        <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Verification link sent
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        We've sent a verification link to your email address. Please click the link to verify your account and access the dashboard.
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <Link to="/auth/login">
                        <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                            Go to Login <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>

                    <p className="text-sm text-gray-500">
                        Didn't receive the email?{' '}
                        <button className="text-blue-600 font-medium hover:underline">
                            Click to resend
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
