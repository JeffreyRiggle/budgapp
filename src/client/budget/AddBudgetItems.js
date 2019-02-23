import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
            <div className="add-budget-view">
                <h1>Add Budget Items</h1>
                <div className="item-table">
                    <table>
                        <thead>
                            <tr>
                                <td>Amount</td>
                                <td>Category</td>
                                <td>Date</td>
                                <td>Detail</td>
                            </tr> 
                        </thead>
                        <tbody>
                            {this.state.items.map(item => {
                                return <AddBudgetItemView item={item}/>
                            })}
                        </tbody>
                    </table>
                    <button onClick={this.addItem.bind(this)} className="add-item">Add Item</button>
                </div>
                <div className="action-area">
                    <Link to="/budget">Back</Link>
                    <button onClick={this.addItems.bind(this)}>Add</button>
                </div>
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

        this.props.history.push('./budget');
    }
}

export default withRouter(AddBudgetItems);