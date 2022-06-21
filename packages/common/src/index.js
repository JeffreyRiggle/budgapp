const {
    convertToNumeric,
    convertToDisplay,
    isValid
} = require('./currencyConversion');

const eventNames = require('./eventNames');

module.exports = {
    ...eventNames,
    convertToDisplay,
    convertToNumeric,
    isValid
};
