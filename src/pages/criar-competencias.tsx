import {
  HStack,
  VStack,
  useColorModeValue,
  ModalBody,
  Text,
  FormLabel,
  FormControl,
  Button,
  Heading,
  IconButton,
  useToast,
  Textarea,
  Skeleton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import "react-datepicker/dist/react-datepicker.css";
import * as React from 'react'
import InputApp from '../components/input'
import api from '../services/api'
import { useHistory } from 'react-router-dom'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

import { EditIcon } from '@chakra-ui/icons'
import { debounce } from 'lodash';

export default function CriarCompetencia() {
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);
  const [buttonModalIsLoading, setButtonModalIsLoading] = React.useState(false);
  const [loadingCompetencies, setLoadingCompetencies] = React.useState(true);
  const [competencies, setCompetencies] = React.useState<{ data: Array<any>, meta: {} }>({ data: [], meta: {} });
  const [search, setSearch] = React.useState("");

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [id, setId] = React.useState(0);


  const colorErrorText = useColorModeValue('red.400', 'red.200')
  const bgColor = useColorModeValue('white', 'gray.700')
  let history = useHistory();
  const toast = useToast()



  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)

      const token = 'Bearer ' + localStorage.getItem('token')
      const response = await api.post('/competencies', {
        name,
        description
      },
        {
          headers: {
            Authorization: token
          }
        }
      )

      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Competência criada",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setCompetencies(response.data)
        setLoading(false)
        setName("")
        setDescription("")
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }
    } catch (e) {
      if (e.response) {
        const data = e.response.data
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          setError('Erro inesperado, tente novamente em alguns minutos!')
        }
      } else {
        setError('Erro inesperado, tente novamente em alguns minutos!')
      }


    } finally {
      setLoading(false)
    }

  }

  function onChangeDescription(e: any) {
    setDescription(e.target.value);
    if (e.target.value && name !== "") {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  function onChangeName(e: any) {
    setName(e.target.value);
    if (e.target.value !== "" && description !== "") {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }
  const focusBorderColor = useColorModeValue("green.400", "green.200")
  const { isOpen, onOpen, onClose } = useDisclosure();

  function loadCompetencies(filter = '', page = 1) {
    setButtonIsLoading(true)
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/competencies?filter=${filter}&page=${page}&limit=6`, {
      headers: {
        Authorization: token
      }
    }).then(({ data }) => {
      setCompetencies(data)
      setLoadingCompetencies(false)
      setButtonIsLoading(false)

    }).catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        }
      }
      setButtonIsLoading(false)
      setLoadingCompetencies(false)
    })
  }

  function handleUpdate() {
    setButtonModalIsLoading(true)
    const token = 'Bearer ' + localStorage.getItem('token')
    api.put(`/competencies/${id}`, {
      name,
      description
    }, {
      headers: {
        Authorization: token
      }
    }).then(({ data }) => {
      toast({
        title: "Sucesso!",
        description: "Competência atualizada",
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      setButtonModalIsLoading(false)
      setCompetencies(data)
      setName('')
      setId(0)
      setDescription('')
      onClose()
    }).catch(e => {
      setButtonModalIsLoading(false)
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        }
      } else {
        toast({
          title:`Erro! ${e.response.status}`,
          description: "Erro ao editar competência",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        onClose()
      }

    })
  }

  function myOnOpen(competencyId: number, name: string, description: string) {
    setName(name)
    setDescription(description)
    setId(competencyId)
    onOpen()
  }
  const onChangeSearch = debounce(async (e) => {
    loadCompetencies(e.target.value)
    setSearch(e.target.value)
  }, 800)

  React.useEffect(() => {
    loadCompetencies()
  }, [])

  if (loadingCompetencies) {
    return (
      <VStack alignItems="center" spacing="10" height="100%" width="100%"  >
        <Skeleton height="40px" width={"25%"} borderRadius="lg" />
        <Skeleton height="300px" width={"70%"} borderRadius="lg" />
        <Skeleton height="40px" width={"25%"} borderRadius="lg" />
        <Skeleton height="500px" width={"70%"} borderRadius="lg" />
      </VStack>
    )
  }
  return (
    <>
      <VStack spacing="8" height="100%" width="100%"  >
        <Heading>Criar Competência</Heading>
        <VStack padding={8}
          as="form"
          rounded="lg"
          bg={bgColor}
          shadow="lg" spacing={6} width={"70%"} >

          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <InputApp value={name} onChange={onChangeName}
              placeholder="Nome da competência" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea maxLength={255} focusBorderColor={focusBorderColor} value={description} onChange={onChangeDescription} placeholder="Descrição da competência" />
          </FormControl>

          {error && <Text fontSize={"17"} fontWeight={500} color={colorErrorText} alignSelf="start">{error}</Text>}
          <Button isDisabled={disabled} type="submit" onClick={(e) => handleSubmit(e)} isLoading={loading} width="100%" colorScheme="green">Entrar</Button>
        </VStack>
        <Heading>Competências</Heading>

        <HStack width="45%" minW="600px" justifyContent="space-between" alignItems="center">
          <Input width="300px" focusBorderColor={focusBorderColor} onChange={onChangeSearch} placeholder="Buscar" />
          <HStack>
            <Button isLoading={buttonIsLoading} onClick={() => loadCompetencies(search, competencies.meta.current_page - 1)}
              disabled={competencies.meta.current_page === 1} colorScheme="green" leftIcon={<MdArrowBack />}>Voltar</Button>
            <Text>{`${competencies.meta.current_page} de ${competencies.meta.last_page}`}</Text>
            <Button isLoading={buttonIsLoading} onClick={() => loadCompetencies(search, competencies.meta.current_page + 1)}
              disabled={competencies.meta.current_page === competencies.meta.last_page} colorScheme="green" rightIcon={<MdArrowForward />}>Avançar</Button>
          </HStack>
        </HStack>

        <VStack rounded="lg" shadow="lg" padding={8} width={"70%"} bg={bgColor}>

          {

            competencies.data.map(competency => (

              <HStack key={competency.id} justifyContent="space-between" width="100%" padding={3} borderBottom="1px solid gray.300" borderBottomColor="gray.200" borderBottomWidth="1px">
                <Text fontWeight="500" width="200px">{competency.name}</Text>
                <Text fontWeight="500" textAlign="justify" width="400px">{competency.description}</Text>
                <IconButton aria-label='Search database' colorScheme="green" onClick={() => myOnOpen(competency.id, competency.name, competency.description)} icon={<EditIcon />} />


              </HStack>

            ))
          }
          <Modal scrollBehavior={"inside"} size="md" onClose={() => {
            setName('')
            setDescription('')
            onClose()
          }} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody padding="6" >
                <VStack>
                  <FormControl>
                    <FormLabel>Nome</FormLabel>
                    <Input focusBorderColor={focusBorderColor} value={name} onChange={e => setName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Descrição</FormLabel>
                    <Textarea focusBorderColor={focusBorderColor} maxLength={255} value={description} onChange={e => setDescription(e.target.value)} />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalHeader display="flex" w="100%" justifyContent="flex-end">
                <Button isLoading={buttonModalIsLoading} onClick={handleUpdate} colorScheme="green">Salvar</Button>
              </ModalHeader>
            </ModalContent>
          </Modal>

        </VStack >
      </VStack>
    </>
  )
}