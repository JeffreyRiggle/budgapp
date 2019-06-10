import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import { fileLocation, setFileLocation, setPassword } from '../../common/eventNames';
import './StorageView.scss';

class StorageView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            protected: false,
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
        }
    }

    handleFileLocation(data) {
        this.setState({
            fileLocation: data
        });
    }

    onAvailable(value) {
        if (value) {
            client.sendMessage(fileLocation, null).then(this.handleFileLocation.bind(this));
            client.removeListener(client.availableChanged, this.boundAvailable);
        }
    }

    render() {
        return (
            <div>
                <h1>Storage Options</h1>
                <div className="storage-option">
                    <label className="storage-label">Storage Type</label>
                    <select value={this.state.storageType} onChange={this.typeChanged.bind(this)}>
                        <option value="local">Local File</option>
                        <option value="remote">Remote File</option>
                    </select>
                </div>
                {this.renderStorageOptions()}
                <Link to="/">Back to General</Link>
            </div>
        );
    }

    renderStorageOptions() {
        if (this.state.storageType !== 'local') {
            return <div>I can't work with this</div>;
        }

        return (
            <div>
                <div className="storage-option">
                    <label>Protect Budget file</label>
                    <input type="checkbox" onChange={this.protectionChanged.bind(this)}></input>
                    <div className="password-settings">
                        <label className="storage-label">Password</label>
                        <input type="password" onChange={this.passwordChanged.bind(this)} disabled={!this.state.protected}></input>
                        <button onClick={this.setPassword.bind(this)} disabled={!this.state.protected}>Set Password</button>
                    </div>
                </div>
                <div className="storage-option">
                    <label className="storage-label">File</label>
                    <label className="storage-label">{this.state.fileLocation}</label>
                    <input type="file" accept=".json" onChange={this.fileChanged.bind(this)} />
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
        let filePath = event.target.files[0].path;

        if (filePath) {
            console.log(`setting file path ${filePath}`);
            client.sendMessage(setFileLocation, filePath);
        }

        this.setState({
            fileLocation: filePath
        });
    }

    setPassword() {
        client.sendMessage(setPassword, this.state.password);
    }
}

export default StorageView;