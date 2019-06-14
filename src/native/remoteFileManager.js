const http = require('http');
const https = require('https');
const isSecure = /https:\/\//i;

class RemoteFileManager {
    save() {
        throw new Error('Invalid operation on remote file manager');
    }

    ensureFile() {
        // no op
    }

    load(location) {
        return new Promise((resolve, reject) => {
            let req = this.createRequest(location, res => {
                let data = '';

                res.on('data', chunck => {
                    data += chunck;
                });
                res.on('end', () => {
                    console.log(`got file data ${data}`)
                    resolve(data);
                });
            });
    
            req.on('error', e => {
                reject(e);
            });
    
            req.end();
        });
    }

    createRequest(location, callback) {
        if (isSecure.test(location)) {
            return https.request(location, callback);
        }

        return http.request(location, callback);
    }
}

module.exports = {
    RemoteFileManager
}