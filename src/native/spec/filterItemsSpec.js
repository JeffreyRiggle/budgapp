const expect = require('chai').expect;
const {filter} = require('../filterItems');
const moment = require('moment');

describe('FilterItems', () => {
    let filterRequest, result, items;

    beforeEach(() => {
        filterRequest = {};
    });

    describe('when filter is or', () => {
        beforeEach(() => {
            filterRequest.type = 'or';
        });

        describe('and filter is equal', () => {
            beforeEach(() => {
                items = [
                    { test: 'foo' },
                    { test: 'bar' },
                    { test: 'baz' }
                ];

                filterRequest.filters = [
                    {
                        type: 'equals',
                        filterProperty: 'test',
                        expectedValue: 'foo'
                    },
                    {
                        type: 'equals',
                        filterProperty: 'test',
                        expectedValue: 'bar'
                    }
                ];

                result = filter(items, filterRequest);
            });

            it('should not contain baz item', () => {
                expect(result).not.to.contain({ test: 'baz' });
            });

            it('should have the right number of items', () => {
                expect(result.length).to.equal(2);
            });
        });

        describe('and filter is month', () => {
            beforeEach(() => {
                items = [
                    { date: Date.now() },
                    { date: moment(Date.now()).add('month', 1).toDate() },
                    { date: moment(Date.now()).add('month', 3).toDate() }
                ];

                filterRequest.filters = [
                    {
                        type: 'month',
                        date: Date.now()
                    },
                    {
                        type: 'month',
                        date: moment(Date.now()).add('month', 1).toDate()
                    }
                ];

                result = filter(items, filterRequest);
            });

            it('should have the right number of items', () => {
                expect(result.length).to.equal(2);
            });
        });

        describe('and filter is date range', () => {

        });

        describe('and type is invalid', () => {

        });
    });

    describe('when filter is and', () => {
        beforeEach(() => {
            filterRequest.type = 'and';
        });

        describe('and filter is equal', () => {

        });

        describe('and filter is month', () => {

        });

        describe('and filter is date range', () => {

        });

        describe('and type is invalid', () => {

        });
    });
});