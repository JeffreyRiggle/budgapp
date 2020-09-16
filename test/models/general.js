const { Category } = require('./category');

class General {
    constructor(client) {
        this.client = client;
    }

    async setIncome(value) {
        const incomeInput = await this.client.$('.income-details input');
        await incomeInput.setValue(value);
        return this;
    }

    async addCategory(name) {
        const categoryInput = await this.client.$('.add-category-area input');
        await categoryInput.setValue(name);
        const addCategoryButton = await this.client.$('.add-category-area button');
        addCategoryButton.click();
        return new Category(this.client, name);
    }

    async update() {
        const addCategoryButton = await this.client.$('[data-testid="category-update"]');
        addCategoryButton.click();
        return this;
    }
}

module.exports = {
    General
};
