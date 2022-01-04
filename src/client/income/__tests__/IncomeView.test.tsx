import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IncomeView from '../IncomeView';
import moment from 'moment';

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
    useExpectedIncome: () => 100000
}));

describe('Income View', () => {
    let component: RenderResult;
    let targetDate: string;

    beforeEach(() => {
        targetDate = moment(Date.now()).format('MMMM');
        const mockMatch = {
            params: {},
            isExact: false,
            path: 'some/path',
            url: 'https://mock/path',
            history: {}
        };

        component = render(<BrowserRouter><IncomeView match={mockMatch} location={{} as History.Location} history={{} as History.History}/></BrowserRouter>);
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
});