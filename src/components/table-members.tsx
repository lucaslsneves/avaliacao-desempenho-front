import { FormControl, FormLabel, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Table, TableCaption, Tbody, Td, Th, Thead, Tooltip, Tr, useDisclosure } from "@chakra-ui/react"
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
import { reduce } from "lodash";

export default function TableMembers({ title = "Modal", assessmentId = 0, requestBody }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [isLoadedButton, setIsLoadedButton] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [competencies, setCompetencies] = React.useState([])
  const [grades, setGrades] = React.useState([])
  const [collaborators, setCollaborators] = React.useState([])

  const buttonBg = useColorModeValue('green.400', 'green.200')
  const colorBg = useColorModeValue('white', 'gray.800')

  const history = useHistory()
  const toast = useToast()



  useEffect(() => {

    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/assessments/${assessmentId}/competencies`, {
      headers: {
        Authorization: token
      }
    }).then((response) => {
      api.get(`/teams/members/grades/manager?team=2`, {
        headers: {
          Authorization: token
        }
      }).then(grades => {
        const reduceGrades: any = {}
        const reduceCollaborator: any = {}
        const collabsArray = []

        grades.data.forEach((grade , i) => {
        
          if (!reduceGrades[grade.collaborator_registration]) {
            reduceGrades[grade.collaborator_registration] = [{
              competency_name: grade.competency_name,
              justification: grade.justification,
              grade: grade.grade
            }]
            reduceCollaborator[grade.collaborator_registration] = {
              name: grade.collaborator_name,
              role: grade.collaborator_role,
              registration: grade.collaborator_registration
            }

          } else {
            reduceGrades[grade.collaborator_registration].push({
              competency_name: grade.competency_name,
              justification: grade.justification,
              grade: grade.grade
            })

          }
        })
        
        const arrayCollab = [];
        for(let key in reduceGrades) {
          arrayCollab.push({...reduceGrades[key] , ...reduceCollaborator[key]})
        }
        setIsLoaded(false)
        setCompetencies(response.data)
        setGrades(reduceGrades) 
        setCollaborators(reduceCollaborator)
        setIsLoaded(false)
        setError(false)
        
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





  return (
    <>
      <Table minWidth="1000" marginTop="14" variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Cargo</Th>
            <Th>Chapa</Th>
            {
              competencies.map((competency: any) => (
                <Th key={`${competency.id}th`}>{competency.name}</Th>
              ))
            }
          </Tr>
        </Thead>
        <Tbody>
          {
            grades.map((competency : any) => (
              <Tr key={`${competency.competency_name}td`}>
               
              </Tr>
            ))
          }
          <Tr>
            <Td >inches</Td>
            <Td >millimetres (mm)</Td>
            <Td >25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td >30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td >0.91444</Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  )
}

