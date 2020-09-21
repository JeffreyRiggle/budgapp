const { AddBudget } = require('./addBudget');
const { CategoryView } = require('./categoryView');

class Budget {
    constructor(client) {
        this.client = client;
    }

    async getTargetBudget() {
        const budgetValue = await this.client.$('span[data-testid="budget-income"]');
        return await budgetValue.getText();
    }

    async getTotalBudget() {
        const budgetValue = await this.client.$('[data-testid="budget-spent"]');
        return await budgetValue.getText();
    }

    async addBudget() {
        const addBudgetButton = await this.client.$('a[href="/addBudget"');
        await addBudgetButton.click();
        return new AddBudget(this.client, this);
    }

    async goToCategory(name) {
        const categoryLink = await this.client.$(`a[href="/category/${name}"]`);
        await categoryLink.click();
        return new CategoryView(this.client);
    }
}

module.exports = {
    Budget
};
