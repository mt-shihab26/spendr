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
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
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
    deleted_at: string | null;
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
};
