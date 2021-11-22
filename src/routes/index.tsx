import React from 'react';

import { Switch } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';

import Route from './route';
import {Route as Route2 } from 'react-router-dom'
import Page404 from '../pages/404';
import Avaliacoes from '../pages/avaliacoes';
import Equipes from '../pages/equipes';
import EquipesMembros from '../pages/equipes-membros';
import MinhasNotas from '../pages/minhas-notas';
import TodasAvaliacoes from '../pages/todas-avaliacoes';
import TodosTiposAvaliacoes from '../pages/todos-tipos-avaliacoes';
import TodasEquipes from '../pages/todas-equipes';


export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" exact component={Dashboard} isPrivate />
      <Route path="/avaliacoes" exact component={Avaliacoes} isPrivate />
      <Route path="/equipes" exact component={Equipes} isPrivate />
      <Route path="/equipes/membros" exact component={EquipesMembros} isPrivate />
      <Route path="/minhas-notas" exact component={MinhasNotas} isPrivate />
      <Route path="/todas-avaliacoes" exact component={TodasAvaliacoes} isPrivate />
      <Route path="/todos-tipos-avaliacoes" exact component={TodosTiposAvaliacoes} isPrivate />
      <Route path="/todas-equipes" exact component={TodasEquipes} isPrivate />
      
      <Route2 path="*" exact component={Page404}  />
    </Switch>
  );
}