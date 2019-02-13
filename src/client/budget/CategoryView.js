import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BudgetView.scss';
import nativeService from '../NativeService';

class CategoryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: this.props.match.params.id,
            items: [],
            totalSpent: 0
        }
    }

    componentDidMount() {
        nativeService.sendMessage('filteredBudgetItems', [
            {
                filterProperty: 'category',
                expectedValue: this.state.category
            }
        ], this._handleItems.bind(this));
    }

    _handleItems(items) {
        let totalSpent = 0;
        items.forEach((v, k) => {
            totalSpent += Number(v.amount);
        });

        this.setState({
            items: items,
            totalSpent: totalSpent
        });
    }

    render() {
        return (
            <div className="budget-view">
                <h1>Spending for {this.state.category}</h1>
                <div className="budget-row">
                    <span className="budget-row-item">Detail</span>
                    <span className="budget-row-item">Spent</span>
                </div>
                {this.state.items.map(v => {
                    return (
                        <div className="budget-row" key={v.detail}>
                            <span className="budget-row-item">{v.detail}</span>
                            <a href="" className="budget-row-item">{v.amount}</a>
                        </div>
                    )
                })}
                <footer>
                    Total Spent ${this.state.totalSpent}. Target $200.
                </footer>
            </div>
        )
    }
}

export default CategoryView;