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
            this.currentBugetFile = defaultBudgetFile;
        }

        registerEvent('fileLocation', () => {
            console.log(`Get file location resulted in ${this.currentBugetFile}`);
            return this.currentBugetFile;
        });

        registerEvent('setFileLocation', this.updateFilePath.bind(this));
    }

    updateFilePath(sender, path) {
        console.log(`file updated to ${path}`);
        process.env.BUDGAPPFILE = path;
        this.currentBugetFile = path;
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