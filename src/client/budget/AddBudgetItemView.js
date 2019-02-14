import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import nativeService from '../NativeService';
import _ from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';

class AddBudgetItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: props.item.amount || 0,
            category: props.item.category,
            knownCategories: [{name: ''}],
            date: props.item.date || new Date(),
            detail: props.item.detail
        }
    }

    componentDidMount() {
        nativeService.sendMessage('getCategories', null, this.handleCategories.bind(this));
    }

    handleCategories(categories) {
        this.setState({
            knownCategories: _.union(this.state.knownCategories, categories)
        });
    }

    render() {
        return (
            <div className="col">
                <input className="item" type="text" value={this.state.amount} onChange={this.amountChanged.bind(this)}/>
                <select className="item" value={this.state.category} onChange={this.categoryChanged.bind(this)}>
                    {this.state.knownCategories.map(category => {
                        return <option>{category.name}</option>
                    })}
                </select>
                <DatePicker 
                    selected={this.state.date}
                    onChange={this.dateChanged.bind(this)}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="MMM d, yyyy h:mm aa" />
                <input className="item" type="text" value={this.state.detail} onChange={this.detailChanged.bind(this)}/>
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
}

export default AddBudgetItemView;