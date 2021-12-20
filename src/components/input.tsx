import { Input, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export default function InputApp({ 
  maxLength= "" ,
  onChange = () => {} ,
  placeholder = "", 
  isRequired = true , 
  type = "text",
  value = "",
  width = "100%",
  disabled = false
}) {
  const focusBorderColor = useColorModeValue("green.400", "green.200")

  if(type === 'file') {
    return (
      <Input disabled={disabled}  width={width} maxLength={maxLength} onChange={(e : any) => onChange(e)} placeholder={placeholder} isRequired={isRequired} type={type} focusBorderColor={focusBorderColor}/>
    )
  }
  return (
    <Input disabled={disabled} value={value} width={width} maxLength={maxLength} onChange={(e : any) => onChange(e)} placeholder={placeholder} isRequired={isRequired} type={type} focusBorderColor={focusBorderColor}/>
  )
}