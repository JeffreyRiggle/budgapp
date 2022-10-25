import { getExpectedIncome, setExpectedIncome } from '@budgapp/common';
import { IncomeManager } from '@budgapp/income';

import service from '../services/communicationService';

const manager = new IncomeManager();

service.registerHandler(getExpectedIncome, () => {
    return Promise.resolve(manager.expectedIncome);
});

service.registerHandler(setExpectedIncome, (income: number) => {
    manager.expectedIncome = income;
    return Promise.resolve();
});
