import React, { useState } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import Main from './Main';
import './style/App.css';

function App() {
  return (
    <div className="app">
     <SideNav />
     <div className="view">
       <Header/>
       <Main/>
     </div>
    </div>
  );
}

export default App;
