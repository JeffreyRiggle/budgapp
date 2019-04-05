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

        this.registerEvents();
    }

    registerEvents() {
        registerEvent(fileLocation, () => {
            console.log(`Get file location resulted in ${this.currentBudgetFile}`);
            return this.currentBudgetFile;
        });

        registerEvent(setFileLocation, this.updateFilePath.bind(this));
        registerEvent(setPassword, this.setPassword.bind(this));
    }

    updateFilePath(sender, path) {
        console.log(`file updated to ${path}`);
        process.env.BUDGAPPFILE = path;
        this.currentBudgetFile = path;
    }

    setPassword(sender, password) {
        this.password = password;
    }

    ensureBudgetFileExists() {
        if (fs.existsSync(this.currentBudgetFile)) {
            return;
        }

        if (!fs.existsSync(budgappDir)) {
            fs.mkdirSync(budgappDir, { recursive: true, mode: 0o755 });
        }

        let defaultContent = {
            items: []
        };
        fs.writeFileSync(this.currentBudgetFile, JSON.stringify(defaultContent), {mode: 0o755});
    }

    saveFile(content) {
        let saveData = JSON.stringify(content);

        if (this.password) {
            saveData = this.encryptContent(saveData);
        }

        console.log(`Saving data ${saveData}`);
        fs.writeFileSync(this.currentBudgetFile, saveData);
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
            let content = fs.readFileSync(this.currentBudgetFile);
            
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