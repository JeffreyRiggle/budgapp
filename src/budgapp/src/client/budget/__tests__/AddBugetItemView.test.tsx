import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import AddBudgetItemView from '../AddBudgetItemView';
import { getCategories } from '@budgapp/common';
import { BudgetItem } from '../../../common/budget';
import service from '../../services/communicationService';

jest.mock('../../services/communicationService', () => ({
    sendMessage: jest.fn()
}));

describe('AddBudgetItems', () => {
    let component: RenderResult;
    let mockItem: BudgetItem;
    let removed: jest.Mock;

    beforeEach(() => {
        (service.sendMessage as unknown as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve([{name: 'testCat'}]))
        removed = jest.fn();
        mockItem = {} as BudgetItem;
        component = render(<AddBudgetItemView item={mockItem} onRemove={removed}/>);
    });

    it('should get categories', () => {
        expect(service.sendMessage).toHaveBeenCalledWith(getCategories, null);
    });

    describe('when an invalid value is entered', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('.input-data') || window, { target: { value: 'invalid' } });
        });

        it('should show an error', () => {
            expect(component.container.querySelector('.input-dataerror')).toBeDefined();
        });
    });

    describe('when a valid value is entered', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('.input-data') || window, { target: { value: '88' } });
        });

        it('should not show an error', () => {
            expect(component.container.querySelector('.input-dataerror')).toBeNull();
        });

        it('should update the item', () => {
            expect(mockItem.amount).toBe('88');
        });
    });

    describe('when a description is added', () => {
        beforeEach(() => {
            fireEvent.change(component.getByTestId('details-input'), { target: { value: 'something' } });
        });
        
        it('should update the item', () => {
            expect(mockItem.detail).toBe('something');
        });
    });

    describe('when a category is selected', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('select') || window, { target: { value: 'testCat' } });
        });

        it('should update the category', () => {
            expect(mockItem.category).toBe('testCat');
        });
    });

    describe('when item is removed', () => {
        beforeEach(() => {
            fireEvent.click(component.getByTestId('remove-action'));
        });

        it('should fire an event', () => {
            expect(removed).toHaveBeenCalled();
        });
    });
});