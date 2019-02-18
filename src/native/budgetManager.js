const { FileManager } = require('./fileManager');
const { IncomeManager } = require('./IncomeManager');
const { registerEvent, broadcast } = require('./ipcBridge');
const fs = require('fs');
const _ = require('lodash');

const fm = new FileManager();
let items = [];
let categories = new Map();
let income = new IncomeManager();
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
        return _.filter(items, (item) => {
            let retVal = false;
            filters.forEach(filter => {
                let val = item[filter.filterProperty];
                if (val === filter.expectedValue) {
                    retVal = true;
                }
            })

            return retVal;
        });
    });

    registerEvent('getCategories', () => {
        return sanitizeCategories();
    });

    registerEvent('addCategory', (event, category) => {
        categories.set(category.name, category.allocated);
    });

    registerEvent('updateCategories', (event, newCategories) => {
        newCategories.forEach(category => {
            if (categories.has(category.name)) {
                categories.set(category.name, category.allocated);
            }
        });
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
}

function sanitizeCategories() {
    let retVal = [];

        categories.forEach((allocated, name) => {
            retVal.push({
                name: name,
                allocated: allocated
            });
        });

        return retVal;
}

function getCategoriesFromItems() {
    items.forEach(item => {
        if (!categories.has(item.category)) {
            categories.set(item.category, 0);
        }
    });
}

function loadCategories(data) {
    data.forEach(category => {
        categories.set(category.name, category.allocated);
    });
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
        loadCategories(parsedContent.categories);
    } else {
        getCategoriesFromItems();
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
        categories: sanitizeCategories(),
        income: income.toSimpleObject()
    });
};

module.exports = {
    setup,
    save
};