import React from 'react';
import { getExpectedIncome } from '@budgapp/common';
import service from '../services/communicationService';

export function useExpectedIncome() {
    const [income, setIncome] = React.useState(0);

    React.useEffect(() => {
        service.sendMessage<null, number>(getExpectedIncome, null).then((expectedIncome) => {
            setIncome(expectedIncome);
        });
    }, []);

    return income;
}