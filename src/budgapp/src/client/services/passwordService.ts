import { client } from '@jeffriggle/ipc-bridge-client';
import EventEmitter from 'events';
import { passwordNeeded, passwordProvided } from '@budgapp/common';

let pending = true;
let required = true;

export interface PasswordProvidedResult {
    success: boolean;
}

function checkPasswordProvided(result: PasswordProvidedResult) {
    required = !result.success;
}

function handlePasswordRequired(req: boolean) {
    pending = false;
    required = req;
}

export class PasswordService extends EventEmitter {
    boundAvailableChanged: (foo: any) => void;

    constructor() {
        super();

        this.boundAvailableChanged = this.availableChanged.bind(this);
        this._setup();
    }

    _setup(): void {
        if (client.available) {
            client.sendMessage<null, boolean>(passwordNeeded, null).then(req => {
                handlePasswordRequired(req);
                this.emit(this.pendingChanged, this.pending);
                this.emit(this.requiredChanged, this.required);
            });
        } else {
            client.on(client.availableChanged, this.boundAvailableChanged);
        }
    }

    availableChanged(value: boolean): void {
        if (value) {
            client.sendMessage<null, boolean>(passwordNeeded, null).then(req => {
                handlePasswordRequired(req);
                this.emit(this.pendingChanged, this.pending);
                this.emit(this.requiredChanged, this.required);
            });
            client.removeListener(client.availableChanged, this.boundAvailableChanged);
        }
    }

    get pending(): boolean {
        return pending;
    }

    get required(): boolean {
        return required;
    }

    get pendingChanged(): string {
        return 'pendingchanged';
    }

    get requiredChanged(): string {
        return 'requiredchanged';
    }

    sendPassword(password: string, callback: (result: PasswordProvidedResult) => void): void {
        client.sendMessage<string, PasswordProvidedResult>(passwordProvided, password).then(result => {
            checkPasswordProvided(result);
            callback(result);
            this.emit(this.requiredChanged, this.required);
        });
    }
}

export default new PasswordService();