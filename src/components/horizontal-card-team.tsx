import { HStack, Heading, Text, useColorModeValue, VStack, Tag, TagLeftIcon, TagLabel, Button } from '@chakra-ui/react'
import React from 'react'
import { FaArrowRight, FaLock } from 'react-icons/fa'
import { TagLock } from './tag-lock'
export default function TeamHorizontalCard({
  handleClick = () => { },
  name = "Setor",
  subHeader = "Setor",
  isAvailable = true,
  unity = "",
  role = "",
  hierarchy = 0,
  buttonTitle = "Avalie sua equipe"
}: any) {
  const textColor = useColorModeValue("white", "gray.600")
  return (
    <HStack cursor="pointer"  maxWidth="700px" as="li" height="48" w="100%" borderRadius="lg" bg={useColorModeValue("white", "gray.700")} shadow="lg" >
      <VStack
        spacing={5}
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        flex="35"
        bg={useColorModeValue("green.400", "green.200")}>
        <Text fontSize="sm" color={textColor}>{subHeader}</Text>
        <Heading color={textColor}>{name === 'TI E INFRAESTRUTURA' ?  "TI E INFRA" : name}</Heading>
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