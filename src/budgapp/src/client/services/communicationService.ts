import { client } from '@jeffriggle/ipc-bridge-client';

export class CommunicationService {
    get nativeClientAvailable(): boolean {
        return client.available;
    }

    sendMessage<TData, TResult>(eventName: string, data: TData): Promise<TResult> {
        if (client.available) {
            return client.sendMessage(eventName, data);
        }

        // TODO figure this out
        return Promise.resolve({} as TResult);
    }

    addAvailableListener(handler: (available: boolean) => void): void {
        client.on(client.availableChanged, handler);
    }

    removeAvailableListener(handler: (available: boolean) => void): void {
        client.removeListener(client.availableChanged, handler);
    }
}

const service = new CommunicationService();

export default service;