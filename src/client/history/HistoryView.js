import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import nativeService from '../services/nativeService';
import moment from 'moment';
import _ from 'lodash';
import HistoryGraph from './HistoryGraph';
import './HistoryView.scss';

class HistoryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            income: new Map()
        }
    }

    componentDidMount() {
        let startdate = moment(Date.now()).subtract(1, 'year').startOf('month');
        let enddate = moment(Date.now()).endOf('month');

        nativeService.sendMessage('filteredBudgetItems', {
            type: 'or',
            filters: [
                {
                    type: 'daterange',
                    start: startdate.toDate(),
                    end: enddate.toDate()
                }
            ]
        }, this._handleItems.bind(this));

        nativeService.sendMessage('getMonthRangeIncome', {
            start: startdate.toDate(),
            end: enddate.toDate()
        }, this._handleIncome.bind(this));
    }

    _handleItems(items) {
        let itemMap = new Map();

        items.forEach(item => {
            let month = moment(item.date).format('MMMM YY');

            let existing = itemMap.get(month);
            if (!existing) {
                itemMap.set(month, Number(item.amount));
                return;
            }

            existing += Number(item.amount);
            itemMap.set(month, existing);
        });

        let newItems = [];
        itemMap.forEach((amount, date) => {
            newItems.push({
                date: date,
                amount: amount
            });
        });

        this.setState({
            items: newItems
        });
    }

    _handleIncome(items) {
        let newIncome = new Map();

        items.forEach(item => {
            let total = _.sumBy(item.items, (item) => { return Number(item.amount); });
            newIncome.set(moment(item.date).format('MMMM YY'), total);
        });

        this.setState({
            income: newIncome
        });
    }

    prepareEarning() {
        let retVal = [];
        let budgetItems = this.prepareSpending();

        budgetItems.forEach(item => {
            retVal.push(this.state.income.get(item.date) || 0);
        });

        return retVal;
    }

    prepareSpending() {
        return _.sortBy(this.state.items, item => {
            return moment(item.date, 'MMMM YY').toDate();
        });
    }

    render() {
        return (
            <div className="budget-view">
                <h1>History View!</h1>
                <div className="budget-row">
                    <span className="budget-row-item">Date</span>
                    <span className="budget-row-item">Earned</span>
                    <span className="budget-row-item">Spent</span>
                    <span className="budget-row-item">Margin</span>
                </div>
                {this.state.items.map(v => {
                    let earned = this.state.income.get(v.date) || 0;
                    return (
                        <div className="budget-row" key={v.date}>
                            <span className="budget-row-item">{v.date}</span>
                            <Link to={`/income/${v.date}`} className="budget-row-item">{earned}</Link>
                            <Link to={`/budget/${v.date}`} className="budget-row-item">{v.amount}</Link>
                            <span className="budget-row-item">{earned - v.amount}</span>
                        </div>
                    )
                })}
                <HistoryGraph spending={this.prepareSpending()} earning={this.prepareEarning()}></HistoryGraph>
            </div>
        )
    }
}

export default HistoryView;