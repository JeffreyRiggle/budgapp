import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import AddIncomeItemView from './AddIncomeItemView';
import nativeService from '../services/nativeService';

class AddIncomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };
    }

    render() {
        return (
            <div>
                <h1>Add Income</h1>
                <div className='add-budget-grid'>
                    <div className="col">
                        <span className="item">Amount</span>
                        <span className="item">Date</span>
                        <span className="item">Detail</span>
                    </div>
                    {this.state.items.map(item => {
                        return <AddIncomeItemView item={item}/>
                    })}
                </div>
                <button onClick={this.addItem.bind(this)}>Add Item</button>
                <Link to="/income">Back</Link>
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
        nativeService.sendMessage('addIncomeItems', this.state.items);
        this.setState({
            items: []
        });

        this.props.history.push('./income');
    }
}

export default withRouter(AddIncomeView);