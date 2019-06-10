const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const { registerEvent } = require('@jeffriggle/ipc-bridge-server');
const {
    fileLocation,
    setFileLocation,
    setPassword
} = require('../common/eventNames');

const homeDir = os.homedir();
const budgappDir = `${homeDir}/Documents/Budgapp`;
const appSettingsFile = `${budgappDir}/settings.json`;
const defaultBudgetFile = `${budgappDir}/budget.json`;

class FileManager {
    constructor() {
        this.settings = {};
        this.ensureAppSettings();
        this.registerEvents();
    }

    registerEvents() {
        registerEvent(fileLocation, () => {
            console.log(`Get file location resulted in ${this.settings.budgetFile}`);
            return this.settings.budgetFile;
        });

        registerEvent(setFileLocation, this.updateFilePath.bind(this));
        registerEvent(setPassword, this.setPassword.bind(this));
    }

    updateFilePath(sender, path) {
        console.log(`file updated to ${path}`);
        this.settings.budgetFile = path;
        this.updateSettingsFile();
    }

    updateSettingsFile() {
        let saveData = JSON.stringify(this.settings);
        console.log(`Saving data ${saveData}`);
        fs.writeFileSync(appSettingsFile, saveData);
    }

    setPassword(sender, password) {
        this.password = password;
    }

    ensureAppSettings() {
        if (fs.existsSync(appSettingsFile)) {
            this.settings = JSON.parse(fs.readFileSync(appSettingsFile));
            return;
        }

        this.ensureBudgappDir();

        this.settings = {
            storageType: 'local',
            budgetFile: defaultBudgetFile
        };
        fs.writeFileSync(appSettingsFile, JSON.stringify(this.settings), {mode: 0o755});
    }

    ensureBudgetFileExists() {
        if (fs.existsSync(this.settings.budgetFile)) {
            return;
        }

        this.ensureBudgappDir();

        let defaultContent = {
            items: []
        };
        fs.writeFileSync(this.settings.budgetFile, JSON.stringify(defaultContent), {mode: 0o755});
    }

    ensureBudgappDir() {
        if (!fs.existsSync(budgappDir)) {
            fs.mkdirSync(budgappDir, { recursive: true, mode: 0o755 });
        }
    }

    saveFile(content) {
        let saveData = JSON.stringify(content);

        if (this.password) {
            saveData = this.encryptContent(saveData);
        }

        console.log(`Saving data ${saveData}`);
        fs.writeFileSync(this.settings.budgetFile, saveData);
    }

    encryptContent(data) {
        let cipher = crypto.createCipher('aes-256-ctr', this.password);
        const bData = new Buffer(data, 'utf8');
        
        return Buffer.concat([cipher.update(bData), cipher.final()]);
    }

    loadFile(password) {
        let parsedContent = '';
        let needsPassword = false;
        try {
            let content = fs.readFileSync(this.settings.budgetFile);
            
            if (password) {
                parsedContent = JSON.parse(this.decryptContent(content, password));
            } else {
                parsedContent = JSON.parse(content);
            }
        } catch(error) { 
            console.log(`Got error ${error}`)
            needsPassword = true;
        }

        console.log(`parsed content ${parsedContent}`);
        return {
            content: parsedContent,
            needsPassword: needsPassword
        };
    }

    decryptContent(content, password) {
        const decipher = crypto.createDecipher('aes-256-ctr', password);
        const bContent = new Buffer(content, 'utf8');
        let retVal = Buffer.concat([decipher.update(bContent), decipher.final()]);

        return retVal.toString('utf8');
    }
}

module.exports = {
    FileManager
}