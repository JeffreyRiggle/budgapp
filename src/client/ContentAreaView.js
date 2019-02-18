import React, {Component} from 'react';
import { withRouter, Route } from 'react-router-dom';
import nativeService from './NativeService';
import GeneralView from './general/GeneralView';
import BudgetView from './budget/BudgetView';
import AddBudgetItems from './budget/AddBudgetItems';
import CategoryView from './budget/CategoryView';
import GoalsView from './GoalsView';
import HistoryView from './HistoryView';
import IncomeView from './income/IncomeView';
import AddIncomeView from './income/AddIncomeView';
import PasswordView from './PasswordView';

class ContentAreaView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        nativeService.sendMessage('passwordNeeded', null, this.handlePasswordRequired.bind(this));
    }

    handlePasswordRequired(required) {
        if (required) {
            this.props.history.push('/password');
        }
    }

    render() {
        return (
            <div className="content-area">
              <Route exact path="/" component={GeneralView}/>
              <Route path="/budget" component={BudgetView}/>
              <Route path="/income" component={IncomeView}/>
              <Route path="/addIncome" component={AddIncomeView}/>
              <Route path="/goals" component={GoalsView}/>
              <Route path="/history" component={HistoryView}/>
              <Route path="/addBudget" component={AddBudgetItems}/>
              <Route path="/category/:id" component={CategoryView}/>
              <Route path="/password" component={PasswordView}/>
            </div>
        )
    }
}

export default withRouter(ContentAreaView);