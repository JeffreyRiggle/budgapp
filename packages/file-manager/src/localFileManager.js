const fs = require('fs');

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
        return new Promise((resolve, reject) => {
            resolve(fs.readFileSync(path));
        })
    }
}

module.exports = {
    LocalFileManager
};