const { FileManager } = require('./fileManager');
const { registerEvent, broadcast } = require('./ipcBridge');
const fs = require('fs');
const _ = require('lodash');

const fm = new FileManager();
let items = [];
let categories = new Map();

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

function attemptLoadFile() {
    try {
        let content = fs.readFileSync(fm.currentBudgetFile);
        let parsedContent = JSON.parse(content);

        if (parsedContent.items) {
            items = parsedContent.items;
        }

        if (parsedContent.categories) {
            loadCategories(parsedContent.categories);
        } else {
            getCategoriesFromItems();
        }
    } catch(err) {
        console.log(`Failed to parse file ${fm.currentBudgetFile}`);
    }
}

const setup = () => {
    fm.ensureBudgetFileExists();
    attemptLoadFile();
    registerHandlers();
};

const save = () => {
    const content = {
        items: items,
        categories: sanitizeCategories()
    };

    console.log(`Attemping to write ${items.length} items to ${fm.currentBudgetFile}`);
    fs.writeFileSync(fm.currentBudgetFile, JSON.stringify(content));
};

module.exports = {
    setup,
    save
};