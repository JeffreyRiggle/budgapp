import { addCategory, getCategories, updateCategories } from '@budgapp/common';
import { CategoryManager } from '@budgapp/budget';
import { budgetManager } from './budgetHandlers';

import service from '../services/communicationService';

const manager = new CategoryManager(budgetManager);

service.registerHandler(getCategories, (request: string) => {
    return Promise.resolve(manager.getMonthCategories(request || Date.now()));
});

service.registerHandler(addCategory, (request) => {
    return Promise.resolve(manager.addCategory(request));
});

service.registerHandler(updateCategories, (request: any[]) => {
    return Promise.resolve(manager.updateCategory(request));
});
