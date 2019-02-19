import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddBudgetItemView from './AddBudgetItemView';
import nativeService from '../services/nativeService';

import './AddBudget.scss';

class AddBudgetItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };
    }

    render() {
        return (
            <div>
                <h1>Add Budget Items</h1>
                <div className='add-budget-grid'>
                    <div className="col">
                        <span className="item">Amount</span>
                        <span className="item">Category</span>
                        <span className="item">Date</span>
                        <span className="item">Detail</span>
                    </div>
                    {this.state.items.map(item => {
                        return <AddBudgetItemView item={item}/>
                    })}
                </div>
                <button onClick={this.addItem.bind(this)}>Add Item</button>
                <Link to="/budget">Back</Link>
                <button onClick={this.addItems.bind(this)}>Add</button>
            </div>
        )
    }

    addItem() {
        this.state.items.push({});
        this.setState({
            items: this.state.items
        });
    }

    addItems() {
        nativeService.sendMessage('addBudgetItems', this.state.items);
        this.setState({
            items: []
        });
    }
}

export default AddBudgetItems;