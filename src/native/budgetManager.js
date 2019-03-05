const { registerEvent, broadcast } = require('./ipcBridge');
const _ = require('lodash');
const { filter } = require('./filterItems');
const { EventEmitter } = require('events');

const {
    addBudgetItems,
    removeBudgetItem,
    budgetItemsChanged,
    getBudgetItems,
    filteredBudgetItems
} = require('../common/eventNames');

class BudgetManager extends EventEmitter {
    constructor() {
        super();
        this.items = [];
    }

    start() {
        registerEvent(addBudgetItems, (event, newItems) => {
            this.items = _.concat(this.items, newItems);
            this.sendItemUpdate();
        });
    
        registerEvent(removeBudgetItem, (event, item) => {
            this.items = _.remove(this.items, (val) => {
                return item.description === val.description && item.amount === val.amount && item.date === val.date;
            });
            this.sendItemUpdate();
        });
    
        registerEvent(getBudgetItems, () => {
            return this.items;
        });
    
        registerEvent(filteredBudgetItems, (event, filters) => {
            return this.getFilteredItems(filters);
        });
    }

    get changedEvent() {
        return budgetItemsChanged;
    }

    sendItemUpdate() {
        this.emit(this.changedEvent, this.items);

        broadcast(this.changedEvent, {
            items: this.items
        });
    }

    getFilteredItems(filters) {
        return filter(this.items, filters);
    }

    fromSimpleObject(obj) {
        this.items = obj
    }

    toSimpleObject() {
        return this.items;
    }
}

let budgetManager = new BudgetManager();
module.exports = {
    budgetManager
}