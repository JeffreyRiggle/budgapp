const expect = require('chai').expect;
const Application = require('spectron').Application;
const electron = require('electron');
const path = require('path');

describe('General', () => {
    let app;

    beforeEach(async () => {
        app = await new Application({
            path: electron,
            args: [path.join(__dirname, '..')]
        }).start();
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await app.stop();
        }
    });

    it('should load the application', async () => {
        await app.client.waitUntilWindowLoaded();
        expect(await app.client.getWindowCount()).to.equal(1);
    });

    it('should have the correct title', async () => {
        await app.client.waitUntilWindowLoaded();
        expect(await app.client.getTitle()).to.equal('Budgapp');
    });

    it('should be able to set income', async () => {
        await app.client.waitUntilWindowLoaded();
        const generalLink = await app.client.$('a[href="/"]');
        await generalLink.click();
        const incomeInput = await app.client.$('.income-details input');
        await incomeInput.setValue('2000');
        const incomeLink = await app.client.$('a[href="/income"');
        await incomeLink.click();
        const incomeValue = await app.client.$('span[data-testid="income-target"]');
        expect(await incomeValue.getText()).to.equal('Target $2000.00')
    });
});