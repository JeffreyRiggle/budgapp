import React from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getCategories } from '../../common/eventNames';
import { Category } from '../../common/category';

export function useCategories() {
    const [categories, setCategories] = React.useState([] as Category[]);

    React.useEffect(() => {
        client.sendMessage<null, Category[]>(getCategories, null).then((categories) => {
            setCategories(categories);
        });
    }, []);

    return categories;
}