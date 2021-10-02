const { app, dialog, Menu } = require('electron');

const { readFile } = require('xlsx');
const { writeFileSync } = require('fs');

function importExcelFile() {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then((fileData) => {
    const workbook = readFile(fileData.filePaths[0]);
    writeFileSync('parsed.json', JSON.stringify(workbook, null, 2));
  })
}
  
function exportExcelFile() {
  
}

function applyMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Import Excel',
          click: importExcelFile,
        },
        {
          label: 'Export Excel',
          click: exportExcelFile,
        },
        { 
          label: 'Exit',
          click: () => app.quit(),
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

module.exports = {
    applyMenu,
};
