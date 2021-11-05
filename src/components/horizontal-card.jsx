import { HStack, Heading, Text, useColorModeValue, VStack, Tag, TagLeftIcon, TagLabel, Button } from '@chakra-ui/react'
import React from 'react'
import { FaArrowRight, FaLock } from 'react-icons/fa'
export default function HorizontalCard(props: any) {
  const textColor = useColorModeValue("white", "gray.600")
  return (
    <HStack cursor="pointer" mx="auto" maxWidth="800px" as="li" height="48" w="100%" borderRadius="lg" bg={useColorModeValue("white", "gray.700")} shadow="lg" >
      <VStack
        spacing={5}
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        flex="35"
        bg={useColorModeValue("green.400", "green.200")}>
        <Text fontSize="sm" color={textColor}>Avaliação de Desempenho</Text>
        <Heading color={textColor}>Janeiro 2022</Heading>
      </VStack>
      <VStack justifyContent="space-between" alignItems="flex-start" height="100%" padding="5" flex="65">
        <VStack  alignItems="flex-start">
          <Text fontSize="1xl">Data de início: 04/01/2022</Text>
          <Text fontSize="1xl">Data de término: 04/02/2022</Text>
        </VStack>
        <Button alignSelf="flex-end" colorScheme="green" rightIcon={<FaArrowRight />}>Acessar</Button>
      </VStack>
    </HStack>
  )
}