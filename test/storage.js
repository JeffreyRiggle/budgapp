const expect = require('chai').expect;
const { Navigation } = require('./models/navigation');
const { createApp, cleanup } = require('./shared');
const { PasswordView } = require('./models/password');

describe('Storage', () => {
    let app;

    beforeEach(async () => {
        app = await createApp(true);
    });

    afterEach(async function() {
        await cleanup(app, this.currentTest);
    });

    it('should handle simple saves', async () => {
        await app.client.waitUntilWindowLoaded();
        let nav = new Navigation(app.client);
        let generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();

        await app.stop();
        app = await createApp();

        nav = new Navigation(app.client);
        generalPage = await nav.goToGeneral();
        expect(await generalPage.getIncome()).to.equal('2000.00');
    });

    it('should handle password protect', async () => {
        await app.client.waitUntilWindowLoaded();
        let nav = new Navigation(app.client);
        let generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();

        const storageView = await generalPage.setStorageOptions();
        await storageView.setPassword('pass');
        await storageView.apply();

        await app.stop();
        app = await createApp();

        const passwordView = new PasswordView(app.client);
        nav = await passwordView.login('pass');
        generalPage = await nav.goToGeneral();
        expect(await generalPage.getIncome()).to.equal('2000.00');
    });
});