class Category {
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }

    async findCategory() {
        const categoryContainer = await this.client.$('.existing-categories')
        const categories = await categoryContainer.$$('.category');

        for (let category of categories) {
            const content = await category.$('.name');
            const contextText = await content.getText();

            if (contextText === this.name) {
                return category;
            }
        }
    }

    async setAmount(amount) {
        const category = await this.findCategory();
        const amountInput = await category.$('input[type="text"]');
        await amountInput.setValue(amount);
        return this;
    }

    async toggleRollover() {
        const category = await this.findCategory();
        const rolloverInput = await category.$('input[type="checkbox"]');
        await rolloverInput.click();
        return this;
    }

    async getAmount() {
        const category = await this.findCategory();
        const amountInput = await category.$('input[type="text"]');
        return await amountInput.getValue();
    }
}

module.exports = {
    Category
};
