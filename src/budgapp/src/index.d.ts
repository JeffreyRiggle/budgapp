declare module '@jeffriggle/ipc-bridge-client' {
    declare interface IClient {
        available: boolean;
        availableChanged: string;
        on(eventName: string, callback: (available: boolean) => void): void;
        removeListener(eventName: string, callback: (available: boolean) => void): void;
        sendMessage<TData, TResult>(eventName: string, data: TData): Promise<T>;
    }

    declare const client: IClient;
}