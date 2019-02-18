import React, { Component } from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import ContentAreaView from './ContentAreaView';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

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
                <li><NavLink to="/income" className="sidebar-item">Income</NavLink></li>
                <li><NavLink to="/goals" className="sidebar-item">Goals</NavLink></li>
                <li><NavLink to="/history" className="sidebar-item">History</NavLink></li>
              </ul>
            </div>
            <ContentAreaView />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
