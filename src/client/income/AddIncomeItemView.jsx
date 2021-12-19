import React from 'react';
import { isValid } from '../../common/currencyConversion';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const AddIncomeItemView = (props) => {
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
                <input data-testid="income-amount-input" className={`item${hasError ? ' error' : ''}`} type="text" value={amount} onChange={amountChanged}/>
            </td>
            <td>
                <DatePicker 
                    selected={date}
                    onChange={dateChanged}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="MMM d, yyyy h:mm aa" />
            </td>
            <td>
                <input data-testid="income-source-input" className="item" type="text" value={source} onChange={sourceChanged}/>
            </td>
            <td><button onClick={removeClicked}>Remove</button></td>
        </tr>
    );
}

export default AddIncomeItemView;