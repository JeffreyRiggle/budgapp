export interface IncomeItem {
    amount: string | number;
    date: string | Date;
    source?: string;
}

export interface GetMonthRangeIncomeRequest {
    start: Date;
    end: Date;
}
