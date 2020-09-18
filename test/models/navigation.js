const { General } = require('./general');
const { Income } = require('./income');
const { Budget } = require('./budget');
const { History } = require('./history');

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

    async goToHistory() {
        const historyLink = await this.client.$('a[href="/history"');
        await historyLink.click();
        return new History(this.client);
    }
}

module.exports = {
    Navigation
};
