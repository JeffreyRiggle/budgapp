import React from 'react';
import { getMonthRangeIncome } from '@budgapp/common';
import { GetMonthRangeIncomeRequest } from '../../common/income';
import { IncomeRangeEvent } from '../../common/events';
import service from '../services/communicationService';

export function useFilterIncome(filter: GetMonthRangeIncomeRequest): IncomeRangeEvent {
    const [items, setItems] = React.useState([] as IncomeRangeEvent);

    React.useEffect(() => {
        service.sendMessage<GetMonthRangeIncomeRequest, IncomeRangeEvent>(getMonthRangeIncome, filter).then((incomeRange) => {
            setItems(incomeRange);
        });
    }, [filter]);

    return items;
}