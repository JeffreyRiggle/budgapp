const { FileManager } = require('./fileManager');
const { IncomeHandler } = require('./IncomeHandler');
const { CategoryHandler } = require('./categoryHandler');
const { budgetHandler } = require('./budgetHandler');
const { registerEvent } = require('@jeffriggle/ipc-bridge-server');
const {
    saveBudgetFile,
    passwordNeeded,
    passwordProvided,
    setFileLocation
} = require('@budgapp/common');

const _ = require('lodash');

const fm = new FileManager();
let income = new IncomeHandler();
let category = new CategoryHandler();
let needsPassword = false;

function registerHandlers() {
    registerEvent(saveBudgetFile, () => {
        save();
    });

    registerEvent(passwordNeeded, () => {
        return needsPassword;
    });

    registerEvent(passwordProvided, (sender, password) => {
        return attemptLoadFile(password).then(() => {
            return { success: true }
        }).catch(() => {
            return { success: false };
        });
    });

    registerEvent(setFileLocation, (sender, location) => {
        console.log(`Attempting to load file from ${location}`);
        return new Promise((resolve, reject) => {
            const lastFilePath = fm.settings.budgetFile;
            fm.updateFilePath(location);
            
            attemptLoadFile().then(() => {
                console.log(`Sucessfully loaded file from ${location}`);
                resolve({ success: true });
            }).catch((err) => {
                console.log(`Failed to load file from ${location}. Needs password ${needsPassword} error ${err}`);
                if (!needsPassword) {
                    fm.updateFilePath(lastFilePath);
                }

                reject({ success: false, needsPassword: needsPassword });
            });
        });
    });

    budgetHandler.start();
    income.start();
    category.start();
}

function attemptLoadFile(password) {
    return new Promise((resolve, reject) => {
        fm.loadFile(password).then(fileData => {
            if (fileData.needsPassword) {
                needsPassword = true;
                reject();
                return;
            }
        
            needsPassword = false;
            let parsedContent = fileData.content;
            if (parsedContent.items) {
                budgetHandler.fromSimpleObject(parsedContent.items);
            }
        
            if (parsedContent.categories) {
                category.fromSimpleObject(parsedContent.categories);
            } else {
                category.manager.updateCategoriesFromItems(parsedContent.items);
            }
        
            if (parsedContent.income) {
                income.fromSimpleObject(parsedContent.income);
            }

            resolve();
        });
    });
}

const setup = () => {
    fm.ensureBudgetFileExists();
    attemptLoadFile();
    registerHandlers();
};

const save = () => {
    fm.saveFile(content = {
        items: budgetHandler.toSimpleObject(),
        categories: category.toSimpleObject(),
        income: income.toSimpleObject()
    });
};

module.exports = {
    setup,
    save,
    category,
    income
};