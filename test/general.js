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
});