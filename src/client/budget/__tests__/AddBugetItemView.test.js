import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddBudgetItemView from '../AddBudgetItemView';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getCategories } from '../../../common/eventNames';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        sendMessage: jest.fn(() => Promise.resolve([{name: 'testCat'}]))
    }
}));

describe('AddBudgetItems', () => {
    let component, mockItem, removed;

    beforeEach(() => {
        removed = jest.fn();
        mockItem = {};
        component = render(<AddBudgetItemView item={mockItem} onRemove={removed}/>);
    });

    it('should get categories', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(getCategories, null);
    });

    describe('when an invalid value is entered', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('.input-data'), { target: { value: 'invalid' } });
        });

        it('should show an error', () => {
            expect(component.container.querySelector('.input-dataerror')).toBeDefined();
        });
    });

    describe('when a valid value is entered', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('.input-data'), { target: { value: '88' } });
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
            fireEvent.change(component.container.querySelector('select'), { target: { value: 'testCat' } });
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