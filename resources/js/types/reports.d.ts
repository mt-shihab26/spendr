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
