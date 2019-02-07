const os = require('os');
const fs = require('fs');

const homeDir = os.homedir();
const budgappDir = `${homeDir}/Documents/Budgapp`;
const defaultBudgetFile = `${budgappDir}/budget.json`;

class FileManager {
    constructor() {
        // TODO allow this to be set. and use something like an env var to control it.
        this.currentBugetFile = defaultBudgetFile;
    }

    ensureBudgetFileExists() {
        if (fs.existsSync(this.currentBugetFile)) {
            return;
        }

        fs.mkdirSync(budgappDir, { recursive: true });
        let stream = fs.createWriteStream(this.currentBugetFile);
        stream.write("{items:[]}");
        stream.close();
    }
}

module.exports = {
    FileManager
}