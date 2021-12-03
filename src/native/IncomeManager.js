const moment = require('moment');
const { registerEvent, broadcast } = require('@jeffriggle/ipc-bridge-server');
const { convertToNumeric } = require('../common/currencyConversion');
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
            if (Number.isInteger(income)) {
                this.expectedIncome = income;
            } else {
                this.expectedIncome = convertToNumeric(income);
            }
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
            if (!Number.isInteger(item.amount)) {
                item.amount = convertToNumeric(item.amount);
            }

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

        while (momentDate.toDate() <= endDate) {
            retVal.push({
                date: momentDate.toDate(),
                items: this.monthIncome.get(momentDate.format('MM/YYYY')) || []
            });

            momentDate.add(1, 'month');
        }

        return retVal;
    }

    fromSimpleObject(obj) {
        if (!obj) {
            return;
        }
        
        this.monthIncome.clear();
        this.expectedIncome = obj.expectedIncome;

        for (let prop in obj.monthIncome) {
            let income = obj.monthIncome[prop];
            income.forEach(item => {
                if (!Number.isInteger(item.amount)) {
                    item.amount = convertToNumeric(item.amount);
                }
            });
            this.monthIncome.set(prop, income);
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