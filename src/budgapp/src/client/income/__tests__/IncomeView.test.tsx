import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IncomeView from '../IncomeView';
import moment from 'moment';
import { useExpectedIncome } from '../../hooks/use-expected-income';

jest.mock('../../hooks/use-month-income-items', () => ({
    useMonthIncomeItems: () => [
        {
            amount: 50000
        },
        {
            amount: 50000
        }
    ]
}));

jest.mock('../../hooks/use-expected-income', () => ({
    useExpectedIncome: jest.fn(),
}));

const useExpectedIncomeMock = useExpectedIncome as jest.MockedFunction<typeof useExpectedIncome>;

describe('Income View', () => {
    let component: RenderResult;
    let targetDate: string;

    function createComponent() {
        const mockMatch = {
            params: {},
            isExact: false,
            path: 'some/path',
            url: 'https://mock/path',
            history: {}
        };

        return render(<BrowserRouter><IncomeView match={mockMatch} location={{} as History.Location} history={{} as History.History}/></BrowserRouter>);
    }

    beforeEach(() => {
        targetDate = moment(Date.now()).format('MMMM');
    });

    describe('when income target is meet', () => {
        beforeEach(() => {
            useExpectedIncomeMock.mockReturnValue(100000);
            component = createComponent();
        });

        it('should have the correct month', () => {
            expect(component.container.querySelector('h1').textContent).toBe(`Income for ${targetDate}`);
        });
    
        it('should have the correct items', () => {
            expect(component.container.querySelectorAll('tbody tr').length).toBe(2);
        });
    
        it('should have the correct target', () => {
            expect(component.getByTestId('income-target').textContent).toBe('Target $1000.00');
        });
    
        it('should have the correct total', () => {
            expect(component.getByTestId('income-total').textContent).toBe('Total earned $1000.00');
        });

        it('should have the correct color class', () => {
            expect(component.getByTestId('income-total-amount').className).toContain('good-score');
        });
    });

    describe('when income target is not meet', () => {
        beforeEach(() => {
            useExpectedIncomeMock.mockReturnValue(300000);
            component = createComponent();
        });

        it('should have the correct month', () => {
            expect(component.container.querySelector('h1').textContent).toBe(`Income for ${targetDate}`);
        });
    
        it('should have the correct items', () => {
            expect(component.container.querySelectorAll('tbody tr').length).toBe(2);
        });
    
        it('should have the correct target', () => {
            expect(component.getByTestId('income-target').textContent).toBe('Target $3000.00');
        });
    
        it('should have the correct total', () => {
            expect(component.getByTestId('income-total').textContent).toBe('Total earned $1000.00');
        });

        it('should have the correct color class', () => {
            expect(component.getByTestId('income-total-amount').className).toContain('bad-score');
        });
    });
});