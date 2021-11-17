import { useColorModeValue } from '@chakra-ui/color-mode';
import { Heading, HStack, VStack } from '@chakra-ui/layout';
import { Box,Text, Button, Grid, IconButton, Skeleton, Table, TableCaption, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';
import { debounce } from 'lodash'
import { useLocation } from 'react-router-dom';
import UserCard from '../components/user-card';
import { VscGraph } from 'react-icons/vsc'
import InputApp from '../components/input';

export default function EquipesMembros(props) {
  const [members, setMembers] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [search, setSearch] = React.useState("");

  const [isTable, setIsTable] = React.useState(false)

  const history = useHistory()
  const location = useLocation();

  const onChangeSearch = debounce(async (e) => {
    loadMembers(e.target.value, 0)
  }, 800)


  function loadMembers(filter = '', timeout = 1000) {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/logged-in-user/assessments/teams/members/${location.state?.teamId}?filter=${filter}`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setMembers(response.data.newCollaborates)
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


  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    loadMembers()
  }, [])



  if (!location.state?.teamId || !location.state?.teamName) {
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
          <Heading size="lg" marginTop={3} color={headingColor}> {location.state.teamName}</Heading>
          <HStack display="inline-flex">
            <Button cursor="pointer" onClick={() => setIsTable(!isTable)} variant="outline" leftIcon={<VscGraph />} colorScheme="green">
              Avaliações
          </Button>
          </HStack>
        </HStack>

        <Table minWidth="1000" marginTop="14" variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
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
        <HStack min-width={"500px"} alignItems="center" justifyContent="space-between"  paddingX="16">
          <Heading size="lg" marginTop={3} color={headingColor}> {location.state.teamName}</Heading>
          <VStack>
            <HStack spacing="5" display="inline-flex">
              <InputApp width="300px" onChange={onChangeSearch} placeholder="Buscar" />
              <Button cursor="pointer" onClick={() => setIsTable(!isTable)} variant="outline" leftIcon={<VscGraph />} colorScheme="green">
                Relatórios
          </Button>
            </HStack>
            <HStack paddingTop="3" spacing="5">
              <Text >70 items</Text> <Button colorScheme="green">Voltar</Button> <Text>1</Text> <Button colorScheme="green">Avançar</Button>
            </HStack>
          </VStack>
        </HStack>
        <Grid mt="10" justifyItems="center" width="100%" templateColumns="repeat(4, 1fr)" gap={6}>
          {members.map(member => <UserCard
            assessmentId={location.state.assessmentId}
            key={member.id}
            name={member.name}
            checked={member.evalueted === 1}
            role={member.role}
            requestBody={{
              teamId: location.state.teamId,
              collaboratorId: member.id,
              teamName: location.state.teamName,
              evalueted: member.evalueted === 1
            }
            }

          />)}
        </Grid>
      </>
    )
  }

}