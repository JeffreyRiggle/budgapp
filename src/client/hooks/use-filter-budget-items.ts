import React from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { filteredBudgetItems } from '../../common/eventNames';
import { BudgetItem, FilterBudgetItemsRequest } from '../../common/budget';

export function useFilterBudgetItems(filter: FilterBudgetItemsRequest) {
    const [items, setItems] = React.useState([] as BudgetItem[]);

    React.useEffect(() => {
        client.sendMessage<FilterBudgetItemsRequest, BudgetItem[]>(filteredBudgetItems, filter).then((budgetItems) => {
            setItems(budgetItems);
        });
    }, [client.available, filter]);

    return items;
}