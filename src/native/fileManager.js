const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const { registerEvent } = require('@jeffriggle/ipc-bridge-server');
const {
    fileLocation,
    storageType,
    setFileType,
    setPassword
} = require('../common/eventNames');
const { LocalFileManager } = require('./localFileManager');
const { RemoteFileManager } = require('./remoteFileManager');

const homeDir = os.homedir();
const budgappDir = `${homeDir}/Documents/Budgapp`;
const appSettingsFile = `${budgappDir}/settings.json`;
const defaultBudgetFile = `${budgappDir}/budget.json`;

class FileManager {
    constructor() {
        this.settings = {};
        this.setupFileManagers();
        this.ensureAppSettings();
        this.registerEvents();
    }

    setupFileManagers() {
        this.localFileManager = new LocalFileManager();
        this.fileManagers = new Map();
        this.fileManagers.set('local', this.localFileManager);
        this.fileManagers.set('remote', new RemoteFileManager());
    }

    registerEvents() {
        registerEvent(fileLocation, () => {
            console.log(`Get file location resulted in ${this.settings.budgetFile}`);
            return this.settings.budgetFile;
        });

        registerEvent(storageType, () => {
            return this.settings.storageType;
        });

        registerEvent(setPassword, this.setPassword.bind(this));
        registerEvent(setFileType, this.setFileType.bind(this));
    }

    updateFilePath(path) {
        console.log(`file updated to ${path}`);
        this.settings.budgetFile = path;
        this.updateSettingsFile();
        return this.settings.budgetFile;
    }

    updateSettingsFile() {
        let saveData = JSON.stringify(this.settings);
        console.log(`Saving data ${saveData}`);
        this.localFileManager.save(appSettingsFile, saveData);
    }

    setPassword(sender, password) {
        this.password = password;
    }

    setFileType(sender, typeData) {
        return new Promise((resolve, reject) => {
            console.log(`updating file manager to ${typeData}`);
            if (!this.fileManagers.has(typeData)) {
                reject(`${typeData} is an invalid manager type`);
                return;
            }

            this.settings.storageType = typeData;
            resolve({success: true});
        });
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

        this.localFileManager.save(appSettingsFile, JSON.stringify(this.settings));
    }

    ensureBudgetFileExists() {
        this.ensureBudgappDir();
        
        let defaultContent = {
            items: []
        };

        let manager = this.fileManagers.get(this.settings.storageType);
        manager.ensureFile(this.settings.budgetFile, JSON.stringify(defaultContent));
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
        const manager = this.fileManagers.get(this.settings.storageType);
        if (manager) {
            manager.save(this.settings.budgetFile, saveData);
        } else {
            console.log(`Unable to find manager for ${this.settings.storageType}`);
        }
    }

    encryptContent(data) {
        let cipher = crypto.createCipher('aes-256-ctr', this.password);
        const bData = new Buffer(data, 'utf8');
        
        return Buffer.concat([cipher.update(bData), cipher.final()]);
    }

    loadFile(password) {
        return new Promise((resolve, reject) => {
            console.log(`Attempting to load file using ${this.settings.storageType}`);

            const manager = this.fileManagers.get(this.settings.storageType);

            if (!manager) {
                reject(`Unable to find file manager ${this.settings.storageType}`);
                return;
            }

            manager.load(this.settings.budgetFile).then(content => {
                if (password) {
                    return JSON.parse(this.decryptContent(content, password));
                } else {
                    return JSON.parse(content);
                }
            }).then(parsedContent => {
                resolve({
                    content: parsedContent,
                    needsPassword: false
                });
            }).catch(error => {
                console.log(`Got error ${error}`);
                resolve({
                    content: '',
                    needsPassword: true
                });
            });
        });
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