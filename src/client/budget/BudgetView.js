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

        let newScore = 'good-score';
        let difference = this.state.income - totalSpent;
        if (difference > (.05 * this.state.income)) {
            newScore = 'warn-score';
        }
        else if (difference < 0) {
            newScore = 'bad-score';
        }

        this.setState({
            categories: catArray,
            totalSpent: totalSpent,
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
                <div className="budget-row">
                    <span className="budget-row-item">Category</span>
                    <span className="budget-row-item">Spent</span>
                </div>
                {this.state.categories.map(v => {
                    return (
                        <div className="budget-row" key={v.category}>
                            <span className="budget-row-item">{v.category}</span>
                            <Link to={`/category/${v.category}`} className="budget-row-item">{v.amount}</Link>
                        </div>
                    )
                })}
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