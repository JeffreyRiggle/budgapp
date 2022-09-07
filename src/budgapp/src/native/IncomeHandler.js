const { registerEvent } = require('@jeffriggle/ipc-bridge-server');
const { convertToNumeric } = require('@budgapp/common');
const {
    addIncomeItems,
    getExpectedIncome,
    setExpectedIncome,
    getMonthIncome,
    getMonthRangeIncome
} = require('@budgapp/common');
const { IncomeManager } = require('@budgapp/income');

class IncomeHandler {
    constructor() {
        this.manager = new IncomeManager();
    }

    start() {
        registerEvent(addIncomeItems, (event, newItems) => {
            this.manager.addIncome(newItems);
        });

        registerEvent(getExpectedIncome, () => {
            return this.manager.expectedIncome;
        });

        registerEvent(setExpectedIncome, (event, income) => {
            if (Number.isInteger(income)) {
                this.manager.expectedIncome = income;
            } else {
                this.manager.expectedIncome = convertToNumeric(income);
            }
        });

        registerEvent(getMonthIncome, (event, date) => {
            return this.manager.getMonthIncome(date);
        });

        registerEvent(getMonthRangeIncome, (event, request) => {
            return this.manager.getMonthRangeIncome(request);
        });
    }

    fromSimpleObject(obj) {
        this.manager.fromSimpleObject(obj);
    }

    toSimpleObject() {
        return this.manager.toSimpleObject();
    }
}

module.exports = {
    IncomeHandler
}