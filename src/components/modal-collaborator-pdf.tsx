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
  Heading,
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as Tooltip2,
  Legend,
} from 'chart.js';
import { Page, Text as TextPDF, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

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

    html2canvas(document.querySelector("#capture")).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF("portrait", "px", "a4");
      pdf.addImage(imgData, 'jpeg', 0, 0);
      pdf.save("download.pdf");

    });

    html2canvas(document.querySelector("#capture")).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF("portrait", "px", "a4");
      pdf.addImage(imgData, 'jpeg', 0, 0);
      pdf.save("download.pdf");

    });

    html2canvas(document.querySelector("#capture")).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF("portrait", "px", "a4");
      pdf.addImage(imgData, 'jpeg', 0, 0);


      pdf.save("download.pdf");

    });

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
      <Modal size="2xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader paddingX="10" display="flex" justifyContent="space-between">{title}
            <Button type="submit" isLoading={isLoadedButton} onClick={handleSubmit} colorScheme="green" >Gerar</Button>

          </ModalHeader>
          <ModalCloseButton />
          <ModalBody maxWidth="800px" paddingY="5" id="capture" >
            <Page size="A4">
              <HStack justifyContent="space-between" mb="5" alignItems="center">
                <VStack fontSize="sm" alignItems="flex-start">
                  <Heading mb="5" fontSize="lg">Relatório Avaliação de Desempenho</Heading>
                  <HStack ><Text fontWeight="700">Avaliado: </Text><Text fontWeight="500">{grades.user.name}</Text></HStack>
                  <HStack><Text fontWeight="700">Cargo: </Text><Text>{grades.collaborator.role}</Text></HStack>
                  <HStack><Text fontWeight="700">Setor: </Text><Text>{`${grades.team.unity} - ${grades.team.area}`}</Text></HStack>
                </VStack>
                <Tag padding="2" colorScheme="green" size="lg">
                  <Text pb="4">Resultado Final</Text>
                </Tag>
              </HStack>
              <Box margin="0 auto" height="600px" width="600px" >
                {

                  <Radar data={{

                    labels: [...grades.averages.map((grade) => grade.name), ...grades.averages.map((grade) => grade.name)], datasets: [
                      {
                        label: 'Notas',
                        data: [95, 96, 100, 100],
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 3,
                      },
                    ],
                  }} />

                }
              </Box>
            </Page>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

