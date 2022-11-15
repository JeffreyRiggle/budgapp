import { addCategory, getCategories, getCategory, updateCategories } from '@budgapp/common';
import { CategoryManager } from '@budgapp/budget';
import { manager as budgetManager } from './budgetHandlers';

import service from '../services/communicationService';

export const manager = new CategoryManager(budgetManager);

service.registerHandler(getCategories, (request: string) => {
    return Promise.resolve(manager.getMonthCategories(request || Date.now()));
});

service.registerHandler(addCategory, (request) => {
    return Promise.resolve(manager.addCategory(request));
});

service.registerHandler(updateCategories, (request: any[]) => {
    return Promise.resolve(manager.updateCategory(request));
});

service.registerHandler(getCategory, (req) => {
    return Promise.resolve(manager.getMonthCategory(req));
});