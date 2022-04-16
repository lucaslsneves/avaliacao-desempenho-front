import {
  Avatar,
  Box, Flex, Heading, HStack, IconButton, Stack, Tag,
  TagLabel,
  TagLeftIcon, Text, Tooltip, useColorModeValue, VStack
} from '@chakra-ui/react';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdFileDownload } from 'react-icons/md';
import api from '../services/api';
import MyModal from './modal';

export default function UserCard({
  requestBody = {},
  name = "Colaborador",
  role = "Cargo",
  checked = false,
  availableToSee = false,
  availableToAnswer = false,
  manager = false,
  handleClick = () => { },
  assessmentId = 0
}) {

  async function generatePdf() {
    setButtonIsLoading(true)
    try {
      const token = 'Bearer ' + localStorage.getItem('token')
      const response = await api.get(`http://localhost:3333/grades/member-pdf?team=${requestBody.teamId}&member=${requestBody.collaboratorId}`
        ,
        {
          responseType: 'blob', headers: {
            Authorization: token
          }
        })
      const file = new Blob(
        [response.data],
        { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);


      setButtonIsLoading(false)
    } catch (e) {
      setButtonIsLoading(false)
    }
  }
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false)
  return (
    <Box
      height="400px"
      w="14em"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'md'}
      overflow={'hidden'}>
      <Box
        h={'120px'}
        w={'full'}

        justifyContent="space-between"
        padding="3"
        paddingBottom="0"
        bg={useColorModeValue('green.400', 'green.200')}
      >
        {checked && (
          <HStack justifyContent="space-between" alignItems="center">
            <Tag maxHeight="30px" size={"sm"} variant="subtle" color="gray.700">
              <TagLeftIcon boxSize="12px" as={FaCheck} />
              <TagLabel fontSize="md">Avaliado</TagLabel>
            </Tag>
            <Tooltip label={"Baixar Relatório do colaborador"} placement="top-start" >
              <IconButton
              disabled={!availableToSee}
                isLoading={buttonIsLoading}
                onClick={generatePdf}
                colorScheme="green"
                aria-label="Baixar PDF"
                icon={<MdFileDownload />}
                size="sm"
              />
            </Tooltip>
          </HStack>
        )}
      </Box>
      <Flex justify={'center'} mt={-12}>
        <Avatar
          size={'xl'}
          alt={'Author'}
          css={{
            border: '2px solid white',
          }}
        />
      </Flex>

      <VStack height="220px" p={4}>
        <Stack h="100%" spacing={0} justifyContent="center" align={'center'} mb={5}>
          <Heading mb="2" fontSize="lg" textAlign="center" fontWeight={500} fontFamily={'body'}>
            {name}
          </Heading>
          <Text color={'gray.500'}>{role}</Text>
        </Stack>
        <MyModal manager={manager} availableToSee={availableToSee} availableToAnswer={availableToAnswer} requestBody={requestBody} title={`${name} | ${role}`} assessmentId={assessmentId} />
      </VStack>
    </Box>
  );
}