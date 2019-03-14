import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import nativeService from '../services/nativeService';
import { getCategories } from '../../common/eventNames';
import { isValid } from '../../common/currencyConversion';
import _ from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';

class AddBudgetItemView extends Component {
    constructor(props) {
        super(props);

        if (!props.item.date) {
            props.item.date = new Date();
        }

        this.state = {
            amount: props.item.amount || 0,
            category: props.item.category,
            knownCategories: [{name: ''}],
            date: props.item.date,
            detail: props.item.detail,
            hasError: false
        }
    }

    componentDidMount() {
        nativeService.sendMessage(getCategories, null, this.handleCategories.bind(this));
    }

    handleCategories(categories) {
        this.setState({
            knownCategories: _.union(this.state.knownCategories, categories)
        });
    }

    render() {
        return (
            <tr>
                <td>
                    <input className={`input-data${this.state.hasError ? ' error' : ''}`} type="text" value={this.state.amount} onChange={this.amountChanged.bind(this)}/>
                </td>
                <td>
                    <select className="input-data" value={this.state.category} onChange={this.categoryChanged.bind(this)}>
                        {this.state.knownCategories.map(category => {
                            return <option key={category.name}>{category.name}</option>
                        })}
                    </select>
                </td>
                <td>
                    <DatePicker 
                        selected={this.state.date}
                        onChange={this.dateChanged.bind(this)}
                        dateFormat="MMM d, yyyy h:mm aa" />
                </td>
                <td>
                    <input className="input-data" type="text" value={this.state.detail} onChange={this.detailChanged.bind(this)}/>
                </td>
                <td><button className="input-data" onClick={this.removeClicked.bind(this)}>Remove</button></td>
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

    categoryChanged(event) {
        let val = event.target.value;

        this.props.item.category = val;
        this.setState({
            category: val
        });
    }

    dateChanged(event) {
        this.props.item.date = event;
        this.setState({
            date: event
        });
    }

    detailChanged(event) {
        let val = event.target.value;

        this.props.item.detail = val;
        this.setState({
            detail: val
        });
    }

    removeClicked() {
        if (this.props.onRemove) {
            this.props.onRemove();
        }
    }
}

export default AddBudgetItemView;