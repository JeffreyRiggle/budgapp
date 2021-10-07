const { readFile } = require('xlsx');

const IS_HEADER_CELL = /^[A-Z]+1$/;
const CELL_KEY = /^([A-Z]+)(\d+)$/;
const CELL_INDEX = /^[A-Z]+(\d+)$/;
const SHEET_DETAIL = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\d{4})$/i;

function processSheet(sheet, date) {
    let categories = [];
    const incomeItems = [];

    const budgetRow = Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Assumed Budget'
    }).map(k => {
        return CELL_INDEX.exec(k)[1];
    })[0];

    const startIncome = CELL_KEY.exec(Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Income'
    })[0]);

    const incomeCell = startIncome[1];
    const incomeCellIndex = parseInt(startIncome[2], 10);
    const incomeValuesCell = String.fromCharCode(incomeCell.charCodeAt(0) + 1);

    const totalIncomeIndex = parseInt(Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Total'
    })[1].replace(/[A-Z]/, ''), 10);

    Object.keys(sheet).forEach(k => {
        if (IS_HEADER_CELL.test(k)) {
            categories.push({
                name: sheet[k].v,
                date,
                amount: sheet[`${CELL_KEY.exec(k)[1]}${budgetRow}`].v,
            });
        }

        const match = CELL_KEY.exec(k);
        if (!match || !match[1] || match[1] !== incomeValuesCell) {
            return;
        }

        const cellIndex = parseInt(match[2], 10);
        if (cellIndex >= totalIncomeIndex || cellIndex < incomeCellIndex) {
            return;
        }

        incomeItems.push({
            amount: parseInt(String(sheet[k].v).replace('.', ''), 10),
            source: sheet[`${incomeCell}${cellIndex}`].v,
        });
    });

    return {
        categories,
        incomeItems
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
    return parseInt(String(sheet[cell].v).replace('.', ''), 10);
}

function processXlsx(file) {
    const workbook = readFile(file);
    let retVal = {
        categories: [],
        income: {
            expectedIncome: 0,
            monthIncome: {}
        }
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
        retVal.categories.push(...sheetData.categories);
        retVal.income.monthIncome[monthDate] = sheetData.incomeItems;
    })

    return retVal;
}

module.exports = {
    processXlsx
};
