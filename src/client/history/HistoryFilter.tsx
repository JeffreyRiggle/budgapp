import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import { FilterBudgetItemsRequest, FilterCriteria } from '../../common/budget';
import { GetMonthRangeIncomeRequest } from '../../common/income';
import { useCategories } from '../hooks/use-categories';
import './HistoryFilter.scss';

interface HistoryFilterProps {
    onFilterChanged: (budgetRequest: FilterBudgetItemsRequest, incomeRequest: GetMonthRangeIncomeRequest) => void;
}

const HistoryFilter = (props: HistoryFilterProps) => {
    const { onFilterChanged } = props;
    const [startDate, setStartDate] = React.useState(moment(Date.now()).subtract(1, 'year').startOf('month').toDate());
    const [endDate, setEndDate] = React.useState(moment(Date.now()).endOf('month').toDate());
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [searchText, setSearchText] = React.useState('');
    const [showAdditionalFilters, setShowAdditionalFilters] = React.useState(false);
    const categories = [{name: 'all' }, ...useCategories()];

    function sendFilter(category: string, searchText: string) {
        const budgetFilter: FilterCriteria[] = [{
            type: 'daterange',
            start: startDate,
            end: endDate,
        }];

        if (category !== 'all') {
            budgetFilter.push({ type: 'equals', expectedValue: category, filterProperty: 'category' });
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
        <div className="history-filter">
            <label className="history-label">Start Date</label>
            <DatePicker
                className="history-input"
                selected={startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    sendFilter(selectedCategory, searchText);
                }}
                dateFormat="MMM d, yyyy h:mm aa" />
            <label className="history-label">End Date</label>
            <DatePicker
                selected={endDate}
                onChange={(date: Date) => {
                    setEndDate(date);
                    sendFilter(selectedCategory, searchText);
                }}
                dateFormat="MMM d, yyyy h:mm aa" />
            <button data-testid="additional-filters" onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}>{showAdditionalFilters ? 'Hide Filters' : 'More Filters'}</button>
            { showAdditionalFilters && (
                <div>
                    <label className="history-label">Categories</label>
                    <select data-testid="category-filter" className="history-input" value={selectedCategory} onChange={(event) => {
                        setSelectedCategory(event.target.value);
                        sendFilter(event.target.value, searchText);
                    }}>
                        {categories.map(category => {
                            return <option key={category.name}>{category.name}</option>
                        })}
                    </select>
                    <label className="history-label">Search</label>
                    <input data-testid="search-input" className="history-input" type="text" value={searchText} onChange={(event) => {
                        setSearchText(event.target.value);
                        sendFilter(selectedCategory, event.target.value);
                    }} />
                </div>
            )
            }
        </div>
    );
}

export default React.memo(HistoryFilter);
