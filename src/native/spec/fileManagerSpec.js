const expect = require('chai').expect;
const mock = require('mock-require');

let registeredEvents, broadcasts, contents, mockFileLocation, localFileLocation, localFileContent;

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
    },
    readFileSync: () => {
        return `{"budgetFile": "${mockFileLocation}", "storageType": "local"}`;
    }
});

class MockLocalFileManager {
    save(lfLocation, lfContent) {
        localFileLocation = lfLocation;
        localFileContent = lfContent;
    }

    load(lPath) {
        localFileLocation = lPath;
    }
}

mock('../localFileManager', {
    LocalFileManager: MockLocalFileManager
});

const {FileManager} = require('../fileManager');
const {
    fileLocation,
    setPassword
} = require('../../common/eventNames');

describe('FileManager', () => {
    let manager, response;

    beforeEach(() => {
        mockFileLocation = 'foolocation/budget.json';
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
            manager.updateFilePath('foo2location/budget.json');
        });

        it('should update the settings file', () => {
            expect(localFileContent).to.equal('{"budgetFile":"foo2location/budget.json","storageType":"local"}');
        });

        it('should update the current location', () => {
            expect(manager.settings.budgetFile).to.equal('foo2location/budget.json');
        });

        it('should have the correct storage type', () => {
            expect(manager.settings.storageType).to.equal('local');
        });
    });

    describe('when file is saved', () => {
        beforeEach(() => {
            manager.saveFile({
                prop: 'test'
            });
        });

        it('should save the contents', () => {
            expect(localFileContent).to.equal('{"prop":"test"}');
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