const moment = require('moment');
const { registerEvent, broadcast } = require('./ipcBridge');
const {
    addIncomeItems,
    getExpectedIncome,
    setExpectedIncome,
    getMonthIncome,
    getMonthRangeIncome
} = require('../common/eventNames');

class IncomeManager {
    constructor() {
        this.expectedIncome = 0;
        this.monthIncome = new Map();
    }

    start() {
        registerEvent(addIncomeItems, (event, newItems) => {
            this.addIncome(newItems);
        });

        registerEvent(getExpectedIncome, () => {
            return this.expectedIncome;
        });

        registerEvent(setExpectedIncome, (event, income) => {
            this.expectedIncome = income;
        });

        registerEvent(getMonthIncome, (event, date) => {
            return this.getMonthIncome(date);
        });

        registerEvent(getMonthRangeIncome, (event, request) => {
            return this.getMonthRangeIncome(request);
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

    getMonthRangeIncome(request) {
        let retVal = [];
        let momentDate = moment(request.start);
        let endDate = moment(request.end).toDate()

        console.log(`checking to see if ${momentDate.toDate()} is less than ${endDate}`);
        while (momentDate.toDate() < endDate) {
            console.log(`Adding ${momentDate.toDate()} income for request`);
            retVal.push({
                date: momentDate.toDate(),
                items: this.monthIncome.get(momentDate.format('MM/YYYY')) || []
            });

            momentDate.add(1, 'month');
            console.log(`checking to see if ${momentDate.toDate()} is less than ${endDate}`);
        }

        return retVal;
    }

    fromSimpleObject(obj) {
        if (!obj) {
            return;
        }
        
        this.expectedIncome = obj.expectedIncome;

        for (let prop in obj.monthIncome) {
            this.monthIncome.set(prop, obj.monthIncome[prop]);
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