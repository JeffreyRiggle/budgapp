import React from 'react';
import DatePicker from 'react-datepicker';
import { isValid } from '@budgapp/common';

import 'react-datepicker/dist/react-datepicker.css';
import { BudgetItem } from '../../common/budget';
import { useCategories } from '../hooks/use-categories';

export interface AddBudgetItemViewProps {
    item: BudgetItem;
    onRemove: () => void;
}

const AddBudgetItemView = (props: AddBudgetItemViewProps) => {
    const { item, onRemove } = props;
    if (!item.date) {
        item.date = new Date();
    }

    const [amount, setAmount] = React.useState(item.amount || 0);
    const [category, setCategory] = React.useState(item.category);
    const [date, setDate] = React.useState(item.date);
    const [detail, setDetail] = React.useState(item.detail);
    const [hasError, setHasError] = React.useState(false);
    const knownCategories = [{ name: '' }, ...useCategories()];

    const amountChanged = React.useCallback((event) => {
        const val = event.target.value;
        item.amount = val;

        setAmount(val);
        setHasError(!isValid(val));
    }, [item]);

    const categoryChanged = React.useCallback((event) => {
        let val = event.target.value;

        item.category = val;
        setCategory(val);
    }, [item]);

    const dateChanged = React.useCallback((event) => {
        item.date = event;
        setDate(event);
    }, [item]);

    const detailChanged = React.useCallback((event) => {
        let val = event.target.value;

        item.detail = val;
        setDetail(val);
    }, [item]);

    const removeClicked = React.useCallback(() => {
        if (onRemove) {
            onRemove();
        }
    }, [onRemove]);

    return (
        <tr>
            <td>
                <input className={`input-data${hasError ? ' error' : ''}`} type="text" value={amount} onChange={amountChanged} data-testid="amount-input"/>
            </td>
            <td>
                <select className="input-data" value={category} onChange={categoryChanged}>
                    {knownCategories.map(category => {
                        return <option key={category.name}>{category.name}</option>
                    })}
                </select>
            </td>
            <td>
                <DatePicker 
                    selected={date as Date}
                    onChange={dateChanged}
                    dateFormat="MMM d, yyyy h:mm aa" />
            </td>
            <td>
                <input className="input-data" type="text" data-testid="details-input" value={detail} onChange={detailChanged} placeholder="Debt source"/>
            </td>
            <td><button className="input-data attention-button" data-testid="remove-action" onClick={removeClicked}>Remove</button></td>
        </tr>
    )
}

export default React.memo(AddBudgetItemView);