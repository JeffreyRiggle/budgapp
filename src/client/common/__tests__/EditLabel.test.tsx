import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import EditableLabel from '../EditableLabel';

describe('Editable Label', () => {
    let component: RenderResult;
    let onChange: (text: string) => void;

    beforeEach(() => {
        onChange = jest.fn();
    });

    function getTextContent(element: HTMLElement | null): string | undefined | null {
        if (!element) {
            return undefined;
        }

        return element.textContent;
    }

    describe('when component has initial text', () => {
        beforeEach(() => {
            component = render(<EditableLabel onChange={onChange} value="foobar"/>);
        });

        it('should have the initial text', () => {
            expect(getTextContent(component.container.querySelector('label'))).toBe('foobar');
        });
    });

    describe('when component has no initial text', () => {
        beforeEach(() => {
            component = render(<EditableLabel onChange={onChange}/>);
        });

        it('should not have initial text', () => {
            expect(getTextContent(component.container.querySelector('label'))).toBe('');
        });

        describe('when edit button is pressed', () => {
            beforeEach(() => {
                const button = component.container.querySelector('button');
                if (button) {
                    fireEvent.click(button);
                }
            });

            it('should show an input', () => {
                expect(component.container.querySelector('input')).toBeDefined();
            });

            describe('when input is typed and sent', () => {
                beforeEach(() => {
                    const inputEl = component.container.querySelector('input');
                    if (inputEl) {
                        fireEvent.change(inputEl, { target: { value: 'testing' } });
                        fireEvent.keyPress(inputEl, { key: 'Enter', code: 13, charCode: 13 });
                    }
                });

                it('should have the correct text', () => {
                    expect(getTextContent(component.container.querySelector('label'))).toBe('testing');
                });

                it('should invoke the callback', () => {
                    expect(onChange).toHaveBeenCalledWith('testing');
                });
            });
        });
    });
});