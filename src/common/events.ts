import { IncomeItem } from './income';

export interface IncomeRange {
    date: string;
    items: IncomeItem[];
}

export type IncomeRangeEvent = IncomeRange[];
