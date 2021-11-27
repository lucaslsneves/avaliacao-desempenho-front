import { FormControl, FormLabel, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip, useDisclosure } from "@chakra-ui/react"
import React, { useEffect } from "react"
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  useColorModeValue,
  ModalFooter,
  Button,
  ModalContent,
  ModalCloseButton,
  Textarea,
  Text,
  VStack,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function ModalCollaboratorPDF({ title = "Modal", assessmentId = 0, requestBody }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [isLoadedButton, setIsLoadedButton] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [competencies, setCompetencies] = React.useState([])

  const focusColor = useColorModeValue('green.400', 'green.200')
  const buttonBg = useColorModeValue('green.400', 'green.200')
  const colorBg = useColorModeValue('white', 'gray.800')

  const history = useHistory()
  const toast = useToast()
  function handleChangeSlider(value: number, competencyIndex: number) {
    const newCompetencies = [...competencies];
    newCompetencies[competencyIndex].value = value
    console.log(newCompetencies)
    setCompetencies(newCompetencies)
  }

  function handleOnChangeTextArea(value: string, competencyIndex: number) {
    const newCompetencies = [...competencies];
    newCompetencies[competencyIndex].justification = value
    console.log(newCompetencies)
    setCompetencies(newCompetencies)
  }

  /*

  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/assessments/${assessmentId}/competencies`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      if(requestBody.evalueted) {
        api.get(`/teams/members/grades?team=${requestBody.teamId}&member=${requestBody.collaboratorId}`, {
          headers: {
            Authorization: token
          }
        }).then((grades) => {
          const gradesMap: any = {}
          grades.data.forEach((grade : any) => {
            gradesMap[grade.competency_id] = {value: grade.grade , justification: grade.justification}
          }) 

          
          setCompetencies(response.data.map((competency : any) => {
              competency.value = gradesMap[competency.competency_id].value
              competency.justification = gradesMap[competency.competency_id].justification
              return competency
          }))
         
          setIsLoaded(false)
        }).catch(e => {
          if (e.response) {
            if (e.response.status === 401) {
              localStorage.setItem("token", "")
              localStorage.setItem("isAuthenticated", 'false')
              history.push('/')
            } else {
              setError(true)
              setIsLoaded(false)
              return
            }
            setError(true)
            setIsLoaded(false)
          }
        })
      }else {
        setTimeout(() => {
          setCompetencies(response.data)
          setIsLoaded(false)
        }, 1000)
      }
     
    }).catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          setError(true)
          setIsLoaded(false)
          return
        }
        setError(true)
        setIsLoaded(false)
      }
    })
  }, [])
*/

  function handleSubmit() {
    const token = 'Bearer ' + localStorage.getItem('token')
    setIsLoadedButton(true)
    api.post(`/grades`, {

      collaboratorId: requestBody.collaboratorId,
      teamId: requestBody.teamId,
      competencies
    },
      {
        headers: {
          Authorization: token
        }
      }

    ).then((response) => {
      toast({
        title: "Sucesso!",
        description: "As notas do colaborador foram enviadas!",
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      
        setIsLoadedButton(false)
        history.push('/equipes/membros')
        onClose()
        history.push('/equipes/membros', {
          teamId: requestBody.teamId,
          teamName: requestBody.teamName,
          assessmentId: assessmentId
        })
     
    }).catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          toast({
            title: "Erro ao avaliar!",
            description: "Não foi possível avaliar este colaborador",
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
          setIsLoadedButton(false)
          return;
        }
        toast({
          title: "Erro ao avaliar!",
          description: "Não foi possível avaliar este colaborador",
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        })

        setIsLoaded(false)
      }
    })
  }

  

  if (isLoaded) {
    return (
      <>
        <Button padding="12px 0"
          w={'full'}
          mt={"auto"}
          bg={buttonBg}
          color={colorBg}
          rounded={'md'}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }} onClick={onOpen}>
          Avaliar
      </Button>
        <Modal scrollBehavior={"inside"} size="2xl" onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form">
              <VStack alignItems="start" w="100%" spacing={6}>
                <Skeleton height="28px" width={"25%"} borderRadius="md" />
                <Skeleton height="28px" width="100%" maxWidth="800px" borderRadius="md" />
                <Skeleton height="56px" width="100%" maxWidth="800px" borderRadius="md" />


                <Skeleton height="28px" width={"25%"} borderRadius="md" />
                <Skeleton height="28px" width="100%" maxWidth="800px" borderRadius="md" />
                <Skeleton height="56px" width="100%" maxWidth="800px" borderRadius="md" />


              </VStack>

            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" onClick={onClose}>Salvar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>



    )
  }

  return (
    <>
      <Button padding="12px 0"
        w={'full'}
        mt={"auto"}
        bg={buttonBg}
        color={colorBg}
        rounded={'md'}
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        }} onClick={onOpen}>
        Avaliar
      </Button>
      <Modal as="form" scrollBehavior={"inside"} size="2xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            {competencies.map((competency, i) => {

              return (
                <>
                  <FormControl key={competency.id}>
                    <Tooltip label={competency.description} placement="top-start">
                      <FormLabel cursor="pointer">{competency.name} - {competency.value || 50}
                        <Text fontWeight="900"></Text>
                      </FormLabel>
                    </Tooltip>
                    <Slider step={5} maxW="750px" colorScheme="green" onChangeEnd={(value) => {
                      handleChangeSlider(value, i)
                    }} defaultValue={competency.value || 50}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                  <Textarea
                    borderRadius="md"
                    focusBorderColor={focusColor}
                    value={competency.justification}
                    m="12px 0"
                    placeholder="Digite observações sobre a nota aqui , este campo é OPCIONAL"
                    size="sm"
                    resize={"none"}
                    onChange={(e) => {
                      handleOnChangeTextArea(e.target.value, i)
                    }}
                  />
                </>
              )
            })}

          </ModalBody>
          <ModalFooter>
            <Button type="submit" isLoading={isLoadedButton} onClick={() => handleSubmit()} colorScheme="green" >Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

