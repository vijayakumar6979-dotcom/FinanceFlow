import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useTheme } from '@financeflow/shared';
import Dashboard from '@/pages/Dashboard';
import AccountsPage from '@/pages/Accounts';
import AccountDetailsPage from '@/pages/AccountDetails';

// Placeholder Page
const TransactionsPage = () => <div className="p-4 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 h-96 flex items-center justify-center">Transactions Content</div>;

function App() {
    const { theme } = useTheme();

    // Sync theme with HTML root
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route
                    path="/*"
                    element={
                        <DashboardLayout>
                            <Routes>
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="accounts" element={<AccountsPage />} />
                                <Route path="accounts/:id" element={<AccountDetailsPage />} />
                                <Route path="transactions" element={<TransactionsPage />} />
                                <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
                            </Routes>
                        </DashboardLayout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
