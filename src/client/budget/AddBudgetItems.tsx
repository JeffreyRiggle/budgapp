import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import AddBudgetItemView from './AddBudgetItemView';
import { client } from '@jeffriggle/ipc-bridge-client';
import { addBudgetItems } from '../../common/eventNames';

import '../AddView.scss';
import { BudgetItem } from '../../common/budget';

let nextId = 0;

interface AddBugetItemsProps {
    history: any;
}

const AddBudgetItems = (props: AddBugetItemsProps) => {
    const [items, setItems] = React.useState([] as BudgetItem[]);
    const [sharedDate, setSharedDate] = React.useState(new Date());
    const [useSharedDate, setUseSharedDate] = React.useState(false);

    const toggleDate = React.useCallback((event) => {
        setUseSharedDate(event.target.checked);
    }, []);

    const dateChanged = React.useCallback((newDate) => {
        setSharedDate(newDate);
    }, []);

    const addItem = React.useCallback(() => {
        let item: BudgetItem = { id: nextId++ } as BudgetItem;

        if (useSharedDate) {
            item.date = sharedDate;
        }

        setItems([...items, item]);
    }, [items, useSharedDate, sharedDate]);

    const addItems = React.useCallback(() => {
        items.forEach(item => {
            delete item.id;
        });

        client.sendMessage(addBudgetItems, items).then(() => {
            props.history.push('./budget');
        });
    }, [items]);

    const removeItem = React.useCallback((item) => {
        return () => {
            let ind = items.indexOf(item);

            if (ind !== -1) {
                items.splice(ind, 1);
                setItems([...items]);
            }
        }
    }, [items]);

    return (
        <div className="add-view">
            <h1>Add Budget Items</h1>
            <div>
                <input type="checkbox" onChange={toggleDate} data-testid="shared-date"/>
                <label>Use shared date?</label>
                { useSharedDate && <DatePicker 
                    selected={sharedDate}
                    onChange={dateChanged}
                    dateFormat="MMM d, yyyy h:mm aa" />}
            </div>
            <div className="item-table">
                <table>
                    <thead>
                        <tr>
                            <td>Amount</td>
                            <td>Category</td>
                            <td>Date</td>
                            <td>Detail</td>
                            <td></td>
                        </tr> 
                    </thead>
                    <tbody>
                        {items.map(item => {
                            return <AddBudgetItemView key={item.id} item={item} onRemove={removeItem(item)}/>
                        })}
                    </tbody>
                </table>
                <button onClick={addItem} className="add-item" data-testid="add-budget-item">Add Item</button>
            </div>
            <div className="action-area">
                <Link to="/budget">Back</Link>
                <button onClick={addItems}>Add</button>
            </div>
        </div>
    )
}

export default withRouter(React.memo(AddBudgetItems));