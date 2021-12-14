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
} from '@chakra-ui/react'
import { FaEyeSlash, FaEye } from "react-icons/fa"

import * as React from 'react'
import LoginDarkImage from '../assets/login-image-dark.svg'
import LoginLightImage from '../assets/login-image-light.svg'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import InputApp from '../components/input'
import api from '../services/api'
import { useHistory } from 'react-router-dom'

export default function Login() {
  const theme = useColorModeValue("light", "dark");
  const [showPassword, setShowPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [cpf, setCpf] = React.useState("");
  const [password, setPassword] = React.useState("");

  const colorErrorText = useColorModeValue('red.400', 'red.200')
  
  let history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post('/login' , {cpf , password})
      if (response.status === 201) {
        localStorage.setItem("isAuthenticated", 'true');
        localStorage.setItem("token" , response.data.token.token)
        localStorage.setItem("role" , response.data.user.role)
        localStorage.setItem("user_name" , response.data.user.name)
        setError('')
        history.push('/dashboard')
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }
    } catch (e) {
      if(e.response){
        const data = e.response.data
        if (e.response.status === 400) {
          if(data.rule === 'required') {
            setError(`O campo ${data.field === 'password' ? 'Senha' :data.field.toUpperCase()} é obrigatório`)
          }else if(data.rule === 'invalid credentials'){
            setError(`Campo ${data.field === 'password' ? 'Senha' :data.field.toUpperCase()} incorreto`)
          }
        }else {
            setError('Erro inesperado, tente novamente em alguns minutos!')
        }
      }else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }

     
    }finally {
      setLoading(false)
    }

  }

  function onChangeCpf(e: any) {
    setCpf(e.target.value);
    if(e.target.value !== "" && password !== "") {
      setDisabled(false)
    }else {
      setDisabled(true)
    }
  }

  function onChangePassword(e: any) {
    setPassword(e.target.value);
    if(e.target.value !== "" && cpf !== "") {
      setDisabled(false)
    }else {
      setDisabled(true)
    }
  }
  return (
    <>
      <Container minH={'100vh'} minW={'100vw'} bg={useColorModeValue('gray.100', 'gray.900')} >


        <Flex position="relative" flexDirection="column" justifyContent="center" minH={'100vh'} maxWidth="1280px" margin="0 auto">
          <HStack position="fixed" top="0" padding={4}> <ColorModeSwitcher /></HStack>
          <HStack maxH={"1000px"} spacing={20} width="100%">
            <VStack width="45%">
              <Heading fontSize={"3xl"} fontWeight={900}>Avaliação de Desempenho</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                Entre em sua conta
          </Text>

              <VStack padding={8}
                as="form"
                height="100%"
                rounded="lg"
                bg={useColorModeValue('white', 'gray.700')}
                shadow="lg" spacing={6} width={"100%"} >
                <FormControl>
                  <FormLabel>CPF</FormLabel>
                  <InputApp value={cpf} maxLength="16" onChange={onChangeCpf} placeholder="Apenas números" type="text" />
                </FormControl>

                <FormControl>
                  <FormLabel>Senha</FormLabel>
                  <InputGroup>
                    <InputApp value={password} onChange={onChangePassword} placeholder="Sua senha" type={showPassword === false ? 'password' : 'text'} />
                    <InputRightElement children={<IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      h="1.75rem" size="sm"
                      bg="transparent"
                      aria-label="Call Sage"
                      icon={showPassword === false ? <FaEyeSlash /> : <FaEye />}
                    />} />
                  </InputGroup>
                </FormControl>
                {error && <Text fontSize={"17"} fontWeight={500} color={colorErrorText} alignSelf="start">{error}</Text>}
                <Button isDisabled={disabled} type="submit" onClick={(e) => handleSubmit(e)} isLoading={loading} width="100%" colorScheme="green">Entrar</Button>
              </VStack>
            </VStack>
            <VStack width={"50%"}>
              <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '3xl', lg: '5xl' }} lineHeight={1.1} >
                <Text color={useColorModeValue('green.400', 'green.200')}>Construa algo</Text>
                <Text
                  color={useColorModeValue('gray.700', 'whiteAlpha.900')}
                  as={'span'}
                  position={'relative'}
                  zIndex={1}
                  _after={{
                    content: "''",
                    width: 'full',
                    height: '30%',
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: useColorModeValue('green.400', 'green.200'),
                    zIndex: -1,
                  }}>
                  Incrível!
                   </Text>
              </Heading>
              {theme === 'dark' ? <Image paddingTop={8} src={LoginDarkImage} /> : <Image paddingTop={8} src={LoginLightImage} />}

            </VStack>
          </HStack>

        </Flex>
      </Container>
    </>
  )
}