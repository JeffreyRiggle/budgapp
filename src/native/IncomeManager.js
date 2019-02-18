const moment = require('moment');
const { registerEvent, broadcast } = require('./ipcBridge');

class IncomeManager {
    constructor() {
        this.expectedIncome = 0;
        this.monthIncome = new Map();
    }

    start() {
        registerEvent('addIncomeItems', (event, newItems) => {
            this.addIncome(newItems);
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

    addIncome(items) {
        console.log(`Attempting to add ${items.length} income items`);

        items.forEach(item => {
            let date = moment(item.date);
            let monthyear = `${date.format('MM/YYYY')}`;
    
            let existing = this.monthIncome.get(monthyear);
            if (existing) {
                console.log(`Adding income item to key ${monthyear}`);
                existing.push(item);
                return;
            }
    
            console.log(`Setting up income for ${monthyear}`);
            this.monthIncome.set(monthyear, [item]);
        });
    }

    getMonthIncome(date) {
        let momentDate = moment(date);
        let monthyear = `${momentDate.format('MM/YYYY')}`;

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