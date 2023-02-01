import React from 'react';
import DatePicker from 'react-datepicker';
import { isValid } from '@budgapp/common';

import 'react-datepicker/dist/react-datepicker.css';
import { BudgetItem } from '../../common/budget';
import ModalComponent from '../common/Modal';
import { useCategories } from '../hooks/use-categories';
import './AddBudgetItemModal.scss';

export interface AddBudgetItemModalProps {
    startDate?: Date;
    onAccept: (item: BudgetItem) => void;
    onCancel: () => void;
}

const AddBudgetItemModal = (props: AddBudgetItemModalProps) => {
    const { startDate, onAccept, onCancel } = props;

    const [amount, setAmount] = React.useState(0);
    const [category, setCategory] = React.useState('');
    const [date, setDate] = React.useState(startDate ?? new Date());
    const [detail, setDetail] = React.useState('');
    const [hasError, setHasError] = React.useState(false);
    const knownCategories = [{ name: '' }, ...useCategories()];

    const amountChanged = React.useCallback((event) => {
        const val = event.target.value;
        setAmount(val);
        setHasError(!isValid(val));
    }, []);

    const categoryChanged = React.useCallback((event) => {
        setCategory(event.target.value);
    }, []);

    const dateChanged = React.useCallback((event) => {
        setDate(event);
    }, []);

    const detailChanged = React.useCallback((event) => {
        setDetail(event.target.value);
    }, []);

    const addItem = React.useCallback(() => {
        onAccept({
            amount,
            category,
            date,
            detail
        });
    }, [onAccept, amount, category, date, detail]);

    return (
        <ModalComponent title="Add Item" onAccept={addItem} onCancel={onCancel}>
            <>
                <div className="input-area">
                    <label>Amount</label>
                    <input className={`input-data${hasError ? ' error' : ''}`} type="text" value={amount} onChange={amountChanged} data-testid="amount-input"/>
                </div>
                <div className="input-area">
                    <label>Category</label>
                    <select className="input-data" value={category} onChange={categoryChanged}>
                        {knownCategories.map(category => {
                            return <option key={category.name}>{category.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-area">
                    <label>Date</label>
                    <DatePicker 
                        selected={date as Date}
                        onChange={dateChanged}
                        dateFormat="MMM d, yyyy h:mm aa" />
                </div>
                <div className="input-area">
                    <label>Debt Source</label>
                    <input className="input-data" type="text" data-testid="details-input" value={detail} onChange={detailChanged} placeholder="Debt source"/>
                </div>
            </>
        </ModalComponent>
    )
}

export default React.memo(AddBudgetItemModal);