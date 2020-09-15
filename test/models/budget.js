const { AddBudget } = require('./addBudget');

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
}

module.exports = {
    Budget
};
