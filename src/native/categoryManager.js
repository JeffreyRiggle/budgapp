const moment = require('moment');
const { registerEvent, broadcast } = require('./ipcBridge');
const _ = require('lodash');

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
    }

    addCategory(request) {
        let momentDate = moment(request.date);
        let monthyear = `${momentDate.format('MM/YYYY')}`;

        this.categoryMap.set(request.name, [{allocated: request.allocated, date: monthyear}]);
    }

    updateCategory(newCategories) {
        let momentDate = moment(Date.now());
        let monthyear = `${momentDate.format('MM/YYYY')}`;

        newCategories.forEach(category => {
            let cat = this.categoryMap.get(category.name);

            if (!cat) {
                return;
            }

            let newCat = _.remove(cat, (value) => {
                value.date === monthyear;
            });
            
            newCat.push({allocated: category.allocated, date: monthyear});
            this.categoryMap.set(category.name, newCat);
        });
    }

    getMonthCategories(date) {
        let momentDate = moment(date);
        let monthyear = `${momentDate.format('MM/YYYY')}`;

        let retVal = [];
        this.categoryMap.forEach((value, category) => {
            retVal.push({name: category, allocated: this.findMonthAllocation(value, monthyear)})
        });

        return retVal;
    }

    findMonthAllocation(value, monthyear) {
        let retVal = 0;
        value.forEach(value => {
            if (value.date === monthyear) {
                retVal = value.allocated;
            }
        });

        return retVal;
    }

    getMonthCategory(request) {
        let momentDate = moment(request.date || Date.now());
        let monthyear = `${momentDate.format('MM/YYYY')}`;

        let val = categoryMap.get(request.category);

        if (!val) {
            return;
        }

        return {name: request.category, allocated: this.findMonthAllocation(val, monthyear)};
    }

    updateCategoriesFromItems(items) {
        items.forEach(item => {
            if (!categories.has(item.category)) {
                categories.set(item.category, {amount: 0, date: Date.now()});
            }
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