import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import GeneralView from '../GeneralView';
import { getExpectedIncome, setExpectedIncome } from '../../../common/eventNames';
import { client } from '@jeffriggle/ipc-bridge-client';
import { BrowserRouter } from 'react-router-dom';
jest.mock('../CategoryChart', () => () => null);

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        available: true,
        sendMessage: jest.fn()
    }
}));

describe('General View', () => {
    let component: RenderResult;

    beforeEach(() => {
        (client.sendMessage as unknown as jest.MockedFunction<any>).mockImplementation((eventName: string) => {
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
        expect(client.sendMessage).toHaveBeenCalledWith(getExpectedIncome, null);
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
            expect(client.sendMessage).not.toHaveBeenCalledWith(setExpectedIncome, 'Invalid');
        });
    });

    describe('when a valid income is entered', () => {
        beforeEach(() => {
            const inputEl = component.container.querySelector('.income-details input') as HTMLInputElement;
            fireEvent.change(inputEl, { target: { value: 1500 } });
        });

        it('should update the income', () => {
            expect(client.sendMessage).toHaveBeenCalledWith(setExpectedIncome, 150000);
        });
    });
});