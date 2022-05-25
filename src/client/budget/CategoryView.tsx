import React from 'react';
import './BudgetView.scss';
import { client } from '@jeffriggle/ipc-bridge-client';
import EditableLabel from '../common/EditableLabel';
import calculateScore from '../common/calculateScoreClass';
import moment from 'moment';
import { filteredBudgetItems, updateBudgetItem, getCategory } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';
import { RouteChildrenProps } from 'react-router';
import { Category } from '../../common/category';
import { BudgetItem } from '../../common/budget';

interface CategoryRoute {
    date?: string;
    id: string;
}

interface CategoryViewProps extends RouteChildrenProps<CategoryRoute> {
}

const CategoryView = (props: CategoryViewProps) => {
    const { match } = props;
    const [date] = React.useState(match && match.params.date ? moment(match.params.date, 'MMMM YY').toDate() : Date.now());
    const [category] = React.useState(match && match.params.id);
    const [items, setItems] = React.useState([] as any[]);
    const [totalSpent, setTotalSpent] = React.useState(0);
    const [target, setTarget] = React.useState(0);
    const [displayMonth] = React.useState(moment(date).format('MMMM YY'));
    const [score, setScore] = React.useState('good-score');

    function handleItems(items: BudgetItem[]) {
        let totalSpent = 0;
        items.forEach((v, k) => {
            totalSpent += Number(v.amount);
        });

        setTotalSpent(totalSpent);
        setScore(calculateScore(target, totalSpent));
        setItems([...items]);
    }

    function handleCategories(category: Category) {
        let target = category.allocated || 0;
        setTarget(target);
        setScore(calculateScore(target, totalSpent));
    }

    const handleItemChange = React.useCallback((item: BudgetItem) => {
        return (value: string) => {
            item.amount = value;

            client.sendMessage(updateBudgetItem, item);
        }
    }, []);

    React.useEffect(() => {
        client.sendMessage(filteredBudgetItems, {
            type: 'and',
            filters: [
                {
                    type: 'equals',
                    filterProperty: 'category',
                    expectedValue: category
                },
                {
                    type: 'month',
                    date: date
                }
            ]
        }).then(handleItems);
        
        client.sendMessage(getCategory, {
            category: category,
            date: date,
            includeRollover: true
        }).then(handleCategories);
    }, [category, date, handleCategories, handleItems]);

    return (
        <div className="budget-view">
            <h1>Spending for {category} in {displayMonth}</h1>
            <div className="budget-grid">
                <table className="budget-table">
                    <thead>
                        <tr>
                            <td>Detail</td>
                            <td>Date</td>
                            <td>Spent</td>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(v => {
                            return (
                                <tr key={v.id}>
                                    <td>{v.detail}</td>
                                    <td>{moment(v.date).format('dddd D')}</td>
                                    <td><EditableLabel value={convertToDisplay(v.amount)} onChange={handleItemChange(v)}/></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <footer>
                <div className="scoring">
                    <span data-testid="category-target">Target ${convertToDisplay(target)}</span>
                    <span data-testid="category-spend">Total Spent <span className={score}>${convertToDisplay(totalSpent)}</span></span>
                    <span data-testid="category-remaining">Remaining <span className={score}>${convertToDisplay(target - totalSpent)}</span></span>
                </div>
            </footer>
        </div>
    )
}

export default React.memo(CategoryView);