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
                expect(result).not.toContain({ test: 'baz' });
            });

            it('should have the right number of items', () => {
                expect(result.length).toBe(2);
            });
        });

        describe('and filter is like', () => {
            beforeEach(() => {
                items = [
                    { test: 'foo' },
                    { test: 'bar' },
                    { test: 'baz' }
                ];

                filterRequest.filters = [
                    {
                        type: 'like',
                        filterProperty: 'test',
                        expectedValue: 'f'
                    },
                    {
                        type: 'like',
                        filterProperty: 'test',
                        expectedValue: 'r'
                    }
                ];

                result = filter(items, filterRequest);
            });

            it('should not contain baz item', () => {
                expect(result).not.toContain({ test: 'baz' });
            });

            it('should have the right number of items', () => {
                expect(result.length).toBe(2);
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
                expect(result.length).toBe(2);
            });
        });

        describe('and filter is date range', () => {
            beforeEach(() => {
                items = [
                    { date: Date.now() },
                    { date: moment(Date.now()).add('month', 1).toDate() },
                    { date: moment(Date.now()).add('month', 3).toDate() }
                ];

                filterRequest.filters = [
                    {
                        type: 'daterange',
                        start: moment(Date.now()).subtract('month', 1).toDate(),
                        end: Date.now()
                    },
                    {
                        type: 'daterange',
                        start: moment(Date.now()).add('month', 2).toDate(),
                        end: moment(Date.now()).add('month', 4).toDate()
                    }
                ];

                result = filter(items, filterRequest);
            });

            it('should have the right number of items', () => {
                expect(result.length).toBe(2);
            });
        });

        describe('and type is invalid', () => {
            beforeEach(() => {
                items = [
                    {name: 'test'}
                ]

                filterRequest.filters = [
                    {
                        type: 'something',
                        data: 'test'
                    },
                    {
                        type: 'foo',
                        foo: 'bar'
                    }
                ]

                result = filter(items, filterRequest);
            });

            it('should not have any items', () => {
                expect(result.length).toBe(0);
            });
        });
    });

    describe('when filter is and', () => {
        beforeEach(() => {
            filterRequest.type = 'and';
        });

        describe('and filter is equal', () => {
            beforeEach(() => {
                items = [
                    { test: 'foo', test2: 'bar' },
                    { test: 'bar', test2: 'baz' },
                    { test: 'baz', test2: 'foo' }
                ];

                filterRequest.filters = [
                    {
                        type: 'equals',
                        filterProperty: 'test',
                        expectedValue: 'foo'
                    },
                    {
                        type: 'equals',
                        filterProperty: 'test2',
                        expectedValue: 'bar'
                    }
                ];

                result = filter(items, filterRequest);
            });

            it('should contain the foo item', () => {
                expect(result).not.toContain({ test: 'foo', test2: 'bar' });
            });

            it('should have the right number of items', () => {
                expect(result.length).toBe(1);
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
                expect(result.length).toBe(0);
            });
        });

        describe('and filter is date range', () => {
            beforeEach(() => {
                items = [
                    { date: Date.now() },
                    { date: moment(Date.now()).add('month', 1).toDate() },
                    { date: moment(Date.now()).add('month', 3).toDate() }
                ];

                filterRequest.filters = [
                    {
                        type: 'daterange',
                        start: moment(Date.now()).subtract('month', 1).toDate(),
                        end: Date.now()
                    },
                    {
                        type: 'daterange',
                        start: moment(Date.now()).subtract('month', 1).toDate(),
                        end: moment(Date.now()).add('month', 1).toDate()
                    }
                ];

                result = filter(items, filterRequest);
            });

            it('should have the right number of items', () => {
                expect(result.length).toBe(1);
            });
        });

        describe('and type is invalid', () => {
            beforeEach(() => {
                items = [
                    {name: 'test'}
                ]

                filterRequest.filters = [
                    {
                        type: 'something',
                        data: 'test'
                    },
                    {
                        type: 'foo',
                        foo: 'bar'
                    }
                ]

                result = filter(items, filterRequest);
            });

            it('should not have any items', () => {
                expect(result.length).toBe(0);
            });
        });
    });
});