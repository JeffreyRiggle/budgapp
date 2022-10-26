import { addCategory, getCategories, updateCategories } from '@budgapp/common';
import { CategoryManager, BudgetManager } from '@budgapp/budget';

import service from '../services/communicationService';

const manager = new CategoryManager(new BudgetManager());

service.registerHandler(getCategories, (request: string) => {
    return Promise.resolve(manager.getMonthCategories(request || Date.now()));
});

service.registerHandler(addCategory, (request) => {
    return Promise.resolve(manager.addCategory(request));
});

service.registerHandler(updateCategories, (request: any[]) => {
    return Promise.resolve(manager.updateCategory(request));
});
