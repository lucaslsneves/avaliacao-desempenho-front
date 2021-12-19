import {
  Image,
  HStack,
  Flex,
  VStack,
  useColorModeValue,
  Text,
  FormLabel,
  FormControl,
  Button,
  Heading,
  Box,
  Input,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper

} from '@chakra-ui/react'
import { FaEyeSlash, FaEye } from "react-icons/fa"
import pt from 'date-fns/locale/pt';
import "react-datepicker/dist/react-datepicker.css";
import * as React from 'react'
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import InputApp from '../components/input'
import api from '../services/api'
import { useHistory } from 'react-router-dom'
import formatISO from 'date-fns/formatISO'
import Select from 'react-select'
import InputMask from "react-input-mask";
import { EditIcon } from '@chakra-ui/icons';

export default function AdicionarMembro() {
  const theme = useColorModeValue("light", "dark");
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [members, setMembers] = React.useState(null);
  const [name, setName] = React.useState("");
  const [registration, setRegistration] = React.useState("");
  const [hierarchy, setHierarchy] = React.useState(0);
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [roleNumber, setRoleNumber] = React.useState("");

  const [assessment, setAssessment] = React.useState({});
  const [team, setTeam] = React.useState({});
  const [competenciesManager, setCompetenciesManager] = React.useState([]);
  const [optionsAssessments, setOptionsAssessments] = React.useState([]);
  const [optionsTeams, setOptionsTeams] = React.useState([]);


  const colorErrorText = useColorModeValue('red.400', 'red.200')
  registerLocale('pt', pt)
  let history = useHistory();
  const toast = useToast()

  React.useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/assessments-groups`, {
      headers: {
        Authorization: token
      }
    }).then(({ data }) => {
      setOptionsAssessments([...data.data.map(assessment => ({ label: assessment.name, value: assessment.id }))])
    }).catch((e) => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          setError('Erro inesperado, tente novamente em alguns minutos!')
        }
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }
    })
  }, [])

  React.useEffect(() => {
    setTeam({})
    setOptionsTeams([])
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/assessments/teams/${assessment.value}`, {
      headers: {
        Authorization: token
      }
    }).then(({ data }) => {
      setOptionsTeams([...data.data.map(team => ({ label: `${team.unity} - ${team.area}`, value: team.id }))])
    }).catch((e) => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          setError('Erro inesperado, tente novamente em alguns minutos!')
        }
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }
    })

  }, [assessment])

  async function handleSubmit(e) {
    e.preventDefault()



    try {
      setLoading(true)

      const token = 'Bearer ' + localStorage.getItem('token')

      const response = await api.post('/members', {
        name,
        registration,
        hierarchy,
        cpf,
        email,
        role,
        roleNumber,
        assessmentGroupId: assessment.value,
        teamId: team.value
      },
        {
          headers: {
            Authorization: token
          }
        }
      )
      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Membro Adicionado",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setLoading(false)

        setName("")
        setRegistration("")
        setHierarchy("")
        setCpf("")
        setEmail("")
        setRole("")
        setRoleNumber("")
        setAssessment({})
        setTeam({})
        setError('')
      } else {
        setError(e.response.data)
      }
    } catch (e) {
      if (e.response) {
        const data = e.response.data
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else if (e.response.status === 400) {
          if (data.rule === 'required') {
            setError('Preencha todos os campos obrigatórios')
          } else {
            setError(e.response.data.error)
          }
        }
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }


    } finally {
      setLoading(false)
    }

  }

  const focusBorderColor = useColorModeValue('green.400', 'green.200')

  return (
    <>
      <VStack spacing="6" height="100%" width="100%"  >
        <Heading>Adicionar colaborador em uma avaliação</Heading>
        <VStack padding={8}
          as="form"
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          shadow="lg" spacing={6} width={"70%"} >
          <HStack width="100%" spacing="5">
            <FormControl isRequired flex="5">
              <FormLabel>Nome</FormLabel>
              <InputApp value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Nome do colaborador" />
            </FormControl>
            <FormControl isRequired flex="2.5">
              <FormLabel>Chapa</FormLabel>
              <InputApp type="number" value={registration} onChange={(e) => setRegistration(e.target.value)} placeholder="Matrícula do colaborador" />
            </FormControl>
            <FormControl isRequired flex="2.5">
              <FormLabel>Hierarquia</FormLabel>
              <NumberInput focusBorderColor={focusBorderColor} value={hierarchy} onChange={(value) => {
                setHierarchy(value)
              }} placeholder="Hierarquia do colaborador" step={1} defaultValue={0} min={0} max={10}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

            </FormControl>
          </HStack>

          <HStack width="100%" spacing="5">
            <FormControl flex="3" isRequired>
              <FormLabel>CPF</FormLabel>
              <Input
                focusBorderColor={focusBorderColor}
                as={InputMask} mask="999.999.999-99"
                maskChar={null}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Apenas números" />
            </FormControl>

            <FormControl flex="7">
              <FormLabel>Email (Opcional)</FormLabel>
              <InputApp value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </FormControl>
          </HStack>


          <HStack width="100%" spacing="5">
            <FormControl flex="6" isRequired>
              <FormLabel>Cargo</FormLabel>
              <InputApp value={role} onChange={(e) => setRole(e.target.value.toUpperCase())} placeholder="Função do colaborador - Ex: Analista de RH PL" />
            </FormControl>

            <FormControl flex="4">
              <FormLabel>Código da Função No RM (Opcional)</FormLabel>
              <InputApp value={roleNumber} onChange={(e) => setRoleNumber(e.target.value)} placeholder="N° Função do colaborador no RM" />
            </FormControl>
          </HStack>



          <Heading fontSize="md" fontWeight="500" width="100%">Avaliação de desempenho</Heading>
          <Box width="100%">
            <Select
              value={assessment}
              key={assessment?.value}
              options={optionsAssessments}
              placeholder="Selecione as competências"
              onChange={(e) => {
                setAssessment(e)
              }}
            />
          </Box>




          <Box width="100%">
            <Heading mb="5" fontSize="md" fontWeight="500">Equipe</Heading>
            <Select
              isDisabled={optionsTeams.length === 0 ? true : false}
              value={team}
              key={team?.value}
              options={optionsTeams}
              placeholder="Selecione o unidade do colaborador"
              onChange={(e) => {
                console.log(e)
                setTeam(e)
              }}
            />
          </Box>



          {error && <Text fontSize={"17"} fontWeight={500} color={colorErrorText} alignSelf="start">{error}</Text>}
          <Button type="submit" onClick={(e) => handleSubmit(e)} isLoading={loading} width="100%" colorScheme="green">Entrar</Button>
        </VStack>

      </VStack>
    </>
  )
}