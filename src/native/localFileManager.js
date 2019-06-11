const os = require('os');
const fs = require('fs');
const crypto = require('crypto');

class LocalFileManager {
    save(file, saveData) {
        fs.writeFileSync(file, saveData);
    }

    ensureFile(file, defaultContent) {
        if (fs.existsSync(file)) {
            return;
        }

        fs.writeFileSync(file, defaultContent, {mode: 0o755});
    }

    load(path) {
        return fs.readFileSync(path);
    }
}

module.exports = {
    LocalFileManager
};