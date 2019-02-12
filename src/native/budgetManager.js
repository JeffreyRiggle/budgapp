const { FileManager } = require('./fileManager');
const { registerEvent, broadcast } = require('./ipcBridge');
const fs = require('fs');
const _ = require('lodash');

const fm = new FileManager();
let items = [];

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

    registerEvent('getBudgetItems', (event) => {
        event.send(items);
    });

    registerEvent('filteredBudgetItems', (event, filter) => {
        event.send(_.filter(items, filter));
    });

    registerEvent('saveBudgetFile', () => {
        save();
    });
}

function attemptLoadFile() {
    try {
        let content = fs.readFileSync(fm.currentBudgetFile);
        let parsedContent = JSON.parse(content);
        if (parsedContent.items) {
            items = parsedContent.items;
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
        items: items
    };

    console.log(`Attemping to write ${items.length} items to ${fm.currentBudgetFile}`);
    fs.writeFileSync(fm.currentBudgetFile, JSON.stringify(content));
};

module.exports = {
    setup,
    save
};