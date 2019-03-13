import React, { Component } from 'react';
import './BudgetView.scss';
import nativeService from '../services/nativeService';
import EditableLabel from '../common/EditableLabel';
import calculateScore from '../common/calculateScoreClass';
import moment from 'moment';
import { filteredBudgetItems, updateBudgetItem, getCategory } from '../../common/eventNames';

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
        nativeService.sendMessage(filteredBudgetItems, {
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
        }, this._handleItems.bind(this));
        
        nativeService.sendMessage(getCategory, {
            category: this.state.category,
            date: this.date,
            includeRollover: true
        }, this.handleCategories.bind(this));
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
                                        <td><EditableLabel value={v.amount} onChange={this.handleItemChange(v)}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <footer>
                    <div className="scoring">
                        <span>Target ${this.state.target}</span>
                        <span>Total Spent <span className={this.state.score}>${this.state.totalSpent}</span></span> 
                    </div>
                </footer>
            </div>
        )
    }

    handleItemChange(item) {
        return (value) => {
            item.amount = value;

            nativeService.sendMessage(updateBudgetItem, item);
        }
    }
}

export default CategoryView;