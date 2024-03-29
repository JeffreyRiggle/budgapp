import React, { useCallback } from 'react';
import { Link, RouteChildrenProps, match } from 'react-router-dom';
import './BudgetView.scss';
import calculateScore from '../common/calculateScoreClass';
import moment from 'moment';
import { convertToDisplay, convertToNumeric, filteredBudgetItems, getExpectedIncome } from '@budgapp/common';
import { BudgetItem } from '../../common/budget';
import service from '../services/communicationService';

interface BudgetViewRoute {
    date?: string;
}

interface CategoryMetadata {
    category: string;
    amount: number;
}

interface BudgetViewProps extends RouteChildrenProps<BudgetViewRoute> { }

function getCategoryLink(m: match<BudgetViewRoute>, category: string) {
    if (!m.params.date) {
        return `/category/${category}`; 
    }
    return `/category/${category}/${m.params.date}`;
}

const BudgetView = (props: BudgetViewProps) => {
    const { match } = props;
    const [date] = React.useState(match && match.params.date ? moment(match.params.date, 'MMMM YY').toDate() : Date.now());
    const [categories, setCategories] = React.useState([] as CategoryMetadata[]);
    const [totalSpent, setTotalSpent] = React.useState('0');
    const [month] = React.useState(moment(date).format('MMMM'));
    const [income, setIncome] = React.useState('0');
    const [score, setScore] = React.useState('good-score');

    const handleItems = useCallback((items: BudgetItem[]) => {
        let catmap = new Map();
        items.forEach(v => {
            let existing = catmap.get(v.category);

            if (existing) {
                catmap.set(v.category, existing + Number(v.amount));
            } else {
                catmap.set(v.category, Number(v.amount));
            }
        });

        let totalSpent = 0;
        let catArray: CategoryMetadata[] = [];
        catmap.forEach((v, k) => {
            catArray.push({category: k, amount: v});
            totalSpent += Number(v);
        });

        setCategories(catArray);
        setTotalSpent(convertToDisplay(totalSpent));
        setScore(calculateScore(convertToNumeric(income), totalSpent));
    }, [income]);

    React.useEffect(() => {
        service.sendMessage<any, BudgetItem[]>(filteredBudgetItems, {
            type: 'or',
            filters: [
                {
                    type: 'month',
                    date: date
                }
            ]
        }).then(handleItems);

        service.sendMessage<null, number>(getExpectedIncome, null).then((income) => {
            setIncome(convertToDisplay(income));
            setScore(calculateScore(income, convertToNumeric(totalSpent)));
        });
    }, [handleItems, date, totalSpent]);

    return (
        <div className="budget-view">
            <h1>{month} Budget</h1>
            <div>
                <Link to="/addBudget">Add Budget Items</Link>
            </div>
            <div className="budget-grid">
                <table className="budget-table">
                    <thead>
                        <tr>
                            <td>Category</td>
                            <td>Spent</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(v => {
                            return (
                                <tr key={v.category}>
                                    <td>{v.category}</td>
                                    <td><Link to={getCategoryLink(match || {} as match<BudgetViewRoute>, v.category)}>{convertToDisplay(v.amount)}</Link></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <footer>
                <div className="scoring">
                    <span data-testid="budget-income">Target ${income}</span>
                    <span data-testid="budget-spent">Total Spent <span className={score}>${totalSpent}</span></span> 
                </div>
            </footer>
        </div>
    )
}

export default React.memo(BudgetView);