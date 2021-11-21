import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import HorizontalCard from '../components/horizontal-card';
import api from '../services/api';

import { format } from 'date-fns'
import { useLocation, useParams } from 'react-router-dom';

export default function Avaliacoes(props) {
  const [assessments, setassessments] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)

  const history = useHistory()
  const location = useLocation();

  const headingColor = useColorModeValue('gray.700', 'white');
  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/logged-in-user/assessments-groups/assessments/${location.state?.id}`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      setTimeout(() => {
        setassessments(response.data.data)
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



  if(!location.state?.id || !location.state?.assessmentGroupName){
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
        <Heading size="lg" marginTop={3} color={headingColor}> {`Avaliação de Desempenho - ${location.state.assessmentGroupName}`}</Heading>
        {assessments.map(assessment => 
        <HorizontalCard 
          description={assessment.name} 
          subHeader="Tipo de avaliação"
          name={`${assessment.type}°`} key={assessment.id}
          handleClick={() => {
            console.log('oi')
            history.push('/equipes' , {
              assessmentId: assessment.id , 
              assessmentGroupName : location.state.assessmentGroupName , 
              assessmentGroupId: location.state.id , 
              availableToAnswer: assessment.available_to_answer,
              availableToSee: assessment.available_to_see
             })
          }}
        />)}
      </VStack>

    )
  }

}