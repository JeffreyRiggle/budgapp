const { General } = require('./general');
const { Income } = require('./income');
const { Budget } = require('./budget');

class Navigation {
    constructor(client) {
        this.client = client;
    }

    async goToGeneral() {
        const generalLink = await this.client.$('a[href="/"]');
        await generalLink.click();
        return new General(this.client);
    }

    async goToIncome() {
        const incomeLink = await this.client.$('a[href="/income"');
        await incomeLink.click();
        return new Income(this.client);
    }

    async goToBudget() {
        const budgetLink = await this.client.$('a[href="/budget"');
        await budgetLink.click();
        return new Budget(this.client);
    }
}

module.exports = {
    Navigation
};
