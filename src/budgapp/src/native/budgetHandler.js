const { registerEvent, broadcast } = require('@jeffriggle/ipc-bridge-server');
const { BudgetManager } = require('@budgapp/budget');
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
            this.manager.addItems(newItems);
        });
    
        registerEvent(removeBudgetItem, (event, item) => {
            this.manager.removeItem(item);
        });
    
        registerEvent(getBudgetItems, () => {
            return this.manager.items;
        });
    
        registerEvent(filteredBudgetItems, (event, filters) => {
            return this.manager.getFilteredItems(filters);
        });

        registerEvent(updateBudgetItem, (event, item) => {
            this.manager.tryUpdateItem(item);
        });

        this.manager.on(this.manager.changedEvent, this.sendItemUpdate.bind(this))
    }

    sendItemUpdate(items) {
        broadcast(budgetItemsChanged, {
            items
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