const _ = require('lodash');
const moment = require('moment');

function testEqualFilter(item, filter) {
    let val = item[filter.filterProperty];
    return val === filter.expectedValue;
}

function testMonthFilter(item, filter) {
    let testMonth = moment(filter.date).format('MM/YYYY');
    return moment(item.date).format('MM/YYYY') === testMonth;
}

function testFilter(item, filter) {
    if (filter.type === 'equals') {
        return testEqualFilter(item, filter);
    }

    if (filter.type === 'month') {
        return testMonthFilter(item, filter);
    }

    return false;
}

function orFilter(item, filters) {
    let retVal = false;
    filters.forEach(filter => {
        if (testFilter(item, filter)) {
            retVal = true;
        }
    })

    return retVal;
}

function andFilter(item, filters) {
    let retVal = true;
    filters.forEach(filter => {
        if (!testFilter(item, filter)) {
            retVal = false;
        }
    })

    return retVal;
}

const filter = (items, filter) => {
    return _.filter(items, (item) => {
        if (filter.type === 'or') {
            return orFilter(item, filter.filters);
        } else {
            return andFilter(item, filter.filters);
        }
    });
}

module.exports = {
    filter
}