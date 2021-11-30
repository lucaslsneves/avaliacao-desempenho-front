import {
  Image,
  HStack,
  Flex,
  VStack,
  useColorModeValue,
  Container,
  Text,
  FormLabel,
  FormControl,
  Button,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  toast,
  useToast,
  Textarea,
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

export default function CriarCompetencia() {
  const theme = useColorModeValue("light", "dark");
  const [showPassword, setShowPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
 


  const colorErrorText = useColorModeValue('red.400', 'red.200')
  let history = useHistory();
  const toast = useToast()

  

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData()

    try {
      setLoading(true)
   
      const token = 'Bearer ' + localStorage.getItem('token')
      const response = await api.post('/competencies', {
        name,
        description
      } , 
        {
          headers: {
            Authorization: token
          }
        }
      )
      
      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Competência criada",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setLoading(false)
        history.push('/todas-avaliacoes')
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }
    } catch (e) {
      if (e.response) {
        const data = e.response.data
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


    } finally {
      setLoading(false)
    }

  }

  function onChangeDescription(e: any) {
    setDescription(e.target.value);
    if (e.target.value && name !== "" ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  function onChangeName(e: any) {
    setName(e.target.value);
    if (e.target.value !== "" &&  description !== "") {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }
  const focusBorderColor = useColorModeValue("green.400", "green.200")


  return (
    <>
      <VStack spacing="6" height="100%" width="100%"  >
        <Heading>Criar Competência</Heading>
        <VStack padding={8}
          as="form"
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          shadow="lg" spacing={6} width={"70%"} >

          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <InputApp value={name} onChange={onChangeName}
              placeholder="Nome da competência"  />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea maxLength={255} focusBorderColor={focusBorderColor}  onChange={onChangeDescription} placeholder="Descrição da competência" />
          </FormControl>

          {error && <Text fontSize={"17"} fontWeight={500} color={colorErrorText} alignSelf="start">{error}</Text>}
          <Button isDisabled={disabled} type="submit" onClick={(e) => handleSubmit(e)} isLoading={loading} width="100%" colorScheme="green">Entrar</Button>
        </VStack>
      </VStack>
    </>
  )
}