import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import AddIncomeItemView from './AddIncomeItemView';
import { client } from '@jeffriggle/ipc-bridge-client';
import { addIncomeItems } from '../../common/eventNames';

import '../AddView.scss';

class AddIncomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };
    }

    render() {
        return (
            <div className="add-view">
                <h1>Add Income</h1>
                <div className='item-table'>
                    <table>
                        <thead>
                            <tr>
                                <td>Amount</td>
                                <td>Date</td>
                                <td>Detail</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map(item => {
                                return <AddIncomeItemView item={item} onRemove={this.removeItem(item)}/>
                            })}
                        </tbody>
                    </table>
                    <button onClick={this.addItem.bind(this)} className="add-item">Add Item</button>
                </div>
                <div className="action-area">
                    <Link to="/income">Back</Link>
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
        client.sendMessage(addIncomeItems, this.state.items);
        this.setState({
            items: []
        });

        this.props.history.push('./income');
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

export default withRouter(AddIncomeView);