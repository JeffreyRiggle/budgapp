import React from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';
import moment from 'moment';
import { client } from '@jeffriggle/ipc-bridge-client';
import { convertToDisplay } from '../../common/currencyConversion';
import { useExpectedIncome } from '../hooks/use-expected-income';
import { useMonthIncomeItems } from '../hooks/use-month-income-items';

interface IncomeViewRoute {
    date?: string;
}

interface IncomeViewProps extends RouteChildrenProps<IncomeViewRoute> { }

// TODO should this just be another option from the calculateScoreClass.js
function getScore(target: number, total: number): string {
    const difference = total - target;

    if (difference >= 0) {
        return 'good-score';
    }

    if ((total - (target / 2)) >= 0) {
        return 'warn-score';
    }

    return 'bad-score';
}

const IncomeView = (props: IncomeViewProps) => {
    const { match } = props;
    const [date] = React.useState(match && match.params.date ? moment(match.params.date, 'MMMM YY').toDate() : Date.now());
    const [month] = React.useState(moment(date).format('MMMM'));
    const [totalIncome, setTotalIncome] = React.useState(0);
    const [score, setScore] = React.useState('good-score');
    const items = useMonthIncomeItems(date);
    const target = useExpectedIncome();

    React.useEffect(() => {
        let total = 0;

        items.forEach(item => {
            total += Number(item.amount);
        });
        setTotalIncome(total);
        setScore(getScore(target, total));
    }, [client, target, items]);

    return (
        <div className="budget-view">
            <h1>Income for {month}</h1>
            <div>
                <Link to="/addIncome">Add Income</Link>
            </div>
            <div className="budget-grid">
                <table className="budget-table">
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Source</td>
                            <td>Amount</td>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((v, index) => {
                            return (
                                <tr key={index}>
                                    <td>{moment(v.date).format('dddd D')}</td>
                                    <td>{v.source}</td>
                                    <td>{convertToDisplay(v.amount)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <footer>
                <div className="scoring">
                    <span data-testid="income-target">Target ${convertToDisplay(target)}</span>
                    <span data-testid="income-total">Total earned <span className={score} data-testid="income-total-amount">${convertToDisplay(totalIncome)}</span></span> 
                </div>
            </footer>
        </div>
    );
}

export default React.memo(IncomeView);