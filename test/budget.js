const expect = require('chai').expect;
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
        expect(await budgetPage.getTotalBudget()).to.equal('Total Spent $150.00');
    });
});