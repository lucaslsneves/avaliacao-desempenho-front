import { HStack, Heading, Text, useColorModeValue, VStack, Tag, TagLeftIcon, TagLabel, Button } from '@chakra-ui/react'
import React from 'react'
import { FaArrowRight, FaLock } from 'react-icons/fa'
export default function HorizontalCard({
  handleClick = () => {} ,
  startDate = "" ,
  endDate = "" ,
  name = "Avaliaçao",
  subHeader = "Avaliação de Desempenho",
  description = ""
} : any) {
  const textColor = useColorModeValue("white", "gray.600")
  return (
    <HStack cursor="pointer"  maxWidth="800px" as="li" height="48" w="100%" borderRadius="lg" bg={useColorModeValue("white", "gray.700")} shadow="lg" >
      <VStack
        spacing={5}
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        flex="35"
        bg={useColorModeValue("green.400", "green.200")}>
        <Text fontSize="sm" color={textColor}>{subHeader}</Text>
        <Heading size={subHeader !== "Avaliação de Desempenho" ? "4xl" : "lg"} color={textColor}>{name}</Heading>
      </VStack>
      <VStack justifyContent="space-between" alignItems="flex-start" height="100%" padding="5" flex="65">
        <VStack  alignItems="flex-start">
          {
          startDate !== "" && endDate !== "" ? 
          (
            <>
          <Text fontSize="1xl">{`Data de início: ${startDate}`}</Text>
          <Text fontSize="1xl">{`Data de término: ${endDate}`}</Text>
          </>
          ) :  <Text textAlign="center" size="2lx">{description}</Text>
          }
        </VStack>
        <Button onClick={handleClick} alignSelf="flex-end" colorScheme="green" rightIcon={<FaArrowRight />}>Acessar</Button>
      </VStack>
    </HStack>
  )
}