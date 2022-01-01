const moment = require('moment');
const { Budget } = require("./budget");
const { Income } = require('./income');

class History {
    constructor(client) {
        this.client = client;
    }

    async findTargetMonth(month, historyItems) {
        for (let item of historyItems) {
            const domItem = await item.$$('td');
            const text = await domItem[0].getText();
            if (text === month) {
                return item;
            }
        }
    }

    async findLastMonth(historyItems) {
        return this.findTargetMonth(moment(new Date()).subtract(1, 'M').format('MMMM YY'), historyItems);
    }

    async findCurrentMonth(historyItems) {
        return this.findTargetMonth(moment(new Date()).format('MMMM YY'), historyItems);
    }

    async getMargin() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const currentMonthRow = await this.findCurrentMonth(historyItems);
        const currentMonth = await currentMonthRow.$$('td');
        return await currentMonth[3].getText();
    }

    async getLastMonthsMargin() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const lastMonth = await this.findLastMonth(historyItems);
        const lastMonthItems = await lastMonth.$$('td');
        return await lastMonthItems[3].getText();
    }

    async goToLastMonthsIncome() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const lastMonth = await this.findLastMonth(historyItems);
        const lastMonthItems = await lastMonth.$$('td');
        const link = await lastMonthItems[1].$('a');
        await link.click();
        return new Income(this.client);
    }

    async goToLastMonthsBudget() {
        const historyTable = await this.client.$('table tbody');
        const historyItems = await historyTable.$$('tr');
        const lastMonth = await this.findLastMonth(historyItems);
        const lastMonthItems = await lastMonth.$$('td');
        const link = await lastMonthItems[2].$('a');
        await link.click();
        return new Budget(this.client);
    }
}

module.exports = {
    History
};
