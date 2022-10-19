import React from 'react';
import { getMonthIncome } from '@budgapp/common';
import { IncomeItem } from '../../common/income';
import service from '../services/communicationService';

export function useMonthIncomeItems(date: number | Date): IncomeItem[] {
    const [items, setItems] = React.useState([] as IncomeItem[]);

    React.useEffect(() => {
        service.sendMessage<number | Date, IncomeItem[]>(getMonthIncome, date).then((foundItems) => {
            setItems(foundItems);
        });
    }, [date]);

    return items;
}