export type TSummary = {
    income: number;
    expenses: number;
    net: number;
};

export type TCashFlowRow = {
    month: string;
    key: string;
    income: number;
    expenses: number;
    net: number;
    savings_rate: number | null;
};

export type TCategoryRow = {
    name: string;
    color: string;
    total: number;
    percentage: number;
};

export type TNetWorthRow = {
    month: string;
    key: string;
    net_worth: number;
};

export type TYearOverYearRow = {
    month: string;
    current_income: number;
    current_expenses: number;
    prev_income: number;
    prev_expenses: number;
};
