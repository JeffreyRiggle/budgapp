class Income {
    constructor(client) {
        this.client = client;
    }

    async getTargetIncome() {
        const incomeValue = await this.client.$('span[data-testid="income-target"]');
        return await incomeValue.getText();
    }
}

module.exports = {
    Income
};
