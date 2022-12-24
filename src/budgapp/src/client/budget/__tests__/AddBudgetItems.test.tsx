import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import AddBudgetItems from '../AddBudgetItems';
import { BrowserRouter } from 'react-router-dom';
import useMobileBreakpoint from '../../hooks/use-mobile-breakpoint';

jest.mock('../../services/communicationService', () => ({
    sendMessage: () => Promise.resolve([])
}));

jest.mock('../../hooks/use-mobile-breakpoint', () => jest.fn(() => () => false));

describe('AddBudgetItems', () => {
    let component: RenderResult;
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

    describe('when view is in mobile', () => {
        beforeEach(() => {
            component.unmount();
            (useMobileBreakpoint as unknown as jest.MockedFunction<any>).mockImplementation(() => () => true);
            component = render(<BrowserRouter><AddBudgetItems /></BrowserRouter>);
        });

        describe('and add item is clicked', () => {
            beforeEach(() => {
                component.getByTestId('add-budget-item').click();
            });

            it('should show the add item modal', () => {
                expect(component.container.querySelector('AddBudgetItemModal')).toBeDefined();
            });
        });
    });
});