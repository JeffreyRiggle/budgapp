
const Application = require('spectron').Application;
const electron = require('electron');
const path = require('path');
const fs = require('fs');

const screenCaptureDir = './test/screencaps';

const createApp = async () => {
    return await new Application({
        path: electron,
        args: [path.join(__dirname, '..')]
    }).start();
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

    if (app && app.isRunning()) {
        await app.stop();
    }
}

module.exports = {
    createApp,
    cleanup
};
