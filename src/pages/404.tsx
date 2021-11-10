import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import React from 'react'
import { useHistory, useLocation } from 'react-router';

export default function NotFound() {
  const location = useLocation()
  const history = useHistory()
  return (
    <VStack alignItems="center" justifyContent="center" h="100vh">
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Essa página nao existe
      </Text>
      <Text color={'gray.500'} mb={6}>
        {location.pathname}
      </Text>

      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        onClick={() => {
          history.push('/')
        }}
        variant="solid">
        Ir para página principal
      </Button>
    </Box>
    </VStack>
  );
}