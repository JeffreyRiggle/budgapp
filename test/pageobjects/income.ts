import { AddIncome } from './addIncome';

export class Income {
    async getTargetIncome() {
        const incomeValue = await $('span[data-testid="income-target"]');
        return await incomeValue.getText();
    }

    async getTotalIncome() {
        const incomeValue = await $('[data-testid="income-total"]');
        return await incomeValue.getText();
    }

    async addIncome() {
        const addIncomeButton = await $('a[href="/addIncome"');
        await addIncomeButton.click();
        return new AddIncome(this);
    }
}
