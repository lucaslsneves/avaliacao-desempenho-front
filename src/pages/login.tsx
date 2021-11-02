import { Center,Image, HStack,Flex, VStack, useColorModeValue, Container, Box, Text, FormLabel, FormControl, Button, Heading } from '@chakra-ui/react'
import React from 'react'
import LoginDarkImage from '../assets/login-image-dark.svg'
import LoginLightImage from '../assets/login-image-light.svg'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import InputApp from '../components/input'

export default function Login() {
const theme = useColorModeValue("light" , "dark");
  return (
    <>
      <Container   minH={'100vh'} minW={'100vw'} bg={useColorModeValue('gray.50', 'gray.800')} >
     
    
        <Flex position="relative" flexDirection="column" justifyContent="center" minH={'100vh'} maxWidth="1280px" margin="0 auto">
        <HStack position="fixed" top="0" right="400px" padding={4}> <ColorModeSwitcher  /></HStack>
            <HStack maxH={"1000px"} spacing={16} width="100%">
              <VStack width="50%">
                <Heading  fontSize={"3xl"} fontWeight={900}>Avaliação de Desempenho</Heading>
                <Text fontSize={'lg'} color={'gray.600'}>
                  Entre em sua conta
          </Text>
                <VStack padding={8}
                  height="100%"
                  rounded="lg"
                  bg={useColorModeValue('white', 'gray.700')}
                  shadow="lg" spacing={6} width={"100%"} >
                  <FormControl>
                    <FormLabel>CPF</FormLabel>
                    <InputApp placeholder="Apenas números" type="number" />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Senha</FormLabel>
                    <InputApp placeholder="Sua senha" type="password" />
                  </FormControl>

                  <Button width="100%" colorScheme="green">Entrar</Button>
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
                {theme === 'dark' ? <Image paddingTop={8} src={LoginDarkImage}/> : <Image paddingTop={8} src={LoginLightImage}/>}
                
              </VStack>
            </HStack>
         
        </Flex>
      </Container>
    </>
  )
}