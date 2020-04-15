import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import Settings from './Settings.js';
import './style/Main.css';

function Main() {
  return (
    <main className="main">
      <Switch>
        <Route path="/" exact component={Dashboard}/>
        <Route path="/settings" exact component={Settings}/>
      </Switch>
    </main>
  )
}

export default Main
