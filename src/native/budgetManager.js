const { registerEvent, broadcast } = require('./ipcBridge');
const _ = require('lodash');
const { filter } = require('./filterItems');
const { EventEmitter } = require('events');

const {
    addBudgetItems,
    updateBudgetItem,
    removeBudgetItem,
    budgetItemsChanged,
    getBudgetItems,
    filteredBudgetItems
} = require('../common/eventNames');

let nextId = 0;

class BudgetManager extends EventEmitter {
    constructor() {
        super();
        this.items = [];
    }

    start() {
        registerEvent(addBudgetItems, (event, newItems) => {
            newItems.forEach(item => {
                item.id = nextId++;
            });

            this.items = _.concat(this.items, newItems);
            this.sendItemUpdate();
        });
    
        registerEvent(removeBudgetItem, (event, item) => {
            this.items = _.remove(this.items, (val) => {
                return item.id === val.id;
            });
            this.sendItemUpdate();
        });
    
        registerEvent(getBudgetItems, () => {
            return this.items;
        });
    
        registerEvent(filteredBudgetItems, (event, filters) => {
            return this.getFilteredItems(filters);
        });

        registerEvent(updateBudgetItem, (event, newItem) => {
            this.updateItem(newItem);
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

    updateItem(newItem) {
        let ind = _.findIndex(this.items, item => {
            return item.id === newItem.id;
        });

        if (ind !== -1) {
            this.items[ind] = newItem;
        }
    }

    fromSimpleObject(obj) {
        nextId = _.maxBy(obj, item => {
            return item.id || 0;
        }).id || 0;

        if (nextId === 0) {
            obj.forEach(item => {
                item.id = nextId++;
            });
        }

        nextId++;
        
        this.items = obj;
    }

    toSimpleObject() {
        return this.items;
    }
}

let budgetManager = new BudgetManager();
module.exports = {
    budgetManager
}