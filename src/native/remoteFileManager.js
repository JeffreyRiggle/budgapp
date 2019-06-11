class RemoteFileManager {
    save() {
        throw new Error('Invalid operation on remote file manager');
    }

    load(location) {
        
    }
}

module.exports = {
    RemoteFileManager
}