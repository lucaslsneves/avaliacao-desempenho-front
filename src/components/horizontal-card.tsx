import { HStack, Heading, Text, useColorModeValue, VStack, Tag, TagLeftIcon, TagLabel, Button, Switch, useToast } from '@chakra-ui/react'
import React from 'react'
import { FaArrowRight, FaLock } from 'react-icons/fa'
import { useHistory } from 'react-router'
import api from '../services/api'
export default function HorizontalCard({
  handleClick = () => { },
  startDate = "",
  endDate = "",
  name = "Avaliaçao",
  subHeader = "Avaliação de Desempenho",
  description = "",
  admin = false,
  availableToSee = 0,
  availableToAnswer = 0,
  assessmentId = 0
}: any) {
  const textColor = useColorModeValue("white", "gray.600")
  const toast = useToast()
  const history = useHistory()
  return (
    <HStack cursor="pointer" maxWidth="700px" as="li" height="48" w="100%" borderRadius="lg" bg={useColorModeValue("white", "gray.700")} shadow="lg" >
      <VStack
        spacing={5}
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        flex="35"
        bg={useColorModeValue("green.400", "green.200")}>
        <Text fontSize="sm" color={textColor}>{subHeader}</Text>
        <Heading size={subHeader !== "Avaliação de Desempenho" ? "4xl" : "md"} color={textColor}>{name}</Heading>
      </VStack>
      <VStack justifyContent="space-between" alignItems="flex-start" height="100%" padding="5" flex="65">
        <VStack alignItems="flex-start">
          {
            startDate !== "" && endDate !== "" ?
              (
                <>
                  <Text fontSize="md">{`Data de início: ${startDate}`}</Text>
                  <Text fontSize="md">{`Data de término: ${endDate}`}</Text>
                </>
              ) : <Text textAlign="center" size="2lx">{description}</Text>
          }
          {
            admin && <HStack>
              <Text fontWeight="500">Feedback</Text> <Switch defaultIsChecked={availableToSee} onChange={ async () => {
                 const token = 'Bearer ' + localStorage.getItem('token')
                api.put(`/assessments/${assessmentId}` ,{availableToSee : !availableToSee}, {
                  headers: {
                    Authorization: token
                  }
                }).then(({data}) => {
                  console.log(data)
                  toast({
                    title: "Sucesso!",
                    description: "Feedback atualizado!",
                    position: "top-right",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  })
                  history.push('/todas-avaliacoes')
                }).catch(e => {
                  if (e.response) {
                    if (e.response.status === 401) {
                      localStorage.setItem("token", "")
                      localStorage.setItem("isAuthenticated", 'false')
                      history.push('/')
                    } else {
                      toast({
                        title: "Danger!",
                        description: "Erro ao liberar",
                        position: "top-right",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      })
                    }
                  }
                })
              }} colorScheme="green" size="lg" />
              <Text fontWeight="500">Responder</Text> <Switch onChange={ async () => {
                 const token = 'Bearer ' + localStorage.getItem('token')
                api.put(`/assessments/${assessmentId}` ,{availableToAnswer : !availableToAnswer}, {
                  headers: {
                    Authorization: token
                  }
                }).then(({data}) => {
                  console.log(data)
                  toast({
                    title: "Sucesso!",
                    description: "Feedback atualizado!",
                    position: "top-right",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  })
                  history.push('/todas-avaliacoes')
                }).catch(e => {
                  if (e.response) {
                    if (e.response.status === 401) {
                      localStorage.setItem("token", "")
                      localStorage.setItem("isAuthenticated", 'false')
                      history.push('/')
                    } else {
                      toast({
                        title: "Danger!",
                        description: "Erro ao liberar",
                        position: "top-right",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      })
                    }
                  }
                })}} defaultIsChecked={availableToAnswer} colorScheme="green" size="lg" />
            </HStack>

          }

        </VStack>
        <Button onClick={handleClick} alignSelf="flex-end" colorScheme="green" rightIcon={<FaArrowRight />}>Acessar</Button>
      </VStack>
    </HStack>
  )
}