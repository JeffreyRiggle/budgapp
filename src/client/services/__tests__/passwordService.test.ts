import passwordService, { PasswordProvidedResult, PasswordService } from '../passwordService';
import { passwordNeeded, passwordProvided } from '../../../common/eventNames';
import { client } from '@jeffriggle/ipc-bridge-client';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        available: true,
        sendMessage: () => Promise.resolve()
    }
}));

describe('Password Service', () => {
    let cb: (result: PasswordProvidedResult) => void;
    let requiredListener: (result: boolean) => void;
    let service: PasswordService;

    beforeEach(() => {
        (client.sendMessage as any) = jest.fn().mockImplementation((eventName: string) => {
            if (eventName === 'passwordNeeded') {
                return Promise.resolve(true)
            }

            if (eventName === 'passwordProvided') {
                return Promise.resolve({ success: true });
            }

            return Promise.resolve();
        });

        cb = jest.fn();
        requiredListener = jest.fn();
        service = new PasswordService();

        service.on(passwordService.requiredChanged, requiredListener);
    });

    it('should have the correct required state', () => {
        expect(service.required).toBe(true);
    });

    describe('when a password is sent', () => {
        beforeEach(() => {
            service.sendPassword('pass', cb);
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