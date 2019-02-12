import React, { Component } from 'react';

class AddBudgetItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: props.item.amount || 0,
            category: props.item.category,
            date: props.item.date || new Date(),
            detail: props.item.detail
        }
    }

    render() {
        return (
            <div className="col">
                <input className="item" type="text" value={this.state.amount} onChange={this.amountChanged.bind(this)}/>
                <input className="item" type="text" value={this.state.category} onChange={this.categoryChanged.bind(this)}/>
                <input className="item" type="text" value={this.state.date} onChange={this.dateChanged.bind(this)}/>
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
        let val = event.target.value;

        this.props.item.date = val;
        this.setState({
            date: val
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