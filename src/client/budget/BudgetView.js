import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BudgetView.scss';
import { client } from '@jeffriggle/ipc-bridge-client';
import calculateScore from '../common/calculateScoreClass';
import moment from 'moment';
import { filteredBudgetItems, getExpectedIncome } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';

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
        client.sendMessage(filteredBudgetItems, {
            type: 'or',
            filters: [
                {
                    type: 'month',
                    date: this.date
                }
            ]
        }).then(this._handleItems.bind(this));

        client.sendMessage(getExpectedIncome, null).then(this.handleIncome.bind(this));
    }

    handleIncome(income) {
        this.setState({
            income: convertToDisplay(income),
            score: calculateScore(income, this.state.totalSpent)
        });
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
            totalSpent: convertToDisplay(totalSpent),
            score: calculateScore(this.state.income, totalSpent)
        });
    }

    getCategoryLink(category) {
        if (!this.props.match.params.date) {
            return `/category/${category}`; 
        }
        return `/category/${category}/${this.props.match.params.date}`;
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
                                        <td><Link to={this.getCategoryLink(v.category)}>{convertToDisplay(v.amount)}</Link></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <footer>
                    <div className="scoring">
                        <span data-testid="budget-income">Target ${this.state.income}</span>
                        <span data-testid="budget-spent">Total Spent <span className={this.state.score}>${this.state.totalSpent}</span></span> 
                    </div>
                </footer>
            </div>
        )
    }
}

export default BudgetView;