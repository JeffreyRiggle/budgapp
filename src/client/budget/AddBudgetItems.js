import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import AddBudgetItemView from './AddBudgetItemView';
import { client } from '@jeffriggle/ipc-bridge-client';
import { addBudgetItems } from '../../common/eventNames';

import '../AddView.scss';

class AddBudgetItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            sharedDate: Date.now(),
            useSharedDate: false
        };

        this.nextId = 0;
    }

    render() {
        return (
            <div className="add-view">
                <h1>Add Budget Items</h1>
                <div>
                    <input type="checkbox" onChange={this.toggleDate.bind(this)} data-testid="shared-date"/>
                    <label>Use shared date?</label>
                    { this.state.useSharedDate && <DatePicker 
                        selected={this.state.sharedDate}
                        onChange={this.dateChanged.bind(this)}
                        dateFormat="MMM d, yyyy h:mm aa" />}
                </div>
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
                    <button onClick={this.addItem.bind(this)} className="add-item" data-testid="add-budget-item">Add Item</button>
                </div>
                <div className="action-area">
                    <Link to="/budget">Back</Link>
                    <button onClick={this.addItems.bind(this)}>Add</button>
                </div>
            </div>
        )
    }

    toggleDate(event) {
        this.setState({
            useSharedDate: event.target.checked
        });
    }

    dateChanged(newDate) {
        this.setState({
            sharedDate: newDate,
            items: this.state.items
        });
    }

    addItem() {
        let item = {id: this.nextId++};

        if (this.state.useSharedDate) {
            item.date = this.state.sharedDate;
        }

        this.state.items.push(item);
        this.setState({
            items: this.state.items
        });
    }

    addItems() {
        this.state.items.forEach(item => {
            delete item.id;
        });

        client.sendMessage(addBudgetItems, this.state.items).then(() => {
            this.props.history.push('./budget');
        });
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