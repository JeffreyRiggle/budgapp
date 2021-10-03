const { readFile } = require('xlsx');

const IS_HEADER_CELL = /^[A-Z]+1$/;
const CELL_KEY = /^([A-Z]+)\d+$/;
const CELL_INDEX = /^[A-Z]+(\d+)$/;
const SHEET_DETAIL = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\d{4})$/i;

function processSheet(sheet, date) {
    let categories = [];
    const budgetRow = Object.keys(sheet).filter(k => {
        return sheet[k].v === 'Assumed Budget'
    }).map(k => {
        return CELL_INDEX.exec(k)[1];
    })[0];

    Object.keys(sheet).forEach(k => {
        if (!IS_HEADER_CELL.test(k)) {
            return;
        }
        categories.push({
            name: sheet[k].v,
            date,
            amount: sheet[`${CELL_KEY.exec(k)[1]}${budgetRow}`].v,
        });
    });

    categories = categories.map(c => ({
        name: c.name,
        date,
        amount: c.amount
    }));

    return {
        categories
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
        case 'dev':
            return '12';
        default:
            return null;
    }
}
function processXlsx(file) {
    const workbook = readFile(file);
    let retVal = {
        categories: []
    }

    Object.keys(workbook.Sheets).forEach(sheet => {
        const match = SHEET_DETAIL.exec(sheet);
        if (!match) {
            return;
        }
        const sheetData = processSheet(workbook.Sheets[sheet], `${toMonth(match[1].toLowerCase())}/${match[2]}`);
        retVal.categories.push(...sheetData.categories);
    })

    return retVal;
}

module.exports = {
    processXlsx
};
