import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import GeneralView from './GeneralView';
import BudgetView from './BudgetView';
import GoalsView from './GoalsView';
import HistoryView from './HistoryView';

import './App.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="budgapp">
        <div className="App">
          <header>
            Hello World!
          </header>
          <div className="content">
            <div className="sidebar">
              <ul className="sidebar-list">
                <li><NavLink exact to="/" className="sidebar-item">General</NavLink></li>
                <li><NavLink to="/budget" className="sidebar-item">Bugdet</NavLink></li>
                <li><NavLink to="/goals" className="sidebar-item">Goals</NavLink></li>
                <li><NavLink to="/history" className="sidebar-item">History</NavLink></li>
              </ul>
            </div>
            <div className="content-area">
              <Route exact path="/" component={GeneralView}/>
              <Route path="/budget" component={BudgetView}/>
              <Route path="/goals" component={GoalsView}/>
              <Route path="/history" component={HistoryView}/>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
