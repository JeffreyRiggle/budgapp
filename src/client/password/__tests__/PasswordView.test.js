import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PasswordView from '../PasswordView';
import passwordService from '../../services/passwordService';

jest.mock('../../services/passwordService', () => ({
    sendPassword: jest.fn((pw, callback) => {
        callback({
            success: pw === 'secret'
        });
    })
}));

describe('Password View', () => {
    let component;

    beforeEach(() => {
        component = render(<BrowserRouter><PasswordView /></BrowserRouter>);
    });

    describe('when an incorrect password is set', () => {
        beforeEach(() => {
            let passwordEl = component.container.querySelector('input[type="password"]');
            fireEvent.change(passwordEl, { target: { value: 'Invalid' } });
            let submitEl = component.container.querySelector('button');
            fireEvent.click(submitEl);
        });

        it('should call the password service', () => {
            expect(passwordService.sendPassword).toHaveBeenCalledWith('Invalid', expect.any(Function));
        });

        it('should show an error message', () => {
            expect(component.container.querySelector('.error')).toBeDefined();
        });
    });

    describe('when a correct password is set', () => {
        beforeEach(() => {
            let passwordEl = component.container.querySelector('input[type="password"]');
            fireEvent.change(passwordEl, { target: { value: 'secret' } });
            let submitEl = component.container.querySelector('button');
            fireEvent.click(submitEl);
        });

        it('should call the password service', () => {
            expect(passwordService.sendPassword).toHaveBeenCalledWith('secret', expect.any(Function));
        });

        it('should not show an error message', () => {
            expect(component.container.querySelector('.error')).toBe(null);
        });
    });
});