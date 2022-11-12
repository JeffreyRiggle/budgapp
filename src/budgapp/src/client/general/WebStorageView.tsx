import React from 'react';
import { processXlsxBuffer } from '@budgapp/xlsx';
import { manager as budgetManager } from '../handlers/budgetHandlers';
import { manager as categoryManager } from '../handlers/categoryHandlers';
import { manager as incomeManager } from '../handlers/incomeHandlers';
import './WebStorageView.scss';

interface WebStorageViewProps {}

const WebStorageView = (props: WebStorageViewProps) => {
    const excelFileChanged = React.useCallback((event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = processXlsxBuffer(e.target?.result, true);
            categoryManager.fromSimpleObject(data);
            budgetManager.fromSimpleObject(data.items);
            incomeManager.fromSimpleObject(data.income);
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }, []);

    return (
        <div className="web-storage-view">
            <h1 className="title">Storage Options</h1>
            <div>
                <label className="import-excel">
                    <input type="file" onChange={excelFileChanged}></input>
                    Import Excel
                </label>
                <button>Export Excel</button>
            </div>
        </div>
    )
}

export default React.memo(WebStorageView);