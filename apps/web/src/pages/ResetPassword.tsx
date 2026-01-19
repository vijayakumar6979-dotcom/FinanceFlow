import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Password strength indicators
    const passwordRequirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Contains number', met: /[0-9]/.test(password) },
        { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) }
    ]

    const passwordStrength = passwordRequirements.filter(req => req.met).length
    const getStrengthLabel = () => {
        if (passwordStrength <= 2) return { label: 'Weak', color: 'text-red-500' }
        if (passwordStrength <= 3) return { label: 'Medium', color: 'text-yellow-500' }
        return { label: 'Strong', color: 'text-green-500' }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!passwordRequirements.every(req => req.met)) {
            setError('Password does not meet all requirements')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const { error: resetError } = await supabase.auth.updateUser({
                password: password
            })

            if (resetError) throw resetError

            setSuccess(true)

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/auth/login')
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 p-4">
                <div className="bg-white dark:bg-dark-elevated rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Password Reset Successful!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Your password has been updated successfully.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Redirecting to login...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-white max-w-md">
                    <h1 className="text-5xl font-bold mb-4">FinanceFlow AI</h1>
                    <p className="text-xl mb-8 opacity-90">Reset your password and get back to managing your finances</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <Lock className="w-5 h-5" />
                            </div>
                            <span>Secure password reset</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Reset Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-dark-base">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-dark-elevated rounded-2xl shadow-xl p-8 backdrop-blur-xl border border-gray-200 dark:border-white/10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Reset Password
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create a new strong password
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                                            <span className={`text-xs font-semibold ${getStrengthLabel().color}`}>
                                                {getStrengthLabel().label}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-dark-surface rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${passwordStrength <= 2 ? 'bg-red-500' :
                                                    passwordStrength <= 3 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Requirements Checklist */}
                                {password && (
                                    <div className="mt-3 space-y-1">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                {req.met ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                                )}
                                                <span className={`text-xs ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                                        placeholder="Re-enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !passwordRequirements.every(req => req.met) || password !== confirmPassword}
                                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>

                            {/* Back to Login */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/auth/login')}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
