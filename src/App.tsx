import * as React from "react"

import LoginImage from './assets/login-image.svg'
import IntsLogo from './assets/ints.svg'
import {
  ChakraProvider,
  Box,
  Text,
  
  VStack,
  Code,
  Grid,
  Input,
  useColorModeValue
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import theme from './config/theme'
import Login from "./pages/login"
import React from "react";


export const App = () => {

  return (


    <>
     
      <Login />
    </>

  )
}

