import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom';

import TableMyGrades from "../components/table-my-grades";

export default function MinhasNotas() {
  const location = useLocation();
  const history = useHistory()


  if (!location.state?.teamId) {
    history.push('/')

    return <div></div>;
  }

  return (
    <TableMyGrades teamId={location.state?.teamId} />
  )
}