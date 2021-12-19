import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { client } from '@jeffriggle/ipc-bridge-client';
import { getMonthIncome, getExpectedIncome } from '../../common/eventNames';
import { convertToDisplay } from '../../common/currencyConversion';

// TODO should this just be another option from the calculateScoreClass.js
function getScore(target, total) {
    const difference = total - target;

    if (difference >= 0) {
        return 'good-score';
    }

    if ((total - (target / 2)) >= 0) {
        return 'warn-score';
    }

    return 'bad-score';
}

const IncomeView = (props) => {
    const { match } = props;
    const [date] = React.useState(match.params.date ? moment(match.params.date, 'MMMM YY').toDate() : Date.now());
    const [month] = React.useState(moment(date).format('MMMM'));
    const [totalIncome, setTotalIncome] = React.useState(0);
    const [target, setTarget] = React.useState(0);
    const [items, setItems] = React.useState([]);
    const [score, setScore] = React.useState('good-score');

    React.useEffect(() => {
        client.sendMessage(getMonthIncome, date).then((items) => {
            let total = 0;

            items.forEach(item => {
                total += Number(item.amount);
            });
            setItems(items);
            setTotalIncome(total);
            setScore(getScore(target, total));
        });
        client.sendMessage(getExpectedIncome, null).then((income) => {
            setTarget(income);
            setScore(getScore(income, totalIncome));
        });
    }, [client]);

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
                    <span data-testid="income-total">Total earned <span className={score}>${convertToDisplay(totalIncome)}</span></span> 
                </div>
            </footer>
        </div>
    );
}

export default IncomeView;