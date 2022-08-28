const { BudgetManager } = require('../budgetManager');
const {
    addBudgetItems,
    updateBudgetItem,
    removeBudgetItem,
    getBudgetItems,
    filteredBudgetItems
} = require('@budgapp/common');

describe('budgetManager', () => {
    let manager;
    let item1, updateCount, updateMessage, updateFun, retVal, item2;

    beforeEach(() => {
        manager = new BudgetManager();
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

            manager.on(manager.changedEvent, updateFun);
            manager.addItems([item1]);
        });

        afterEach(() => {
            manager.removeListener(manager.changedEvent, updateFun);
            manager.items = [];
        });

        it('should add the item', () => {
            expect(manager.items).toContain(item1);
        });

        it('should give the item an id', () => {
            expect(updateMessage[0].id).toBeDefined();
        });

        it('should send an update', () => {
            expect(updateCount).toBe(1);
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

            manager.items = [item1];

            updateCount = 0;

            updateFun = (updateItems) => {
                updateCount++;
                updateMessage = updateItems;
            };

            manager.on(manager.changedEvent, updateFun);
        });

        afterEach(() => {
            manager.removeListener(manager.changedEvent, updateFun);
        });

        describe('with valid item', () => {
            beforeEach(() => {
                manager.removeItem(item1);
            });

            it('should remove the item', () => {
                expect(manager.items).not.toContain(item1);
            });

            it('should send an update', () => {
                expect(updateCount).toBe(1);
            });

            it('should have removed the item in the udpate', () => {
                expect(updateMessage.length).toBe(0);
            });
        });

        describe('with invalid item', () => {
            beforeEach(() => {
                manager.removeItem({ id: 500 })
            });

            it('should not remove the item', () => {
                expect(manager.items).toContain(item1);
            });

            it('should not send an update', () => {
                expect(updateCount).toBe(0);
            });
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

            manager.items = [item1, item2];
        });

        afterEach(() => {
            manager.items = [];
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

                retVal = manager.getFilteredItems(filter);
            });

            it('should not return any items', () => {
                expect(retVal.length).toBe(0);
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

                retVal = manager.getFilteredItems(filter);
            });

            it('should return all items', () => {
                expect(retVal.length).toBe(2);
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

                retVal = manager.getFilteredItems(filter);
            });

            it('should return some items', () => {
                expect(retVal.length).toBe(1);
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

            manager.items = [item1, item2];

            updateCount = 0;
            updateFun = () => { updateCount++; };
            manager.on(manager.changedEvent, updateFun);
        });

        afterEach(() => {
            manager.items = [];
            manager.removeListener(manager.changedEvent, updateFun);
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

                manager.tryUpdateItem(updateItem);
            });

            it('should update the item', () => {
                expect(manager.items).toContain(updateItem);
            });

            it('should update the amount to a number', () => {
                expect(Number.isInteger(updateItem.amount)).toBe(true);
            });

            it('should send an update', () => {
                expect(updateCount).toBe(1);
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

                manager.tryUpdateItem(updateItem);
            });

            it('should not update the items', () => {
                expect(manager.items).not.toContain(updateItem);
            });

            it('should not send an update', () => {
                expect(updateCount).toBe(0);
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

                    manager.fromSimpleObject([ item1, item2 ]);
                });

                afterEach(() => {
                    manager.items = [];
                });

                it('should have the correct item length', () => {
                    expect(manager.items.length).toBe(2);
                });

                it('should have the correct items', () => {
                    expect(manager.items).toContain(item1);
                    expect(manager.items).toContain(item2);
                });

                describe('when an item is added', () => {
                    beforeEach(() => {
                        item3 = {
                            amount: 1001,
                            description: 'something',
                            category: 'test',
                            date: Date.now()
                        };

                        manager.addItems([item3]);
                    });

                    it('should have the correct id', () => {
                        expect(item3.id).toBe(3);
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

                    manager.fromSimpleObject([ item1, item2 ]);
                });

                afterEach(() => {
                    manager.items = [];
                });

                it('should have the correct length', () => {
                    expect(manager.items.length).toBe(2);
                });

                it('should have the correct items', () => {
                    expect(manager.items).toContain(item1);
                    expect(manager.items).toContain(item2);
                });

                it('should apply ids to the items', () => {
                    expect(item1.id).toBe(0);
                    expect(item2.id).toBe(1);
                });

                describe('when an item is added', () => {
                    beforeEach(() => {
                        item3 = {
                            amount: 1001,
                            description: 'something',
                            category: 'test',
                            date: Date.now()
                        };

                        manager.addItems([item3]);
                    });

                    it('should have the correct id', () => {
                        expect(item3.id).toBe(2);
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

                    manager.fromSimpleObject([ item1, item2 ]);
                });

                afterEach(() => {
                    manager.items = [];
                });

                it('should have the correct item length', () => {
                    expect(manager.items.length).toBe(2);
                });

                it('should have the correct items', () => {
                    expect(manager.items).toContain(item1);
                    expect(manager.items).toContain(item2);
                });

                it('should update the item type', () => {
                    expect(item1.amount).toBe(100);
                    expect(item2.amount).toBe(10000);
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

                manager.items = [item1, item2];
                retVal = manager.toSimpleObject();
            });

            it('should have the correct return value', () => {
                expect(retVal).toBe(manager.items);
            });
        });
    });
});