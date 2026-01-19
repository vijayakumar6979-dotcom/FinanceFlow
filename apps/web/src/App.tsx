import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useTheme } from '@financeflow/shared';
import Dashboard from '@/pages/Dashboard';
import AccountsPage from '@/pages/Accounts';
import CreateAccountPage from '@/pages/CreateAccountPage';
import AccountDetailsPage from '@/pages/AccountDetails';
import BudgetsDashboard from '@/pages/budgets/BudgetsDashboard';
import CreateBudget from '@/pages/budgets/CreateBudget';
import BudgetDetails from '@/pages/budgets/BudgetDetails';
import GoalsDashboard from '@/pages/goals/GoalsDashboard';
import CreateGoal from '@/pages/goals/CreateGoal';
import GoalDetails from '@/pages/goals/GoalDetails';
import BillsDashboard from '@/pages/bills/BillsDashboard';
import CreateBill from '@/pages/bills/CreateBill';
import BillDetails from '@/pages/bills/BillDetails';
import EditBill from '@/pages/bills/EditBill';
import BillsAnalytics from '@/pages/bills/BillsAnalytics';
import { ReloadPrompt } from '@/components/ReloadPrompt';
import LoansPage from '@/pages/Loans';
import LoanDetailsPage from '@/pages/LoanDetails';
import LoanStrategiesPage from '@/pages/LoanStrategies';
import LoginPage from '@/pages/Login';
import SignupPage from '@/pages/Signup';
import ForgotPasswordPage from '@/pages/ForgotPassword';
import ResetPasswordPage from '@/pages/ResetPassword';
import VerifyEmailPage from '@/pages/VerifyEmail';
import OnboardingPage from '@/pages/Onboarding';
import ProfilePage from '@/pages/Profile';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import InvestmentsPage from '@/pages/Investments';
import AnalyticsPage from '@/pages/Analytics';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { PageTransition } from '@/components/ui/PageTransition';

function AppContent() {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <>
            <ToastProvider />
            <ReloadPrompt />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public Auth Routes */}
                    <Route path="/auth/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/auth/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/login" element={<Navigate to="/auth/login" replace />} />

                    <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

                    {/* Root path - redirect based on auth status */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />} />

                    {/* Protected Dashboard Routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <PageTransition>
                                        <Routes location={location} key={location.pathname}>
                                            <Route path="dashboard" element={<Dashboard />} />
                                            <Route path="analytics" element={<AnalyticsPage />} />
                                            <Route path="accounts" element={<AccountsPage />} />
                                            <Route path="accounts/new" element={<CreateAccountPage />} />
                                            <Route path="accounts/:id" element={<AccountDetailsPage />} />
                                            <Route path="budgets" element={<BudgetsDashboard />} />
                                            <Route path="budgets/new" element={<CreateBudget />} />
                                            <Route path="budgets/:id" element={<BudgetDetails />} />
                                            <Route path="goals" element={<GoalsDashboard />} />
                                            <Route path="goals/new" element={<CreateGoal />} />
                                            <Route path="goals/:id" element={<GoalDetails />} />
                                            <Route path="bills" element={<BillsDashboard />} />
                                            <Route path="bills/analytics" element={<BillsAnalytics />} />
                                            <Route path="bills/new" element={<CreateBill />} />
                                            <Route path="bills/:id" element={<BillDetails />} />
                                            <Route path="bills/:id/edit" element={<EditBill />} />
                                            <Route path="loans" element={<LoansPage />} />
                                            <Route path="loans/strategies" element={<LoanStrategiesPage />} />
                                            <Route path="loans/:id" element={<LoanDetailsPage />} />
                                            <Route path="transactions" element={<TransactionsPage />} />
                                            <Route path="investments" element={<InvestmentsPage />} />
                                            <Route path="settings" element={<ProfilePage />} />
                                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                                        </Routes>
                                    </PageTransition>
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </>
    );
}

function App() {
    const { theme } = useTheme();
    const { loading } = useAuth();

    // Sync theme with HTML root
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0E27] text-gray-900 dark:text-white">Loading...</div>;
    }

    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
