import React from 'react';
import { isValid } from '@budgapp/common';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { IncomeItem } from '../../common/income';

interface AddIncomeItemViewProps {
    item: IncomeItem;
    onRemove?: () => void;
}

const AddIncomeItemView = (props: AddIncomeItemViewProps) => {
    const { item, onRemove } = props;
    const [amount, setAmount] = React.useState(item.amount || 0);
    const [date, setDate] = React.useState(item.date || new Date());
    const [source, setSource] = React.useState(item.source);
    const [hasError, setHasError] = React.useState(false);

    const amountChanged = React.useCallback((event) => {
        const val = event.target.value;

        item.amount = val;
        setAmount(val);
        setHasError(!isValid(val));
    }, [item]);

    const dateChanged = React.useCallback((event) => {
        item.date = event;
        setDate(event);
    }, [item]);

    const sourceChanged = React.useCallback((event) => {
        const val = event.target.value;

        item.source = val;
        setSource(val);
    }, [item]);

    const removeClicked = React.useCallback(() => {
        if (onRemove) {
            onRemove();
        }
    }, [onRemove])

    return (
        <tr>
            <td>
                <input data-testid="income-amount-input" className={`input-data item${hasError ? ' error' : ''}`} type="text" value={amount} onChange={amountChanged}/>
            </td>
            <td>
                <DatePicker 
                    selected={date as Date}
                    onChange={dateChanged}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="MMM d, yyyy h:mm aa" />
            </td>
            <td>
                <input data-testid="income-source-input" className="item input-data" type="text" value={source} onChange={sourceChanged} placeholder="Income source"/>
            </td>
            <td><button className="input-data attention-button" onClick={removeClicked}>Remove</button></td>
        </tr>
    );
}

export default React.memo(AddIncomeItemView);