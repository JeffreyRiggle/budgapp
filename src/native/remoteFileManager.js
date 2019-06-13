const http = require('http');

class RemoteFileManager {
    save() {
        throw new Error('Invalid operation on remote file manager');
    }

    load(location) {
        return new Promise((resolve, reject) => {
            let req = http.request(location, res => {
                res.on('data', chunck => {
                    data += chunck;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
    
            req.on('error', e => {
                reject(e);
            });
    
            req.end();
        });
    }
}

module.exports = {
    RemoteFileManager
}