export class AddBudget<T> {
    constructor(private parent: T) {}

    async addItem(amount, category, detail) {
        const addButton = await $('[data-testid="add-budget-item"]');
        await addButton.click();
        const amountInput = await $('[data-testid="amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await $('[data-testid="details-input"]');
        await detailInput.setValue(detail);
        const categoryInput = await $('select');
        await categoryInput.selectByVisibleText(category);
        return this;
    }

    async addItemPreviousMonth(amount, category, detail) {
        const addButton = await $('[data-testid="add-budget-item"]');
        await addButton.click();
        const amountInput = await $('[data-testid="amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await $('[data-testid="details-input"]');
        await detailInput.setValue(detail);
        const categoryInput = await $('select');
        await categoryInput.selectByVisibleText(category);

        const dateInput = await $('.react-datepicker-wrapper input');
        await dateInput.click();

        const lastMonth = await $('.react-datepicker__navigation--previous');
        await lastMonth.click();

        const day = await $('.react-datepicker__day--keyboard-selected');
        await day.click();
        await browser.keys('Escape');
        return this;
    }

    async addItems() {
        const addItemsButton = await $('.action-area button');
        addItemsButton.click();
        return this.parent;
    }
}
