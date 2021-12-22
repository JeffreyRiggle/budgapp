import React from 'react';
import { Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import moment from 'moment';
import _ from 'lodash';
import HistoryGraph from './HistoryGraph';
import { filteredBudgetItems, getMonthRangeIncome } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';

import './HistoryView.scss';

const HistoryView = (props) => {
    const [items, setItems] = React.useState([]);
    const [income, setIncome] = React.useState(new Map());
    const [spending, setSpending] = React.useState([]);
    const [earning, setEarning] = React.useState([]);

    function prepareSpending(items) {
        return _.sortBy(items, item => {
            return moment(item.date, 'MMMM YY').toDate();
        });
    }

    function prepareEarning(income, items) {
        const retVal = [];
        const budgetItems = prepareSpending(items);

        budgetItems.forEach(item => {
            retVal.push(income.get(item.date) || 0);
        });

        return retVal;
    }

    function handleItems(items) {
        const itemMap = new Map();

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

        const newItems = [];
        itemMap.forEach((amount, date) => {
            newItems.push({
                date: date,
                amount: amount
            });
        });

        setItems(newItems);
        setSpending(prepareSpending(newItems));
        setEarning(prepareEarning(income, newItems));
    }

    function handleIncome(items) {
        const newIncome = new Map();

        items.forEach(item => {
            const total = _.sumBy(item.items, (item) => { return Number(item.amount); });
            newIncome.set(moment(item.date).format('MMMM YY'), total);
        });

        setIncome(newIncome);
        setEarning(prepareEarning(newIncome, items));
    }

    React.useEffect(() => {
        const startdate = moment(Date.now()).subtract(1, 'year').startOf('month');
        const enddate = moment(Date.now()).endOf('month');

        client.sendMessage(filteredBudgetItems, {
            type: 'or',
            filters: [
                {
                    type: 'daterange',
                    start: startdate.toDate(),
                    end: enddate.toDate()
                }
            ]
        }).then(handleItems);

        client.sendMessage(getMonthRangeIncome, {
            start: startdate.toDate(),
            end: enddate.toDate()
        }).then(handleIncome);
    }, [client]);

    return (
        <div className="budget-view">
            <h1>History</h1>
            <table>
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Earned</td>
                        <td>Spent</td>
                        <td>Margin</td>
                    </tr>
                </thead>
                <tbody>
                    {items.map(v => {
                        let earned = income.get(v.date) || 0;
                        let difference = earned - v.amount;
                        return (
                            <tr key={v.date}>
                                <td>{v.date}</td>
                                <td><Link to={`/income/${v.date}`}>{convertToDisplay(earned)}</Link></td>
                                <td><Link to={`/budget/${v.date}`}>{convertToDisplay(v.amount)}</Link></td>
                                <td className={difference < 0 ? 'bad-score' : 'good-score'}>{convertToDisplay(difference)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <HistoryGraph spending={spending} earning={earning}></HistoryGraph>
        </div>
    );
}

export default React.memo(HistoryView);