import { Input, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export default function InputApp({ placeholder = "", isRequired = true , type = "text"}) {
  const focusBorderColor = useColorModeValue("green.400", "green.200")

  return (
    <Input placeholder={placeholder} isRequired={isRequired} type={type} focusBorderColor={focusBorderColor}/>
  )
}