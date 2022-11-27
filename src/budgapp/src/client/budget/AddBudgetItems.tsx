import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import AddBudgetItemView from './AddBudgetItemView';
import { addBudgetItems } from '@budgapp/common';

import '../AddView.scss';
import { BudgetItem } from '../../common/budget';
import { CSVImport } from '../common/CSVImport';
import { processCSVItems } from '../common/csvHelper';
import moment from 'moment';
import service from '../services/communicationService';

let nextId = 0;

interface AddBugetItemsProps {
    history: any;
}

function getBudgetItemFromCells(cells: string[], header: string[]): BudgetItem {
    let pendingItem = {} as BudgetItem;
    cells.forEach((c, i) => {
        const key = header[i];
        if (key === 'amount') {
            pendingItem.amount = c;
        }
        if (key === 'date') {
            pendingItem.date = moment(c, 'MM/DD/YYYY').toDate();;
        }
        if (key === 'detail') {
            pendingItem.detail = c;
        }
        if (key === 'category') {
            pendingItem.category = c;
        }
    });
    return pendingItem;
}

const AddBudgetItems = (props: AddBugetItemsProps) => {
    const [items, setItems] = React.useState<BudgetItem[]>([]);
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

        service.sendMessage(addBudgetItems, items).then(() => {
            props.history.push('./budget');
        });
    }, [items, props.history]);

    const removeItem = React.useCallback((item) => {
        return () => {
            let ind = items.indexOf(item);

            if (ind !== -1) {
                items.splice(ind, 1);
                setItems([...items]);
            }
        }
    }, [items]);

    const handleCSVFile = React.useCallback((csvData: string) => {
        const loadedItems = processCSVItems(csvData, getBudgetItemFromCells);
        setItems([...items, ...loadedItems]);
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
            <CSVImport onChange={handleCSVFile} className="csv-import" />
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
                <button onClick={addItem} className="add-item primary-button" data-testid="add-budget-item">Add Item</button>
            </div>
            <div className="action-area">
                <Link to="/budget">Back</Link>
                <button onClick={addItems} className="primary-button">Add</button>
            </div>
        </div>
    )
}

export default withRouter(React.memo(AddBudgetItems));