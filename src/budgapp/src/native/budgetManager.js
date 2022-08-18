const { registerEvent, broadcast } = require('@jeffriggle/ipc-bridge-server');
const _ = require('lodash');
const { EventEmitter } = require('events');
const { convertToNumeric, filter } = require('@budgapp/common');

const {
    addBudgetItems,
    updateBudgetItem,
    removeBudgetItem,
    budgetItemsChanged,
    getBudgetItems,
    filteredBudgetItems
} = require('@budgapp/common');

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

                if (!Number.isInteger(item.amount)) {
                    item.amount = convertToNumeric(item.amount);
                }
            });

            this.items = _.concat(this.items, newItems);
            this.sendItemUpdate();
        });
    
        registerEvent(removeBudgetItem, (event, item) => {
            const originalLength = this.items.length;

            _.remove(this.items, val => {
                return item.id === val.id;
            });

            if (originalLength !== this.items.length) {
                this.sendItemUpdate();
            }
        });
    
        registerEvent(getBudgetItems, () => {
            return this.items;
        });
    
        registerEvent(filteredBudgetItems, (event, filters) => {
            return this.getFilteredItems(filters);
        });

        registerEvent(updateBudgetItem, (event, newItem) => {
            if (this.updateItem(newItem)) {
                this.sendItemUpdate();
            }
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
        if (!Number.isInteger(newItem.amount)) {
            newItem.amount = convertToNumeric(newItem.amount);
        }

        let ind = _.findIndex(this.items, item => {
            return item.id === newItem.id;
        });

        let hasItem = ind !== -1;
        if (hasItem) {
            this.items[ind] = newItem;
        }

        return hasItem;
    }

    fromSimpleObject(obj) {
        nextId = 0;

        let max = _.maxBy(obj, item => {
            return item.id || 0;
        });
        
        if (max && max.id) {
            nextId = max.id;
        }

        let needsIds = nextId === 0;

        obj.forEach(item => {
            if (needsIds) {
                item.id = nextId++;
            }

            if (!Number.isInteger(item.amount)) {
                item.amount = convertToNumeric(item.amount);
            }
        });

        if (!needsIds) {
            nextId++;
        }

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