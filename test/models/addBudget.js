class AddBudget {
    constructor(client, parent) {
        this.client = client;
        this.parent = parent;
    }

    async addItem(amount, category, detail) {
        const addButton = await this.client.$('[data-testid="add-budget-item"]');
        await addButton.click();
        const amountInput = await this.client.$('[data-testid="amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await this.client.$('[data-testid="details-input"]');
        await detailInput.setValue(detail);
        const categoryInput = await this.client.$('select');
        await categoryInput.selectByVisibleText(category);
        return this;
    }

    async addItemPreviousMonth(amount, category, detail) {
        const addButton = await this.client.$('[data-testid="add-budget-item"]');
        await addButton.click();
        const amountInput = await this.client.$('[data-testid="amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await this.client.$('[data-testid="details-input"]');
        await detailInput.setValue(detail);
        const categoryInput = await this.client.$('select');
        await categoryInput.selectByVisibleText(category);

        const dateInput = await this.client.$('.react-datepicker-wrapper input');
        await dateInput.click();

        const lastMonth = await this.client.$('.react-datepicker__navigation--previous');
        await lastMonth.click();

        const day = await this.client.$('.react-datepicker__day--keyboard-selected');
        await day.click();
        await this.client.keys('Escape');
        return this;
    }

    async addItems() {
        const addItemsButton = await this.client.$('.action-area button');
        addItemsButton.click();
        return this.parent;
    }
}

module.exports = {
    AddBudget
};
