import React from 'react';
import { fireEvent, render, RenderResult } from "@testing-library/react";
import HistoryFilter from "../HistoryFilter";
import { FilterBudgetItemsRequest } from '../../../common/budget';

jest.mock('../../hooks/use-categories', () => ({
    useCategories: () => [{
        name: 'testCat'
    }]
}));

describe('history filter', () => {
    let component: RenderResult;
    let result: FilterBudgetItemsRequest;

    beforeEach(() => {
        const onChange = jest.fn((filter: FilterBudgetItemsRequest) => result = filter);
        component = render(<HistoryFilter onFilterChanged={onChange} />);
        fireEvent.click(component.getByTestId('additional-filters'));
    });

    describe('when category is set', () => {
        beforeEach(() => {
            fireEvent.change(component.getByTestId('category-filter') || window, { target: { value: 'testCat' } });
        });

        it('should send an updated filter', () => {
            expect(result.filters[1]).toEqual({
                type: 'equals',
                filterProperty: 'category',
                expectedValue: 'testCat',
            });
        });
    });

    describe('when search text is set', () => {
        beforeEach(() => {
            fireEvent.change(component.getByTestId('search-input'), { target: { value: 'something' } });
        });

        it('should send an updated filter', () => {
            expect(result.filters[1]).toEqual({
                type: 'like',
                filterProperty: 'detail',
                expectedValue: 'something',
            });
        });
    });
});