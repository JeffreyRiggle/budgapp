import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CategoryConfiguration from '../CategoryConfiguration';
import { addCategory, getCategories, updateCategories } from '../../../common/eventNames';
import { client } from '@jeffriggle/ipc-bridge-client';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        available: true,
        sendMessage: jest.fn((eventName) => {
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
        })
    }
}));

describe('Category Configuration', () => {
    let component;

    beforeEach(() => {
        component = render(<CategoryConfiguration />);
    });

    it('should get categories', () => {
        expect(client.sendMessage).toHaveBeenCalledWith(getCategories, null);
    });

    it('should display categories', () => {
        expect(component.container.querySelectorAll('.existing-categories .category').length).toBe(2);
    });

    it('should have a disabled update button', () => {
        expect(component.getByTestId('category-update').getAttribute('disabled')).toBe("");
    });

    describe('when updating a categories amount', () => {
        let inputEl;

        beforeEach(() => {
            const foodCat = component.container.querySelectorAll('.existing-categories .category')[0];
            inputEl = foodCat.querySelector('input[type="text"]');
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
                expect(client.sendMessage).toHaveBeenCalledWith(updateCategories, expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Food',
                        allocated: 30000
                    })
                ]));
            });
        });
    });

    describe('when updating a categories rollover', () => {
        let inputEl;

        beforeEach(() => {
            const foodCat = component.container.querySelectorAll('.existing-categories .category')[0];
            inputEl = foodCat.querySelector('input[type="checkbox"]');
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
            let inputEl = component.container.querySelector('.add-category-area input[type="text"]');
            fireEvent.change(inputEl, { target: { value: 'Personal' } });
            let addButton = component.container.querySelector('.add-category-area button');
            fireEvent.click(addButton);
        });

        it('should add the category to the UI', () => {
            expect(component.container.querySelectorAll('.existing-categories .category').length).toBe(3);
        });

        it('should add the category', () => {
            expect(client.sendMessage).toHaveBeenCalledWith(addCategory, expect.objectContaining({
                name: 'Personal',
                rollover: false,
                allocated: 0
            }));
        });
    });
});