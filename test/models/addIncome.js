class AddIncome {
    constructor(client, parent) {
        this.client = client;
        this.parent = parent;
    }

    async addItem(amount, detail) {
        const addButton = await this.client.$('[data-testid="add-income-item"]');
        await addButton.click();
        const amountInput = await this.client.$('[data-testid="income-amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await this.client.$('[data-testid="income-source-input"]');
        await detailInput.setValue(detail);
        return this;
    }

    async addItems() {
        const addItemsButton = await this.client.$('[data-testid="add-income-items"]');
        addItemsButton.click();
        return this.parent;
    }
}

module.exports = {
    AddIncome
};
