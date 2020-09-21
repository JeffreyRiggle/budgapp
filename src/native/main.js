const { app, BrowserWindow, dialog } = require('electron');
const { setup, save } = require('./app');
const { start } = require('@jeffriggle/ipc-bridge-server');

const shouldSave = !process.argv.includes('--no-save');
const autoSave = process.argv.includes('--auto-save');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  start();
  setup();

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile('build/index.html');
  }

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('close', function () {
    if (!shouldSave) {
      return;
    }

    if (autoSave) {
      save();
      return;
    }

    const choice = dialog.showMessageBoxSync(this, {
      type: 'question',
      buttons: ['Close Without saving', 'Save'],
      title: "Save before closing",
      message: 'Would you like to save before closing this application?',
    });
  
    if (choice === 1) {
      save();
    }
  });

  mainWindow.on('closed', function(e) {
    mainWindow = null
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function (e) {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})