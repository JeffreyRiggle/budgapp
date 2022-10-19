import React from 'react';
import { addCategory, getCategories, updateCategories, isValid, convertToNumeric, convertToDisplay } from '@budgapp/common';
import './CategoryConfiguration.scss';
import { Category } from '../../common/category';
import CategoryChart from './CategoryChart';
import service from '../services/communicationService';

interface CategoryConfigurationProps {}

interface ConfigurableCategory extends Omit<Category, 'allocated'> {
    allocated: string | number;
    hasChange?: boolean;
    hasError?: boolean;
}

function resetItem(item: ConfigurableCategory, orginalCollection: ConfigurableCategory[]) {
    let newCollection = [...orginalCollection];
    const currentIndex = newCollection.indexOf(item);
    newCollection.splice(currentIndex, 1);
    newCollection.splice(currentIndex, 0, item);
    return newCollection;
}

const CategoryConfiguration = (props: CategoryConfigurationProps) => {
    const [pendingCategory, setPendingCategory] = React.useState('');
    const [categories, setCategories] = React.useState<ConfigurableCategory[]>([]);
    const [pendingChanges, setPendingChanges] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    function handleCategories(categories: ConfigurableCategory[]) {
        categories.forEach(cat => {
            cat.allocated = convertToDisplay(cat.allocated);
        });

        setCategories(categories);
    }

    React.useEffect(() => {
        if (service.nativeClientAvailable) {
            service.sendMessage<null, ConfigurableCategory[]>(getCategories, null).then(handleCategories);
            return;
        }

        function onAvailable(value: boolean) {
            if (value) {
                service.sendMessage<null, ConfigurableCategory[]>(getCategories, null).then(handleCategories);
                service.removeAvailableListener(onAvailable);
            }
        }
        service.addAvailableListener(onAvailable);
    }, []);

    const pendingCategoryChanged = React.useCallback((event) => {
        setPendingCategory(event.target.value);
    }, []);

    const addCategoryItem = React.useCallback(() => {
        const cat = {
            name: pendingCategory,
            allocated: 0,
            rollover: false
        };

        service.sendMessage(addCategory, cat);

        //TODO use subscription instead
        setPendingCategory('');
        setCategories([...categories, cat]);
    }, [categories, pendingCategory]);

    const handleKeyPress = React.useCallback((event) => {
        if (event.key === 'Enter') {
            addCategoryItem();
        }
    }, [addCategoryItem]);

    const updateAllocation = React.useCallback((category: ConfigurableCategory) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;

            category.hasError = !isValid(val);
            category.allocated = event.target.value;
            category.hasChange = true;

            const exisitingError: ConfigurableCategory[] = (categories.find(cat => cat.hasError) || []) as ConfigurableCategory[];
            const error = !!(category.hasError || (exisitingError[0] && exisitingError[0].hasError));

            setPendingChanges(true);
            setHasError(error);
            setCategories(resetItem(category, categories));
        }
    }, [categories]);

    const updateRollover = React.useCallback((category) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            category.rollover = event.target.checked;
            setPendingChanges(true);
        }
    }, []);

    const sendUpdate = React.useCallback(() => {
        categories.forEach(c => c.allocated = convertToNumeric(c.allocated));
        const updatedCategories = categories.map(c => {
            const newCat = { ...c };
            delete newCat.hasChange;
            delete newCat.hasError;

            return newCat;
        });

        service.sendMessage(updateCategories, updatedCategories).then(() => {
            handleCategories(categories);
            setPendingChanges(false);
        });
    }, [categories]);

    return (
        <div className="category-configuration">
            <div className="category-details">
                <h3>Categories</h3>
                <div className="add-category-area">
                    <input 
                        type="text"
                        value={pendingCategory} 
                        onChange={pendingCategoryChanged}
                        onKeyPress={handleKeyPress} />
                    <button onClick={addCategoryItem}>Add</button>
                </div>
                <div className="existing-categories">
                    {categories.map(cat => {
                        return (
                            <div className="category" key={cat.name}>
                                <span className="name">{cat.name}</span>
                                <input type="text" value={cat.allocated} onChange={updateAllocation(cat)}></input>
                                <span>Rollover</span>
                                <input type="checkbox" checked={cat.rollover} onChange={updateRollover(cat)}></input>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <button data-testid="category-update" disabled={!pendingChanges || hasError} onClick={sendUpdate}>Update Categories</button>
                </div>
            </div>
            <CategoryChart categories={categories as Category[]} />
        </div>
        
    );
}

export default React.memo(CategoryConfiguration);