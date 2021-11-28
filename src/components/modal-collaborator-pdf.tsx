import { FormControl, FormLabel, HStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip, useDisclosure } from "@chakra-ui/react"
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
  Box,
  Text,
  VStack,
  Skeleton,
  useToast,
  IconButton,
  Tag,
  TagLabel
} from '@chakra-ui/react';
import { MdFileDownload } from 'react-icons/md'
import { Radar } from 'react-chartjs-2';
import api from "../services/api";
import { useHistory } from "react-router-dom";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as Tooltip2,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip2,
  Legend
);

export default function ModalCollaboratorPDF({ title = "Relatório Individual", assessmentId = 0, requestBody, availableToSee = true }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadedButton, setIsLoadedButton] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [grades, setGrades] = React.useState({})

  const focusColor = useColorModeValue('green.400', 'green.200')

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

  function handleOpen() {
    setIsLoading(true)
    onOpen()
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/grades/member-pdf?member=${requestBody.collaboratorId}&team=${requestBody.teamId}`, {
      headers: {
        Authorization: token
      }
    }).then(({ data }) => {
      setGrades(data)
      setIsLoading(false)
    }).catch(e => {
      console.log(e)
    })
  }

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



  if (isLoading) {
    return (
      <>
        <Tooltip label={"Baixar Relatório do colaborador"} placement="top-start" >
          <IconButton
            disabled={!availableToSee}
            onClick={handleOpen}
            colorScheme="green"
            aria-label="Baixar PDF"
            icon={<MdFileDownload />}
            size="sm"
          />
        </Tooltip>
        <Modal size="6xl" scrollBehavior={"inside"} onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent padding="4">
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form">
              <VStack alignItems="start" w="100%" spacing={6}>
                <Skeleton height="28px" width={"30%"} borderRadius="md" />
                <Skeleton height="28px" width="100%" borderRadius="md" />
                <Skeleton height="56px" width="100%" borderRadius="md" />


                <Skeleton height="28px" width={"30%"} borderRadius="md" />
                <Skeleton height="28px" width="100%" borderRadius="md" />
                <Skeleton height="56px" width="100%" borderRadius="md" />


              </VStack>

            </ModalBody>
          </ModalContent>
        </Modal>
      </>



    )
  }
  return (
    <>
      <Tooltip label={"Baixar Relatório do colaborador"} placement="top-start" >
        <IconButton
          disabled={!availableToSee}
          onClick={handleOpen}
          colorScheme="green"
          aria-label="Baixar PDF"
          icon={<MdFileDownload />}
          size="sm"
        />
      </Tooltip>
      <Modal size="6xl" scrollBehavior={"inside"} size="6xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader paddingX="10" display="flex" justifyContent="space-between">{title}
            <Button type="submit" isLoading={isLoadedButton} onClick={() => handleSubmit()} colorScheme="green" >Gerar</Button>

          </ModalHeader>
          <ModalCloseButton />
          <ModalBody >
              <HStack justifyContent="space-between" mb="5" alignItems="center">
                <VStack alignItems="flex-start">
                    <HStack><Text fontWeight="700">Avaliado: </Text><Text fontWeight="500">{grades.user.name}</Text></HStack>
                    <HStack><Text fontWeight="700">Cargo: </Text><Text>{grades.collaborator.role}</Text></HStack>
                    <HStack><Text fontWeight="700">Setor: </Text><Text>{`${grades.team.unity} - ${grades.team.area}`}</Text></HStack>
                </VStack>
                <Tag colorScheme="green" size="lg">
                  <TagLabel display="flex" >Resultado Final: <Text ml="2" fontWeight="700"> 100%</Text></TagLabel>
                </Tag>
              </HStack>
              <Box margin="0 auto" height="600px" width="600px" >
                {
                  <Radar  data={{

                    labels: [...grades.averages.map((grade) => grade.name), ...grades.averages.map((grade) => grade.name)], datasets: [
                      {
                        label: 'Notas',
                        data: [95,96,100,100],
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 3,
                      },
                    ],
                  }} />
                }
              </Box>
          
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

