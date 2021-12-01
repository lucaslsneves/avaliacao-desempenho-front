import { HStack, Heading, Text, useColorModeValue, VStack, Tag, TagLabel, Button } from '@chakra-ui/react'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { TagLock } from './tag-lock'
export default function TeamHorizontalCard({
  handleClick = () => { },
  name = "Setor",
  isAvailable = true,
  unity = "",
  role = "",
  hierarchy = 0,
  buttonTitle = "Avaliar",
  isCollaborator = false,
  manager = false,
  manangers = []
}: any) {
  const textColor = useColorModeValue("white", "gray.600")
  const bgColor1 = useColorModeValue("white", "gray.700")
  const bgColor2 = useColorModeValue("green.400", "green.200")
  let manangersText = "";

 manangers.forEach((mananger , i) => {
  manangersText += i === 0 ? "" : ", "
  manangersText += mananger.name
 })

  if(isCollaborator) {
    return (
      <HStack   cursor="pointer"  maxWidth="700px" as="li" height="48" w="100%" borderRadius="lg" bg={bgColor1} shadow="lg" >
        <VStack
        justifyContent="center"
          borderTopLeftRadius="lg"
          borderBottomLeftRadius="lg"
          height="100%"
          padding="5"
          flex="35"
          bg={bgColor2}>
          <Heading fontSize="2xl" color={textColor}>{name === 'TI E INFRAESTRUTURA' ?  "TI E INFRA" : name}</Heading>
        </VStack>
        <VStack justifyContent="space-between" alignItems="flex-start" height="100%" padding="5" flex="65">
          <VStack spacing={2} alignItems="flex-start">
            {!isAvailable && <TagLock />}
            <Text display="inline-block" fontSize="smaller">
              Gestores:  
              <Text  fontSize="smaller" fontWeight="600">{manangersText}</Text>
            </Text>  
          </VStack>
          <Button isDisabled={!isAvailable} onClick={handleClick} alignSelf="flex-end" colorScheme="green" rightIcon={<FaArrowRight />}>{buttonTitle}</Button>
        </VStack>
      </HStack>
    )
  }
  return (
    <HStack cursor="pointer"  maxWidth="700px" as="li" height="48" w="100%" borderRadius="lg" bg={bgColor1} shadow="lg" >
      <VStack
       justifyContent="center"
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        flex="35"
        bg={bgColor2}>
        <Heading  fontSize="2xl" color={textColor}>{name === 'TI E INFRAESTRUTURA' ?  "TI E INFRA" : name}</Heading>
      </VStack>
      <VStack justifyContent="space-between" alignItems="flex-start" height="100%" padding="5" flex="65">
        <VStack spacing={4} alignItems="flex-start">
          {!isAvailable && <TagLock />}
          <HStack>
            {unity && (<Tag size={"sm"} variant="subtle" colorScheme="green">
              <TagLabel fontSize="md">{unity}</TagLabel>
            </Tag>)}
            {role && (<Tag size={"sm"} variant="subtle" colorScheme="green">
              <TagLabel fontSize="md">{role}</TagLabel>
            </Tag>)}
          </HStack>
          {hierarchy >= 1  && (<Tag size={"sm"} variant="subtle" colorScheme="green">
              <TagLabel fontSize="md">Gestor</TagLabel>
            </Tag>)}
            
        </VStack>
        <Button isDisabled={!isAvailable} onClick={handleClick} alignSelf="flex-end" colorScheme="green" rightIcon={<FaArrowRight />}>{buttonTitle}</Button>
      </VStack>
    </HStack>
  )
}