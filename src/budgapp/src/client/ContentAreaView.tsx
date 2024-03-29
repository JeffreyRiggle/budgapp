import React, { useCallback } from 'react';
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
import WebStorageView from './general/WebStorageView';
import useMobileBreakpoint from './hooks/use-mobile-breakpoint';

interface ContentAreaViewProps {
    history: any;
}

const ContentAreaView = (props: ContentAreaViewProps) => {
    const { history } = props;
    const [noPendingPassword, setNoPendingPassword] = React.useState(!passwordService.required || passwordService.pending);
    const isMobile = useMobileBreakpoint();

    const requiredChanged = useCallback((required: boolean) => {
        setNoPendingPassword(!required);

        if (required) {
            history.push('/password');
        }
    }, [history]);

    const pendingChanged = useCallback(() => {
        setNoPendingPassword(!passwordService.required);

        passwordService.on(passwordService.requiredChanged, requiredChanged);
        passwordService.removeListener(passwordService.pendingChanged, pendingChanged);
    }, [requiredChanged]);

    React.useEffect(() => {
        if (!passwordService.pending) {
            passwordService.on(passwordService.requiredChanged, requiredChanged);
            return;
        }

        passwordService.on(passwordService.pendingChanged, pendingChanged);
        return () => {
            passwordService.removeListener(passwordService.requiredChanged, requiredChanged);
        }
    }, [pendingChanged, requiredChanged]);

    return (
        <div className="content">
            { noPendingPassword && !isMobile && (<div className="sidebar">
                <ul className="sidebar-list">
                    <li><NavLink exact to="/" className="sidebar-item">General</NavLink></li>
                    <li><NavLink to="/budget" className="sidebar-item">Budget</NavLink></li>
                    <li><NavLink to="/income" className="sidebar-item">Income</NavLink></li>
                    <li><NavLink to="/history" className="sidebar-item">History</NavLink></li>
                </ul>
            </div>) }
            <div className="content-area">
                <Route exact path="/" component={(props: any) => <GeneralView {...props} />}/>
                <Route exact path="/budget" component={(props: any) => <BudgetView {...props} />}/>
                <Route path="/budget/:date" component={(props: any) => <BudgetView {...props} />}/>
                <Route exact path="/income" component={(props: any) => <IncomeView {...props} />}/>
                <Route path="/income/:date" component={(props: any) => <IncomeView {...props} />}/>
                <Route path="/addIncome" component={(props: any) => <AddIncomeView {...props} />}/>
                <Route path="/history" component={(props: any) => <HistoryView {...props} />}/>
                <Route path="/addBudget" component={(props: any) => <AddBudgetItems {...props} />}/>
                <Route exact path="/category/:id" component={(props: any) => <CategoryView {...props} />}/>
                <Route path="/category/:id/:date" component={(props: any) => <CategoryView {...props} />}/>
                <Route path="/password" component={(props: any) => <PasswordView {...props} />}/>
                <Route path="/storage" component={(props: any) => <StorageView {...props} />}/>
                <Route path="/web-storage" component={(props: any) => <WebStorageView {...props} />}></Route>
            </div>
        </div>
    );
}

export default withRouter(React.memo(ContentAreaView));