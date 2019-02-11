import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BudgetView.scss';

class BudgetView extends Component {
    render() {
        return (
            <div className="budget-view">
                <h1>This months budget</h1>
                <div>
                    <Link to="/addBudget">Add Budget Items</Link>
                </div>
                <div className="budget-row">
                    <span className="budget-row-item">Category</span>
                    <span className="budget-row-item">Spent</span>
                </div>
                <div className="budget-row">
                    <span className="budget-row-item">Test cat</span>
                    <a href="" className="budget-row-item">150.20</a>
                </div>
                <footer>
                    Total Spent 150. Target 200.
                </footer>
            </div>
        )
    }
}

export default BudgetView;