export const SHARED_CONSTANT = "FinanceFlow Shared";

export interface User {
    id: string;
    name: string;
}

export * from './utils/currency';
export * from './constants/banks';
export * from './hooks/useAuth';
export * from './hooks/useTheme';
export * from './types/finance';
export * from './services/budget';
export * from './services/goal';
export * from './services/grok';
export * from './services/bills';
export * from './types/bills';
