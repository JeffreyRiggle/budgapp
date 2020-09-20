import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import { storageType, fileLocation, setFileLocation, setPassword, setFileType } from '../../common/eventNames';
import './StorageView.scss';

class StorageView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            protected: false,
            pending: false,
            error: false,
            password: '',
            fileLocation: '',
            storageType: 'local'
        };

        this.boundAvailable = this.onAvailable.bind(this);
    }

    componentDidMount() {
        if (!client.available) {
            client.on(client.availableChanged, this.boundAvailable);
        } else {
            client.sendMessage(fileLocation, null).then(this.handleFileLocation.bind(this));
            client.sendMessage(storageType, null).then(this.handleStorageType.bind(this));
        }
    }

    handleFileLocation(data) {
        this.setState({
            fileLocation: data
        });
    }

    handleStorageType(data) {
        this.setState({
            storageType: data
        });
    }

    onAvailable(value) {
        if (value) {
            client.sendMessage(fileLocation, null).then(this.handleFileLocation.bind(this));
            client.removeListener(client.availableChanged, this.boundAvailable);
        }
    }

    applyChanges() {
        this.setState({
            pending: true
        });

        client.sendMessage(setFileType, this.state.storageType).then(() => {
            console.log(`Updated type now attempting to set file location to ${this.state.fileLocation}`)
            return client.sendMessage(setFileLocation, this.state.fileLocation);
        }).then(result => {
            if (result.success) {
                this.setState({ pending: false });
                return;
            }
            
            if (result.needsPassword) {
                this.props.history.push('/password');
                return;
            }

            this.setState({
                pending: false,
                error: true
            });
        });
    }

    render() {
        return (
            <div className="storage-view">
                <h1>Storage Options</h1>
                <div>
                    <label className="storage-label">Storage Type</label>
                    <select value={this.state.storageType} onChange={this.typeChanged.bind(this)}>
                        <option value="local">Local File</option>
                        <option value="remote">Remote File</option>
                    </select>
                </div>
                {this.renderStorageOptions()}
                <div className="apply-changes">
                    {this.state.error && <p>Failed to update file</p>}
                    {this.state.pending && <p>Attempting to update file</p>}
                    <button onClick={this.applyChanges.bind(this)}>Apply Changes</button>
                </div>
                <Link to="/">Back to General</Link>
            </div>
        );
    }

    renderStorageOptions() {
        if (this.state.storageType === 'local') {
            return this.renderLocalStorageOptions();
        }

        if (this.state.storageType === 'remote') {
            return this.renderRemoteStorageOptions();
        }

        return <div>I can't work with this</div>;
    }

    renderLocalStorageOptions() {
        return (
            <div className="storage-option" data-testid="local-storage">
                <div className="storage-option">
                    <div>
                        <label>Protect Budget file</label>
                        <input type="checkbox" onChange={this.protectionChanged.bind(this)} data-testid="local-file-password-checkbox"></input>
                    </div>
                    <div className="password-settings">
                        <label className="storage-label">Password</label>
                        <input type="password" onChange={this.passwordChanged.bind(this)} disabled={!this.state.protected} data-testid="local-file-password-input"></input>
                        <button onClick={this.setPassword.bind(this)} disabled={!this.state.protected} data-testid="local-file-set-password">Set Password</button>
                    </div>
                </div>
                <div className="storage-option">
                    <div>
                        <label className="storage-label">File</label>
                        <label className="storage-label" data-testid="local-file-location">{this.state.fileLocation}</label>
                    </div>
                    <input type="file" accept=".json" onChange={this.fileChanged.bind(this)} />
                </div>
            </div>
        );
    }

    renderRemoteStorageOptions() {
        return (
            <div>
                <div className="storage-option" data-testid="remote-storage">
                    <label className="storage-label">File URL</label>
                    <input type="url" placeholder="http://example.com/budget.json" onChange={this.urlChanged.bind(this)} value={this.state.fileLocation} />
                </div>
            </div>
        );
    }

    typeChanged(event) {
        this.setState({
            storageType: event.target.value
        });
    }

    protectionChanged(event) {
        this.setState({
            protected: event.target.checked
        });
    }

    passwordChanged(event) {
        this.setState({
            password: event.target.value
        });
    }

    fileChanged(event) {
        this.setState({
            fileLocation: event.target.files[0].path
        });
    }

    urlChanged(event) {
        this.setState({
            fileLocation: event.target.value
        });
    }

    setPassword() {
        client.sendMessage(setPassword, this.state.password);
    }
}

export default withRouter(StorageView);