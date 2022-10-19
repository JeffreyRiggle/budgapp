import React from 'react';
import { filteredBudgetItems } from '@budgapp/common';
import { BudgetItem, FilterBudgetItemsRequest } from '../../common/budget';
import service from '../services/communicationService';

export function useFilterBudgetItems(filter: FilterBudgetItemsRequest) {
    const [items, setItems] = React.useState([] as BudgetItem[]);

    React.useEffect(() => {
        service.sendMessage<FilterBudgetItemsRequest, BudgetItem[]>(filteredBudgetItems, filter).then((budgetItems) => {
            setItems(budgetItems);
        });
    }, [filter]);

    return items;
}