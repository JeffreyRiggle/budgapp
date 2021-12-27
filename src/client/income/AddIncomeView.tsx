import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import AddIncomeItemView from './AddIncomeItemView';
import { client } from '@jeffriggle/ipc-bridge-client';
import { addIncomeItems } from '../../common/eventNames';

import '../AddView.scss';
import { IncomeItem } from '../../common/income';

interface AddIncomeViewProps {
    history: any;
}

const AddIncomeView = (props: AddIncomeViewProps) => {
    const { history } = props;
    const [items, setItems] = React.useState([] as IncomeItem[]);
    const [sharedDate, setSharedDate] = React.useState(new Date());
    const [useSharedDate, setUseSharedDate] = React.useState(false);

    const toggleDate = React.useCallback((event) => {
        setUseSharedDate(event.target.checked);
    }, []);

    const dateChanged = React.useCallback((newDate) => {
        setSharedDate(newDate);
    }, []);

    const addItem = React.useCallback(() => {
        let item = {} as IncomeItem;

        if (useSharedDate) {
            item.date = sharedDate;
        }

        setItems([...items, item]);
    }, [items, useSharedDate, sharedDate]);

    const removeItem = React.useCallback((item) => {
        return () => {
            let ind = items.indexOf(item);

            if (ind !== -1) {
                items.splice(ind, 1);
                setItems([...items]);
            }
        }
    }, [items]);

    const addItems = React.useCallback(() => {
        client.sendMessage(addIncomeItems, items);
        setItems([]);

        history.push('./income');
    }, [items]);

    return (
        <div className="add-view">
            <h1>Add Income</h1>
            <div>
                <input type="checkbox" onChange={toggleDate} />
                <label>Use shared date?</label>
                { useSharedDate && <DatePicker 
                    selected={sharedDate}
                    onChange={dateChanged}
                    dateFormat="MMM d, yyyy h:mm aa" />}
            </div>
            <div className='item-table'>
                <table>
                    <thead>
                        <tr>
                            <td>Amount</td>
                            <td>Date</td>
                            <td>Detail</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            return <AddIncomeItemView item={item} onRemove={removeItem(item)} key={index}/>
                        })}
                    </tbody>
                </table>
                <button data-testid="add-income-item" onClick={addItem} className="add-item">Add Item</button>
            </div>
            <div className="action-area">
                <Link to="/income">Back</Link>
                <button data-testid="add-income-items" onClick={addItems}>Add</button>
            </div>
        </div>
    );
}

export default withRouter(React.memo(AddIncomeView));