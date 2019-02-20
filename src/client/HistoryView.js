import React, { Component } from 'react';
import nativeService from './services/nativeService';
import moment from 'moment';

class HistoryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
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

    render() {
        return (
            <div className="budget-view">
                <h1>History View!</h1>
                <div className="budget-row">
                    <span className="budget-row-item">Date</span>
                    <span className="budget-row-item">Amount</span>
                </div>
                {this.state.items.map(v => {
                    return (
                        <div className="budget-row" key={v.date}>
                            <span className="budget-row-item">{v.date}</span>
                            <a href="" className="budget-row-item">{v.amount}</a>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default HistoryView;