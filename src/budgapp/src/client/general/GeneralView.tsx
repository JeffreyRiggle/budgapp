import React from 'react';
import { Link } from 'react-router-dom';
import { client } from '@jeffriggle/ipc-bridge-client';
import CategoryConfiguration from './CategoryConfiguration';
import { getExpectedIncome, setExpectedIncome } from '../../common/eventNames';
import { isValid, convertToNumeric, convertToDisplay } from '@budgapp/common';
import './GeneralView.scss';

interface GeneralViewProps {}

const GeneralView = (props: GeneralViewProps) => {
    const [income, setIncome] = React.useState('0');
    const [incomeError, setIncomeError] = React.useState(false);

    function handleIncome(income: number) {
        setIncome(convertToDisplay(income));
    }

    React.useEffect(() => {
        if (client.available) {
            client.sendMessage(getExpectedIncome, null).then(handleIncome);
            return;
        }

        function onAvailable(value: boolean) {
            if (value) {
                client.sendMessage(getExpectedIncome, null).then(handleIncome);
                client.removeListener(client.availableChanged, onAvailable);
            }
        }
        client.on(client.availableChanged, onAvailable);
    }, []);

    const incomeChanged = React.useCallback((event) => {
        let val = event.target.value;
        let incomeError = !isValid(val);

        if (!incomeError) {
            client.sendMessage(setExpectedIncome, convertToNumeric(val));
        }
        
        setIncome(val);
        setIncomeError(incomeError);
    }, []);

    return (
        <div className="general-view">
            <h1 className="title">General Options</h1>
            <div className="income-details">
                <label>Expected Monthly income</label>
                <input className={incomeError ? 'error' : ''} type="text" value={income} onChange={incomeChanged}></input>
            </div>
            <CategoryConfiguration/>
            <Link to="/storage">Storage Options</Link>
        </div>
    )
}

export default React.memo(GeneralView);