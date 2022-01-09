import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import HistoryGraph from './HistoryGraph';
import { convertToDisplay } from '../../common/currencyConversion';

import './HistoryView.scss';
import { IncomeRangeEvent } from '../../common/events';
import { BudgetItem, FilterBudgetItemsRequest } from '../../common/budget';
import { GetMonthRangeIncomeRequest } from '../../common/income';
import HistoryFilter from './HistoryFilter';
import { useCategories } from '../hooks/use-categories';
import { Category } from '../../common/category';
import { useFilterBudgetItems } from '../hooks/use-filter-budget-items';
import { useFilterIncome } from '../hooks/use-filter-income';

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

function getCategoryAmountFromFilter(categories: Category[], filter: FilterBudgetItemsRequest): number {
    const searchCategory = filter.filters.find(f => f.filterProperty === 'category');
    if (!searchCategory) {
        return 0;
    }

    const category = categories.find(c => c.name === searchCategory.expectedValue);
    return category ? category.allocated : 0;
}

const HistoryView = (props: HistoryViewProps) => {
    const [income, setIncome] = React.useState(new Map<string, number>());
    const [spending, setSpending] = React.useState([] as HistoryItem[]);
    const [earning, setEarning] = React.useState([] as HistoryItem[]);
    const [budgetFilter, setBudgetFilter] = React.useState({
        type: 'and',
        filters: [
            {
                type: 'daterange',
                start: moment(Date.now()).subtract(1, 'year').startOf('month').toDate(),
                end: moment(Date.now()).endOf('month').toDate(),
            }
        ]
    } as FilterBudgetItemsRequest);
    const [incomeFilter, setIncomeFilter] = React.useState({
        start: moment(Date.now()).subtract(1, 'year').startOf('month').toDate(),
        end: moment(Date.now()).endOf('month').toDate(),
    } as GetMonthRangeIncomeRequest);
    const categories = useCategories();
    const showIncome = budgetFilter.filters.length === 1;
    const categoryAmount = getCategoryAmountFromFilter(categories, budgetFilter);
    function handleItems(items: BudgetItem[]) {
        const itemMap = generateHistoryItemMap(incomeFilter.start, incomeFilter.end);

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

        incomeItems.forEach(item => {
            const total = _.sumBy(item.items, (item) => { return Number(item.amount); });
            newIncome.set(moment(item.date).format('MMMM YY'), total);
        });

        newIncome.forEach((v, k) => {
            newItems.push({
                amount: showIncome ? v : categoryAmount,
                date: k,
            });
        });

        setIncome(newIncome);
        setEarning(sortItems(newItems));
    }

    const budgetItems = useFilterBudgetItems(budgetFilter);
    const incomeItems = useFilterIncome(incomeFilter);

    React.useEffect(() => {
        handleItems(budgetItems);
    }, [budgetItems]);

    React.useEffect(() => {
        handleIncome(incomeItems);
    }, [incomeItems]);

    return (
        <div className="budget-view">
            <h1>History</h1>
            <HistoryFilter onFilterChanged={(budgetFilter, incomeFilter) => {
                setBudgetFilter(budgetFilter);
                setIncomeFilter(incomeFilter);
            }}/>
            <table>
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Earned</td>
                        <td>{ showIncome ? 'Spent' : 'Allocated' }</td>
                        <td>Margin</td>
                    </tr>
                </thead>
                <tbody>
                    {spending.map(v => {
                        let earned = showIncome ? (income.get(v.date) || 0) : categoryAmount;
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