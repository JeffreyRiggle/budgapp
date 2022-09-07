
const fs = require('fs');
const os = require('os');

const screenCaptureDir = './test/screencaps';
const homeDir = os.homedir();
const budgappDir = `${homeDir}/Documents/Budgapp`;
const appSettingsFile = `${budgappDir}/settings.json`;
const defaultBudgetFile = `${budgappDir}/budget.json`;

function ensureDirectory() {
    if (!fs.existsSync(screenCaptureDir)) {
        fs.mkdirSync(screenCaptureDir);
    }
}

export async function cleanup(currentTest) {
    if (currentTest && currentTest.err) {
        ensureDirectory();
        await browser.saveScreenshot(`${'./test/screencaps'}/${currentTest.title}.png`);
    }

    if (fs.existsSync(defaultBudgetFile)) {
        fs.unlinkSync(defaultBudgetFile);
    }

    if (fs.existsSync(appSettingsFile)) {
        fs.unlinkSync(appSettingsFile);
    }
}
