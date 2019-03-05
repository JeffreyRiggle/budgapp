import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ContentAreaView from './ContentAreaView';

import './App.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="header-area">
            Budgapp
          </header>
          <ContentAreaView />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
