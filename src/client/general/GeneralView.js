import React, { Component } from 'react';
import nativeService from '../NativeService';
import CategoryConfiguration from './CategoryConfiguration';

class GeneralView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            protected: false,
            password: '',
            showDetails: false,
            fileLocation: '',
            income: 0
        };
    }

    componentDidMount() {
        nativeService.sendMessage('fileLocation', null, this.handleFileLocation.bind(this));
    }

    handleFileLocation(data) {
        this.setState({
            fileLocation: data
        });
    }

    render() {
        return (
            <div>
                <h1>General Options</h1>
                <div>
                    <label>Expected Monthly income</label>
                    <input type="text" value={this.state.income} onChange={this.incomeChanged.bind(this)}></input>
                </div>
                <CategoryConfiguration/>
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

    incomeChanged(event) {
        let converted = Number(event.target.value);

        if (!converted && converted !== 0) {
            return;
        }

        this.setState({
            income: event.target.value
        });
    }
}

export default GeneralView;