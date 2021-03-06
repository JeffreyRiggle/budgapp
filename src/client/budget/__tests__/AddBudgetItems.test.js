import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddBudgetItems from '../AddBudgetItems';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        sendMessage: jest.fn(() => ({
            then: jest.fn()
        }))
    }
}));

describe('AddBudgetItems', () => {
    let component;
    beforeEach(() => {
        component = render(<BrowserRouter><AddBudgetItems /></BrowserRouter>);
    });

    describe('default render', () => {
        it('should have a table', () => {
            expect(component.container.querySelector('table')).toBeDefined();
        });
    });

    describe('when shared date is clicked', () => {
        beforeEach(() => {
            fireEvent.click(component.getByTestId('shared-date'));
        });

        it('should show a date picker', () => {
            expect(component.container.querySelector('.react-datepicker-wrapper')).toBeDefined();
        });
    });

    describe('when add item is clicked', () => {
        beforeEach(() => {
            component.getByTestId('add-budget-item').click();
        });

        it('should add a budget item', () => {
            expect(component.container.querySelector('AddBudgetItemView')).toBeDefined();
        });
    });
});