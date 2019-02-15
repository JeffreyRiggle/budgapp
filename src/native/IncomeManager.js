const moment = require('moment');
const { registerEvent, broadcast } = require('./ipcBridge');

class IncomeManager {
    constructor() {
        this.expectedIncome = 0;
        this.monthIncome = new Map();
    }

    start() {
        registerEvent('addIncomeItem', (event, newItem) => {
            this.addIncome(newItem);
        });

        registerEvent('getExpectedIncome', () => {
            return this.expectedIncome;
        });

        registerEvent('setExpectedIncome', (event, income) => {
            this.expectedIncome = income;
        });

        registerEvent('getMonthIncome', (event, date) => {
            return this.getMonthIncome(date);
        });
    }

    addIncome(item) {
        let date = moment(item.date);
        let monthyear = `${date.format('M')}/${date.format('yyyy')}`;

        let existing = this.monthIncome.get(monthyear);
        if (existing) {
            existing.push(item);
            return;
        }

        this.monthIncome.set(monthyear, [item]);
    }

    getMonthIncome(date) {
        let date = moment(item.date);
        let monthyear = `${date.format('M')}/${date.format('yyyy')}`;

        return this.monthIncome.get(monthyear) || [];
    }

    fromSimpleObject(obj) {
        this.expectedIncome = obj.expectedIncome;

        for (let prop in obj) {
            this.monthIncome.set(prop, obj[prop]);
        }
    }

    toSimpleObject() {
        let retVal = {
            expectedIncome: this.expectedIncome,
            monthIncome: {}
        };

        this.monthIncome.forEach((value, key) => {
            retVal.monthIncome[key] = value;
        });

        return retVal;
    }
}

module.exports = {
    IncomeManager
}