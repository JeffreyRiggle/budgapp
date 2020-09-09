const expect = require('chai').expect;
const { Navigation } = require('./models/navigation');
const { createApp } = require('./shared');
const moment = require('moment');

describe('Income', () => {
    let app;

    beforeEach(async () => {
        app = await createApp();
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await app.stop();
        }
    });

    it('should be able to add income', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        const addIncome = await incomePage.addIncome();
        await addIncome.addItem('500', 'Got paid');
        await addIncome.addItems();
        expect(await incomePage.getTotalIncome()).to.equal('Total earned $500.00');
    });

    it('should have income history', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        let addIncome = await incomePage.addIncome();
        await addIncome.addItem('2000', 'Got paid');
        await addIncome.addItems();

        addIncome = await incomePage.addIncome();
        await addIncome.addItemPreviousMonth('2000', 'Got paid');
        await addIncome.addItems();
        expect(await incomePage.getTotalIncome()).to.equal('Total earned $2000.00');
    });
});