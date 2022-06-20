const _ = require('lodash');
const moment = require('moment');

function testEqualFilter(item, filter) {
    const val = item[filter.filterProperty];
    return val === filter.expectedValue;
}

function testLikeFilter(item, filter) {
    const val = item[filter.filterProperty];
    return new RegExp(filter.expectedValue, 'i').test(val);
}

function testMonthFilter(item, filter) {
    const testMonth = moment(filter.date).format('MM/YYYY');
    return moment(item.date).format('MM/YYYY') === testMonth;
}

function testDateRange(item, filter) {
    let date = item.date;
    if (!Number.isInteger(date)) {
        date = new Date(date).getTime();
    }
    return date >= filter.start && date <= filter.end;
}

function testFilter(item, filter) {
    if (filter.type === 'equals') {
        return testEqualFilter(item, filter);
    }

    if (filter.type === 'like') {
        return testLikeFilter(item, filter);
    }

    if (filter.type === 'month') {
        return testMonthFilter(item, filter);
    }

    if (filter.type === 'daterange') {
        return testDateRange(item, filter);
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