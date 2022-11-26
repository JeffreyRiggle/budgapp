import React from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import ContentAreaView from './ContentAreaView';

import './App.scss';
import useMobileBreakpoint from './hooks/use-mobile-breakpoint';

const App = () => {
  const isMobile = useMobileBreakpoint();
  const [showPopup, setPopup] = React.useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="header-area">
          { isMobile && (
            <div className="mobile-nav">
              <button onClick={() => setPopup(true)}>Nav</button>
              { showPopup && (
                <div className="mobile-nav-area">
                  <ul className="mobile-nav-items">
                    <li><NavLink exact to="/" className="sidebar-item">General</NavLink></li>
                    <li><NavLink to="/budget" className="sidebar-item">Budget</NavLink></li>
                    <li><NavLink to="/income" className="sidebar-item">Income</NavLink></li>
                    <li><NavLink to="/history" className="sidebar-item">History</NavLink></li>
                  </ul>
                  <div className="close-area">
                    <button onClick={() => setPopup(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
          Budgapp
        </header>
        <ContentAreaView />
      </div>
    </BrowserRouter>
  );
}

export default React.memo(App);
