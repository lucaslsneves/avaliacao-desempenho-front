import React from 'react';

import { Switch } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';

import Route from './route';



export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/avaliacoes" exact component={Dashboard} isPrivate />
    </Switch>
  );
}