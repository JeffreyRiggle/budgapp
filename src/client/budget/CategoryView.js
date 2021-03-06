import React, { Component } from 'react';
import './BudgetView.scss';
import { client } from '@jeffriggle/ipc-bridge-client';
import EditableLabel from '../common/EditableLabel';
import calculateScore from '../common/calculateScoreClass';
import moment from 'moment';
import { filteredBudgetItems, updateBudgetItem, getCategory } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';

class CategoryView extends Component {
    constructor(props) {
        super(props);

        this.date = Date.now();

        if (this.props.match.params.date) {
            this.date = moment(this.props.match.params.date, 'MMMM YY').toDate();
        }

        this.state = {
            category: this.props.match.params.id,
            items: [],
            totalSpent: 0,
            target: 0,
            displayMonth: moment(this.date).format('MMMM YY'),
            score: 'good-score'
        }
    }

    componentDidMount() {
        client.sendMessage(filteredBudgetItems, {
            type: 'and',
            filters: [
                {
                    type: 'equals',
                    filterProperty: 'category',
                    expectedValue: this.state.category
                },
                {
                    type: 'month',
                    date: this.date
                }
            ]
        }).then(this._handleItems.bind(this));
        
        client.sendMessage(getCategory, {
            category: this.state.category,
            date: this.date,
            includeRollover: true
        }).then(this.handleCategories.bind(this));
    }

    _handleItems(items) {
        let totalSpent = 0;
        items.forEach((v, k) => {
            totalSpent += Number(v.amount);
        });

        this.setState({
            items: items,
            totalSpent: totalSpent,
            score: calculateScore(this.state.target, totalSpent)
        });
    }

    handleCategories(category) {
        let target = category.allocated || 0
        this.setState({
            target: target,
            score: calculateScore(target, this.state.totalSpent)
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
                                    <tr key={v.id}>
                                        <td>{v.detail}</td>
                                        <td>{moment(v.date).format('dddd D')}</td>
                                        <td><EditableLabel value={convertToDisplay(v.amount)} onChange={this.handleItemChange(v)}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <footer>
                    <div className="scoring">
                        <span data-testid="category-target">Target ${convertToDisplay(this.state.target)}</span>
                        <span data-testid="category-spend">Total Spent <span className={this.state.score}>${convertToDisplay(this.state.totalSpent)}</span></span> 
                    </div>
                </footer>
            </div>
        )
    }

    handleItemChange(item) {
        return (value) => {
            item.amount = value;

            client.sendMessage(updateBudgetItem, item);
        }
    }
}

export default CategoryView;