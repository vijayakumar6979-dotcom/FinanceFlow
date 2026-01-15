export const SHARED_CONSTANT = "FinanceFlow Shared";

export interface User {
    id: string;
    name: string;
}

export * from './utils/currency';
export * from './constants/banks';
export * from './hooks/useAuth';
export * from './hooks/useTheme';
