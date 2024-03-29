import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import CategoryView from '../CategoryView';
import { filteredBudgetItems, getCategory } from '@budgapp/common';
import { BrowserRouter } from 'react-router-dom';
import service from '../../services/communicationService';

jest.mock('../../services/communicationService', () => ({
    nativeClientAvailable: true,
    sendMessage: jest.fn()
}));

describe('Category View', () => {
    let component: RenderResult;

    beforeEach(() => {
        (service.sendMessage as unknown as jest.MockedFunction<any>).mockImplementation((eventName: string) => {
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
        });
        const mockMatch = {
            params: {
                id: 'Food'
            },
            isExact: false,
            path: 'some/path',
            url: 'https://mock/path',
            history: {}
        };

        component = render(<BrowserRouter><CategoryView match={mockMatch} location={{} as History.Location} history={{} as History.History} /></BrowserRouter>);
    });

    it('should get budget items', () => {
        expect(service.sendMessage).toHaveBeenCalledWith(filteredBudgetItems, expect.objectContaining({
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
        expect(service.sendMessage).toHaveBeenCalledWith(getCategory, expect.objectContaining({
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

    it('should have the correct remaining', () => {
        expect(component.getByTestId('category-remaining').textContent).toBe('Remaining $50.00');
    });
});