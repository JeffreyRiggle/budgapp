const moment = require('moment');
const { registerEvent } = require('@jeffriggle/ipc-bridge-server');
const _ = require('lodash');
const { budgetHandler } = require('./budgetHandler');
const {
    getCategories,
    getCategory,
    addCategory,
    updateCategories
} = require('@budgapp/common');
const { CategoryManager } = require('@budgapp/budget');

const dateFormat = 'MM/YYYY';

function getCurrentMonth() {
    const momentDate = moment(Date.now());
    return `${momentDate.format(dateFormat)}`;
}

class CategoryHandler {
    constructor() {
        this.categoryMap = new Map();
        this.manager = new CategoryManager(budgetHandler.manager);
    }

    start() {
        registerEvent(getCategories, (event, date) => {
            return this.manager.getMonthCategories(date || Date.now());
        });

        registerEvent(getCategory, (event, req) => {
            return this.manager.getMonthCategory(req);
        })
    
        registerEvent(addCategory, (event, request) => {
            this.manager.addCategory(request);
        });
    
        registerEvent(updateCategories, (event, newCategories) => {
            this.manager.updateCategory(newCategories);
        });
    }

    fromSimpleObject(obj) {
        this.manager.fromSimpleObject(obj)
    }

    toSimpleObject() {
        return this.manager.toSimpleObject();
    }
}

module.exports = {
    CategoryHandler
}