import React, { Component } from 'react';
import nativeService from './NativeService';

// TODO create ipc bridge, file passing from ipcbridge and modal for file picker
class GeneralView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            protected: false,
            password: '',
            showDetails: false,
            fileLocation: ''
        };

        nativeService.sendMessage('fileLocation', null, this._handleFileLocation.bind(this));
    }

    _handleFileLocation(data) {
        this.setState({
            fileLocation: data
        });
    }

    render() {
        return (
            <div>
                <h1>General Options</h1>
                <div>
                    <label>Protect Budget file</label>
                    <input type="checkbox" onChange={this.protectionChanged.bind(this)}></input>
                    {this.state.protected &&
                        <div>
                            <label>Password</label>
                            <input type="password" onChange={this.passwordChanged.bind(this)}></input>
                        </div>
                    }
                </div>
                <div>
                    <label>{this.state.showDetails ? 'Hide File Details' : 'Show File Details'}</label>
                    <input type="checkbox" onChange={this.detailsChanged.bind(this)}></input>
                    {this.state.showDetails &&
                        <div>
                            <label>File</label>
                            <label>{this.state.fileLocation}</label>
                            <input type="file" accept=".json" onChange={this.fileChanged.bind(this)}/>
                        </div>
                    }
                </div>
            </div>
        )
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

    detailsChanged(event) {
        this.setState({
            showDetails: event.target.checked
        });
    }

    fileChanged(event) {
        let filePath = event.target.files[0].path;

        if (filePath) {
            console.log(`setting file path ${filePath}`);
            nativeService.sendMessage('setFileLocation', filePath);
        }

        this.setState({
            fileLocation: filePath
        });
    }
}

export default GeneralView;