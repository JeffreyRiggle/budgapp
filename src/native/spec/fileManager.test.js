const { registerEvent, broadcast } = require('@jeffriggle/ipc-bridge-server');
const { writeFileSync, readFileSync } = require('fs');
const { LocalFileManager } = require('../localFileManager');
const { FileManager } = require('../fileManager');
const {
    fileLocation,
    setPassword
} = require('../../common/eventNames');

jest.mock('@jeffriggle/ipc-bridge-server', () => ({ 
    registerEvent: jest.fn(),
    broadcast: jest.fn(),
}));

jest.mock('fs', () => ({
    existsSync: () => {
        return true;
    },
    writeFileSync: jest.fn(),
    readFileSync: jest.fn(),
}));

jest.mock('../localFileManager', () => {
    return {
        LocalFileManager: jest.fn()
    };
});

describe('FileManager', () => {
    let manager, response;
    let registeredEvents, broadcasts, contents, mockFileLocation, localFileLocation, localFileContent;

    beforeEach(() => {
        const instance = { save: jest.fn(), load: jest.fn() };
        LocalFileManager.mockImplementation(() => {
            return instance;
        });

        mockFileLocation = 'foolocation/budget.json';
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
        writeFileSync.mockImplementation((location, data) => {
            contents = data;
        });
        readFileSync.mockImplementation(() => {
            return `{"budgetFile": "${mockFileLocation}", "storageType": "local"}`;
        });
        const managerInstance = new LocalFileManager();
        managerInstance.save.mockImplementation((lfLocation, lfContent) => {
            localFileLocation = lfLocation;
            localFileContent = lfContent;
        });
        managerInstance.load.mockImplementation((lPath) => {
            localFileLocation = lPath;
        });

        manager = new FileManager();
    });

    describe('when file location is requested', () => {
        beforeEach(() => {
            response = registeredEvents.get(fileLocation)();
        });

        it('should return the correct value', () => {
            expect(response).toBe('foolocation/budget.json');
        });
    });

    describe('when file location is changed', () => {
        beforeEach(() => {
            manager.updateFilePath('foo2location/budget.json');
        });

        it('should update the settings file', () => {
            expect(localFileContent).toBe('{"budgetFile":"foo2location/budget.json","storageType":"local"}');
        });

        it('should update the current location', () => {
            expect(manager.settings.budgetFile).toBe('foo2location/budget.json');
        });

        it('should have the correct storage type', () => {
            expect(manager.settings.storageType).toBe('local');
        });
    });

    describe('when file is saved', () => {
        beforeEach(() => {
            manager.saveFile({
                prop: 'test'
            });
        });

        it('should save the contents', () => {
            expect(localFileContent).toBe('{"prop":"test"}');
        });
    });

    describe('when password is set', () => {
        beforeEach(() => {
            registeredEvents.get(setPassword)(undefined, 'supersecret');
        });

        it('should set the password', () => {
            expect(manager.password).toBe('supersecret');
        });
    });
});