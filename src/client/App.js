import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
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
          <ContentAreaView />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
