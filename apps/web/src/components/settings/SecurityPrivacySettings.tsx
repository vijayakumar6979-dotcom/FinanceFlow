import { Shield, Key, Smartphone, Monitor, LogOut, Trash2, Download, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { supabase } from '@/services/supabase'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export function SecuritySettings() {
    const { user, signOut } = useAuth()
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            toast.success('Password updated successfully')
            setShowChangePassword(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password')
        } finally {
            setLoading(false)
        }
    }

    const handleSignOutAllDevices = async () => {
        if (!confirm('This will sign you out from all devices. Continue?')) return

        try {
            await supabase.auth.signOut({ scope: 'global' })
            toast.success('Signed out from all devices')
            signOut()
        } catch (error: any) {
            toast.error('Failed to sign out from all devices')
        }
    }

    return (
        <div className="space-y-6">
            {/* Change Password */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Password</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Change your account password</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowChangePassword(!showChangePassword)}
                    >
                        {showChangePassword ? 'Cancel' : 'Change Password'}
                    </Button>
                </div>

                {showChangePassword && (
                    <form onSubmit={handleChangePassword} className="mt-4 space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </form>
                )}
            </Card>

            {/* Active Sessions */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active login sessions</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Current Device</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Last active: Just now</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                            Active
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <Button
                        variant="danger"
                        onClick={handleSignOutAllDevices}
                        className="w-full justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out All Devices
                    </Button>
                </div>
            </Card>

            {/* Two-Factor Authentication (Coming Soon) */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-60">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security (Coming Soon)</p>
                    </div>
                </div>
                <Button disabled className="w-full">Enable 2FA (Coming Soon)</Button>
            </Card>
        </div>
    )
}

export function PrivacySettings() {
    const { user } = useAuth()
    const [dataSharing, setDataSharing] = useState(false)
    const [profileVisibility, setProfileVisibility] = useState<'private' | 'public'>('private')
    const [loading, setLoading] = useState(false)

    const handleDownloadData = async () => {
        toast.success('Preparing your data export... This may take a few minutes.')
        // TODO: Implement GDPR data export
    }

    const handleDeleteAccount = async () => {
        const confirmed = confirm(
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
        )

        if (!confirmed) return

        const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:')

        if (doubleConfirm !== 'DELETE') {
            toast.error('Account deletion cancelled')
            return
        }

        try {
            setLoading(true)
            // TODO: Implement account deletion
            toast.success('Account deletion request submitted')
        } catch (error: any) {
            toast.error('Failed to delete account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Visibility */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Visibility</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your profile</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Private</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Only you can see your profile</p>
                        </div>
                        <input
                            type="radio"
                            name="visibility"
                            checked={profileVisibility === 'private'}
                            onChange={() => setProfileVisibility('private')}
                            className="w-4 h-4 text-primary-600"
                        />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer opacity-50">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Public (Coming Soon)</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Anyone can see your profile</p>
                        </div>
                        <input
                            type="radio"
                            name="visibility"
                            disabled
                            className="w-4 h-4 text-primary-600"
                        />
                    </label>
                </div>
            </Card>

            {/* Data Sharing */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Sharing</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Share anonymous usage data to improve the app</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dataSharing}
                            onChange={(e) => setDataSharing(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                </div>
            </Card>

            {/* Download Data */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Download Your Data</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Export all your data (GDPR compliance)</p>
                    </div>
                </div>
                <Button onClick={handleDownloadData} variant="outline" className="w-full justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Request Data Export
                </Button>
            </Card>

            {/* Delete Account */}
            <Card className="p-6 bg-white dark:bg-white/5 border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                    </div>
                </div>
                <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="w-full justify-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    {loading ? 'Processing...' : 'Delete Account'}
                </Button>
            </Card>
        </div>
    )
}
