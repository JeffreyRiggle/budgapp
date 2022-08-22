const _ = require('lodash');
const { EventEmitter } = require('events');
const { convertToNumeric, filter } = require('@budgapp/common');

const {
    budgetItemsChanged
} = require('@budgapp/common');

class BudgetManager extends EventEmitter {
    constructor() {
        super();
        this.nextId = 0;
        this.items = [];
    }

    get changedEvent() {
        return budgetItemsChanged;
    }

    sendItemUpdate() {
        this.emit(this.changedEvent, this.items);
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
        this.nextId = 0;

        let max = _.maxBy(obj, item => {
            return item.id || 0;
        });
        
        if (max && max.id) {
            this.nextId = max.id;
        }

        let needsIds = this.nextId === 0;

        obj.forEach(item => {
            if (needsIds) {
                item.id = this.nextId++;
            }

            if (!Number.isInteger(item.amount)) {
                item.amount = convertToNumeric(item.amount);
            }
        });

        if (!needsIds) {
            this.nextId++;
        }

        this.items = obj;
    }

    toSimpleObject() {
        return this.items;
    }
}

module.exports = {
    BudgetManager
}