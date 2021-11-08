import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';

import { useLocation} from 'react-router-dom';
import TeamHorizontalCard from '../components/horizontal-card-team';

export default function EquipesMembros(props) {
  const [members, setMembers] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)

  const history = useHistory()
  const location = useLocation();

  const headingColor = useColorModeValue('gray.700', 'white');
  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/logged-in-user/assessments/teams/members/${location.state?.teamId}`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setMembers(response.data)
        setIsLoaded(false)
        console.log(response.data)
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



  if (!location.state?.teamId || !location.state?.teamName) {
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
    return (
      <VStack spacing={6}>
        <Heading size="lg" marginTop={3} color={headingColor}> {location.state.teamName}</Heading>
        {members.map(member => <h1>{member.name}</h1>)}
      </VStack>
    )
  }

}