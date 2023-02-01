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

interface SendFilterRequest {
    category: string;
    searchText: string;
    startDate: Date;
    endDate: Date;
}

interface SendFilterResponse {
    budgetRequest: FilterBudgetItemsRequest;
    incomeRequest: GetMonthRangeIncomeRequest;
}

function buildFilter(request: SendFilterRequest): SendFilterResponse {
    const { startDate, endDate, category, searchText } = request;

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

    return {
        budgetRequest: {
            type: 'and',
            filters: budgetFilter,
        },
        incomeRequest: { start: startDate, end: endDate }
    }
}

const HistoryFilter = (props: HistoryFilterProps) => {
    const { onFilterChanged } = props;
    const [startDate, setStartDate] = React.useState(moment(Date.now()).subtract(1, 'year').startOf('month').toDate());
    const [endDate, setEndDate] = React.useState(moment(Date.now()).endOf('month').toDate());
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [searchText, setSearchText] = React.useState('');
    const [showAdditionalFilters, setShowAdditionalFilters] = React.useState(false);
    const categories = [{name: 'all' }, ...useCategories()];

    function sendFilter(req: SendFilterRequest) {
        const { budgetRequest, incomeRequest } = buildFilter(req);
        onFilterChanged(budgetRequest, incomeRequest);
    }

    return (
        <div className="history-filter">
            <div className="filter-section">
                <label className="history-label">Start Date</label>
                <DatePicker
                    className="history-input"
                    selected={startDate}
                    onChange={(date: Date) => {
                        setStartDate(date);
                        sendFilter({
                            startDate: date,
                            endDate,
                            category: selectedCategory,
                            searchText,
                        });
                    }}
                    dateFormat="MMM d, yyyy h:mm aa" />
            </div>
            <div className="filter-section">
                <label className="history-label">End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => {
                        setEndDate(date);
                        sendFilter({
                            startDate,
                            endDate: date,
                            category: selectedCategory,
                            searchText,
                        });
                    }}
                    dateFormat="MMM d, yyyy h:mm aa" />                
            </div>
            { showAdditionalFilters && (
                <div>
                    <div className="filter-section">
                        <label className="history-label">Categories</label>
                        <select data-testid="category-filter" className="history-input" value={selectedCategory} onChange={(event) => {
                            setSelectedCategory(event.target.value);
                            sendFilter({
                                startDate,
                                endDate,
                                category: event.target.value,
                                searchText,
                            });
                        }}>
                            {categories.map(category => {
                                return <option key={category.name}>{category.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="filter-section">
                        <label className="history-label">Search</label>
                        <input data-testid="search-input" className="history-input" type="text" value={searchText} onChange={(event) => {
                            setSearchText(event.target.value);
                            sendFilter({
                                startDate,
                                endDate,
                                category: selectedCategory,
                                searchText: event.target.value,
                            });
                        }} />
                    </div>
                </div>
            )
            }
            <button className="additional-filters secondary-button" data-testid="additional-filters" onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}>{showAdditionalFilters ? 'Hide Filters' : 'More Filters'}</button>
        </div>
    );
}

export default React.memo(HistoryFilter);
