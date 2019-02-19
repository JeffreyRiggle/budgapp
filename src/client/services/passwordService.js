import nativeService from './nativeService';
import EventEmitter from 'events';
let pending = true;
let required = true;

function passwordProvided(result) {
    required = !result.success;
}

function handlePasswordRequired(req) {
    pending = false;
    required = req;
}

class PasswordService extends EventEmitter {
    constructor() {
        super();

        nativeService.sendMessage('passwordNeeded', null, function(req) {
            handlePasswordRequired(req);
            this.emit(this.pendingChanged, this.pending);
            this.emit(this.requiredChanged, this.required);
        }.bind(this));
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
        nativeService.sendMessage('passwordProvided', password, function(result) {
            passwordProvided(result);
            callback(result);
            this.emit(this.requiredChanged, this.required);
        }.bind(this));
    }
}

export default new PasswordService();