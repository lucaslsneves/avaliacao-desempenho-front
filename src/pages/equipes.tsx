import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import HorizontalCard from '../components/horizontal-card';
import api from '../services/api';

import { format } from 'date-fns'
import { useLocation, useParams } from 'react-router-dom';
import TeamHorizontalCard from '../components/horizontal-card-team';

export default function Equipes(props) {
  const [teams, setTeams] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)

  const history = useHistory()
  const location = useLocation();

  const headingColor = useColorModeValue('gray.700', 'white');
  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/logged-in-user/assessments/teams/${location.state?.assessmentId}`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setTeams(response.data.data)
        setIsLoaded(false)
        console.log(response.data.data)
      }, 1000)
    }).catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          setError(true)
          setIsLoaded(false)
        }
      }
    })
  }, [])



  if(!location.state?.assessmentId || !location.state?.assessmentGroupName){
    history.push('/')
    
    return <div></div>;
  }


  if (error) {
    return <h1>Ops Algo de errado - Erro 500</h1>
  }

  if (isLoaded) {
    return (
      <VStack alignItems="center" w="100%" spacing={6}>
        <Skeleton height="28px" width={"25%"} borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
      </VStack>
    )
  }

  if (!isLoaded) {
    return (
      <VStack spacing={6}>
        <Heading size="lg" marginTop={3} color={headingColor}> {`Equipes - ${location.state.assessmentGroupName}`}</Heading>
        {teams.map(team => 
        <TeamHorizontalCard 
          
          unity={team.unity}
          role={team.role}
          name={team.area} key={team.id}
          hierarchy={team.hierarchy}
          onClick={() => {
            history.push('/equipes' , {teamId: team.id} )
          }}
        />)}
      </VStack>

    )
  }

}