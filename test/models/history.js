const { Budget } = require("./budget");
const { Income } = require('./income');

class History {
    constructor(client) {
        this.client = client;
    }

    async getMargin() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const currentMonth = await historyItems[0].$$('td');
        return await currentMonth[3].getText();
    }

    async getLastMonthsMargin() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const currentMonth = await historyItems[1].$$('td');
        return await currentMonth[3].getText();
    }

    async goToLastMonthsIncome() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const currentMonth = await historyItems[1].$$('td');
        const link = await currentMonth[1].$('a');
        await link.click();
        return new Income(this.client);
    }

    async goToLastMonthsBudget() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const currentMonth = await historyItems[1].$$('td');
        const link = await currentMonth[2].$('a');
        await link.click();
        return new Budget(this.client);
    }
}

module.exports = {
    History
};
