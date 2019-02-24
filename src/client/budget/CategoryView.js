import React, { Component } from 'react';
import './BudgetView.scss';
import nativeService from '../services/nativeService';
import moment from 'moment';

class CategoryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: this.props.match.params.id,
            items: [],
            totalSpent: 0,
            target: 0,
            displayMonth: moment(Date.now()).format('MMMM YY')
        }
    }

    componentDidMount() {
        nativeService.sendMessage('filteredBudgetItems', {
            type: 'and',
            filters: [
                {
                    type: 'equals',
                    filterProperty: 'category',
                    expectedValue: this.state.category
                },
                {
                    type: 'month',
                    date: Date.now()
                }
            ]
        }, this._handleItems.bind(this));
        
        // TODO this feels like a hack.
        nativeService.sendMessage('getCategories', null, this.handleCategories.bind(this));
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

    handleCategories(categories) {
        let targetAmount = 0;
        categories.forEach(category => {
            if (category.name === this.props.match.params.id) {
                targetAmount = category.allocated
            }
        });

        this.setState({
            target: targetAmount
        });
    }

    render() {
        return (
            <div className="budget-view">
                <h1>Spending for {this.state.category} in {this.state.displayMonth}</h1>
                <div className="budget-grid">
                    <table className="budget-table">
                        <thead>
                            <tr>
                                <td>Detail</td>
                                <td>Date</td>
                                <td>Spent</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map(v => {
                                return (
                                    <tr key={v.detail}>
                                        <td>{v.detail}</td>
                                        <td>{moment(v.date).format('dddd D')}</td>
                                        <td>{v.amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <footer>
                    Total Spent ${this.state.totalSpent}. Target ${this.state.target}.
                </footer>
            </div>
        )
    }
}

export default CategoryView;