import { client } from '@jeffriggle/ipc-bridge-client';

export class CommunicationService {
    private handlers = new Map<string, Function>();

    get nativeClientAvailable(): boolean {
        return client.available;
    }

    sendMessage<TData, TResult>(eventName: string, data: TData): Promise<TResult> {
        if (client.available) {
            return client.sendMessage(eventName, data);
        }

        const handler = this.handlers.get(eventName);
        if (!handler) {
            console.error('Unable to find handler for ', eventName);
            return Promise.reject();
        }

        return handler(data);
    }

    addAvailableListener(handler: (available: boolean) => void): void {
        client.on(client.availableChanged, handler);
    }

    removeAvailableListener(handler: (available: boolean) => void): void {
        client.removeListener(client.availableChanged, handler);
    }

    registerHandler<TData, TResult>(eventName: string, handler: (data: TData) => Promise<TResult>): void {
        this.handlers.set(eventName, handler);
    }
}

const service = new CommunicationService();

export default service;