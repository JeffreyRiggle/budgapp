import { AddBudget } from './addBudget';
import { CategoryView } from './categoryView';

export class Budget {
    async getTargetBudget(): Promise<string> {
        const budgetValue = await $('span[data-testid="budget-income"]');
        return await budgetValue.getText();
    }

    async getTotalBudget(): Promise<string> {
        const budgetValue = await $('[data-testid="budget-spent"]');
        return await budgetValue.getText();
    }

    async addBudget(): Promise<AddBudget<Budget>> {
        const addBudgetButton = await $('a[href="/addBudget"');
        await addBudgetButton.click();
        return new AddBudget<Budget>(this);
    }

    async goToCategory(name: string): Promise<CategoryView> {
        const categoryLink = await $(`a[href="/category/${name}"]`);
        await categoryLink.click();
        return new CategoryView();
    }
}
