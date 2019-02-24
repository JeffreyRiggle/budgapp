import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BudgetView.scss';
import nativeService from '../services/nativeService';
import moment from 'moment';

class BudgetView extends Component {
    constructor(props) {
        super(props);

        this.date = Date.now();

        if (this.props.match.params.date) {
            this.date = moment(this.props.match.params.date, 'MMMM YY').toDate()
        }

        this.state = {
            categories: [],
            totalSpent: 0,
            month: moment(this.date).format('MMMM'),
            income: 0,
            score: 'good-score'
        }
    }

    componentDidMount() {
        nativeService.sendMessage('filteredBudgetItems', {
            type: 'or',
            filters: [
                {
                    type: 'month',
                    date: this.date
                }
            ]
        }, this._handleItems.bind(this));

        nativeService.sendMessage('getExpectedIncome', null, this.handleIncome.bind(this));
    }

    handleIncome(income) {
        this.setState({
            income: income
        });

        this._updateScore(income, this.state.totalSpent);
    }

    _handleItems(items) {
        let catmap = new Map();
        items.forEach(v => {
            let existing = catmap.get(v.category);

            if (existing) {
                catmap.set(v.category, existing + Number(v.amount));
            } else {
                catmap.set(v.category, Number(v.amount));
            }
        });

        let totalSpent = 0;
        let catArray = [];
        catmap.forEach((v, k) => {
            catArray.push({category: k, amount: v});
            totalSpent += Number(v);
        });

        this.setState({
            categories: catArray,
            totalSpent: totalSpent
        });

        this._updateScore(this.state.income, totalSpent);
    }

    _updateScore(income, totalSpent) {
        let newScore = 'good-score';
        let difference = income - totalSpent;
        if (difference > (.05 * income)) {
            newScore = 'warn-score';
        }
        else if (difference < 0) {
            newScore = 'bad-score';
        }

        this.setState({
            score: newScore
        });
    }

    render() {
        return (
            <div className="budget-view">
                <h1>{this.state.month} Budget</h1>
                <div>
                    <Link to="/addBudget">Add Budget Items</Link>
                </div>
                <div className="budget-grid">
                    <table className="budget-table">
                        <thead>
                            <tr>
                                <td>Category</td>
                                <td>Spent</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.categories.map(v => {
                                return (
                                    <tr key={v.category}>
                                        <td>{v.category}</td>
                                        <td><Link to={`/category/${v.category}`}>{v.amount}</Link></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <footer>
                    <div className="scoring">
                        <span>Target ${this.state.income}</span>
                        <span>Total Spent <span className={this.state.score}>${this.state.totalSpent}</span></span> 
                    </div>
                </footer>
            </div>
        )
    }
}

export default BudgetView;