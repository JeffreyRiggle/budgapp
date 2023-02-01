import React from 'react';
import DatePicker from 'react-datepicker';
import { isValid } from '@budgapp/common';

import 'react-datepicker/dist/react-datepicker.css';
import ModalComponent from '../common/Modal';
import './AddIncomeItemModal.scss';
import { IncomeItem } from '../../common/income';

export interface AddIncomeItemModalProps {
    startDate?: Date;
    onAccept: (item: IncomeItem) => void;
    onCancel: () => void;
}

const AddIncomeItemModal = (props: AddIncomeItemModalProps) => {
    const { startDate, onAccept, onCancel } = props;

    const [amount, setAmount] = React.useState(0);
    const [date, setDate] = React.useState(startDate || new Date());
    const [source, setSource] = React.useState('');
    const [hasError, setHasError] = React.useState(false);

    const amountChanged = React.useCallback((event) => {
        const val = event.target.value;

        setAmount(val);
        setHasError(!isValid(val));
    }, []);

    const dateChanged = React.useCallback((event) => {
        setDate(event);
    }, []);

    const sourceChanged = React.useCallback((event) => {
        setSource(event.target.value);
    }, []);

    const addItem = React.useCallback(() => {
        onAccept({
            amount,
            date,
            source
        });
    }, [onAccept, amount, date, source]);

    return (
        <ModalComponent title="Add Item" onAccept={addItem} onCancel={onCancel}>
            <>
                <div className="input-area">
                    <label>Amount</label>
                    <input data-testid="income-amount-input" className={`input-data item${hasError ? ' error' : ''}`} type="text" value={amount} onChange={amountChanged}/>
                </div>
                <div className="input-area">
                    <label>Date</label>
                    <DatePicker 
                        selected={date as Date}
                        onChange={dateChanged}
                        showTimeSelect
                        timeIntervals={5}
                        dateFormat="MMM d, yyyy h:mm aa" />
                </div>
                <div className="input-area">
                    <label>Income Source</label>
                    <input data-testid="income-source-input" className="item input-data" type="text" value={source} onChange={sourceChanged} placeholder="Income source"/>
                </div>
            </>
        </ModalComponent>
    )
}

export default React.memo(AddIncomeItemModal);