import {  Heading, VStack } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/react';
import React from 'react';
import {  useLocation } from 'react-router';


export default function Page404(props) {
 const location = useLocation()



  return(
    <VStack alignItems="center" justifyContent="center" height={"100vh"}>
      <Heading bgGradient="linear(to-l, #F56565, #C53030)" bgClip="text" >Error 404</Heading>
      <Heading>{`Essa página não existe: ${location.pathname}`}</Heading>
    </VStack>
  )
  }

