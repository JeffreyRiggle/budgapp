const { Navigation } = require('./models/navigation');
const { createApp, cleanup } = require('./shared');
const { PasswordView } = require('./models/password');

describe('Storage', () => {
    let app;

    beforeEach(async () => {
        app = await createApp(true);
        await app.client.waitUntilWindowLoaded();
    });

    afterEach(async function() {
        await cleanup(app);
    });

    it('should handle simple saves', async () => {
        let nav = new Navigation(app.client);
        let generalPage = await nav.goToGeneral();
        await generalPage.setIncome('2000');
        const category = await generalPage.addCategory('Food');
        await category.setAmount('500');
        await generalPage.update();
        await generalPage.setStorageOptions();

        await app.stop();
        app = await createApp();
        await app.client.waitUntilWindowLoaded();

        nav = new Navigation(app.client);
        generalPage = await nav.goToGeneral();
        expect(await generalPage.getIncome()).toBe('2000.00');
    });

    it('should handle password protect', async () => {
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
        await app.client.waitUntilWindowLoaded();

        const passwordView = new PasswordView(app.client);
        nav = await passwordView.login('pass');
        generalPage = await nav.goToGeneral();
        expect(await generalPage.getIncome()).toBe('2000.00');
    });
});