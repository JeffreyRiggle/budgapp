import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BudgetView from '../BudgetView';
import { filteredBudgetItems, getExpectedIncome } from '../../../common/eventNames';
import { BrowserRouter } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        sendMessage: jest.fn((eventName) => {
            if (eventName === 'filteredBudgetItems') {
                return Promise.resolve([
                    {
                        category: 'Food',
                        amount: 10000
                    },
                    {
                        category: 'Rent',
                        amount: 70000
                    }
                ]);
            }

            if (eventName === 'getExpectedIncome') {
                return Promise.resolve(100000);
            }
        })
    }
}));

describe('Budget View', () => {
    let component;

    beforeEach(() => {
        const mockMatch = {
            params: {}
        };

        component = render(<BrowserRouter><BudgetView match={mockMatch}/></BrowserRouter>);
    });

    it('should get budget items', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(filteredBudgetItems, expect.anything());
    });

    it('should get the income', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(getExpectedIncome, null);
    });

    it('should have the correct categories', () => {
        expect(component.container.querySelectorAll('tbody tr').length).toBe(2);
    });

    it('should have the correct amount spent', () => {
        expect(component.getByTestId('budget-spent').textContent).toBe('Total Spent $800.00');
    });

    it('should have the correct income', () => {
        expect(component.getByTestId('budget-income').textContent).toBe('Target $1000.00');
    });
});