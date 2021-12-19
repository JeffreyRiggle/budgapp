import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import {
    storageType as StorageTypeEvent,
    fileLocation as FileLocationEvent,
    setFileLocation as SetFileLocationMessage,
    setPassword as SetPasswordMessage,
    setFileType as SetFileTypeMessage,
} from '../../common/eventNames';
import './StorageView.scss';

const StorageView = (props) => {
    const [isProtected, setIsProtected] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [fileLocation, setFileLocation] = React.useState('');
    const [storageType, setStorageType] = React.useState('local');

    React.useEffect(() => {
        if (client.available) {
            client.sendMessage(FileLocationEvent, null).then(setFileLocation);
            client.sendMessage(StorageTypeEvent, null).then(setStorageType);
            return;
        }

        function onAvailable(value) {
            if (value) {
                client.sendMessage(FileLocationEvent, null).then(setFileLocation);
                client.sendMessage(StorageTypeEvent, null).then(setStorageType);
                client.removeListener(client.availableChanged, onAvailable);
            }
        }
        client.on(client.availableChanged, onAvailable);
    }, [client]);

    const applyChanges = React.useCallback(() => {
        setPending(true);

        client.sendMessage(SetFileTypeMessage, storageType).then(() => {
            return client.sendMessage(SetFileLocationMessage, fileLocation);
        }).then(result => {
            if (result.success) {
                setPending(false);
                return;
            }
            
            if (result.needsPassword) {
                props.history.push('/password');
                return;
            }

            setPending(false);
            setError(true);
        });
    }, [storageType, fileLocation, props.history]);

    const typeChanged = React.useCallback((event) => {
        setStorageType(event.target.value);
    }, [storageType]);

    const protectionChanged = React.useCallback((event) => {
        setIsProtected(event.target.checked);
    }, [isProtected])

    const passwordChanged = React.useCallback((event) => {
        setPassword(event.target.value);
    }, [password]);

    const fileChanged = React.useCallback((event) => {
        setFileLocation(event.target.files[0].path);
    }, [fileLocation]);

    const urlChanged = React.useCallback((event) => {
        setFileLocation(event.target.value);
    }, [fileLocation]);

    const sendPassword = React.useCallback(() => {
        client.sendMessage(SetPasswordMessage, password);
    }, [password]);

    // TODO these should be components of their own
    function renderLocalStorageOptions() {
        return (
            <div className="storage-option" data-testid="local-storage">
                <div className="storage-option">
                    <div>
                        <label>Protect Budget file</label>
                        <input type="checkbox" onChange={protectionChanged} data-testid="local-file-password-checkbox"></input>
                    </div>
                    <div className="password-settings">
                        <label className="storage-label">Password</label>
                        <input type="password" onChange={passwordChanged} disabled={!isProtected} data-testid="local-file-password-input"></input>
                        <button onClick={sendPassword} disabled={!isProtected} data-testid="local-file-set-password">Set Password</button>
                    </div>
                </div>
                <div className="storage-option">
                    <div>
                        <label className="storage-label">File</label>
                        <label className="storage-label" data-testid="local-file-location">{fileLocation}</label>
                    </div>
                    <input type="file" accept=".json" onChange={fileChanged} />
                </div>
            </div>
        );
    }

    function renderRemoteStorageOptions() {
        return (
            <div>
                <div className="storage-option" data-testid="remote-storage">
                    <label className="storage-label">File URL</label>
                    <input type="url" placeholder="http://example.com/budget.json" onChange={urlChanged} value={fileLocation} />
                </div>
            </div>
        );
    }

    function renderStorageOptions() {
        if (storageType === 'local') {
            return renderLocalStorageOptions();
        }

        if (storageType === 'remote') {
            return renderRemoteStorageOptions();
        }

        return <div>I can't work with this</div>;
    }

    return (
        <div className="storage-view">
            <h1>Storage Options</h1>
            <div>
                <label className="storage-label">Storage Type</label>
                <select value={storageType} onChange={typeChanged}>
                    <option value="local">Local File</option>
                    <option value="remote">Remote File</option>
                </select>
            </div>
            {renderStorageOptions()}
            <div className="apply-changes">
                {error && <p>Failed to update file</p>}
                {pending && <p>Attempting to update file</p>}
                <button onClick={applyChanges}>Apply Changes</button>
            </div>
            <Link to="/">Back to General</Link>
        </div>
    );
}

export default withRouter(StorageView);