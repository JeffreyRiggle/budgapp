import React from 'react';
import { Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';
import HistoryGraph from './HistoryGraph';
import { filteredBudgetItems, getMonthRangeIncome } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';

import './HistoryView.scss';
import { IncomeRangeEvent } from '../../common/events';
import { BudgetItem, FilterBudgetItemsRequest, FilterCriteria } from '../../common/budget';
import { GetMonthRangeIncomeRequest } from '../../common/income';
import { useCategories } from '../hooks/use-categories';

interface HistoryViewProps { }

export interface HistoryItem {
    date: string;
    amount: number;
}

function sortItems(items: HistoryItem[]): HistoryItem[] {
    return _.sortBy(items, item => {
        return moment(item.date, 'MMMM YY').toDate();
    });
}

function generateHistoryItemMap(startDate: Date, endDate: Date): Map<string, number> {
    const retVal = new Map<string, number>();
    const iterDate = moment(startDate);

    while (iterDate.toDate() <= endDate) {
        retVal.set(iterDate.format('MMMM YY'), 0);
        iterDate.add(1, 'month');
    }
    return retVal;
}

const HistoryView = (props: HistoryViewProps) => {
    const [income, setIncome] = React.useState(new Map<string, number>());
    const [spending, setSpending] = React.useState([] as HistoryItem[]);
    const [earning, setEarning] = React.useState([] as HistoryItem[]);
    const [startDate, setStartDate] = React.useState(moment(Date.now()).subtract(1, 'year').startOf('month').toDate());
    const [endDate, setEndDate] = React.useState(moment(Date.now()).endOf('month').toDate());
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [searchText, setSearchText] = React.useState('');
    const categories = [{name: 'all' }, ...useCategories()];

    function handleItems(items: HistoryItem[]) {
        const itemMap = generateHistoryItemMap(startDate, endDate);

        items.forEach(item => {
            const month = moment(item.date).format('MMMM YY');

            let existing = itemMap.get(month);
            if (!existing) {
                itemMap.set(month, Number(item.amount));
                return;
            }

            existing += Number(item.amount);
            itemMap.set(month, existing);
        });

        const newItems: HistoryItem[] = [];
        itemMap.forEach((amount, date) => {
            newItems.push({
                date: date,
                amount: amount
            });
        });

        setSpending(sortItems(newItems));
    }

    function handleIncome(incomeItems: IncomeRangeEvent) {
        const newIncome = new Map();
        const newItems: HistoryItem[] = [];
        const showIncome = selectedCategory === 'all' && !searchText;

        incomeItems.forEach(item => {
            const total = _.sumBy(item.items, (item) => { return Number(item.amount); });
            newIncome.set(moment(item.date).format('MMMM YY'), total);
        });

        newIncome.forEach((v, k) => {
            newItems.push({
                amount: showIncome ? v : 0,
                date: k,
            });
        });

        setIncome(newIncome);
        setEarning(sortItems(newItems));
    }

    React.useEffect(() => {
        const budgetFilter: FilterCriteria[] = [{
            type: 'daterange',
            start: startDate,
            end: endDate,
        }];

        if (selectedCategory !== 'all') {
            budgetFilter.push({ type: 'equals', expectedValue: selectedCategory, filterProperty: 'category' });
        }
        
        if (searchText) {
            budgetFilter.push({ type: 'like', expectedValue: searchText, filterProperty: 'detail' });
        }

        client.sendMessage<FilterBudgetItemsRequest, BudgetItem[]>(filteredBudgetItems, {
            type: 'and',
            filters: budgetFilter,
        }).then(handleItems);

        client.sendMessage<GetMonthRangeIncomeRequest, IncomeRangeEvent>(getMonthRangeIncome, {
            start: startDate,
            end: endDate,
        }).then(handleIncome);
    }, [client, startDate, endDate, selectedCategory, searchText]);

    return (
        <div className="budget-view">
            <h1>History</h1>
            <div>
                <label>Start Date</label>
                <DatePicker 
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    dateFormat="MMM d, yyyy h:mm aa" />
                <label>End Date</label>
                <DatePicker 
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    dateFormat="MMM d, yyyy h:mm aa" />
                <label>Categories</label>
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                    {categories.map(category => {
                        return <option key={category.name}>{category.name}</option>
                    })}
                </select>
                <label>Search</label>
                <input type="text" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
            </div>
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
                    {spending.map(v => {
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