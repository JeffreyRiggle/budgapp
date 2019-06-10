import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import CategoryConfiguration from './CategoryConfiguration';
import { getExpectedIncome, setExpectedIncome } from '../../common/eventNames';
import { isValid, convertToNumeric, convertToDisplay } from '../../common/currencyConversion';
import './GeneralView.scss';

class GeneralView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            income: 0,
            incomeError: false
        };

        this.boundAvailable = this.onAvailable.bind(this);
    }

    componentDidMount() {
        if (!client.available) {
            client.on(client.availableChanged, this.boundAvailable);
        } else {
            client.sendMessage(getExpectedIncome, null).then(this.handleIncome.bind(this));
        }
    }

    onAvailable(value) {
        if (value) {
            client.sendMessage(getExpectedIncome, null).then(this.handleIncome.bind(this));
            client.removeListener(client.availableChanged, this.boundAvailable);
        }
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
                <Link to="/storage">Storage Options</Link>
            </div>
        )
    }

    incomeChanged(event) {
        let val = event.target.value;
        let incomeError = !isValid(val);

        if (!incomeError) {
            client.sendMessage(setExpectedIncome, convertToNumeric(val));
        }
        
        this.setState({
            income: val,
            incomeError: incomeError
        });
    }
}

export default GeneralView;