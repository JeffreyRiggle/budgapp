import passwordService from '../passwordService';
import { passwordNeeded, passwordProvided } from '../../../common/eventNames';
import { client } from '@jeffriggle/ipc-bridge-client';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        available: true,
        sendMessage: jest.fn((eventName) => {
            if (eventName === 'passwordNeeded') {
                return Promise.resolve(true)
            }

            if (eventName === 'passwordProvided') {
                return Promise.resolve({ success: true });
            }

            return Promise.resolve();
        })
    }
}));

describe('Password Service', () => {
    let cb, requiredListener;

    beforeEach(() => {
        cb = jest.fn();
        requiredListener = jest.fn();
        passwordService.on(passwordService.requiredChanged, requiredListener);
    });

    it('should have the correct required state', () => {
        expect(passwordService.required).toBe(true);
    });

    describe('when a password is sent', () => {
        beforeEach(() => {
            passwordService.sendPassword('pass', cb);
        });

        it('should send a password request', () => {
            expect(client.sendMessage).toHaveBeenCalledWith(passwordProvided, 'pass');
        });

        it('should invoke the callback', () => {
            expect(cb).toHaveBeenCalledWith({ success: true });
        });

        it('should emit a required changed event', () => {
            expect(requiredListener).toHaveBeenCalledWith(false);
        });
    });
});