import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import { getCategories } from '@budgapp/common';
import { BudgetItem } from '../../../common/budget';
import service from '../../services/communicationService';
import AddBudgetItemModal from '../AddBudgetItemModal';

jest.mock('../../services/communicationService', () => ({
    sendMessage: jest.fn()
}));

describe('AddBudgetItemModal', () => {
    let component: RenderResult;
    let accept: jest.Mock;
    let cancel: jest.Mock;

    beforeEach(() => {
        (service.sendMessage as unknown as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve([{name: 'testCat'}]));
        accept = jest.fn();
        cancel = jest.fn();
        component = render(<AddBudgetItemModal onAccept={accept} onCancel={cancel} />);
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

    describe('when item is added', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('.input-data') || window, { target: { value: '88' } });
            fireEvent.change(component.getByTestId('details-input'), { target: { value: 'something' } });
            fireEvent.change(component.container.querySelector('select') || window, { target: { value: 'testCat' } });
            fireEvent.click(component.getByTestId('accept-modal'));
        });

        it('should fire accept event', () => {
            expect(accept).toHaveBeenCalledWith(expect.objectContaining({
                amount: '88',
                detail: 'something',
                category: 'testCat'
            }));
        });
    });

    describe('when item is cancelled', () => {
        beforeEach(() => {
            fireEvent.change(component.container.querySelector('.input-data') || window, { target: { value: '88' } });
            fireEvent.change(component.getByTestId('details-input'), { target: { value: 'something' } });
            fireEvent.change(component.container.querySelector('select') || window, { target: { value: 'testCat' } });
            fireEvent.click(component.getByTestId('cancel-modal'));
        });

        it('should fire cancel event', () => {
            expect(cancel).toHaveBeenCalled();
        });

        it('should not fire accept event', () => {
            expect(accept).not.toHaveBeenCalled();
        });
    });
});