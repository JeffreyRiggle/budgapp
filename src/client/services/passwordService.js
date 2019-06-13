import { client } from '@jeffriggle/ipc-bridge-client';
import EventEmitter from 'events';
import { passwordNeeded, passwordProvided } from '../../common/eventNames';

let pending = true;
let required = true;

function checkPasswordProvided(result) {
    required = !result.success;
}

function handlePasswordRequired(req) {
    pending = false;
    required = req;
}

class PasswordService extends EventEmitter {
    constructor() {
        super();

        this.boundAvailableChanged = this.availableChanged.bind(this);
        this._setup();
    }

    _setup() {
        if (client.available) {
            client.sendMessage(passwordNeeded, null).then((req) => {
                handlePasswordRequired(req);
                this.emit(this.pendingChanged, this.pending);
                this.emit(this.requiredChanged, this.required);
            });
        } else {
            client.on(client.availableChanged, this.boundAvailableChanged);
        }
    }

    availableChanged(value) {
        if (value) {
            client.sendMessage(passwordNeeded, null).then((req) => {
                handlePasswordRequired(req);
                this.emit(this.pendingChanged, this.pending);
                this.emit(this.requiredChanged, this.required);
            });
            client.removeListener(client.availableChanged, this.boundAvailableChanged);
        }
    }

    get pending() {
        return pending;
    }

    get required() {
        return required;
    }

    get pendingChanged() {
        return 'pendingchanged';
    }

    get requiredChanged() {
        return 'requiredchanged';
    }

    sendPassword(password, callback) {
        client.sendMessage(passwordProvided, password).then(result => {
            checkPasswordProvided(result);
            callback(result);
            this.emit(this.requiredChanged, this.required);
        });
    }
}

export default new PasswordService();