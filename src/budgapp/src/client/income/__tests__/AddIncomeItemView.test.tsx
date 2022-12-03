import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import AddIncomeItemView from '../AddIncomeItemView';
import { IncomeItem } from '../../../common/income';

describe('Add Income Item View', () => {
    let component: RenderResult;
    let mockItem: IncomeItem;
    let removed: jest.Mock;

    beforeEach(() => {
        removed = jest.fn();
        mockItem = {} as IncomeItem;
        component = render(<AddIncomeItemView item={mockItem} onRemove={removed} />);
    });

    describe('When the amount changes to a valid number', () => {
        beforeEach(() => {
            const amountEl = component.getByTestId('income-amount-input');
            fireEvent.change(amountEl, { target: { value: '500' } });
        });

        it('should update the UI', () => {
            expect((component.getByTestId('income-amount-input') as HTMLInputElement).value).toBe('500');
        });

        it('should update the item', () => {
            expect(mockItem.amount).toBe('500');
        });
    });

    describe('when the amount changes to an invalid number', () => {
        beforeEach(() => {
            const amountEl = component.getByTestId('income-amount-input');
            fireEvent.change(amountEl, { target: { value: 'Invalid' } });
        });

        it('should show an error', () => {
            expect(component.getByTestId('income-amount-input').className).toBe('input-data item error');
        });
    });

    describe('when source is changed', () => {
        beforeEach(() => {
            const sourceEl = component.getByTestId('income-source-input');
            fireEvent.change(sourceEl, { target: { value: 'work' } });
        });

        it('should update the UI', () => {
            expect((component.getByTestId('income-source-input') as HTMLInputElement).value).toBe('work');
        });

        it('should update the item', () => {
            expect(mockItem.source).toBe('work');
        });
    });

    describe('when remove is clicked', () => {
        beforeEach(() => {
            let removeEl = component.container.querySelector('button');
            if (removeEl) {
                fireEvent.click(removeEl);
            }
        });

        it('should remove the element', () => {
            expect(removed).toHaveBeenCalled();
        });
    });
});