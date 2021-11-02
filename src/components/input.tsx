import { Input, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export default function InputApp({ maxLength= "" ,onChange ,placeholder = "", isRequired = true , type = "text"}) {
  const focusBorderColor = useColorModeValue("green.400", "green.200")

  return (
    <Input maxLength={maxLength} onChange={(e : any) => onChange(e)} placeholder={placeholder} isRequired={isRequired} type={type} focusBorderColor={focusBorderColor}/>
  )
}