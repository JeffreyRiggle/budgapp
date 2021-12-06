const { Navigation } = require('./models/navigation');
const { createApp, cleanup } = require('./shared');

describe('History', () => {
    let app;

    beforeEach(async () => {
        app = await createApp();
    });

    afterEach(async function() {
        await cleanup(app, this.currentTest);
    });

    async function setup(nav) {
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();

        const incomePage = await nav.goToIncome();
        let addIncome = await incomePage.addIncome();
        await addIncome.addItem('2000', 'Got paid');
        await addIncome.addItems();

        addIncome = await incomePage.addIncome();
        await addIncome.addItemPreviousMonth('2000', 'Got paid');
        await addIncome.addItems();

        const budgetPage = await nav.goToBudget();
        let addBudget = await budgetPage.addBudget();
        await addBudget.addItem('300', 'Food', 'Grocery');
        await addBudget.addItems();

        addBudget = await budgetPage.addBudget();
        await addBudget.addItemPreviousMonth('250', 'Food', 'Grocery');
        await addBudget.addItems();
    }

    it('should be able to see cost margins', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        await setup(nav);

        const historyPage = await nav.goToHistory();
        expect(await historyPage.getLastMonthsMargin()).toBe('1750.00');
        expect(await historyPage.getMargin()).toBe('1700.00');
    });

    it('should be able to see last months income', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        await setup(nav);

        const historyPage = await nav.goToHistory();
        const incomePage = await historyPage.goToLastMonthsIncome();
        expect(await incomePage.getTotalIncome()).toBe('Total earned $2000.00');
    });

    it('should be able to see last months budget', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        await setup(nav);

        const historyPage = await nav.goToHistory();
        const budgetPage = await historyPage.goToLastMonthsBudget();
        expect(await budgetPage.getTotalBudget()).toBe('Total Spent $250.00');
    });
});