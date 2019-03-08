import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import AddBudgetItemView from './AddBudgetItemView';
import nativeService from '../services/nativeService';
import { addBudgetItems } from '../../common/eventNames';

import '../AddView.scss';

class AddBudgetItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };

        this.nextId = 0;
    }

    render() {
        return (
            <div className="add-view">
                <h1>Add Budget Items</h1>
                <div className="item-table">
                    <table>
                        <thead>
                            <tr>
                                <td>Amount</td>
                                <td>Category</td>
                                <td>Date</td>
                                <td>Detail</td>
                                <td></td>
                            </tr> 
                        </thead>
                        <tbody>
                            {this.state.items.map(item => {
                                return <AddBudgetItemView key={item.id} item={item} onRemove={this.removeItem(item)}/>
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
        this.state.items.push({id: this.nextId++});
        this.setState({
            items: this.state.items
        });
    }

    addItems() {
        this.state.items.forEach(item => {
            delete item.id;
        });

        nativeService.sendMessage(addBudgetItems, this.state.items);
        this.props.history.push('./budget');
    }

    removeItem(item) {
        return () => {
            let ind = this.state.items.indexOf(item);

            if (ind !== -1) {
                this.state.items.splice(ind, 1);
            }

            this.setState({
                items: this.state.items
            });
        }
    }
}

export default withRouter(AddBudgetItems);