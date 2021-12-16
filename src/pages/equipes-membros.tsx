import { useColorModeValue } from '@chakra-ui/color-mode';
import { Heading, HStack, VStack } from '@chakra-ui/layout';
import { Box, Text, Button, Grid, IconButton, Skeleton, Table, TableCaption, Tbody, Td, Tfoot, Th, Thead, Tr, SimpleGrid, Input } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';
import { debounce } from 'lodash'
import { useLocation } from 'react-router-dom';
import UserCard from '../components/user-card';
import { VscGraph } from 'react-icons/vsc'
import { MdArrowBack,MdArrowForward } from 'react-icons/md'

import InputApp from '../components/input';
import TableMembers from '../components/table-members';

export default function EquipesMembros(props) {
  const [members, setMembers] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({})
  const [isTable, setIsTable] = React.useState(false)

  const history = useHistory()
  const location = useLocation();

  const onChangeSearch = debounce(async (e) => {
    loadMembers(e.target.value, 0)
    setSearch(e.target.value)
  }, 800)


  function loadMembers(filter = '', timeout = 1000 , page = 1) {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/logged-in-user/assessments/teams/members/${location.state?.teamId}?filter=${filter}&page=${page}`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setMembers(response.data.newCollaborates)
        setPagination(response.data.collaborates.meta)
        setIsLoaded(false)
      }, timeout)
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

  }
  const focusBorderColor = useColorModeValue("green.400", "green.200")


  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    loadMembers()
  }, [])



  if (!location.state?.teamId || !location.state?.teamName || location.state.availableToSee === undefined || location.state.availableToSee === null) {
    history.push('/')

    return <div></div>;
  }


  if (error) {
    return <h1>Ops,algo deu errado! Tente novamente mais tarde!</h1>
  }

  if (isTable) {
    return (
      <>
        <HStack min-width={"500px"} spacing={12} alignItems="center" justifyContent="space-between" spacing="4" paddingX="16">
          <Heading size="lg" marginTop={3} color={headingColor}>Minhas avaliações - {localStorage.getItem('user_name')}</Heading>
          <HStack display="inline-flex">
            <Button cursor="pointer" onClick={() => setIsTable(!isTable)} variant="outline" leftIcon={<VscGraph />} colorScheme="green">
              Avaliações
            </Button>
          </HStack>
        </HStack>
        <TableMembers assessmentId={location.state.assessmentId} requestBody={{
          members,
          teamId: location.state.teamId,
          teamName: location.state.teamName
        }} />
      </>
    )
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
        <HStack flexDirection={{ base: 'column', md: 'column', lg: 'row' }} min-width={"500px"} alignItems="center" justifyContent="space-between" paddingX="16" >
          <Heading fontSize={{ base: '22px', md: '26px', lg: '33px' }} marginTop={3} color={headingColor}> {location.state.teamName}</Heading>
          <VStack>
            <HStack mt="5" spacing="5" display="inline-flex">
              <Input focusBorderColor={focusBorderColor} width="300px" onChange={onChangeSearch} placeholder="Buscar" />
              <Button cursor="pointer" onClick={() => setIsTable(!isTable)} variant="outline" leftIcon={<VscGraph />} colorScheme="green">
                Relatórios
              </Button>
            </HStack>
            <HStack paddingTop="4">
              <Button onClick={() => loadMembers(search , 0 , pagination.current_page - 1)} 
              disabled={pagination.current_page === 1} colorScheme="green" leftIcon={<MdArrowBack/>}>Voltar</Button>
              <Text>{`${pagination.current_page} de ${pagination.last_page}`}</Text>
              <Button onClick={() => loadMembers(search , 0 , pagination.current_page + 1)} 
              disabled={pagination.current_page === pagination.last_page} colorScheme="green" rightIcon={<MdArrowForward/>}>Avançar</Button>
            </HStack>
          </VStack>
        </HStack>
        <SimpleGrid mt="10" justifyItems="center" width="100%" minChildWidth="270px" gap={10}>
          {
            members.map(member => <UserCard
            manager={location.state.manager}
              assessmentId={location.state.assessmentId}
              key={member.id}
              name={member.name}
              checked={member.evalueted === 1}
              role={member.role}
              availableToSee={location.state.availableToSee}
              availableToAnswer={location.state.availableToAnswer}
              requestBody={{
                teamId: location.state.teamId,
                collaboratorId: member.id,
                teamName: location.state.teamName,
                evalueted: member.evalueted === 1
              }

              }


            />)}



        </SimpleGrid>
      </>
    )
  }

}