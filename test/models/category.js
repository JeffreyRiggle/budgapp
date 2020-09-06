class Category {
    constructor(client) {
        this.client = client;
    }

    async setAmount(amount) {
        const amountInput = await this.client.$('.category input[type="text"]');
        await amountInput.setValue(amount);
        return this;
    }

    async toggleRollover() {
        const rolloverInput = await this.client.$('.category input[type="checkbox"]');
        await rolloverInput.click();
        return this;
    }

    async getAmount() {
        const amountInput = await this.client.$('.category input[type="text"]');
        return await amountInput.getValue();
    }
}

module.exports = {
    Category
};
