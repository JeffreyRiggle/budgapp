const expect = require('chai').expect;
const { Navigation } = require('./models/navigation');
const { createApp, cleanup } = require('./shared');

describe('General', () => {
    let app;

    beforeEach(async () => {
        app = await createApp();
    });

    afterEach(async function() {
        await cleanup(app, this.currentTest);
    });

    it('should load the application', async () => {
        await app.client.waitUntilWindowLoaded();
        expect(await app.client.getWindowCount()).to.equal(1);
    });

    it('should be able to set income', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        expect(await incomePage.getTargetIncome()).to.equal('Target $2000.00')
    });

    it('should be able to set Categories', async () => {
        await app.client.waitUntilWindowLoaded();
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        expect(await category.getAmount()).to.equal('50000');
    });
});