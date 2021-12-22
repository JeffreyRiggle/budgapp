import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EditableLabel from '../EditableLabel';

describe('Editable Label', () => {
    let component, onChange;

    beforeEach(() => {
        onChange = jest.fn();
    });

    describe('when component has initial text', () => {
        beforeEach(() => {
            component = render(<EditableLabel onChange={onChange} value="foobar"/>);
        });

        it('should have the initial text', () => {
            expect(component.container.querySelector('label').textContent).toBe('foobar');
        });
    });

    describe('when component has no initial text', () => {
        beforeEach(() => {
            component = render(<EditableLabel onChange={onChange}/>);
        });

        it('should not have initial text', () => {
            console.log(component.container.querySelector('label').textContent);
            expect(component.container.querySelector('label').textContent).toBe('');
        });

        describe('when edit button is pressed', () => {
            beforeEach(() => {
                fireEvent.click(component.container.querySelector('button'));
            });

            it('should show an input', () => {
                expect(component.container.querySelector('input')).toBeDefined();
            });

            describe('when input is typed and sent', () => {
                beforeEach(() => {
                    const inputEl = component.container.querySelector('input');
                    fireEvent.change(inputEl, { target: { value: 'testing' } });
                    fireEvent.keyPress(inputEl, { key: 'Enter', code: 13, charCode: 13 });
                });

                it('should have the correct text', () => {
                    expect(component.container.querySelector('label').textContent).toBe('testing');
                });

                it('should invoke the callback', () => {
                    expect(onChange).toHaveBeenCalledWith('testing');
                });
            });
        });
    });
});