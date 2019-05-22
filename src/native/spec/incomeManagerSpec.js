const expect = require('chai').expect;
const mock = require('mock-require');
const moment = require('moment');

let registeredEvents, broadcasts;

mock('@jeffriggle/ipc-bridge-server', { 
    registerEvent: (eventName, callback) => {
        registeredEvents.set(eventName, callback);
    },
    broadcast: (event, message) => {
        let stored = broadcasts.get(event);
        if (!stored) {
            broadcasts.set(event, [message]);
            return;
        }

        stored.push(message);
    }
});

const {IncomeManager} = require('../IncomeManager');
const {
    addIncomeItems,
    getExpectedIncome,
    setExpectedIncome,
    getMonthIncome,
    getMonthRangeIncome
} = require('../../common/eventNames');

describe('Income Manager', () => {
    let manager, request, result;

    beforeEach(() => {
        registeredEvents = new Map();
        manager = new IncomeManager();
    });

    describe('when manager is started', () => {
        beforeEach(() => {
            manager.start();
        });

        describe('and add income is invoked', () => {
            let toda, lastMonth;

            beforeEach(() => {
                today = Date.now();
                lastMonth = moment(today).subtract(1, 'Months').toDate();

                request = [
                    {
                        amount: 1000,
                        date: today
                    },
                    {
                        amount: 2000,
                        date: today
                    },
                    {
                        amount: 5000,
                        date: lastMonth
                    }
                ];
    
                registeredEvents.get(addIncomeItems)(undefined, request);
            });
           
            it('should add the income items for this month', () => {
                let items = manager.monthIncome.get(moment(today).format('MM/YYYY'));
                expect(items.length).to.equal(2);
            });

            it('should add the income items for last month', () => {
                let items = manager.monthIncome.get(moment(lastMonth).format('MM/YYYY'));
                expect(items.length).to.equal(1);
            });

            describe('when get income is invoked', () => {
                beforeEach(() => {
                    result = registeredEvents.get(getMonthIncome)(undefined, today);
                });

                it('should return the correct income', () => {
                    expect(result.length).to.equal(2);
                });
            });

            describe('when get income over a date range is invoked', () => {
                beforeEach(() => {
                    request = {
                        start: lastMonth,
                        end: today
                    };

                    result = registeredEvents.get(getMonthRangeIncome)(undefined, request);
                });

                it('should return the correct income months', () => {
                    expect(result.length).to.equal(2);
                });

                it('should return the correct number of items for the first month', () => {
                    expect(result[0].items.length).to.equal(1);
                });

                it('should return the correct number of items for this month', () => {
                    expect(result[1].items.length).to.equal(2);
                });
            });
        });

        describe('and add income is invoked with non numbers', () => {
            let today;

            beforeEach(() => {
                today = Date.now();

                request = [
                    {
                        amount: '100',
                        date: today
                    }
                ];
    
                registeredEvents.get(addIncomeItems)(undefined, request);
                result = manager.monthIncome.get(moment(today).format('MM/YYYY'));
            });
           
            it('should add the income item', () => {
                expect(result.length).to.equal(1);
            });

            it('should have the correct amount', () => {
                expect(result[0].amount).to.equal(10000);
            });
        });

        describe('when set expected income is invoked', () => {
            beforeEach(() => {
                registeredEvents.get(setExpectedIncome)(undefined, 10000);
            });

            it('should have the right expected income', () => {
                expect(manager.expectedIncome).to.equal(10000);
            });

            describe('when get expected income is invoked', () => {
                beforeEach(() => {
                    result = registeredEvents.get(getExpectedIncome)();
                });

                it('should have the correct result', () => {
                    expect(result).to.equal(10000);
                });
            });
        });

        describe('when set expected income is invoked with a string', () => {
            beforeEach(() => {
                registeredEvents.get(setExpectedIncome)(undefined, '100');
            });

            it('should have the right expected income', () => {
                expect(manager.expectedIncome).to.equal(10000);
            });
        });
    });
});