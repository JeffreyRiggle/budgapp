import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import { FilterBudgetItemsRequest, FilterCriteria } from '../../common/budget';
import { GetMonthRangeIncomeRequest } from '../../common/income';
import { useCategories } from '../hooks/use-categories';

interface HistoryFilterProps {
    onFilterChanged: (budgetRequest: FilterBudgetItemsRequest, incomeRequest: GetMonthRangeIncomeRequest) => void;
}

const HistoryFilter = (props: HistoryFilterProps) => {
    const { onFilterChanged } = props;
    const [startDate, setStartDate] = React.useState(moment(Date.now()).subtract(1, 'year').startOf('month').toDate());
    const [endDate, setEndDate] = React.useState(moment(Date.now()).endOf('month').toDate());
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [searchText, setSearchText] = React.useState('');
    const categories = [{name: 'all' }, ...useCategories()];

    function sendFilter() {
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

        onFilterChanged({
            type: 'and',
            filters: budgetFilter,
        }, { start: startDate, end: endDate });
    }

    return (
        <div>
            <label>Start Date</label>
            <DatePicker 
                selected={startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    sendFilter();
                }}
                dateFormat="MMM d, yyyy h:mm aa" />
            <label>End Date</label>
            <DatePicker 
                selected={endDate}
                onChange={(date: Date) => {
                    setEndDate(date);
                    sendFilter();
                }}
                dateFormat="MMM d, yyyy h:mm aa" />
            <label>Categories</label>
            <select value={selectedCategory} onChange={(event) => {
                setSelectedCategory(event.target.value);
                sendFilter();
            }}>
                {categories.map(category => {
                    return <option key={category.name}>{category.name}</option>
                })}
            </select>
            <label>Search</label>
            <input type="text" value={searchText} onChange={(event) => {
                setSearchText(event.target.value);
                sendFilter();
            }} />
        </div>
    );
}

export default React.memo(HistoryFilter);
