const expect = require('chai').expect;
const mock = require('mock-require');

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

const {budgetManager} = require('../budgetManager');
const {
    addBudgetItems,
    updateBudgetItem,
    removeBudgetItem,
    budgetItemsChanged,
    getBudgetItems,
    filteredBudgetItems
} = require('../../common/eventNames');

describe('budgetManager', () => {
    let item1, updateCount, updateMessage, updateFun, retVal, item2;

    beforeEach(() => {
        registeredEvents = new Map();
        broadcasts = new Map();
    });

    describe('when manager is started', () => {
        beforeEach(() => {
            budgetManager.start();
        });

        describe('when a budget add is called', () => {
            beforeEach(() => {
                item1 = {
                    amount: 1,
                    description: 'this is a test',
                    category: 'something',
                    date: Date.now()
                };

                updateCount = 0;

                updateFun = (updateItems) => {
                    updateCount++;
                    updateMessage = updateItems;
                };

                budgetManager.on(budgetManager.changedEvent, updateFun);

                registeredEvents.get(addBudgetItems)(undefined, [item1]);
            });

            afterEach(() => {
                budgetManager.removeListener(budgetManager.changedEvent, updateFun);
                budgetManager.items = [];
            });

            it('should add the item', () => {
                expect(budgetManager.items).to.contain(item1);
            });

            it('should give the item an id', () => {
                expect(updateMessage[0].id).to.not.be.undefined;
            });

            it('should send an update', () => {
                expect(updateCount).to.equal(1);
            });

            it('should broadcast that event', () => {
                expect(broadcasts.get(budgetManager.changedEvent)[0].items.length).to.equal(1);
            });
        });

        describe('and remove is invoked', () => {
            beforeEach(() => {
                item1 = {
                    id: 1,
                    amount: 1,
                    description: 'this is a test',
                    category: 'something',
                    date: Date.now()
                };

                budgetManager.items = [item1];

                updateCount = 0;

                updateFun = (updateItems) => {
                    updateCount++;
                    updateMessage = updateItems;
                };

                budgetManager.on(budgetManager.changedEvent, updateFun);
            });

            afterEach(() => {
                budgetManager.removeListener(budgetManager.changedEvent, updateFun);
            });

            describe('with valid item', () => {
                beforeEach(() => {
                    registeredEvents.get(removeBudgetItem)(undefined, item1);
                });

                it('should remove the item', () => {
                    expect(budgetManager.items).to.not.contain(item1);
                });

                it('should send an update', () => {
                    expect(updateCount).to.equal(1);
                });

                it('should have removed the item in the udpate', () => {
                    expect(updateMessage.length).to.equal(0);
                });
            });

            describe('with invalid item', () => {
                beforeEach(() => {
                    registeredEvents.get(removeBudgetItem)(undefined, { id: 500 });
                });

                it('should not remove the item', () => {
                    expect(budgetManager.items).to.contain(item1);
                });

                it('should not send an update', () => {
                    expect(updateCount).to.equal(0);
                });
            });
        });

        describe('when get items is called', () => {
            beforeEach(() => {
                item1 = {
                    id: 1,
                    amount: 1,
                    description: 'this is a test',
                    category: 'something',
                    date: Date.now()
                };

                budgetManager.items = [item1];
                retVal = registeredEvents.get(getBudgetItems)();
            });

            afterEach(() => {
                budgetManager.items = [];
            });

            it('Should return the right items', () => {
                expect(retVal).to.equal(budgetManager.items);
            });
        });

        describe('filter items', () => {
            let filter;
            beforeEach(() => {
                item1 = {
                    id: 1,
                    amount: 1,
                    description: 'this is a test',
                    category: 'something',
                    date: Date.now()
                };

                item2 = {
                    id: 2,
                    amount: 100,
                    description: 'testing test test',
                    category: 'something',
                    date: Date.now()
                };

                budgetManager.items = [item1, item2];
            });

            afterEach(() => {
                budgetManager.items = [];
            });

            describe('when filter does not include items', () => {
                beforeEach(() => {
                    filter = {
                        type: 'and',
                        filters: [
                            {
                                type: 'equals',
                                filterProperty: 'category',
                                expectedValue: 'mycat'
                            }
                        ]
                    };

                    retVal = registeredEvents.get(filteredBudgetItems)(undefined, filter);
                });

                it('should not return any items', () => {
                    expect(retVal.length).to.equal(0);
                });
            });

            describe('when filter includes all items', () => {
                beforeEach(() => {
                    filter = {
                        type: 'and',
                        filters: [
                            {
                                type: 'equals',
                                filterProperty: 'category',
                                expectedValue: 'something'
                            }
                        ]
                    };

                    retVal = registeredEvents.get(filteredBudgetItems)(undefined, filter);
                });

                it('should return all items', () => {
                    expect(retVal.length).to.equal(2);
                });
            });

            describe('when filter includes some items', () => {
                beforeEach(() => {
                    filter = {
                        type: 'and',
                        filters: [
                            {
                                type: 'equals',
                                filterProperty: 'id',
                                expectedValue: 1
                            }
                        ]
                    };

                    retVal = registeredEvents.get(filteredBudgetItems)(undefined, filter);
                });

                it('should return some items', () => {
                    expect(retVal.length).to.equal(1);
                });
            });
        });

        describe('updating an item', () => {
            let updateItem;

            beforeEach(() => {
                item1 = {
                    id: 1,
                    amount: 1,
                    description: 'this is a test',
                    category: 'something',
                    date: Date.now()
                };

                item2 = {
                    id: 2,
                    amount: 100,
                    description: 'testing test test',
                    category: 'something',
                    date: Date.now()
                };

                budgetManager.items = [item1, item2];

                updateCount = 0;
                updateFun = () => { updateCount++; };
                budgetManager.on(budgetManager.changedEvent, updateFun);
            });

            afterEach(() => {
                budgetManager.items = [];
                budgetManager.removeListener(budgetManager.changedEvent, updateFun);
            });

            describe('when a valid item is updated', () => {
                beforeEach(() => {
                    updateItem = {
                        id: 1,
                        amount: '1000',
                        description: 'this is another test',
                        category: 'something',
                        date: Date.now()
                    };

                    registeredEvents.get(updateBudgetItem)(undefined, updateItem);
                });

                it('should update the item', () => {
                    expect(budgetManager.items).to.contain(updateItem);
                });

                it('should update the amount to a number', () => {
                    expect(Number.isInteger(updateItem.amount)).to.equal(true);
                });

                it('should send an update', () => {
                    expect(updateCount).to.equal(1);
                });
            });

            describe('when an invalid item is updated', () => {
                beforeEach(() => {
                    updateItem = {
                        id: 1000,
                        amount: 10,
                        description: 'this is another test',
                        category: 'something',
                        date: Date.now()
                    };

                    registeredEvents.get(updateBudgetItem)(undefined, updateItem);
                });

                it('should not update the items', () => {
                    expect(budgetManager.items).to.not.contain(updateItem);
                });

                it('should not send an update', () => {
                    expect(updateCount).to.equal(0);
                });
            });
        });

        describe('persistence', () => {
            describe('when budget manager is loaded from persistence', () => {
                let item3;
                describe('with ids and types', () => {
                    beforeEach(() => {
                        item1 = {
                            id: 1,
                            amount: 1,
                            description: 'this is a test',
                            category: 'something',
                            date: Date.now()
                        };
        
                        item2 = {
                            id: 2,
                            amount: 100,
                            description: 'testing test test',
                            category: 'something',
                            date: Date.now()
                        };

                        budgetManager.fromSimpleObject([ item1, item2 ]);
                    });

                    afterEach(() => {
                        budgetManager.items = [];
                    });

                    it('should have the correct item length', () => {
                        expect(budgetManager.items.length).to.equal(2);
                    });

                    it('should have the correct items', () => {
                        expect(budgetManager.items).to.contain(item1);
                        expect(budgetManager.items).to.contain(item2);
                    });

                    describe('when an item is added', () => {
                        beforeEach(() => {
                            item3 = {
                                amount: 1001,
                                description: 'something',
                                category: 'test',
                                date: Date.now()
                            };

                            registeredEvents.get(addBudgetItems)(undefined, [item3]);
                        });

                        it('should have the correct id', () => {
                            expect(item3.id).to.equal(3);
                        });
                    });
                });

                describe('with missing ids', () => {
                    beforeEach(() => {
                        item1 = {
                            amount: 1,
                            description: 'this is a test',
                            category: 'something',
                            date: Date.now()
                        };
        
                        item2 = {
                            amount: 100,
                            description: 'testing test test',
                            category: 'something',
                            date: Date.now()
                        };

                        budgetManager.fromSimpleObject([ item1, item2 ]);
                    });

                    afterEach(() => {
                        budgetManager.items = [];
                    });

                    it('should have the correct length', () => {
                        expect(budgetManager.items.length).to.equal(2);
                    });

                    it('should have the correct items', () => {
                        expect(budgetManager.items).to.contain(item1);
                        expect(budgetManager.items).to.contain(item2);
                    });

                    it('should apply ids to the items', () => {
                        expect(item1.id).to.equal(0);
                        expect(item2.id).to.equal(1);
                    });

                    describe('when an item is added', () => {
                        beforeEach(() => {
                            item3 = {
                                amount: 1001,
                                description: 'something',
                                category: 'test',
                                date: Date.now()
                            };

                            registeredEvents.get(addBudgetItems)(undefined, [item3]);
                        });

                        it('should have the correct id', () => {
                            expect(item3.id).to.equal(2);
                        });
                    });
                });

                describe('when incorrect amount types', () => {
                    beforeEach(() => {
                        item1 = {
                            id: 1,
                            amount: '1',
                            description: 'this is a test',
                            category: 'something',
                            date: Date.now()
                        };
        
                        item2 = {
                            id: 2,
                            amount: '100',
                            description: 'testing test test',
                            category: 'something',
                            date: Date.now()
                        };

                        budgetManager.fromSimpleObject([ item1, item2 ]);
                    });

                    afterEach(() => {
                        budgetManager.items = [];
                    });

                    it('should have the correct item length', () => {
                        expect(budgetManager.items.length).to.equal(2);
                    });

                    it('should have the correct items', () => {
                        expect(budgetManager.items).to.contain(item1);
                        expect(budgetManager.items).to.contain(item2);
                    });

                    it('should update the item type', () => {
                        expect(item1.amount).to.equal(100);
                        expect(item2.amount).to.equal(10000);
                    });
                });
            });

            describe('when budget manager is saved', () => {
                beforeEach(() => {
                    item1 = {
                        id: 1,
                        amount: 1,
                        description: 'this is a test',
                        category: 'something',
                        date: Date.now()
                    };
    
                    item2 = {
                        id: 2,
                        amount: 100,
                        description: 'testing test test',
                        category: 'something',
                        date: Date.now()
                    };
    
                    budgetManager.items = [item1, item2];
                    retVal = budgetManager.toSimpleObject();
                });

                it('should have the correct return value', () => {
                    expect(retVal).to.equal(budgetManager.items);
                });
            });
        });
    });
});