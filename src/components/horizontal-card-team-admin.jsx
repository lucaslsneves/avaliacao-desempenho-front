import { Button, Heading, HStack, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
export default function TeamHorizontalCardAdmin({
  handleClick = () => { },
  area = "Setor",
  areaNumber = "",
  unity = "",
  unityNumber = "",
  buttonTitle = "Acessar"
}) {
  const textColor = useColorModeValue("white", "gray.600")
  const bgColor1 = useColorModeValue("white", "gray.700")
  const bgColor2 = useColorModeValue("green.400", "green.200")

  return (
    <HStack cursor="pointer" maxWidth="700px" as="li" height="48" w="100%" borderRadius="lg" bg={bgColor1} shadow="lg" >
      <VStack
        justifyContent="center"
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        spacing={2}
        flex="35"
        bg={bgColor2}>
        <Heading fontSize="2xl" color={textColor}>{unity}</Heading>
        <Heading fontSize="lg" color={textColor}>{unityNumber}</Heading>
      </VStack>
      <VStack justifyContent="space-between" alignItems="flex-start" height="100%" padding="5" flex="65">
        <VStack spacing={4} alignItems="flex-start">
          <Heading fontSize="2xl" >{area === 'TI E INFRAESTRUTURA' ? "TI E INFRA" : area}</Heading>
          <Heading fontSize="lg" >{areaNumber}</Heading>
        </VStack>
        <Button  onClick={handleClick} alignSelf="flex-end" colorScheme="green" rightIcon={<FaArrowRight />}>{buttonTitle}</Button>
      </VStack>
    </HStack>
  )
}