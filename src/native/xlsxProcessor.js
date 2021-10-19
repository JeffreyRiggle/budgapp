const { readFile, utils, writeFile } = require('xlsx');
const { convertToNumeric } = require('../common/currencyConversion');

const IS_HEADER_CELL = /^[A-Z]+1$/;
const CELL_KEY = /^([A-Z]+)(\d+)$/;
const CELL_INDEX = /^[A-Z]+(\d+)$/;
const SHEET_DETAIL = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\d{4})$/i;

function getBudgetRow(sheet) {
    return Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Assumed Budget'
    }).map(k => {
        return CELL_INDEX.exec(k)[1];
    })[0];
}

function getIncomeMetadata(sheet) {
    const startIncome = CELL_KEY.exec(Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Income'
    })[0]);

    const incomeCell = startIncome[1];
    const incomeCellIndex = parseInt(startIncome[2], 10);
    const incomeValuesCell = String.fromCharCode(incomeCell.charCodeAt(0) + 1);

    const totalIncomeIndex = parseInt(Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Total'
    })[1].replace(/[A-Z]/, ''), 10);

    return {
        incomeCell,
        incomeCellIndex,
        incomeValuesCell,
        totalIncomeIndex,
    }
}

function processSheet(sheet, date) {
    let categories = {};
    const incomeItems = [];
    const budgetItems = [];

    const budgetRow = getBudgetRow(sheet);
    const incomeMetadata = getIncomeMetadata(sheet);

    Object.keys(sheet).forEach(k => {
        if (IS_HEADER_CELL.test(k)) {
            categories[sheet[k].v] = {
                date,
                allocated: convertToNumeric(String(sheet[`${CELL_KEY.exec(k)[1]}${budgetRow}`].v)),
            };
            return;
        }

        const match = CELL_KEY.exec(k);
        if (!match || !match[1]) {
            return;
        }

        const cellIndex = parseInt(match[2], 10);
        if (match[1] === incomeMetadata.incomeValuesCell && cellIndex < incomeMetadata.totalIncomeIndex && cellIndex > incomeMetadata.incomeCellIndex) {
            incomeItems.push({
                amount: convertToNumeric(String(sheet[k].v)),
                source: sheet[`${incomeMetadata.incomeCell}${cellIndex}`].v,
            });
            return;
        }

        if (cellIndex >= budgetRow - 1 || Number.isNaN(Number(sheet[k].v))) {
            return;
        }

        const dateParts = date.split('/');
        const detailCell = sheet[`${String.fromCharCode(match[1].charCodeAt(0) - 1)}${cellIndex}`];
        budgetItems.push({
            amount: convertToNumeric(String(sheet[k].v)),
            detail: detailCell ? detailCell.v : 'unknown',
            date: new Date(`${dateParts[0]}/1/${dateParts[1]}`),
            category: sheet[`${match[1]}1`].v
        });
    });

    return {
        categories,
        incomeItems,
        budgetItems,
    };
}

function toMonth(value) {
    switch(value) {
        case 'jan':
            return '01';
        case 'feb':
            return '02';
        case 'mar':
            return '03';
        case 'apr':
            return '04';
        case 'may':
            return '05';
        case 'jun':
            return '06';
        case 'jul':
            return '07';
        case 'aug':
            return '08';
        case 'sep':
            return '09';
        case 'oct':
            return '10';
        case 'nov':
            return '11';
        case 'dec':
            return '12';
        default:
            return null;
    }
}

function getExpectedIncome(sheet) {
    const budgetRow = Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Cumulative budget';
    })[0];

    const value = CELL_KEY.exec(budgetRow)[1];
    const newValue = String.fromCharCode(value.charCodeAt(0) + 1);
    const cell = budgetRow.replace(value, newValue);
    return convertToNumeric(String(sheet[cell].v));
}

function aggregateCategories(existingCategories, categories) {
    const retVal = existingCategories;
    Object.keys(categories).forEach(c => {
        let existing = retVal[c];
        if (!existing) {
            retVal[c] = [];
        }

        retVal[c].push(categories[c]);
    });
    return retVal;
}

function processXlsx(file) {
    const workbook = readFile(file);
    let retVal = {
        categories: {},
        income: {
            expectedIncome: 0,
            monthIncome: {}
        },
        items: []
    }

    Object.keys(workbook.Sheets).forEach(sheet => {
        if (sheet === 'Base') {
            retVal.income.expectedIncome = getExpectedIncome(workbook.Sheets[sheet]);
            return;
        }

        const match = SHEET_DETAIL.exec(sheet);
        if (!match) {
            return;
        }
        const monthDate = `${toMonth(match[1].toLowerCase())}/${match[2]}`;
        const sheetData = processSheet(workbook.Sheets[sheet], monthDate);
        retVal.categories = aggregateCategories(retVal.categories, sheetData.categories);
        retVal.income.monthIncome[monthDate] = sheetData.incomeItems;
        retVal.items.push(...sheetData.budgetItems);
    })

    return retVal;
}

function findDates(data) {
    return Object.keys(data.income.monthIncome || {});
}

function fromDate(date) {
    switch(date) {
        case '01':
            return 'JAN';
        case '02':
            return 'FEB';
        case '03':
            return 'MAR';
        case '04':
            return 'APR';
        case '05':
            return 'MAY';
        case '06':
            return 'JUN';
        case '07':
            return 'JUL';
        case '08':
            return 'AUG';
        case '09':
            return 'SEP';
        case '10':
            return 'OCT';
        case '11':
            return 'NOV';
        case '12':
            return 'DEC';
        default:
            return null;
    }
}

function convertToSheetName(date) {
    const parts = date.split('/');
    return `${fromDate(parts[0])}${parts[1]}`;
}

function saveXlsx(fileName, data) {
    const wb = utils.book_new();
    const dates = findDates(data);
    dates.forEach(d => {
        const sheet = utils.aoa_to_sheet([]);
        utils.book_append_sheet(wb, sheet, convertToSheetName(d));
    });
    writeFile(wb, fileName);
}

module.exports = {
    processXlsx,
    saveXlsx
};
