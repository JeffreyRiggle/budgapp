import React from 'react';
import { getCategories } from '@budgapp/common';
import { Category } from '../../common/category';
import service from '../services/communicationService';

export function useCategories() {
    const [categories, setCategories] = React.useState([] as Category[]);

    React.useEffect(() => {
        service.sendMessage<null, Category[]>(getCategories, null).then((categories) => {
            setCategories(categories);
        });
    }, []);

    return categories;
}