import { BudgetManager } from '@budgapp/budget';
import { addBudgetItems, filteredBudgetItems, getBudgetItems, removeBudgetItem, updateBudgetItem } from '@budgapp/common';
import service from '../services/communicationService';

export const manager = new BudgetManager();

service.registerHandler<any[], any[]>(filteredBudgetItems, (filters) => {
    return Promise.resolve(manager.getFilteredItems(filters));
});

service.registerHandler<any[], void>(addBudgetItems, (newItems) => {
    return Promise.resolve(manager.addItems(newItems));
});

service.registerHandler(removeBudgetItem, (item) => {
    return Promise.resolve(manager.removeItem(item));
});

service.registerHandler(getBudgetItems, () => {
    return Promise.resolve(manager.items);
});


service.registerHandler(updateBudgetItem, (item) => {
    return Promise.resolve(manager.tryUpdateItem(item));
});