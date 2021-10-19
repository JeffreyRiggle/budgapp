const { app, dialog, Menu } = require('electron');

const { processXlsx, saveXlsx } = require('./xlsxProcessor');
const { writeFileSync } = require('fs');
const { category, income } = require('./app');
const { budgetManager } = require('./budgetManager');

function importExcelFile() {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then((fileData) => {
    const result = processXlsx(fileData.filePaths[0]);
    writeFileSync('debugbudget.json', JSON.stringify(result, null, 2));
    category.fromSimpleObject(result);
    budgetManager.fromSimpleObject(result.items);
    income.fromSimpleObject(result.income);
  })
}

function exportExcelFile() {
  dialog.showSaveDialog({
    filters: [{ name: 'Excel', extensions: ['.xlsx'] }]
  }).then(result => {
    saveXlsx(result.filePath, {
      items: budgetManager.toSimpleObject(),
      categories: category.toSimpleObject(),
      income: income.toSimpleObject()
    });
  });
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
