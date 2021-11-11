import { useColorModeValue } from '@chakra-ui/color-mode';
import { Heading } from '@chakra-ui/layout';
import { Grid, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';

import { useLocation } from 'react-router-dom';
import UserCard from '../components/user-card';
import MyModal from '../components/modal';

export default function EquipesMembros(props) {
  const [members, setMembers] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)

  const history = useHistory()
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure()

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
      <>
        <Skeleton margin="0 auto" height="28px" width={"25%"} borderRadius="lg" />
        <Grid mt="10" justifyItems="center" width="100%" templateColumns="repeat(4, 1fr)" gap={4}>
          <Skeleton height="400" width="270px" borderRadius="lg" />
          <Skeleton height="400" width="270px" borderRadius="lg" />
          <Skeleton height="400" width="270px" borderRadius="lg" />
          <Skeleton height="400" width="270px" borderRadius="lg" />
        </Grid>
      </>
    )
  }

  if (!isLoaded) {
    return (
      <>
        <Heading textAlign="center" size="lg" marginTop={3} color={headingColor}> {location.state.teamName}</Heading>
        <Grid mt="10" justifyItems="center" width="100%" templateColumns="repeat(4, 1fr)" gap={6}>
          {members.map(member => <UserCard
            assessmentId={location.state.assessmentId}
            key={member.id}
            name={member.name}
            checked={member.evalueted === 1}
            role={member.role}
            requestBody={{
              teamId: location.state.teamId,
              collaboratorId : member.id,
              teamName: location.state.teamName,
              evalueted: member.evalueted === 1
            }
            }
            handleClick={() => {
              onOpen()
            }}
          />)}
        </Grid>
      </>
    )
  }

}