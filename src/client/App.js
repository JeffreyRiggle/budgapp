import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import GeneralView from './general/GeneralView';
import BudgetView from './budget/BudgetView';
import AddBudgetItems from './budget/AddBudgetItems';
import CategoryView from './budget/CategoryView';
import GoalsView from './GoalsView';
import HistoryView from './HistoryView';

import './App.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header>
            Budgapp
          </header>
          <div className="content">
            <div className="sidebar">
              <ul className="sidebar-list">
                <li><NavLink exact to="/" className="sidebar-item">General</NavLink></li>
                <li><NavLink to="/budget" className="sidebar-item">Budget</NavLink></li>
                <li><NavLink to="/goals" className="sidebar-item">Goals</NavLink></li>
                <li><NavLink to="/history" className="sidebar-item">History</NavLink></li>
              </ul>
            </div>
            <div className="content-area">
              <Route exact path="/" component={GeneralView}/>
              <Route path="/budget" component={BudgetView}/>
              <Route path="/goals" component={GoalsView}/>
              <Route path="/history" component={HistoryView}/>
              <Route path="/addBudget" component={AddBudgetItems}/>
              <Route path="/category/:id" component={CategoryView}/>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
