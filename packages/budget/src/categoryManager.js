const moment = require('moment');
const _ = require('lodash');

const dateFormat = 'MM/YYYY';

function getCurrentMonth() {
    const momentDate = moment(Date.now());
    return `${momentDate.format(dateFormat)}`;
}

class CategoryManager {
    constructor(budgetManager) {
        this.categoryMap = new Map();
        this.budgetManager = budgetManager;
        this.budgetManager.on(this.budgetManager.changedEvent, this.checkCategories.bind(this));
        this.checkCategories(this.budgetManager.items);
    }

    addCategory(request) {
        const currentMonthYear = moment(Date.now()).format(dateFormat);

        let momentDate = moment(request.date);
        let monthyear = `${momentDate.format(dateFormat)}`;
        let value = [{allocated: request.allocated, date: monthyear, rollover: request.rollover}]

        while (monthyear !== currentMonthYear) {
            momentDate = momentDate.add(1, 'Months');
            monthyear = `${momentDate.format(dateFormat)}`;
            value.push({allocated: request.allocated, date: monthyear, rollover: request.rollover});
        }
        
        this.categoryMap.set(request.name, value);
    }

    updateCategoriesFromItems(items) {
        items.forEach(item => {
            let monthyear = (moment(item.date).format(dateFormat));

            const category = this.categoryMap.get(item.category);
            if (!category || !category.some(month => month.date === monthyear)) {
                this.categoryMap.set(item.category, [{allocated: 0, date: monthyear, rollover: false}]);
            }
        });
    }

    updateCategory(newCategories) {
        const monthyear = getCurrentMonth();

        newCategories.forEach(category => {
            let cat = this.categoryMap.get(category.name);

            if (!cat) {
                return;
            }

            let newCat = cat.filter((value) => value.date !== monthyear);

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
        let foundDate = false;

        value.forEach(value => {
            if (value.date === monthyear) {
                foundDate = true;
                retVal += value.allocated;
            } else if (value.rollover && includeRollover && moment(value.date, dateFormat).endOf('month').toDate() < targetDate) {
                let amount = this.getRolloverAmount(value, category, moment(value.date, dateFormat).toDate());
                retVal += amount;
            }
        });

        if (!foundDate) {
            const lastValue = value[value.length -1];
            this.categoryMap.get(category).push({
                date: getCurrentMonth(),
                allocated: lastValue.allocated,
                rollover: lastValue.rollover
            });
            retVal += lastValue.allocated;
        }

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

        let items = this.budgetManager.getFilteredItems(filter);

        let retVal = 0;

        items.forEach(item => {
            retVal += Number(item.amount);
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
        this.updateCategoriesFromItems(items);
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

                let closestDate, found, error;
                while(!found && !error) {
                    let m = date.add(1, 'months');

                    if (!m.isValid()) {
                        error = true;
                        break;
                    }

                    closestDate = m.format(dateFormat);
                    if (closestDate === '-NaN/-0NaN') {
                        error = true;
                        break;
                    }

                    found = _.find(value, val => {
                        return val.date === closestDate;
                    });
                }

                if (!found) {
                    return;
                }

                date = moment(item.date);

                value.push({
                    date: formatedDate, 
                    allocated: found.allocated, 
                    rollover: found.rollover
                });
            });
        });
    }

    fromSimpleObject(obj) {
        if (!obj) {
            return;
        }

        this.categoryMap.clear();
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