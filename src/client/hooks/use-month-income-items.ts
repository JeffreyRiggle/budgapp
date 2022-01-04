import React from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getMonthIncome } from '../../common/eventNames';
import { IncomeItem } from '../../common/income';

export function useMonthIncomeItems(date: number | Date): IncomeItem[] {
    const [items, setItems] = React.useState([] as IncomeItem[]);

    React.useEffect(() => {
        client.sendMessage<number | Date, IncomeItem[]>(getMonthIncome, date).then((foundItems) => {
            setItems(foundItems);
        });
    }, [client.available, date]);

    return items;
}