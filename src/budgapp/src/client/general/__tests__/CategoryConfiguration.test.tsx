import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import CategoryConfiguration from '../CategoryConfiguration';
import { addCategory, getCategories, updateCategories } from '@budgapp/common';
import service from '../../services/communicationService';

jest.mock('../../services/communicationService', () => ({
    sendMessage: jest.fn(),
    nativeClientAvailable: true
}));

jest.mock('../CategoryChart', () => () => null);

describe('Category Configuration', () => {
    let component: RenderResult;

    beforeEach(() => {
        (service.sendMessage as unknown as jest.MockedFunction<any>).mockImplementation((eventName: string) => {
            if (eventName === 'getCategories') {
                return Promise.resolve([
                    {
                        name: 'Food',
                        allocated: 20000,
                        rollover: false
                    },
                    {
                        name: 'Rent',
                        allocated: 100000,
                        rollover: false
                    }
                ]);
            }

            return Promise.resolve();
        });

        component = render(<CategoryConfiguration />);
    });

    it('should get categories', () => {
        expect(service.sendMessage).toHaveBeenCalledWith(getCategories, null);
    });

    it('should display categories', () => {
        expect(component.container.querySelectorAll('.existing-categories .category').length).toBe(2);
    });

    it('should have a disabled update button', () => {
        expect(component.getByTestId('category-update').getAttribute('disabled')).toBe("");
    });

    describe('when updating a categories amount', () => {
        let inputEl: HTMLInputElement;

        beforeEach(() => {
            const foodCat = component.container.querySelectorAll('.existing-categories .category')[0];
            inputEl = foodCat.querySelector('input[type="text"]') as HTMLInputElement;
            fireEvent.change(inputEl, { target: { value: '300' } });
        });

        it('should update the amount in the UI', () => {
            expect(inputEl.value).toBe('300');
        });

        it('should enable the update button', () => {
            expect(component.getByTestId('category-update').getAttribute('disabled')).toBe(null);
        });

        describe('and updating', () => {
            beforeEach(() => {
                let updateButton = component.getByTestId('category-update');
                fireEvent.click(updateButton);
            });

            it('should update the category', () => {
                expect(service.sendMessage).toHaveBeenCalledWith(updateCategories, expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Food',
                        allocated: 30000
                    })
                ]));
            });

            it('should have the correct display', () => {
                const foodCat = component.container.querySelectorAll('.existing-categories .category')[0];
                inputEl = foodCat.querySelector('input[type="text"]') as HTMLInputElement;
                expect(inputEl.value).toBe('300.00');
            });
        });
    });

    describe('when updating a categories rollover', () => {
        let inputEl: HTMLInputElement;

        beforeEach(() => {
            const foodCat = component.container.querySelectorAll('.existing-categories .category')[0];
            inputEl = foodCat.querySelector('input[type="checkbox"]') as HTMLInputElement;
            fireEvent.click(inputEl);
        });

        it('should update the rollover in the UI', () => {
            expect(inputEl.value).toBe('on');
        });

        it('should enable the update button', () => {
            expect(component.getByTestId('category-update').getAttribute('disabled')).toBe(null);
        });
    });

    describe('when adding a category', () => {
        beforeEach(() => {
            let inputEl = component.container.querySelector('.add-category-area input[type="text"]') as HTMLInputElement;
            fireEvent.change(inputEl, { target: { value: 'Personal' } });
            let addButton = component.container.querySelector('.add-category-area button') as HTMLButtonElement;
            fireEvent.click(addButton);
        });

        it('should add the category to the UI', () => {
            expect(component.container.querySelectorAll('.existing-categories .category').length).toBe(3);
        });

        it('should add the category', () => {
            expect(service.sendMessage).toHaveBeenCalledWith(addCategory, expect.objectContaining({
                name: 'Personal',
                rollover: false,
                allocated: 0
            }));
        });
    });
});