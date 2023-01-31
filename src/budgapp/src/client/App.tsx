import React from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import ContentAreaView from './ContentAreaView';
import useMobileBreakpoint from './hooks/use-mobile-breakpoint';

import './App.scss';

const App = () => {
  const isMobile = useMobileBreakpoint();
  const [showPopup, setPopup] = React.useState(false);

  const closePopup = React.useCallback(() => {
    setPopup(false);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="header-area">
          { isMobile && (
            <div className="mobile-nav">
              <button className="nav-button" onClick={() => setPopup(true)}><svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg></button>
              { showPopup && (
                <div className="mobile-nav-area">
                  <ul className="mobile-nav-items">
                    <li><NavLink exact to="/" className="sidebar-item" onClick={closePopup}>General</NavLink></li>
                    <li><NavLink to="/budget" className="sidebar-item" onClick={closePopup}>Budget</NavLink></li>
                    <li><NavLink to="/income" className="sidebar-item" onClick={closePopup}>Income</NavLink></li>
                    <li><NavLink to="/history" className="sidebar-item" onClick={closePopup}>History</NavLink></li>
                  </ul>
                  <div className="close-area">
                    <button className="close-button" onClick={closePopup}><svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></button>
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
