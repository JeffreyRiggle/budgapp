import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import GeneralView from '../GeneralView';
import { getExpectedIncome, setExpectedIncome } from '@budgapp/common';
import { BrowserRouter } from 'react-router-dom';
import service from '../../services/communicationService';

jest.mock('../CategoryChart', () => () => null);

jest.mock('../../services/communicationService', () => ({
    sendMessage: jest.fn(),
    nativeClientAvailable: true
}));

describe('General View', () => {
    let component: RenderResult;

    beforeEach(() => {
        (service.sendMessage as unknown as jest.MockedFunction<any>).mockImplementation((eventName: string) => {
            if (eventName === 'getCategories') {
                return Promise.resolve([]);
            }

            if (eventName === 'getExpectedIncome') {
                return Promise.resolve(100000);
            }

            return Promise.resolve();
        });
        component = render(<BrowserRouter><GeneralView /></BrowserRouter>);
    });

    it('should get the income', () => {
        expect(service.sendMessage).toHaveBeenCalledWith(getExpectedIncome, null);
    });

    it('should have the correct income', () => {
        expect((component.container.querySelector('.income-details input') as HTMLInputElement).value).toBe('1000.00');
    });

    describe('When an invalid income is entered', () => {
        beforeEach(() => {
            const inputEl = component.container.querySelector('.income-details input') as HTMLInputElement;
            fireEvent.change(inputEl, { target: { value: 'Invalid' } });
        });

        it('should show an error state', () => {
            expect((component.container.querySelector('.income-details input') as HTMLInputElement).className).toBe('error');
        });

        it('should not update the income', () => {
            expect(service.sendMessage).not.toHaveBeenCalledWith(setExpectedIncome, 'Invalid');
        });
    });

    describe('when a valid income is entered', () => {
        beforeEach(() => {
            const inputEl = component.container.querySelector('.income-details input') as HTMLInputElement;
            fireEvent.change(inputEl, { target: { value: 1500 } });
        });

        it('should update the income', () => {
            expect(service.sendMessage).toHaveBeenCalledWith(setExpectedIncome, 150000);
        });
    });
});