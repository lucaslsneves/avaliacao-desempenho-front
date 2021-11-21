/* eslint-disable react/jsx-no-comment-textnodes */
import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';

import { useLocation } from 'react-router-dom';
import TeamHorizontalCard from '../components/horizontal-card-team';

export default function Equipes(props) {
  const [teams, setTeams] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)

  const history = useHistory()
  const location = useLocation();

  const headingColor = useColorModeValue('gray.700', 'white');
  useEffect(() => {
    console.log(location.state.assessmentId)
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/logged-in-user/assessments/teams/${location.state?.assessmentId}`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setTeams(response.data)
        setIsLoaded(false)
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
        setError(true)
        setIsLoaded(false)
      }
    })
  }, [])



  if (!location.state?.assessmentId || 
    !location.state?.assessmentGroupName || 
    location.state.availableToAnswer === null || 
    location.state.availableToAnswer === undefined || 
    location.state.availableToSee === null || 
    location.state.availableToSee === undefined) {
    history.push('/')

    return <div></div>;
  }


  if (error) {
    return <h1>Ops,algo deu errado! Tente novamente mais tarde!</h1>
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
    if (teams.mananger) {
      if (teams.manangers.length > 0) {
        return (
          // Gestor Avalia sua equipe
          <VStack spacing={6}>
            <Heading size="lg" marginTop={3} color={headingColor}> {`Equipes - ${location.state.assessmentGroupName}`}</Heading>
            {teams.teams.map(team =>
              <TeamHorizontalCard
              isAvailable={location.state.availableToAnswer}
                unity={team.unity}
                role={'Avaliação dos seus Gestores'}
                name={team.area} key={team.team_id}
                hierarchy={team.hierarchy}
                handleClick={() => {
                  history.push('/equipes/membros', { teamId: team.team_id, teamName: team.area, assessmentId: location.state.assessmentId })
                }}
              />)}

            // Gestor ver notas dos seus gestores acima
        
            {teams.teams.map(team =>
              <TeamHorizontalCard
            isAvailable={location.state.availableToSee}
              buttonTitle="Acessar"
                unity={team.unity}
                role={team.role}
                name={team.area} key={team.team_id}
                hierarchy={team.hierarchy}
                handleClick={() => {
                  history.push('/equipes/membros', { teamId: team.team_id, teamName: team.area, assessmentId: location.state.assessmentId })
                }}
              />)}

          </VStack>
        )
      } else {
            // Gestor master avalia sua equipe
       return ( 
       <VStack spacing={6}>
          <Heading size="lg" marginTop={3} color={headingColor}> {`Equipes - ${location.state.assessmentGroupName}`}</Heading>
          {teams.teams.map(team =>
            <TeamHorizontalCard
            isAvailable={location.state.availableToAnswer}
              unity={team.unity}
              role={team.role}
              name={team.area} key={team.team_id}
              hierarchy={team.hierarchy}
              handleClick={() => {
                history.push('/equipes/membros', { teamId: team.team_id, teamName: team.area, assessmentId: location.state.assessmentId })
              }}
            />)}
        </VStack>
       )
      }
    }
    // Colaborador ver as notas dos seus gestores
    return (
      <VStack spacing={6}>
        <Heading size="lg" marginTop={3} color={headingColor}> {`Equipes - ${location.state.assessmentGroupName}`}</Heading>
        {teams.teams.map(team =>
          <TeamHorizontalCard
          isAvailable={location.state.availableToSee}
            buttonTitle="Acessar"
            unity={team.unity}
            role={team.role}
            name={team.area} key={team.team_id}
            hierarchy={team.hierarchy}
            handleClick={() => {
              history.push('/equipes/membros', { teamId: team.team_id, teamName: team.area, assessmentId: location.state.assessmentId })
            }}
          />)}
      </VStack>
    )
  }

}