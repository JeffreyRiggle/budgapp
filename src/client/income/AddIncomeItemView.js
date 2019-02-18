import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class AddIncomeItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: props.item.amount || 0,
            date: props.item.date || new Date(),
            detail: props.item.detail
        }
    }

    render() {
        return (
            <div className="col">
                <input className="item" type="text" value={this.state.amount} onChange={this.amountChanged.bind(this)}/>
                <DatePicker 
                    selected={this.state.date}
                    onChange={this.dateChanged.bind(this)}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="MMM d, yyyy h:mm aa" />
                <input className="item" type="text" value={this.state.source} onChange={this.sourceChanged.bind(this)}/>
            </div>
        )
    }

    amountChanged(event) {
        let val = event.target.value;

        this.props.item.amount = val;
        this.setState({
            amount: val
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
}

export default AddIncomeItemView;