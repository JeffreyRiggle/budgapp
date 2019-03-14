import React, { Component } from 'react';
import nativeService from '../services/nativeService';
import CategoryConfiguration from './CategoryConfiguration';
import { fileLocation, getExpectedIncome, setFileLocation, setExpectedIncome, setPassword } from '../../common/eventNames';
import { isValid, convertToNumeric, convertToDisplay } from '../../common/currencyConversion';
import './GeneralView.scss';

class GeneralView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            protected: false,
            password: '',
            showDetails: false,
            fileLocation: '',
            income: 0,
            incomeError: false
        };
    }

    componentDidMount() {
        nativeService.sendMessage(fileLocation, null, this.handleFileLocation.bind(this));
        nativeService.sendMessage(getExpectedIncome, null, this.handleIncome.bind(this));
    }

    handleFileLocation(data) {
        this.setState({
            fileLocation: data
        });
    }

    handleIncome(income) {
        this.setState({
            income: convertToDisplay(income)
        });
    }

    render() {
        return (
            <div className="general-view">
                <h1 className="title">General Options</h1>
                <div className="income-details">
                    <label>Expected Monthly income</label>
                    <input className={this.state.incomeError ? 'error' : ''} type="text" value={this.state.income} onChange={this.incomeChanged.bind(this)}></input>
                </div>
                <CategoryConfiguration/>
                <div className="additional-options">
                    <div className="expanding-option">
                        <label>Protect Budget file</label>
                        <input type="checkbox" onChange={this.protectionChanged.bind(this)}></input>
                        {this.state.protected &&
                            <div>
                                <label>Password</label>
                                <input type="password" onChange={this.passwordChanged.bind(this)}></input>
                                <button onClick={this.setPassword.bind(this)}>Set Password</button>
                            </div>
                        }
                    </div>
                    <div className="expanding-option">
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
            nativeService.sendMessage(setFileLocation, filePath);
        }

        this.setState({
            fileLocation: filePath
        });
    }

    incomeChanged(event) {
        let val = event.target.value;
        let incomeError = !isValid(val);

        if (!incomeError) {
            nativeService.sendMessage(setExpectedIncome, convertToNumeric(val));
        }
        
        this.setState({
            income: val,
            incomeError: incomeError
        });
    }

    setPassword() {
        nativeService.sendMessage(setPassword, this.state.password);
    }
}

export default GeneralView;