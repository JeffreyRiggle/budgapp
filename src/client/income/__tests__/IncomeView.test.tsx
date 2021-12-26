import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IncomeView from '../IncomeView';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getMonthIncome, getExpectedIncome } from '../../../common/eventNames';
import moment from 'moment';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        sendMessage: jest.fn((eventName) => {
            if (eventName === 'getMonthIncome') {
                return Promise.resolve([
                    {
                        amount: 50000
                    },
                    {
                        amount: 50000
                    }
                ])
            }

            if (eventName === 'getExpectedIncome') {
                return Promise.resolve(100000);
            }

            return Promise.resolve();
        })
    }
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

    it('should get the correct income items', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(getMonthIncome, expect.any(Number));
    });

    it('should request the income target', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(getExpectedIncome, null);
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