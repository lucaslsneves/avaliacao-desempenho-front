import {
  Heading,
  Avatar,
  Box,
  VStack,
  Flex,
  Text,
  Stack,
  Button,
  Image,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import React from   'react'
import {FaCheck} from 'react-icons/fa'

export default function UserCard({name = "Colaborador" , role = "Cargo" , checked = false}) {
  const iconColor = useColorModeValue("white" , "gray.800");
  return (
      <Box
        height="400px"
        
        w="270px"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}>
        <Box
          h={'100px'}
          w={'full'}
          textAlign="end"
          padding="3"
          paddingBottom="0"
          bg={useColorModeValue('green.400' , 'green.200')}
        >
        { checked && <Icon color={iconColor}  as={FaCheck} width="24px"/>}
        </Box>
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            alt={'Author'}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>

        <VStack height="240px" p={4}>
          <Stack h="100%" spacing={0} justifyContent="center" align={'center'} mb={5}>
            <Heading mb="2"  fontSize="lg" textAlign="center" fontWeight={500} fontFamily={'body'}>
             {name}
            </Heading>
            <Text color={'gray.500'}>{role}</Text>
          </Stack>

          <Button
            padding="12px 0"
            w={'full'}
            mt={"auto"}
            bg={useColorModeValue('green.400', 'green.200')}
            color={useColorModeValue('white', 'gray.800')}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}>
           Avaliar
          </Button>
        </VStack>
      </Box>
  );
}