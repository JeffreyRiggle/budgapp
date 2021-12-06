const { Navigation } = require('./models/navigation');
const { createApp, cleanup } = require('./shared');

describe('General', () => {
    let app;

    beforeEach(async () => {
        app = await createApp();
        await app.client.waitUntilWindowLoaded();
    });

    afterEach(async () => {
        console.log('Cleaning up app');
        await cleanup(app, this.currentTest);
    });

    it('should load the application', async () => {
        expect(await app.client.getWindowCount()).toBe(1);
    });

    it('should be able to set income', async () => {
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const incomePage = await nav.goToIncome();
        expect(await incomePage.getTargetIncome()).toBe('Target $2000.00')
    });

    it('should be able to set Categories', async () => {
        const nav = new Navigation(app.client);
        const generalPage = await nav.goToGeneral();
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        expect(await category.getAmount()).toBe('50000');
    });
});