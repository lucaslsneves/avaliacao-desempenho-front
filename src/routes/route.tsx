import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from '../pages/_layout';


export default function RouteWrapper({
  component,
  isPrivate,
  ...rest
}: any) {
  const signed = localStorage.getItem('isAuthenticated')

  if (signed === "false" && isPrivate) {
    return <Redirect to="/" />;
  }

  if (signed === "true" && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  const Component = component

  return (
    signed === 'false' ?
      <Route
        {...rest}
        render={(props) => (
          <Component {...props} />
        )}
      /> : <Route
        {...rest}
        render={(props) => (
          <Layout> <Component {...props} /></Layout>
        )}
      />
  );
}
