import React, { ReactNode } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Image
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { FaEyeSlash, FaEye, FaList } from "react-icons/fa"

import { MdAdd , MdPersonAdd , MdPerson } from 'react-icons/md'

import { Link as LinkRouter } from 'react-router-dom'
import LogoGreen from '../assets/logo-green.png'
import LogoWhite from '../assets/logo-white.svg'
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { useHistory } from 'react-router';
import InputApp from '../components/input';
import { truncate } from 'fs';
import api from '../services/api';

interface LinkItemProps {
  name: string;
  icon: IconType;
  onClick: Function
}

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {




  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box overflowX="auto" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const history = useHistory()

  let LinkItems: Array<LinkItemProps> = [
    {
      name: 'Minhas Avaliações', icon: FiHome, onClick: () => {
        history.push('/dashboard')
      }
    },

  ];

  if (localStorage.getItem('role') === 'admin' ||  localStorage.getItem('role') ===  'admin-ti') {
    LinkItems = [...LinkItems, {
      name: 'Todas Avaliações', icon: FiTrendingUp, onClick: () => {
        history.push('/todas-avaliacoes')
      }
    },
    {
      name: 'Criar Avaliação', icon: MdAdd, onClick: () => {
        history.push('/criar-avaliacao')
      }
    },
    {
      name: 'Competências', icon: FaList, onClick: () => {
        history.push('/competencias')
      }
    },
    {
      name: 'Adicionar Membro', icon: MdPersonAdd, onClick: () => {
        history.push('/adicionar-membro')
      }
    },
  
    ]
  }

  if(localStorage.getItem('role') === 'admin-ti') {
    LinkItems = [...LinkItems ,   {
      name: 'Usuários', icon: MdPerson, onClick: () => {
        history.push('/usuarios')
      }
    }]
  }
  const theme = useColorModeValue("light", "dark");


  return (
    <Box

      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      {theme === 'dark' ? <Image width={90}  src={LogoWhite} /> : <Image width={90}  src={LogoGreen} />}

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem onClick={link.onClick} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('green.400', "green.200"),
          color: useColorModeValue('white', "gray.800"),
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const history = useHistory()
  const { isOpen, onOpen: onOpen2, onClose } = useDisclosure();

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)

  const [isLoadingButton, setIsLoadingButton] = React.useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true)
  const toast = useToast()
 
  
  function onChangeCurrentPassword(e: any) {
    setCurrentPassword(e.target.value);
    if(e.target.value !== "" && newPassword.length >= 8) {
      setIsButtonDisabled(false)
    }else {
      setIsButtonDisabled(true)
    }
  }

  function onChangeNewPassword(e: any) {
    setNewPassword(e.target.value);
    if(e.target.value.length >= 8 && currentPassword !== "") {
      setIsButtonDisabled(false)
    }else {
      setIsButtonDisabled(true)
    }
  }
 

  function signOut() {
    localStorage.setItem('isAuthenticated', "false")
    localStorage.setItem("token", "")
    history.push("/")
  }

  function handleSubmit() {
    const token = 'Bearer ' + localStorage.getItem('token')
    setIsLoadingButton(true)
    api.put(`/user/change-password`, {
      currentPassword,
      newPassword
    },
      {
        headers: {
          Authorization: token
        }
      }

    ).then((response) => {
      onClose()

      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso!",
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      
      setIsLoadingButton(false)
    }).catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
          return
        } else if (e.response.status === 400) {
          toast({
            title: "Erro!",
            description: "Senha Atual Incorreta!",
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
          setIsLoadingButton(false)
          return;
        }

        toast({
          title: "Erro!",
          description: "Erro inesperado!",
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        })

        setIsLoadingButton(false)
      }
    })
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        INTS
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <ColorModeSwitcher />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">

                  <Text fontSize="sm">{
                    localStorage.getItem("user_name") || 'Usuário'
                  }</Text>

                  <Text fontSize="xs" color="gray.600">
                    {
                      localStorage.getItem("role") === 'user' ? "Usuário" : "Admin"
                    }
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={onOpen2}>Trocar senha</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => signOut()}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
      <Modal as="form" scrollBehavior={"inside"} size="sm" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Senha</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <VStack spacing={6}>
            <FormControl>
              <FormLabel>Senha Atual</FormLabel>
              <InputGroup>
                <InputApp value={currentPassword} onChange={(e) => onChangeCurrentPassword(e)} placeholder="Sua senha atual" type={showCurrentPassword === false ? 'password' : 'text'} />
                <InputRightElement children={<IconButton
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  h="1.75rem" size="sm"
                  bg="transparent"
                  aria-label="Call Sage"
                  icon={showCurrentPassword === false ? <FaEyeSlash /> : <FaEye />}
                />} />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Nova Senha</FormLabel>
              <InputGroup>
                <InputApp value={newPassword} onChange={(e) => onChangeNewPassword(e)} placeholder="No mínimo 8 digitos" type={showNewPassword === false ? 'password' : 'text'} />
                <InputRightElement children={<IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  h="1.75rem" size="sm"
                  bg="transparent"
                  aria-label="Call Sage"
                  icon={showNewPassword === false ? <FaEyeSlash /> : <FaEye />}
                />} />
              </InputGroup>
            </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="flex-end">
            <Button  disabled={isButtonDisabled} type="submit" isLoading={isLoadingButton} onClick={() => handleSubmit()} colorScheme="green" >Trocar Senha</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};