import scoreClass from '../calculateScoreClass';

describe('Calculate score class', () => {
    let result: string;

    describe('when remaining income is greater than 5 percent', () => {
        beforeEach(() => {
            result = scoreClass(1000, 400);
        });

        it('should have a warn score', () => {
            expect(result).toBe('warn-score');
        });
    });

    describe('when remaining income is less than 5 percent', () => {
        beforeEach(() => {
            result = scoreClass(1000, 990);
        });

        it('should have a good score', () => {
            expect(result).toBe('good-score');
        });
    });

    describe('when remaining income is negative', () => {
        beforeEach(() => {
            result = scoreClass(1000, 1200);
        });

        it('should have a bad score', () => {
            expect(result).toBe('bad-score');
        });
    });
});