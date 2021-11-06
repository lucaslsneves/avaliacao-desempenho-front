import { HStack, Heading, Text, useColorModeValue, VStack, Tag, TagLeftIcon, TagLabel } from '@chakra-ui/react'
import React from 'react'

export function MyTag(props) {
  return (

    <Tag size={"sm"} variant="subtle" colorScheme="green">
      <TagLeftIcon boxSize="12px" as={FaLock} />
      <TagLabel>Resultado Indisponível</TagLabel>
    </Tag>
  )
}