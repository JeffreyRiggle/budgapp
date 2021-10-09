const { app, dialog, Menu } = require('electron');

const { processXlsx } = require('./xlsxProcessor');
const { writeFileSync } = require('fs');
const { category, income } = require('./app');
const { budgetManager } = require('./budgetManager');

function importExcelFile() {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then((fileData) => {
    const result = processXlsx(fileData.filePaths[0]);
    console.log(result.income);
    writeFileSync('debugbudget.json', JSON.stringify(result, null, 2));
    category.fromSimpleObject(result);
    budgetManager.fromSimpleObject(result.items);
    income.fromSimpleObject(result.income);
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
