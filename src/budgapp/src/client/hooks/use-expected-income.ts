import React from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getExpectedIncome } from '@budgapp/common';

export function useExpectedIncome() {
    const [income, setIncome] = React.useState(0);

    React.useEffect(() => {
        client.sendMessage<null, number>(getExpectedIncome, null).then((expectedIncome) => {
            setIncome(expectedIncome);
        });
    }, []);

    return income;
}