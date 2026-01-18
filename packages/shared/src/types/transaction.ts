export type TransactionType = 'income' | 'expense' | 'transfer';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
export type RecurrenceEndCondition = 'never' | 'count' | 'date';
export type LinkedType = 'bill' | 'loan' | 'goal' | 'investment' | 'credit_card';

export interface TransactionCategory {
    id: string;
    user_id?: string;
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
    is_system: boolean;
    group_name?: string;
    created_at?: string;
}

export interface RecurrenceRule {
    id?: string;
    transaction_id?: string;
    frequency: RecurrenceFrequency;
    interval: number;
    start_date: string;
    end_date?: string;
    end_condition: RecurrenceEndCondition;
    occurrence_count?: number;
    next_occurrence?: string;
    created_at?: string;
}

export interface TransactionSplit {
    id?: string;
    transaction_id?: string;
    category_id: string;
    amount: number;
    note?: string;
    created_at?: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    account_id: string;
    category_id?: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    notes?: string;
    tags?: string[];

    // Links
    linked_type?: LinkedType;
    linked_id?: string;

    // Recurring
    is_recurring: boolean;
    recurrence_rule?: RecurrenceRule; // Joined property

    // Splits
    is_split: boolean;
    splits?: TransactionSplit[]; // Joined property

    created_at?: string;
    updated_at?: string;

    // Joins
    category?: TransactionCategory;
    // account?: Account; // Avoid circular dependency if possible
}

export interface CreateTransactionDTO extends Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'recurrence_rule' | 'splits' | 'category' | 'is_recurring' | 'is_split'> {
    is_recurring?: boolean; // Optional - only if database has these columns
    is_split?: boolean; // Optional - only if database has these columns
    recurrence_rule?: Omit<RecurrenceRule, 'id' | 'transaction_id' | 'created_at'>;
    splits?: Omit<TransactionSplit, 'id' | 'transaction_id' | 'created_at'>[];
}
