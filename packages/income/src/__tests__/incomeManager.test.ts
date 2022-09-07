const moment = require('moment');

const { IncomeManager } = require('../incomeManager');

describe('Income Manager', () => {
    let manager, request, result;

    beforeEach(() => {
        manager = new IncomeManager();
    });

    describe('when add income is invoked', () => {
        let today, lastMonth;

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

            manager.addIncome(request);
        });
       
        it('should add the income items for this month', () => {
            let items = manager.monthIncome.get(moment(today).format('MM/YYYY'));
            expect(items.length).toBe(2);
        });

        it('should add the income items for last month', () => {
            let items = manager.getMonthIncome(lastMonth);
            expect(items.length).toBe(1);
        });

        describe('when get income is invoked', () => {
            beforeEach(() => {
                result = manager.getMonthIncome(today);
            });

            it('should return the correct income', () => {
                expect(result.length).toBe(2);
            });
        });

        describe('when get income over a date range is invoked', () => {
            beforeEach(() => {
                request = {
                    start: lastMonth,
                    end: today
                };

                result = manager.getMonthRangeIncome(request);
            });

            it('should return the correct income months', () => {
                expect(result.length).toBe(2);
            });

            it('should return the correct number of items for the first month', () => {
                expect(result[0].items.length).toBe(1);
            });

            it('should return the correct number of items for this month', () => {
                expect(result[1].items.length).toBe(2);
            });
        });
    });

    describe('when add income is invoked with non numbers', () => {
        let today;

        beforeEach(() => {
            today = Date.now();

            request = [
                {
                    amount: '100',
                    date: today
                }
            ];

            manager.addIncome(request);
            result = manager.monthIncome.get(moment(today).format('MM/YYYY'));
        });
       
        it('should add the income item', () => {
            expect(result.length).toBe(1);
        });

        it('should have the correct amount', () => {
            expect(result[0].amount).toBe(10000);
        });
    });

    describe('persistence', () => {
        let persisted;

        beforeEach(() => {
            persisted = {
                expectedIncome: 50000,
                monthIncome: {
                    '09/2021': [
                        {
                            amount: 50000,
                            source: 'Payday'
                        }
                    ],
                    '10/2021': [
                        {
                            amount: 50000,
                            source: 'Payday'
                        }
                    ],
                }
            }
        });

        describe('when loading persisted value', () => {
            beforeEach(() => {
                manager.fromSimpleObject(persisted);
            });
    
            it('should have the correct items', () => {
                expect(manager.monthIncome.get('09/2021')[0].amount).toBe(50000);
                expect(manager.monthIncome.get('10/2021')[0].amount).toBe(50000);
            });

            it('should have the correct expected income', () => {
                expect(manager.expectedIncome).toBe(50000);
            });
        });

        describe('when loading persisted  with existing data', () => {
            beforeEach(() => {
                manager.monthIncome.set('8/2021', [{ amount: 50000, source: 'Payday' }]);
                manager.fromSimpleObject(persisted);
            });
    
            it('should clear the old item', () => {
                expect(manager.monthIncome.get('8/2021')).toBeUndefined();
            });

            it('should have the correct expected income', () => {
                expect(manager.expectedIncome).toBe(50000);
            });
        });
    });
});