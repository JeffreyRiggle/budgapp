import React from 'react';
import { Link } from 'react-router-dom';
import CategoryConfiguration from './CategoryConfiguration';
import { isValid, convertToNumeric, convertToDisplay, getExpectedIncome, setExpectedIncome } from '@budgapp/common';
import { processXlsxBuffer } from '@budgapp/xlsx';
import './GeneralView.scss';
import service from '../services/communicationService';
import { manager as budgetManager } from '../handlers/budgetHandlers';
import { manager as categoryManager } from '../handlers/categoryHandlers';
import { manager as incomeManager } from '../handlers/incomeHandlers';

interface GeneralViewProps {}

const GeneralView = (props: GeneralViewProps) => {
    const [income, setIncome] = React.useState('0');
    const [incomeError, setIncomeError] = React.useState(false);
    const [isNative, setIsNative] = React.useState(service.nativeClientAvailable);

    function handleIncome(income: number) {
        setIncome(convertToDisplay(income));
    }

    React.useEffect(() => {
        service.sendMessage<null, number>(getExpectedIncome, null).then(handleIncome);

        if (service.nativeClientAvailable) return;

        function onAvailable(value: boolean) {
            if (value) {
                service.sendMessage<null, number>(getExpectedIncome, null).then(handleIncome);
                service.removeAvailableListener(onAvailable);
            }
            setIsNative(value);
        }
        service.addAvailableListener(onAvailable);
    }, []);

    const incomeChanged = React.useCallback((event) => {
        let val = event.target.value;
        let incomeError = !isValid(val);

        if (!incomeError) {
            service.sendMessage(setExpectedIncome, convertToNumeric(val));
        }
        
        setIncome(val);
        setIncomeError(incomeError);
    }, []);

    const excelFileChanged = React.useCallback((event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = processXlsxBuffer(e.target?.result, true);
            categoryManager.fromSimpleObject(data);
            budgetManager.fromSimpleObject(data.items);
            incomeManager.fromSimpleObject(data.income);
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }, [])

    return (
        <div className="general-view">
            <h1 className="title">General Options</h1>
            { !isNative && (
                <div>
                    <label className="import-excel">
                        <input type="file" onChange={excelFileChanged}></input>
                        Import Excel
                    </label>
                    <button>Export Excel</button>
                </div>
            )}
            <div className="income-details">
                <label>Expected Monthly income</label>
                <input className={incomeError ? 'error' : ''} type="text" value={income} onChange={incomeChanged}></input>
            </div>
            <CategoryConfiguration/>
            { isNative && <Link to="/storage">Storage Options</Link> }
        </div>
    )
}

export default React.memo(GeneralView);