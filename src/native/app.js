const { FileManager } = require('./fileManager');
const { IncomeManager } = require('./IncomeManager');
const { CategoryManager } = require('./categoryManager');
const { budgetManager } = require('./budgetManager');
const { registerEvent } = require('@jeffriggle/ipc-bridge-server');
const {
    saveBudgetFile,
    passwordNeeded,
    passwordProvided
} = require('../common/eventNames');

const _ = require('lodash');

const fm = new FileManager();
let income = new IncomeManager();
let category = new CategoryManager();
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

    budgetManager.start();
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
                budgetManager.fromSimpleObject(parsedContent.items);
            }
        
            if (parsedContent.categories) {
                category.fromSimpleObject(parsedContent.categories);
            } else {
                category.updateCategoriesFromItems(parsedContent.items);
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
    attemptLoadFile().finally(() => {
        registerHandlers();
    });
};

const save = () => {
    fm.saveFile(content = {
        items: budgetManager.toSimpleObject(),
        categories: category.toSimpleObject(),
        income: income.toSimpleObject()
    });
};

module.exports = {
    setup,
    save
};