const { AddIncome } = require('./addIncome');

class Income {
    constructor(client) {
        this.client = client;
    }

    async getTargetIncome() {
        const incomeValue = await this.client.$('span[data-testid="income-target"]');
        return await incomeValue.getText();
    }

    async getTotalIncome() {
        const incomeValue = await this.client.$('[data-testid="income-total"]');
        return await incomeValue.getText();
    }

    async addIncome() {
        const addIncomeButton = await this.client.$('a[href="/addIncome"');
        await addIncomeButton.click();
        return new AddIncome(this.client, this);
    }
}

module.exports = {
    Income
};
