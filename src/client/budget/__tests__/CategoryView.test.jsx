import React from 'react';
import { render } from '@testing-library/react';
import CategoryView from '../CategoryView';
import { filteredBudgetItems, getCategory } from '../../../common/eventNames';
import { BrowserRouter } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        sendMessage: jest.fn((eventName) => {
            if (eventName === 'filteredBudgetItems') {
                return Promise.resolve([
                    {
                        id: 1,
                        category: 'Food',
                        amount: 10000
                    },
                    {
                        id: 2,
                        category: 'Food',
                        amount: 5000
                    }
                ]);
            }

            if (eventName === 'getCategory') {
                return Promise.resolve({
                    name: 'Food',
                    allocated: 20000
                });
            }
        })
    }
}));

describe('Category View', () => {
    let component;

    beforeEach(() => {
        const mockMatch = {
            params: {
                id: 'Food'
            }
        };

        component = render(<BrowserRouter><CategoryView match={mockMatch}/></BrowserRouter>);
    });

    it('should get budget items', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(filteredBudgetItems, expect.objectContaining({
            filters: [
                {
                    expectedValue: 'Food',
                    filterProperty: 'category',
                    type: 'equals'
                },
                expect.objectContaining({
                    type: 'month'
                })
            ]
        }));
    });

    it('should get the category', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(getCategory, expect.objectContaining({
            category: 'Food',
            includeRollover: true
        }));
    });

    it('should have the correct budget items', () => {
        expect(component.container.querySelectorAll('tbody tr').length).toBe(2);
    });

    it('should have the correct target', () => {
        expect(component.getByTestId('category-target').textContent).toBe('Target $200.00');
    });

    it('should have the correct spend', () => {
        expect(component.getByTestId('category-spend').textContent).toBe('Total Spent $150.00');
    });
});