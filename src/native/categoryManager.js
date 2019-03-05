const moment = require('moment');
const { registerEvent, broadcast } = require('./ipcBridge');
const _ = require('lodash');
const { budgetManager } = require('./budgetManager');
const dateFormat = 'MM/YYYY';

class CategoryManager {
    constructor() {
        this.categoryMap = new Map();
    }

    start() {
        registerEvent('getCategories', (event, date) => {
            return this.getMonthCategories(date || Date.now());
        });

        registerEvent('getCategory', (event, req) => {
            return this.getMonthCategory(req);
        })
    
        registerEvent('addCategory', (event, request) => {
            this.addCategory(request);
        });
    
        registerEvent('updateCategories', (event, newCategories) => {
            this.updateCategory(newCategories);
        });

        budgetManager.on(budgetManager.changedEvent, this.checkCategories.bind(this));
        this.checkCategories(budgetManager.items);
    }

    addCategory(request) {
        let momentDate = moment(request.date);
        let monthyear = `${momentDate.format(dateFormat)}`;

        this.categoryMap.set(request.name, [{allocated: request.allocated, date: monthyear, rollover: request.rollover}]);
    }

    updateCategory(newCategories) {
        let momentDate = moment(Date.now());
        let monthyear = `${momentDate.format(dateFormat)}`;

        newCategories.forEach(category => {
            let cat = this.categoryMap.get(category.name);

            if (!cat) {
                return;
            }

            let newCat = _.remove(cat, (value) => {
                value.date === monthyear;
            });

            newCat.push({
                allocated: category.allocated, 
                date: monthyear, 
                rollover: category.rollover
            });
            
            this.categoryMap.set(category.name, newCat);
        });
    }

    getMonthCategories(date) {
        let momentDate = moment(date);
        let monthyear = `${momentDate.format(dateFormat)}`;

        let retVal = [];
        this.categoryMap.forEach((value, category) => {
            retVal.push({
                name: category, 
                allocated: this.findMonthAllocation(value, monthyear, category, false), 
                rollover: this.findMonthRollover(value, monthyear)
            });
        });

        return retVal;
    }

    findMonthAllocation(value, monthyear, category, includeRollover) {
        let retVal = 0;
        let targetDate = moment(monthyear, dateFormat).toDate();

        value.forEach(value => {
            if (value.date === monthyear) {
                retVal += value.allocated;
            } else if (value.rollover && includeRollover && moment(value.date, dateFormat).endOf('month').toDate() < targetDate) {
                retVal += this.getRolloverAmount(value, category, targetDate);
            }
        });

        return retVal;
    }

    findMonthRollover(value, monthyear) {
        let retVal = false;
        value.forEach(value => {
            if (value.date === monthyear) {
                retVal = value.rollover;
            }
        });

        return retVal;
    }

    getRolloverAmount(value, category, date) {
        return value.allocated - this.getSpent(category, date);
    }

    getSpent(category, date) {
        let filter = {
            filters: [
                {
                    type: 'equals',
                    filterProperty: 'category',
                    expectedValue: category
                },
                {
                    type: 'month',
                    date: date
                }
            ]
        };

        let items = budgetManager.getFilteredItems(filter);

        let retVal = 0;

        items.forEach(item => {
            retVal += item.amount;
        });

        return retVal;
    }

    getMonthCategory(request) {
        let momentDate = moment(request.date || Date.now());
        let monthyear = `${momentDate.format(dateFormat)}`;

        let val = this.categoryMap.get(request.category);

        if (!val) {
            return;
        }

        return {
            name: request.category, 
            allocated: this.findMonthAllocation(val, monthyear, request.category, request.includeRollover), 
            rollover: this.findMonthRollover(val, monthyear)
        };
    }

    checkCategories(items) {
        let checkedDates = [];

        items.forEach(item => {
            if (!item.date) {
                return;
            }

            let date = moment(item.date);
            let formatedDate = date.format(dateFormat);

            if (checkedDates.indexOf(formatedDate) !== -1) {
                return;
            }

            checkedDates.push(formatedDate);
            this.categoryMap.forEach((value, key) => {
                let hasDate = _.find(value, val => {
                    return val.date === formatedDate;
                });

                if (hasDate) {
                    return;
                }

                let closestDate, found;
                let iter = 1;
                while(!found) {
                    closestDate = date.add(iter++, 'M').format(dateFormat);
                    found = _.find(value, val => {
                        return val.date === closestDate;
                    });
                }

                value.push({
                    date: formatedDate, 
                    allocated: found.allocated, 
                    rollover: found.rollover
                });
            });
        });
    }

    fromSimpleObject(obj) {
        for (let prop in obj.categories) {
            this.categoryMap.set(prop, obj.categories[prop]);
        }
    }

    toSimpleObject() {
        let retVal = {
            categories: {}
        };

        this.categoryMap.forEach((value, key) => {
            retVal.categories[key] = value;
        });

        return retVal;
    }
}

module.exports = {
    CategoryManager
}