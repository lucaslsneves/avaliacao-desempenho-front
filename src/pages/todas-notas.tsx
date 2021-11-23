import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom';
import TableAllGrades from '../components/table-all-grades';


export default function TodasNotas() {
  const location = useLocation();
  const history = useHistory()


  if (!location.state?.teamId || !location.state?.teamArea || !location.state?.teamUnity) {
    history.push('/todas-avaliacoes')

    return <div></div>;
  }

  return (
    <TableAllGrades teamId={location.state?.teamId} teamArea={location.state?.teamArea}  teamUnity={location.state?.teamUnity} />
  )
}