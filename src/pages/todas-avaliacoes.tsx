import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';
import format from 'date-fns/format';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import HorizontalCard from '../components/horizontal-card';
import api from '../services/api';


export default function TodasAvaliacoes(props) {
  const [assessmentsGroups, setAssessmentsGroups] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)

  const history = useHistory()

  const headingColor = useColorModeValue('gray.700', 'white');
  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get('/assessments-groups', {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setAssessmentsGroups(response.data.data)
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
      setError(true)
      setIsLoaded(false)
    })
  }, [])


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
        <Heading color={headingColor}>Todas Avaliações</Heading>
        {assessmentsGroups.map(assessmentGroup => 
        <HorizontalCard 
          key={assessmentGroup.id}
          admin={true}
          assessmentId={assessmentGroup.assessment_id}
          assessmentGroupId={assessmentGroup.id}
          availableToSee={assessmentGroup.available_to_see}
          availableToSeeCollaborator={assessmentGroup.available_to_see_collaborator}
          availableToAnswer={assessmentGroup.available_to_answer}
          endDate={format(new Date(assessmentGroup.end_date), 'dd/MM/yyyy')} 
          startDate={format(new Date(assessmentGroup.start_date), 'dd/MM/yyyy')} 
          name={assessmentGroup.name} key={assessmentGroup.assessment_group_id}
          handleClick={() => {
            history.push(`/todos-tipos-avaliacoes` , {assessmentGroupName: assessmentGroup.name , id: assessmentGroup.id})
          }}
        />)}
      </VStack>
    )
  }

}