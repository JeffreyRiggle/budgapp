import { Category } from './category';
import { StorageView } from './storage';

export class General {
    async setIncome(value) {
        const incomeInput = await $('.income-details input');
        await incomeInput.setValue(value);
        return this;
    }

    async getIncome() {
        const incomeInput = await $('.income-details input');
        return await incomeInput.getValue();
    }

    async addCategory(name) {
        const categoryInput = await $('.add-category-area input');
        await categoryInput.setValue(name);
        const addCategoryButton = await $('.add-category-area button');
        addCategoryButton.click();
        return new Category(name);
    }

    async update() {
        const addCategoryButton = await $('[data-testid="category-update"]');
        addCategoryButton.click();
        return this;
    }

    async setStorageOptions() {
        const storageLink = await $('a[href="/storage"]');
        await storageLink.click();
        return new StorageView();
    }
}
