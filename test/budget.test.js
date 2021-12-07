const { Navigation } = require('./models/navigation');
const { createApp, cleanup } = require('./shared');

describe('Budget', () => {
    let app;

    beforeEach(async () => {
        app = await createApp();
    });

    afterEach(async function() {
        await cleanup(app, this.currentTest);
    });

    it('should be able to add budget', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        const budgetPage = await nav.goToBudget();
        const addBudget = await budgetPage.addBudget();
        await addBudget.addItem('150', 'Food', 'Grocery');
        await addBudget.addItems();
        expect(await budgetPage.getTotalBudget()).toBe('Total Spent $150.00');
    });

    it('should have budget history', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        const budgetPage = await nav.goToBudget();
        let addBudget = await budgetPage.addBudget();
        await addBudget.addItem('250', 'Food', 'Grocery');
        await addBudget.addItems();

        addBudget = await budgetPage.addBudget();
        await addBudget.addItemPreviousMonth('250', 'Food', 'Grocery');
        await addBudget.addItems();
        expect(await budgetPage.getTotalBudget()).toBe('Total Spent $250.00');
    });

    it('should handle multiple categories', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        let category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        category = await generalPage.addCategory('Rent');
        await category.setAmount('1000');
        await generalPage.update();
        const budgetPage = await nav.goToBudget();
        let addBudget = await budgetPage.addBudget();
        await addBudget.addItem('250', 'Food', 'Grocery');
        await addBudget.addItems();

        addBudget = await budgetPage.addBudget();
        await addBudget.addItem('1000', 'Rent', 'Paid rent');
        await addBudget.addItems();
        expect(await budgetPage.getTotalBudget()).toBe('Total Spent $1250.00');

        const categoryView = await budgetPage.goToCategory('Rent');
        expect(await categoryView.getTarget()).toBe('Target $1000.00');
        expect(await categoryView.getTotal()).toBe('Total Spent $1000.00');
    });
});