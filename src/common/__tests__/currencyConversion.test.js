import {
    convertToNumeric,
    convertToDisplay,
    isValid
} from '../currencyConversion';

describe('currency conversion', () => {
    let result;

    describe('when isValid is called', () => {
        describe('and value is an integer', () => {
            beforeEach(() => {
                result = isValid(20);
            });

            it('should return true', () => {
                expect(result).toBe(true);
            });
        });

        describe('and value is a decimal number in string form', () => {
            beforeEach(() => {
                result = isValid('20.00');
            });

            it('should return true', () => {
                expect(result).toBe(true);
            });
        });

        describe('and value is a number in string form', () => {
            beforeEach(() => {
                result = isValid('20');
            });

            it('should return true', () => {
                expect(result).toBe(true);
            });
        });

        describe('and value is a string', () => {
            beforeEach(() => {
                result = isValid('foobar');
            });

            it('should return true', () => {
                expect(result).toBe(false);
            });
        });
    });

    describe('when converToDisplay is called', () => {
        describe('and value is zero', () => {
            beforeEach(() => {
                result = convertToDisplay(0);
            });

            it('should return the correct display value', () => {
                expect(result).toBe('0');
            });
        });

        describe('and value is a single digit', () => {
            beforeEach(() => {
                result = convertToDisplay(5);
            });

            it('should return the correct display value', () => {
                expect(result).toBe('0.05');
            });
        });

        describe('and value is two digits', () => {
            beforeEach(() => {
                result = convertToDisplay(52);
            });

            it('should return the correct display value', () => {
                expect(result).toBe('0.52');
            });
        });

        describe('and value is three digits', () => {
            beforeEach(() => {
                result = convertToDisplay(525);
            });

            it('should return the correct display value', () => {
                expect(result).toBe('5.25');
            });
        });
    });

    describe('when converToNumeric is called', () => {
        describe('and input is empty string', () => {
            beforeEach(() => {
                result = convertToNumeric('');
            });

            it('should return zero', () => {
                expect(result).toBe(0);
            });
        });

        describe('and input does not include decimal', () => {
            beforeEach(() => {
                result = convertToNumeric('20');
            });

            it('should return the correct number in cents', () => {
                expect(result).toBe(2000);
            });
        });

        describe('and input includes a decimal', () => {
            beforeEach(() => {
                result = convertToNumeric('20.05');
            });

            it('should return the correct number in cents', () => {
                expect(result).toBe(2005);
            });
        });

        describe('and input is a single precision decimal', () => {
            beforeEach(() => {
                result = convertToNumeric('20.5');
            });

            it('should return the correct number in cents', () => {
                expect(result).toBe(2050);
            });
        });

        describe('and input includes a comma', () => {
            beforeEach(() => {
                result = convertToNumeric('2,000.05');
            });

            it('should return the correct number in cents', () => {
                expect(result).toBe(200005);
            });
        });
    });
});