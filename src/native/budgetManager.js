const { FileManager } = require('./fileManager');
const { IncomeManager } = require('./IncomeManager');
const { CategoryManager } = require('./categoryManager');
const { registerEvent, broadcast } = require('./ipcBridge');
const _ = require('lodash');
const { filter } = require('./filterItems');

const fm = new FileManager();
let items = [];
let income = new IncomeManager();
let category = new CategoryManager();
let needsPassword = false;

function sendItemUpdate() {
    broadcast('budgetitemschanged', {
        items: items
    });
}

function registerHandlers() {
    registerEvent('addBudgetItems', (event, newItems) => {
        items = _.concat(items, newItems);
        sendItemUpdate();
    });

    registerEvent('removeBudgetItem', (event, item) => {
        items = _.remove(items, (val) => {
            return item.description === val.description && item.amount === val.amount && item.date === val.date;
        });
        sendItemUpdate();
    });

    registerEvent('getBudgetItems', () => {
        return items;
    });

    registerEvent('filteredBudgetItems', (event, filters) => {
        return filter(items, filters);
    });

    registerEvent('saveBudgetFile', () => {
        save();
    });

    registerEvent('passwordNeeded', () => {
        return needsPassword;
    });

    registerEvent('passwordProvided', (sender, password) => {
        attemptLoadFile(password);
        return {
            success: !needsPassword
        };
    });

    income.start();
    category.start();
}

function attemptLoadFile(password) {
    let fileData = fm.loadFile(password);

    if (fileData.needsPassword) {
        needsPassword = true;
        return;
    }

    needsPassword = false;
    let parsedContent = fileData.content;
    if (parsedContent.items) {
        items = parsedContent.items;
    }

    if (parsedContent.categories) {
        category.fromSimpleObject(parsedContent.categories);
    } else {
        category.updateCategoriesFromItems(parsedContent.items);
    }

    if (parsedContent.income) {
        income.fromSimpleObject(parsedContent.income);
    }
}

const setup = () => {
    fm.ensureBudgetFileExists();
    attemptLoadFile();
    registerHandlers();
};

const save = () => {
    fm.saveFile(content = {
        items: items,
        categories: category.toSimpleObject(),
        income: income.toSimpleObject()
    });
};

module.exports = {
    setup,
    save
};