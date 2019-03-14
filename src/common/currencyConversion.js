const validation = /^(\d{1,3},)*\d+(\.\d{1,2})*$/m

const convertToNumeric = (input) => {
    let retVal = input.replace('.', '');
    retVal = retVal.replace(',', '');

    return retVal;
}

const convertToDisplay = (input) => {
    let retVal = "" + input;

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