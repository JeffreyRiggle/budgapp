import React from 'react';
import { withRouter, Route, NavLink } from 'react-router-dom';
import GeneralView from './general/GeneralView';
import BudgetView from './budget/BudgetView';
import AddBudgetItems from './budget/AddBudgetItems';
import CategoryView from './budget/CategoryView';
import HistoryView from './history/HistoryView';
import IncomeView from './income/IncomeView';
import AddIncomeView from './income/AddIncomeView';
import PasswordView from './password/PasswordView';
import passwordService from './services/passwordService';
import StorageView from './general/StorageView';

interface ContentAreaViewProps {
    history: any;
}

const ContentAreaView = (props: ContentAreaViewProps) => {
    const { history } = props;
    const [noPendingPassword, setNoPendingPassword] = React.useState(!passwordService.required);

    function requiredChanged(required: boolean) {
        setNoPendingPassword(!required);

        if (required) {
            history.push('/password');
        }
    }

    function pendingChanged() {
        setNoPendingPassword(!passwordService.required);

        passwordService.on(passwordService.requiredChanged, requiredChanged);
        passwordService.removeListener(passwordService.pendingChanged, pendingChanged);
    }

    React.useEffect(() => {
        if (!passwordService.pending) {
            passwordService.on(passwordService.requiredChanged, requiredChanged);
            return;
        }

        passwordService.on(passwordService.pendingChanged, pendingChanged);
        return () => {
            passwordService.removeListener(passwordService.requiredChanged, requiredChanged);
        }
    }, [passwordService]);

    return (
        <div className="content">
            { noPendingPassword && (<div className="sidebar">
                <ul className="sidebar-list">
                    <li><NavLink exact to="/" className="sidebar-item">General</NavLink></li>
                    <li><NavLink to="/budget" className="sidebar-item">Budget</NavLink></li>
                    <li><NavLink to="/income" className="sidebar-item">Income</NavLink></li>
                    <li><NavLink to="/history" className="sidebar-item">History</NavLink></li>
                </ul>
            </div>) }
            <div className="content-area">
                <Route exact path="/" component={GeneralView}/>
                <Route exact path="/budget" component={BudgetView}/>
                <Route path="/budget/:date" component={BudgetView}/>
                <Route exact path="/income" component={IncomeView}/>
                <Route path="/income/:date" component={IncomeView}/>
                <Route path="/addIncome" component={AddIncomeView}/>
                <Route path="/history" component={HistoryView}/>
                <Route path="/addBudget" component={AddBudgetItems}/>
                <Route exact path="/category/:id" component={CategoryView}/>
                <Route path="/category/:id/:date" component={CategoryView}/>
                <Route path="/password" component={PasswordView}/>
                <Route path="/storage" component={StorageView}/>
            </div>
        </div>
    );
}

export default withRouter(React.memo(ContentAreaView));