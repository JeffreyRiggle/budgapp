const expect = require('chai').expect;
const mock = require('mock-require');
const moment = require('moment');

let registeredEvents, broadcasts, callback;

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

class MockBudgetManager {
    constructor() {
        this.items = [];
    }

    on(event, cb) {
        callback = cb;
    }

    get changedEvent() {
        return 'changed';
    }

    getFilteredItems() {
        return [];
    }
}

mock('../budgetManager', { budgetManager: new MockBudgetManager() });

const { CategoryManager } = require('../categoryManager');
const {
    getCategories,
    getCategory,
    addCategory,
    updateCategories
} = require('../../common/eventNames');

describe('category manager', () => {
    let manager, response;

    beforeEach(() => {
        registeredEvents = new Map();
        manager = new CategoryManager();
    });

    describe('when manager is started', () => {
        beforeEach(() => {
            manager.start();
        });

        it('should register the proper events', () => {
            expect(registeredEvents.size).to.equal(4);
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
                expect(manager.categoryMap.get('something')).to.be.an('array');
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
                expect(manager.categoryMap.get('My Cat')).to.be.an('array');
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
                    expect(response.allocated).to.equal(750);
                });

                it('should return the correct category', () => {
                    expect(response.name).to.equal('My Cat');
                });

                it('should return the correct rollover', () => {
                    expect(response.rollover).to.equal(false);
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
                    expect(manager.categoryMap.get('My Cat')[0].allocated).to.equal(150);
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
                expect(manager.categoryMap.get('My Cat')).to.be.an('array');
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
                    expect(response.allocated).to.equal(1500);
                });

                it('should return the correct category', () => {
                    expect(response.name).to.equal('My Cat');
                });

                it('should return the correct rollover', () => {
                    expect(response.rollover).to.equal(true);
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
                expect(response[0].name).to.equal('My Cat');
                expect(response[1].name).to.equal('My Cat2');
            });
        });

        describe('persistence', () => {
            describe('when manager is loaded', () => {
                beforeEach(() => {
                    let persist = {
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
                    }

                    manager.fromSimpleObject(persist);
                });

                it('should have the correct items', () => {
                    expect(manager.categoryMap.size).to.equal(2);
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
                    expect(response.categories).to.be.an('object');
                    expect(response.categories['My Cat'][0].allocated).to.equal(750);
                    expect(response.categories['My Cat2'][0].allocated).to.equal(150);
                })
            });
        });
    });
});