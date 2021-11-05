import { VStack, Heading } from '@chakra-ui/layout';
import React from 'react';
import HorizontalCard from '../components/horizontal-card';

export default function Dashboard(props) {
  return (
    <VStack spacing={5}>
      <Heading>Minhas Avaliações</Heading>
       <HorizontalCard/>
    </VStack>
  
  )
}