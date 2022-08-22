const moment = require('moment');
const { CategoryHandler } = require('../categoryHandler');
const {
    getCategories,
    getCategory,
    addCategory,
    updateCategories
} = require('@budgapp/common');
const { registerEvent, broadcast } = require('@jeffriggle/ipc-bridge-server');
const { budgetHandler } = require('../budgetHandler');

jest.mock('@jeffriggle/ipc-bridge-server', () => ({ 
    registerEvent: jest.fn(),
    broadcast: jest.fn(),
}));

jest.mock('../budgetHandler', () => {
    class MockBudgetHandler {
        constructor() {
            this.items = [];
            this.on = jest.fn();
        }
    
        get changedEvent() {
            return 'changed';
        }
    
        getFilteredItems() {
            return [];
        }
    }

    return { budgetHandler: { manager: new MockBudgetHandler() } }
});

describe('category manager', () => {
    let handler, response;
    let registeredEvents, broadcasts, callback;

    beforeEach(() => {
        registeredEvents = new Map();
        registerEvent.mockImplementation((eventName, callback) => {
            registeredEvents.set(eventName, callback);
        });
        broadcast.mockImplementation((event, message) => {
            let stored = broadcasts.get(event);
            if (!stored) {
                broadcasts.set(event, [message]);
                return;
            }
    
            stored.push(message);
        });
        budgetHandler.manager.on.mockImplementation((event, cb) => {
            callback = cb;
        });

        handler = new CategoryHandler();
    });

    describe('when manager is started', () => {
        beforeEach(() => {
            handler.start();
        });

        it('should register the proper events', () => {
            expect(registeredEvents.size).toBe(4);
        });

        describe('when a budget item is added with a new category', () => {
            beforeEach(() => {
                callback([{
                    id: 1,
                    amount: 1,
                    description: 'this is a test',
                    category: 'something',
                    date: Date.now()
                }]);
            });

            it('should add that category', () => {
                expect(Array.isArray(handler.manager.categoryMap.get('something'))).toBe(true);
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

                registeredEvents.get(addCategory)(undefined, request);
            });

            it('should add the item', () => {
                expect(Array.isArray(handler.manager.categoryMap.get('My Cat'))).toBe(true);
            });

            describe('when get category is invoked', () => {
                let response;
                beforeEach(() => {
                    request = {
                        date: Date.now(),
                        category: 'My Cat'
                    };

                    response = registeredEvents.get(getCategory)(undefined, request);
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
    
                        response = registeredEvents.get(getCategory)(undefined, request);
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
    
                    registeredEvents.get(updateCategories)(undefined, request);
                });

                it('should update the item', () => {
                    expect(handler.manager.categoryMap.get('My Cat')[0].allocated).toBe(150);
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

                registeredEvents.get(addCategory)(undefined, request);
            });

            it('should add the item', () => {
                expect(Array.isArray(handler.manager.categoryMap.get('My Cat'))).toBe(true);
            });

            describe('when get category is invoked', () => {
                beforeEach(() => {
                    request = {
                        date: Date.now(),
                        category: 'My Cat',
                        includeRollover: true
                    };

                    response = registeredEvents.get(getCategory)(undefined, request);
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
                registeredEvents.get(addCategory)(undefined, {
                    date: Date.now(),
                    name: 'My Cat',
                    allocated: 750,
                    rollover: false
                });

                registeredEvents.get(addCategory)(undefined, {
                    date: moment(Date.now()).subtract(1, 'Months').toDate(),
                    name: 'My Cat2',
                    allocated: 250,
                    rollover: true
                });

                response = registeredEvents.get(getCategories)();
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
                    handler.fromSimpleObject(persist);
                });

                it('should have the correct items', () => {
                    expect(handler.manager.categoryMap.size).toBe(2);
                });
            });

            describe('when manager is loaded while data is already present', () => {
                beforeEach(() => {
                    handler.manager.categoryMap.set('Old Cat', [{
                        allocated: 750,
                        rollover: false,
                        date: '05/2019'
                    }])
                    handler.fromSimpleObject(persist);
                });

                it('should not retain the old category', () => {
                    expect(handler.manager.categoryMap.get('Old Cat')).toBeUndefined();
                });
            });

            describe('when manager is saved', () => {
                beforeEach(() => {
                    handler.manager.categoryMap.set('My Cat', [
                        {
                            allocated: 750,
                            rollover: false,
                            date: '05/2019'
                        }
                    ]);

                    handler.manager.categoryMap.set('My Cat2', [
                        {
                            allocated: 150,
                            rollover: true,
                            date: '05/2019'
                        }
                    ]);

                    response = handler.toSimpleObject();
                });

                it('should have the correct value', () => {
                    expect(response.categories['My Cat'][0].allocated).toBe(750);
                    expect(response.categories['My Cat2'][0].allocated).toBe(150);
                })
            });
        });
    });
});