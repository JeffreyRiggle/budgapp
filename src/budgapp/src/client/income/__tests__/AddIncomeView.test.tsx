import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddIncomeView from '../AddIncomeView';
import { addIncomeItems } from '@budgapp/common';
import service from '../../services/communicationService';

jest.mock('../../services/communicationService', () => ({
    sendMessage: jest.fn()
}));

jest.mock('../../hooks/use-mobile-breakpoint', () => jest.fn(() => () => false));

describe('Add Income View', () => {
    let component: RenderResult;

    beforeEach(() => {
        component = render(<BrowserRouter><AddIncomeView /></BrowserRouter>);
    });

    describe('when shared date is clicked', () => {
        beforeEach(() => {
            const sharedDateEl = component.container.querySelector('input[type="checkbox"]');
            if (sharedDateEl) {
                fireEvent.click(sharedDateEl);
            }
        });

        it('should show the date control', () => {
            expect(component.container.querySelector('.react-datepicker-wrapper')).toBeDefined();
        });
    });

    describe('when add item is pressed', () => {
        beforeEach(() => {
            fireEvent.click(component.getByTestId('add-income-item'));
        });

        it('should add a row', () => {
            expect(component.container.querySelectorAll('table tbody tr').length).toBe(1);
        });

        describe('when another item is added', () => {
            beforeEach(() => {
                fireEvent.click(component.getByTestId('add-income-item'));
            });
    
            it('should add a row', () => {
                expect(component.container.querySelectorAll('table tbody tr').length).toBe(2);
            });

            describe('when an item is removed', () => {
                beforeEach(() => {
                    let removeBtn = component.container.querySelectorAll('table tbody tr button')[0];
                    fireEvent.click(removeBtn);
                });

                it('should remove a row', () => {
                    expect(component.container.querySelectorAll('table tbody tr').length).toBe(1);
                });
            });
        });

        describe('when add items is pressed', () => {
            beforeEach(() => {
                fireEvent.click(component.getByTestId('add-income-items'));
            });

            it('should send the items', () => {
                expect(service.sendMessage).toHaveBeenCalledWith(addIncomeItems, expect.any(Array));
            });
        });
    });
});