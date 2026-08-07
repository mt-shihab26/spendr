import type { TCurrency, TType } from '@/types/enums';

export type TUser = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
};

export type TWallet = {
    id: string;
    user_id: string;
    name: string;
    currency: TCurrency;
    initial_balance: number;
    color: string;
    icon: string | null;
    is_default: boolean;
    sort_order: number;
    income: number | null;
    expense: number | null;
    transfers_out: number | null;
    transfers_in: number | null;
    net: number | null;
    balance: number | null;
    transactions_count?: number | null;
    month_income?: number | null;
    month_expense?: number | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

export type TBudget = {
    id: string;
    user_id: string;
    category_id: string;
    amount: Record<TCurrency, number>;
    spent?: Partial<Record<TCurrency, number>>;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    category?: TCategory;
};

export type TCategory = {
    id: string;
    user_id: string;
    name: string;
    type: TType;
    color: string;
    icon: string | null;
    is_default: boolean;
    sort_order: number;
    transactions_count: number | null;
    total_amount: number | null;
    month_spent?: Partial<Record<TCurrency, number>>;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    budget?: TBudget | null;
};

export type TFile = {
    id: string;
    user_id: string;
    fileable_type: string;
    fileable_id: string;
    name: string;
    path: string;
    mime_type: string;
    size: number;
    created_at: string;
    updated_at: string;
};

export type TTransaction = {
    id: string;
    user_id: string;
    wallet_id: string;
    category_id: string;
    type: TType;
    amount: number;
    transacted_at: string;
    description: string;
    notes: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    wallet?: TWallet;
    category?: TCategory;
    files?: TFile[];
};

export type TRecurringTransaction = {
    id: string;
    user_id: string;
    wallet_id: string;
    category_id: string | null;
    type: TType;
    amount: number;
    description: string;
    notes: string | null;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    next_due_at: string;
    last_run_at: string | null;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    wallet?: TWallet;
    category?: TCategory | null;
};

export type TGoal = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    currency: TCurrency;
    target_amount: number;
    current_amount: number;
    progress_percentage?: number;
    target_date: string | null;
    icon: string | null;
    color: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

export type TTransfer = {
    id: string;
    user_id: string;
    from_wallet_id: string;
    to_wallet_id: string;
    amount: number;
    transacted_at: string;
    notes: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    from_wallet?: TWallet;
    to_wallet?: TWallet;
};
