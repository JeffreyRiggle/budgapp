
const Application = require('spectron').Application;
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const screenCaptureDir = './test/screencaps';
const homeDir = os.homedir();
const budgappDir = `${homeDir}/Documents/Budgapp`;
const appSettingsFile = `${budgappDir}/settings.json`;
const defaultBudgetFile = `${budgappDir}/budget.json`;

jest.setTimeout(30000);

const createApp = async (autoSave) => {
    const app = new Application({
        path: electron,
        args: [path.join(__dirname, '..'), autoSave ? '--auto-save' : '--no-save'],
        port: Math.floor(Math.random() * (9999 - 9000) + 9000),
    });
    await app.start();
    return app;
};

function ensureDirectory() {
    if (!fs.existsSync(screenCaptureDir)) {
        fs.mkdirSync(screenCaptureDir);
    }
}

const cleanup = async (app, currentTest) => {
    if (app && currentTest && currentTest.err) {
        ensureDirectory();
        app.client.saveScreenshot(`${'./test/screencaps'}/${currentTest.title}.png`);
    }

    if (fs.existsSync(defaultBudgetFile)) {
        fs.unlinkSync(defaultBudgetFile);
    }

    if (fs.existsSync(appSettingsFile)) {
        fs.unlinkSync(appSettingsFile);
    }

    if (app && app.isRunning()) {
        await app.stop();
    }
}

module.exports = {
    createApp,
    cleanup
};
