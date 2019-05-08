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
    beforeEach(() => {
        registeredEvents = new Map();
        broadcasts = new Map();
    });

    describe('when manager is started', () => {
        beforeEach(() => {
            budgetManager.start();
        });

        describe('when a budget add is called', () => {
            let item1, updateCount, updateMessage, updateFun;

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

                let addItems = registeredEvents.get(addBudgetItems);
                addItems(undefined, [item1]);
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
    });
});