const { registerEvent, broadcast } = require('@jeffriggle/ipc-bridge-server');
const { BudgetManager } = require('@budgapp/budget');
const _ = require('lodash');
const { convertToNumeric } = require('@budgapp/common');

const {
    addBudgetItems,
    updateBudgetItem,
    removeBudgetItem,
    budgetItemsChanged,
    getBudgetItems,
    filteredBudgetItems
} = require('@budgapp/common');

class BudgetHandler {
    constructor() {
        this.manager = new BudgetManager();
    }

    start() {
        registerEvent(addBudgetItems, (event, newItems) => {
            newItems.forEach(item => {
                item.id = this.manager.nextId++;

                if (!Number.isInteger(item.amount)) {
                    item.amount = convertToNumeric(item.amount);
                }
            });

            this.manager.items = _.concat(this.manager.items, newItems);
            this.sendItemUpdate();
        });
    
        registerEvent(removeBudgetItem, (event, item) => {
            const originalLength = this.manager.items.length;

            _.remove(this.manager.items, val => {
                return item.id === val.id;
            });

            if (originalLength !== this.manager.items.length) {
                this.sendItemUpdate();
            }
        });
    
        registerEvent(getBudgetItems, () => {
            return this.manager.items;
        });
    
        registerEvent(filteredBudgetItems, (event, filters) => {
            return this.manager.getFilteredItems(filters);
        });

        registerEvent(updateBudgetItem, (event, newItem) => {
            if (this.manager.updateItem(newItem)) {
                this.sendItemUpdate();
            }
        });
    }

    get changedEvent() {
        return budgetItemsChanged;
    }

    sendItemUpdate() {
        this.manager.sendItemUpdate();

        broadcast(this.changedEvent, {
            items: this.manager.items
        });
    }

    fromSimpleObject(obj) {
        this.manager.fromSimpleObject(obj);
    }

    toSimpleObject() {
        return this.manager.toSimpleObject();
    }
}

let budgetHandler = new BudgetHandler();
module.exports = {
    budgetHandler
}