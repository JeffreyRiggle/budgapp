import React from 'react';
import { Link } from 'react-router-dom';
import './BudgetView.scss';
import { client } from '@jeffriggle/ipc-bridge-client';
import calculateScore from '../common/calculateScoreClass';
import moment from 'moment';
import { filteredBudgetItems, getExpectedIncome } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';

function getCategoryLink(match, category) {
    if (!match.params.date) {
        return `/category/${category}`; 
    }
    return `/category/${category}/${match.params.date}`;
}

const BudgetView = (props) => {
    const { match } = props;
    const [date] = React.useState(match.params.date ? moment(match.params.date, 'MMMM YY').toDate() : Date.now());
    const [categories, setCategories] = React.useState([]);
    const [totalSpent, setTotalSpent] = React.useState(0);
    const [month] = React.useState(moment(date).format('MMMM'));
    const [income, setIncome] = React.useState(0);
    const [score, setScore] = React.useState('good-score');

    function handleItems(items) {
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
        let catArray = [];
        catmap.forEach((v, k) => {
            catArray.push({category: k, amount: v});
            totalSpent += Number(v);
        });

        setCategories(catArray);
        setTotalSpent(convertToDisplay(totalSpent));
        setScore(calculateScore(income, totalSpent));
    }

    React.useEffect(() => {
        client.sendMessage(filteredBudgetItems, {
            type: 'or',
            filters: [
                {
                    type: 'month',
                    date: date
                }
            ]
        }).then(handleItems);

        client.sendMessage(getExpectedIncome, null).then((income) => {
            setIncome(convertToDisplay(income));
            setScore(calculateScore(income, totalSpent));
        });
    }, [client]);

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
                                    <td><Link to={getCategoryLink(match, v.category)}>{convertToDisplay(v.amount)}</Link></td>
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

export default BudgetView;