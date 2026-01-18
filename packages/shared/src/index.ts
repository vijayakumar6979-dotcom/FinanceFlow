export const SHARED_CONSTANT = "FinanceFlow Shared";

export interface User {
    id: string;
    name: string;
}

export * from './utils/currency';
export * from './utils/repayment-calculator';
export * from './constants/banks';
export * from './hooks/useAuth';
export * from './hooks/useTheme';
export * from './types/finance';
export * from './services/budget';
export * from './services/goal';
export * from './services/grok';
export * from './services/bills';
export * from './types/bills';

// Export only specific items from bill-providers to avoid type conflicts
export { malaysianBillProviders, getBillProviderById, getBillProvidersByCategory, getAllBillCategories } from './constants/bill-providers';
export * from './constants/billConstants';

export * from './types/investments';
export * from './services/investments';
export * from './services/market';
export * from './types/transaction';
export * from './services/transaction';
export * from './services/account';
export * from './types/auth';
export * from './types/analytics';
export * from './services/analytics';
export * from './types/credit-card-analytics';
export * from './services/credit-card-analytics';
export * from './services/budget-integration';
export * from './services/transaction-auto-creation';
export * from './types/loans';
export * from './services/loans';
export * from './constants/loanProviders';
export * from './utils/loanCalculations';
export * from './services/paymentReminders';
