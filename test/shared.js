
const Application = require('spectron').Application;
const electron = require('electron');
const path = require('path');

const createApp = async () => {
    return await new Application({
        path: electron,
        args: [path.join(__dirname, '..')]
    }).start();
};

module.exports = {
    createApp
};
