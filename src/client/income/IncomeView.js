import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import nativeService from '../services/nativeService';

class IncomeView extends Component {
    constructor(props) {
        super(props);

        this.date = Date.now();

        if (this.props.match.params.date) {
            this.date = moment(this.props.match.params.date, 'MMMM YY').toDate()
        }

        this.state = {
            month: moment(this.date).format('MMMM'),
            totalIncome: 0,
            target: 0,
            items: [],
            score: 'good-score'
        }
    }

    componentDidMount() {
        nativeService.sendMessage('getMonthIncome', this.date, this.handleIncomeItems.bind(this));
        nativeService.sendMessage('getExpectedIncome', null, this.handleIncome.bind(this));
    }

    handleIncomeItems(items) {
        let total = 0;

        items.forEach(item => {
            total += Number(item.amount);
        });

        this.setState({
            items: items,
            totalIncome: total,
            score: this.getScore(this.state.target, total)
        });
    }

    handleIncome(income) {
        this.setState({
            target: income,
            score: this.getScore(income, this.state.totalIncome)
        });
    }

    getScore(target, total) {
        let difference = total - target;

        if (difference >= 0) {
            return 'good-score';
        }

        if ((total - (target / 2)) >= 0) {
            return 'warn-score';
        }

        return 'bad-score';
    }

    render() {
        return (
            <div className="budget-view">
                <h1>Income for {this.state.month}</h1>
                <div>
                    <Link to="/addIncome">Add Income</Link>
                </div>
                <div className="budget-row">
                    <span className="budget-row-item">Date</span>
                    <span className="budget-row-item">Source</span>
                    <span className="budget-row-item">Amount</span>
                </div>
                {this.state.items.map(v => {
                    return (
                        <div className="budget-row" key={v.date}>
                            <span className="budget-row-item">{v.source}</span>
                            <span className="budget-row-item">{moment(v.date).format('dddd D')}</span>
                            <a href="" className="budget-row-item">{v.amount}</a>
                        </div>
                    )
                })}
                <footer>
                    <div className="scoring">
                        <span>Target ${this.state.target}</span>
                        <span>Total earned <span className={this.state.score}>${this.state.totalIncome}</span></span> 
                    </div>
                </footer>
            </div>
        );
    }
}

export default IncomeView;