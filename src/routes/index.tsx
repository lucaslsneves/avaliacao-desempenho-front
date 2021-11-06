import React from 'react';

import { Switch } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';

import Route from './route';
import {Route as Route2 } from 'react-router-dom'
import Page404 from '../pages/404';
import Avaliacoes from '../pages/avaliacoes';


export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" exact component={Dashboard} isPrivate />
      <Route path="/avaliacoes" exact component={Avaliacoes} isPrivate />
      <Route2 path="*" exact component={Page404}  />
    </Switch>
  );
}