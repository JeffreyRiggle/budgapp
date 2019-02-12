const os = require('os');
const fs = require('fs');
const { registerEvent } = require('./ipcBridge');

const homeDir = os.homedir();
const budgappDir = `${homeDir}/Documents/Budgapp`;
const defaultBudgetFile = `${budgappDir}/budget.json`;

class FileManager {
    constructor() {
        let fileOverride = process.env.BUDGAPPFILE;

        if (fileOverride) {
            console.log(`Found buget file override ${fileOverride}`);
            this.currentBugetFile = fileOverride;
        }
        else {
            this.currentBudgetFile = defaultBudgetFile;
        }

        registerEvent('fileLocation', () => {
            console.log(`Get file location resulted in ${this.currentBudgetFile}`);
            return this.currentBudgetFile;
        });

        registerEvent('setFileLocation', this.updateFilePath.bind(this));
    }

    updateFilePath(sender, path) {
        console.log(`file updated to ${path}`);
        process.env.BUDGAPPFILE = path;
        this.currentBudgetFile = path;
    }

    ensureBudgetFileExists() {
        if (fs.existsSync(this.currentBudgetFile)) {
            return;
        }

        fs.mkdirSync(budgappDir, { recursive: true });
        let stream = fs.createWriteStream(this.currentBudgetFile);
        stream.write("{items:[]}");
        stream.close();
    }
}

module.exports = {
    FileManager
}