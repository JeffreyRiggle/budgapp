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
}

module.exports = {
    History
};
