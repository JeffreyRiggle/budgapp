const expect = require('chai').expect;
const mock = require('mock-require');

let registeredEvents, broadcasts, contents;

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

mock('fs', {
    existsSync: () => {
        return true;
    },
    writeFileSync: (location, data) => {
        contents = data;
    }
});

const {FileManager} = require('../fileManager');
const {
    fileLocation,
    setFileLocation,
    setPassword
} = require('../../common/eventNames');

describe('FileManager', () => {
    let manager, response;

    beforeEach(() => {
        process.env.BUDGAPPFILE = 'foolocation/budget.json';
        registeredEvents = new Map();
        manager = new FileManager();
    });

    describe('when file location is requested', () => {
        beforeEach(() => {
            response = registeredEvents.get(fileLocation)();
        });

        it('should return the correct value', () => {
            expect(response).to.equal('foolocation/budget.json');
        });
    });

    describe('when file location is changed', () => {
        beforeEach(() => {
            registeredEvents.get(setFileLocation)(undefined, 'foo2location/budget.json');
        });

        it('should update the process', () => {
            expect(process.env.BUDGAPPFILE).to.equal('foo2location/budget.json');
        });

        it('should update the current location', () => {
            expect(manager.currentBudgetFile).to.equal('foo2location/budget.json');
        });
    });

    describe('when file is saved', () => {
        beforeEach(() => {
            manager.saveFile({
                prop: 'test'
            });
        });

        it('should save the contents', () => {
            expect(contents).to.equal('{"prop":"test"}');
        });
    });

    describe('when password is set', () => {
        beforeEach(() => {
            registeredEvents.get(setPassword)(undefined, 'supersecret');
        });

        it('should set the password', () => {
            expect(manager.password).to.equal('supersecret');
        });
    });
});