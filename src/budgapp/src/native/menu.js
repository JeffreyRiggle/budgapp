const { app, dialog, Menu } = require('electron');

const { processXlsxFile, saveXlsx } = require('@budgapp/xlsx');
const { category, income } = require('./app');
const { budgetHandler } = require('./budgetHandler');

function importExcelFile() {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    if (result.canceled) {
      return;
    }

    const data = processXlsxFile(result.filePaths[0]);
    category.fromSimpleObject(data);
    budgetHandler.fromSimpleObject(data.items);
    income.fromSimpleObject(data.income);
  })
}

function exportExcelFile() {
  dialog.showSaveDialog({
    filters: [{ name: 'Excel', extensions: ['.xlsx'] }]
  }).then(result => {
    if (result.canceled) {
      return;
    }

    let savePath = result.filePath;

    if (!savePath.includes('.')) {
      savePath = savePath + '.xlsx';
    }
  
    saveXlsx(savePath, {
      items: budgetHandler.toSimpleObject(),
      categories: category.toSimpleObject().categories,
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
