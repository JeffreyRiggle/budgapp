import React, { Component } from 'react';
import { isValid } from '../../common/currencyConversion';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class AddIncomeItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: props.item.amount || 0,
            date: props.item.date || new Date(),
            source: props.item.source,
            hasError: false
        }
    }

    render() {
        return (
            <tr>
                <td>
                    <input data-testid="income-amount-input" className={`item${this.state.hasError ? ' error' : ''}`} type="text" value={this.state.amount} onChange={this.amountChanged.bind(this)}/>
                </td>
                <td>
                    <DatePicker 
                        selected={this.state.date}
                        onChange={this.dateChanged.bind(this)}
                        showTimeSelect
                        timeIntervals={5}
                        dateFormat="MMM d, yyyy h:mm aa" />
                </td>
                <td>
                    <input data-testid="income-source-input" className="item" type="text" value={this.state.source} onChange={this.sourceChanged.bind(this)}/>
                </td>
                <td><button onClick={this.removeClicked.bind(this)}>Remove</button></td>
            </tr>
        )
    }

    amountChanged(event) {
        let val = event.target.value;
        let error = !isValid(val);

        this.props.item.amount = val;
        this.setState({
            amount: val,
            hasError: error
        });
    }

    dateChanged(event) {
        this.props.item.date = event;
        this.setState({
            date: event
        });
    }

    sourceChanged(event) {
        let val = event.target.value;

        this.props.item.source = val;
        this.setState({
            source: val
        });
    }

    removeClicked() {
        if (this.props.onRemove) {
            this.props.onRemove();
        }
    }
}

export default AddIncomeItemView;