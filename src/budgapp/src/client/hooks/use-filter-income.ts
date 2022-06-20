import React from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getMonthRangeIncome } from '../../common/eventNames';
import { GetMonthRangeIncomeRequest } from '../../common/income';
import { IncomeRangeEvent } from '../../common/events';

export function useFilterIncome(filter: GetMonthRangeIncomeRequest): IncomeRangeEvent {
    const [items, setItems] = React.useState([] as IncomeRangeEvent);

    React.useEffect(() => {
        client.sendMessage<GetMonthRangeIncomeRequest, IncomeRangeEvent>(getMonthRangeIncome, filter).then((incomeRange) => {
            setItems(incomeRange);
        });
    }, [filter]);

    return items;
}