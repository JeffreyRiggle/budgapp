import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ContentAreaView from './ContentAreaView';

import './App.scss';

const App = () => {
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

export default React.memo(App);
