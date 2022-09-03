const moment = require('moment');
const { CategoryManager } = require('../categoryManager');
const {
    getCategories,
    getCategory,
    addCategory,
    updateCategories
} = require('@budgapp/common');
const { BudgetManager } = require('../budgetManager');

describe('category manager', () => {
    let budgetManager, manager, response;

    beforeEach(() => {
        budgetManager = new BudgetManager();
        manager = new CategoryManager(budgetManager);
    });

    describe('when a budget item is added with a new category', () => {
        beforeEach(() => {
            budgetManager.addItems([{
                id: 1,
                amount: 1,
                description: 'this is a test',
                category: 'something',
                date: Date.now()
            }]);
        });

        it('should add that category', () => {
            expect(Array.isArray(manager.categoryMap.get('something'))).toBe(true);
        });
    });

    describe('when add category is invoked', () => {
        let request;

        beforeEach(() => {
            request = {
                date: Date.now(),
                name: 'My Cat',
                allocated: 750,
                rollover: false
            };

            manager.addCategory(request);
        });

        it('should add the item', () => {
            expect(Array.isArray(manager.categoryMap.get('My Cat'))).toBe(true);
        });

        describe('when get category is invoked', () => {
            let response;
            beforeEach(() => {
                request = {
                    date: Date.now(),
                    category: 'My Cat'
                };

                response = manager.getMonthCategory(request);
            });

            it('should return the correct amount', () => {
                expect(response.allocated).toBe(750);
            });

            it('should return the correct category', () => {
                expect(response.name).toBe('My Cat');
            });

            it('should return the correct rollover', () => {
                expect(response.rollover).toBe(false);
            });

            describe('and there is no data for the requested month', () => {
                beforeEach(() => {
                    request = {
                        date: moment().add(1, 'M').toDate(),
                        category: 'My Cat'
                    };

                    response = manager.getMonthCategory(request);
                });

                it('should return the correct amount', () => {
                    expect(response.allocated).toBe(750);
                });

                it('should return the correct category', () => {
                    expect(response.name).toBe('My Cat');
                });

                it('should return the correct rollover', () => {
                    expect(response.rollover).toBe(false);
                });
            });
        });

        describe('when update categories is invoked', () => {
            beforeEach(() => {
                request = [{
                    date: Date.now(),
                    name: 'My Cat',
                    allocated: 150,
                    rollover: false
                }];

                manager.updateCategory(request);
            });

            it('should update the item', () => {
                expect(manager.categoryMap.get('My Cat')[0].allocated).toBe(150);
            });
        });
    });

    describe('when add category is invoked with rollover', () => {
        let request;

        beforeEach(() => {
            request = {
                date: moment(Date.now()).subtract(1, 'Months').toDate(),
                name: 'My Cat',
                allocated: 750,
                rollover: true
            };

            manager.addCategory(request);
        });

        it('should add the item', () => {
            expect(Array.isArray(manager.categoryMap.get('My Cat'))).toBe(true);
        });

        describe('when get category is invoked', () => {
            beforeEach(() => {
                request = {
                    date: Date.now(),
                    category: 'My Cat',
                    includeRollover: true
                };

                response = manager.getMonthCategory(request);
            });

            it('should return the correct amount', () => {
                expect(response.allocated).toBe(1500);
            });

            it('should return the correct category', () => {
                expect(response.name).toBe('My Cat');
            });

            it('should return the correct rollover', () => {
                expect(response.rollover).toBe(true);
            });
        });
    });

    describe('when get categories is invoked', () => {
        beforeEach(() => {
            manager.addCategory({
                date: Date.now(),
                name: 'My Cat',
                allocated: 750,
                rollover: false
            });

            manager.addCategory({
                date: moment(Date.now()).subtract(1, 'Months').toDate(),
                name: 'My Cat2',
                allocated: 250,
                rollover: true
            });

            response = manager.getMonthCategories();
        });

        it('should return both categories', () => {
            expect(response[0].name).toBe('My Cat');
            expect(response[1].name).toBe('My Cat2');
        });
    });

    describe('persistence', () => {
        let persist;

        beforeEach(() => {
            persist = {
                categories: {
                    'My Cat': [
                        {
                            allocated: 750,
                            rollover: false,
                            date: '05/2019'
                        }
                    ],
                    'My Cat2': [
                        {
                            allocated: 150,
                            rollover: true,
                            date: '05/2019'
                        }
                    ]
                }
            };
        });

        describe('when manager is loaded', () => {
            beforeEach(() => {
                manager.fromSimpleObject(persist);
            });

            it('should have the correct items', () => {
                expect(manager.categoryMap.size).toBe(2);
            });
        });

        describe('when manager is loaded while data is already present', () => {
            beforeEach(() => {
                manager.categoryMap.set('Old Cat', [{
                    allocated: 750,
                    rollover: false,
                    date: '05/2019'
                }])
                manager.fromSimpleObject(persist);
            });

            it('should not retain the old category', () => {
                expect(manager.categoryMap.get('Old Cat')).toBeUndefined();
            });
        });

        describe('when manager is saved', () => {
            beforeEach(() => {
                manager.categoryMap.set('My Cat', [
                    {
                        allocated: 750,
                        rollover: false,
                        date: '05/2019'
                    }
                ]);

                manager.categoryMap.set('My Cat2', [
                    {
                        allocated: 150,
                        rollover: true,
                        date: '05/2019'
                    }
                ]);

                response = manager.toSimpleObject();
            });

            it('should have the correct value', () => {
                expect(response.categories['My Cat'][0].allocated).toBe(750);
                expect(response.categories['My Cat2'][0].allocated).toBe(150);
            })
        });
    });
});