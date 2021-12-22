import React from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { addCategory, getCategories, updateCategories } from '../../common/eventNames';
import { isValid, convertToNumeric, convertToDisplay } from '../../common/currencyConversion';
import './CategoryConfiguration.scss';

function resetItem(item, orginalCollection) {
    let newCollection = [...orginalCollection];
    const currentIndex = newCollection.indexOf(item);
    newCollection.splice(currentIndex, 1);
    newCollection.splice(currentIndex, 0, item);
    return newCollection;
}

const CategoryConfiguration = (props) => {
    const [pendingCategory, setPendingCategory] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [pendingChanges, setPendingChanges] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    function handleCategories(categories) {
        categories.forEach(cat => {
            cat.allocated = convertToDisplay(cat.allocated);
        });

        setCategories(categories);
    }

    React.useEffect(() => {
        if (client.available) {
            client.sendMessage(getCategories, null).then(handleCategories);
            return;
        }

        function onAvailable(value) {
            if (value) {
                client.sendMessage(getCategories, null).then(handleCategories);
                client.removeListener(client.availableChanged, onAvailable);
            }
        }
        client.on(client.availableChanged, onAvailable);
    }, [client]);

    const pendingCategoryChanged = React.useCallback((event) => {
        setPendingCategory(event.target.value);
    });

    const addCategoryItem = React.useCallback(() => {
        const cat = {
            name: pendingCategory,
            allocated: 0,
            rollover: false
        };

        client.sendMessage(addCategory, cat);

        //TODO use subscription instead
        setPendingCategory('');
        setCategories([...categories, cat]);
    }, [categories, pendingCategory]);

    const handleKeyPress = React.useCallback((event) => {
        if (event.key === 'Enter') {
            addCategoryItem();
        }
    }, [addCategoryItem]);

    const updateAllocation = React.useCallback((category) => {
        return (event) => {
            const val = event.target.value;

            category.hasError = !isValid(val);
            category.allocated = event.target.value;
            category.hasChange = true;

            const exisitingError = categories.find(cat => cat.hasError) || [];
            const error = category.hasError || (exisitingError[0] && exisitingError[0].hasError);

            setPendingChanges(true);
            setHasError(error);
            setCategories(resetItem(category, categories));
        }
    }, [categories]);

    const updateRollover = React.useCallback((category) => {
        return (event) => {
            category.rollover = event.target.checked;
            setPendingChanges(true);
        }
    });

    const sendUpdate = React.useCallback(() => {
        categories.forEach(category => {
            category.allocated = convertToNumeric(category.allocated);
            delete category.hasChange;
            delete category.hasError;
        });

        client.sendMessage(updateCategories, categories);

        setPendingChanges(false);
    }, [categories]);

    return (
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
    );
}

export default React.memo(CategoryConfiguration);