const { app, BrowserWindow, dialog } = require('electron');
const { setup, save } = require('./app');
const { start } = require('@jeffriggle/ipc-bridge-server');

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

  mainWindow.loadFile(`build/index.html`)
  //mainWindow.loadURL('http://localhost:3000');

  mainWindow.webContents.openDevTools()

  mainWindow.on('close', function () {
    const choice = dialog.showMessageBox(this, {
      type: 'question',
      buttons: ['Close Without saving', 'Save'],
      title: "Save before closing",
      message: 'Would you like to save before closing this application?',
    });
  
    if (choice === 1) {
      save();
    }
  });

  mainWindow.on('closed', function() {
    mainWindow = null
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})