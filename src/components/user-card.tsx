import {
  Heading,
  Avatar,
  Box,
  VStack,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  Tag,
  TagLabel,
  TagLeftIcon,
  IconButton,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { MdFileDownload } from 'react-icons/md'
import MyModal from './modal';
import  ModalCollaboratorPDF from './modal-collaborator-pdf';

export default function UserCard({
  requestBody = {},
  name = "Colaborador",
  role = "Cargo",
  checked = false,
  availableToSee = false,
  handleClick = () => { },
  assessmentId = 0
}) {
  const iconColor = useColorModeValue("white", "gray.800");
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
            <ModalCollaboratorPDF requestBody={requestBody} />
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
        <MyModal requestBody={requestBody} title={`${name} | ${role}`} assessmentId={assessmentId} />
      </VStack>
    </Box>
  );
}