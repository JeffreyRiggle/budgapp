import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StorageView from '../StorageView';
import { storageType, fileLocation, setFileLocation, setPassword, setFileType } from '../../../common/eventNames';
import { client } from '@jeffriggle/ipc-bridge-client';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@jeffriggle/ipc-bridge-client', () => ({
    client: {
        available: true,
        sendMessage: jest.fn((eventName) => {
            if (eventName === 'fileLocation') {
                return Promise.resolve('/some/file.json');
            }

            if (eventName === 'storageType') {
                return Promise.resolve('local');
            }

            if (eventName === 'setFileLocation') {
                return Promise.resolve({ success: true });
            }

            return Promise.resolve();
        })
    }
}));

describe('Storage View', () => {
    let component;

    beforeEach(() => {
        component = render(<BrowserRouter><StorageView /></BrowserRouter>);
    });

    it('should have the correct storage type', () => {
        expect(component.getByTestId('local-storage')).toBeDefined();
    });

    it('should have the correct protection state', () => {
        expect(component.container.querySelector('.storage-option input[type="checkbox"]').checked).toBe(false);
    });

    it('should have the correct location', () => {
        expect(component.getByTestId('local-file-location').textContent).toBe('/some/file.json');
    });

    describe('when protection is changed', () => {
        beforeEach(() => {
            const checkboxEl = component.container.querySelector('.storage-option input[type="checkbox"]');
            fireEvent.click(checkboxEl);
        });

        it('should enable the password', () => {
            expect(component.container.querySelector('.password-settings button').getAttribute('disabled')).toBe(null);
        });

        describe('when password is set', () => {
            beforeEach(() => {
                const passSubmitEl = component.container.querySelector('.password-settings button');
                const passEl = component.container.querySelector('.password-settings input');

                fireEvent.change(passEl, { target: { value: 'secret' } });
                fireEvent.click(passSubmitEl);
            });

            it('should send a password message', () => {
                expect(client.sendMessage).toHaveBeenCalledWith(setPassword, 'secret');
            });
        });
    });

    describe('when location is updated', () => {
        beforeEach(() => {
            const fileEl = component.container.querySelector('.storage-option input[type="file"]');
            fireEvent.change(fileEl, { target: { files: [ { path: '/other/file.json' } ] } });
        });

        it('should update the location', () => {
            expect(component.getByTestId('local-file-location').textContent).toBe('/other/file.json');
        });

        describe('when changes are applied', () => {
            beforeEach(() => {
                const saveEl = component.container.querySelector('.apply-changes button');
                fireEvent.click(saveEl);
            });

            it('should save the file type', () => {
                expect(client.sendMessage).toHaveBeenCalledWith(setFileType, 'local');
            });

            it('should save the file location', () => {
                expect(client.sendMessage).toHaveBeenCalledWith(setFileLocation, '/other/file.json');
            });
        });
    });

    describe('when storage type is changed', () => {
        beforeEach(() => {
            const selectEl = component.container.querySelector('select');
            fireEvent.change(selectEl, { target: { value: 'remote' } })
        });

        it('should update the view', () => {
            expect(component.getByTestId('remote-storage')).toBeDefined();
        });

        describe('when url is provied', () => {
            beforeEach(() => {
                const urlEl = component.container.querySelector('.storage-option input[type="url"]');
                fireEvent.change(urlEl, { target: { value: 'http://someplace/file.com' } });
            });

            it('should update the url', () => {
                const urlEl = component.container.querySelector('.storage-option input[type="url"]');
                expect(urlEl.value).toBe('http://someplace/file.com');
            });

            describe('when changes are applied', () => {
                beforeEach(() => {
                    const saveEl = component.container.querySelector('.apply-changes button');
                    fireEvent.click(saveEl);
                });

                it('should save the file type', () => {
                expect(client.sendMessage).toHaveBeenCalledWith(setFileType, 'remote');
            });

            it('should save the file location', () => {
                expect(client.sendMessage).toHaveBeenCalledWith(setFileLocation, 'http://someplace/file.com');
            });
            });
        });
    });
});