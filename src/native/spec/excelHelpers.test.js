const { numberToColumn } = require('../excelHelpers');

describe('Excel Helpers', () => {
    describe('number to column', () => {
        let result;

        describe('when the number is less than 26', () => {
            beforeEach(() => {
                result = numberToColumn(3);
            });

            it('should return a single letter column', () => {
                expect(result).toBe('C');
            });
        });

        describe('when the number is greater than 26', () => {
            beforeEach(() => {
                result = numberToColumn(82);
            });

            it('should return a double letter column', () => {
                expect(result).toBe('CB');
            });
        });

        describe('when the number is greater than 729', () => {
            beforeEach(() => {
                result = numberToColumn(1460);
            });

            it('should return a triple letter column', () => {
                expect(result).toBe('BAC');
            });
        });
    });
});
