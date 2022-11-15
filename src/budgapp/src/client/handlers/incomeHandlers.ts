import { addIncomeItems, convertToNumeric, getExpectedIncome, getMonthIncome, getMonthRangeIncome, setExpectedIncome } from '@budgapp/common';
import { IncomeManager } from '@budgapp/income';

import service from '../services/communicationService';

export const manager = new IncomeManager();

service.registerHandler(getExpectedIncome, () => {
    return Promise.resolve(manager.expectedIncome);
});

service.registerHandler(setExpectedIncome, (income: number) => {
    if (Number.isInteger(income)) {
        manager.expectedIncome = income;
    } else {
        manager.expectedIncome = convertToNumeric(income);
    }
    return Promise.resolve();
});

service.registerHandler(addIncomeItems, (newItems) => {
    return Promise.resolve(manager.addIncome(newItems));
});

service.registerHandler<string | Date, any>(getMonthIncome, (date) => {
    return Promise.resolve(manager.getMonthIncome(date));
});

service.registerHandler(getMonthRangeIncome, (request) => {
    return Promise.resolve(manager.getMonthRangeIncome(request));
});
