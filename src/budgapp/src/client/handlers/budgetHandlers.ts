import { BudgetManager } from '@budgapp/budget';
import { addBudgetItems, filteredBudgetItems, getBudgetItems, removeBudgetItem, updateBudgetItem } from '@budgapp/common';
import service from '../services/communicationService';

export const budgetManager = new BudgetManager();

service.registerHandler<any[], any[]>(filteredBudgetItems, (filters) => {
    return Promise.resolve(budgetManager.getFilteredItems(filters));
});

service.registerHandler<any[], void>(addBudgetItems, (newItems) => {
    return Promise.resolve(budgetManager.addItems(newItems));
});

service.registerHandler(removeBudgetItem, (item) => {
    return Promise.resolve(budgetManager.removeItem(item));
});

service.registerHandler(getBudgetItems, () => {
    return Promise.resolve(budgetManager.items);
});


service.registerHandler(updateBudgetItem, (item) => {
    return Promise.resolve(budgetManager.tryUpdateItem(item));
});