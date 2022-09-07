const validation = /^(\d{1,3},)*\d+(\.\d{1,2})*$/m

const convertToNumeric = (input) => {
    let retVal = input;
    if (!retVal) {
        return 0;
    }

    if (!retVal.includes('.')) {
        retVal += ".00";
    }

    const precision = retVal.split('.')[1].length;
    if (precision === 1) {
        retVal += '0';
    }

    retVal = retVal.replace('.', '');
    retVal = retVal.replace(',', '');

    return Number(retVal);
}

const convertToDisplay = (input) => {
    if (input === 0) {
        return '0'
    }

    let retVal = "" + input;
    let len = retVal.length;

    if (len === 1) {
        return `0.0${input}`
    }
    if (len === 2) {
        return `0.${input}`;
    }

    let decimalPlace = len - 2;
    retVal = `${retVal.substring(0, decimalPlace)}.${retVal.substring(decimalPlace, len)}`;

    return retVal;
}

const isValid = (input) => {
    if (Number.isInteger(input)) {
        return true;
    }

    return validation.test(input);
}

module.exports = {
    convertToNumeric,
    convertToDisplay,
    isValid
}