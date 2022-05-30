export class AddIncome<T> {
    constructor(private parent: T) {}

    async addItem(amount: string, detail: string): Promise<AddIncome<T>> {
        const addButton = await $('[data-testid="add-income-item"]');
        await addButton.click();
        const amountInput = await $('[data-testid="income-amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await $('[data-testid="income-source-input"]');
        await detailInput.setValue(detail);
        return this;
    }

    async addItemPreviousMonth(amount: string, detail: string): Promise<AddIncome<T>> {
        const addButton = await $('[data-testid="add-income-item"]');
        await addButton.click();
        const amountInput = await $('[data-testid="income-amount-input"]');
        await amountInput.setValue(amount);
        const detailInput = await $('[data-testid="income-source-input"]');
        await detailInput.setValue(detail);

        const dateInput = await $('.react-datepicker-wrapper input');
        await dateInput.click();

        const lastMonth = await $('.react-datepicker__navigation--previous');
        await lastMonth.click();

        const day = await $('.react-datepicker__day--keyboard-selected');
        await day.click();
        await browser.keys('Escape');
        return this;
    }

    async addItems(): Promise<T> {
        const addItemsButton = $('[data-testid="add-income-items"]');
        addItemsButton.click();
        return this.parent;
    }
}
