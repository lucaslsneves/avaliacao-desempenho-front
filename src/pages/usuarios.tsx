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
    Switch,
    Stack,
    Select
} from '@chakra-ui/react'

import "react-datepicker/dist/react-datepicker.css";
import * as React from 'react'
import InputApp from '../components/input'
import api from '../services/api'
import { useHistory } from 'react-router-dom'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import InputMask from "react-input-mask";

import { EditIcon } from '@chakra-ui/icons'
import { debounce } from 'lodash';

export default function Usuarios() {
    const [disabled, setDisabled] = React.useState(true);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [buttonIsLoading, setButtonIsLoading] = React.useState(false);
    const [buttonModalIsLoading, setButtonModalIsLoading] = React.useState(false);
    const [loadingCompetencies, setLoadingCompetencies] = React.useState(true);
    const [users, setUsers] = React.useState<{ data: Array<any>, meta: {} }>({ data: [], meta: {} });
    const [search, setSearch] = React.useState("");
    const [cpf, setCpf] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [role, setRole] = React.useState("user");
    const [id, setId] = React.useState(0);


    const colorErrorText = useColorModeValue('red.400', 'red.200')
    const bgColor = useColorModeValue('white', 'gray.700')
    let history = useHistory();
    const toast = useToast()

    const focusBorderColor = useColorModeValue('green.400', 'green.200')


    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setLoading(true)

            const token = 'Bearer ' + localStorage.getItem('token')
            const response = await api.post('/users', {
                name,
                cpf,
                email,
                role
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
                setUsers(response.data)
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
    const { isOpen, onOpen, onClose } = useDisclosure();

    function loadUsers(filter = '', page = 1) {
        setButtonIsLoading(true)
        const token = 'Bearer ' + localStorage.getItem('token')
        api.get(`/users?filter=${filter}&page=${page}`, {
            headers: {
                Authorization: token
            }
        }).then(({ data }) => {
            setUsers(data)
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
            setUsers(data)
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
                    title: `Erro! ${e.response.status}`,
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
        loadUsers(e.target.value)
        setSearch(e.target.value)
    }, 800)

    React.useEffect(() => {
        loadUsers()
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
                <Heading>Criar Usuário</Heading>
                <VStack padding={8}
                    as="form"
                    rounded="lg"
                    bg={bgColor}
                    shadow="lg" spacing={6} width={"80%"} maxWidth="1280px" >


                    <HStack width="100%" spacing="5">
                        <FormControl isRequired flex="7">
                            <FormLabel>Nome</FormLabel>
                            <InputApp value={name} onChange={onChangeName}
                                placeholder="Nome do colaborador" />
                        </FormControl>
                        <FormControl flex="3" isRequired>
                            <FormLabel>CPF</FormLabel>
                            <Input
                                focusBorderColor={focusBorderColor}
                                as={InputMask} mask="999.999.999-99"
                                maskChar={null}
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder="Apenas números" />
                        </FormControl>
                    </HStack>

                    <HStack width="100%" spacing="5">
                        <FormControl isRequired flex="7">
                            <FormLabel>Email (Opcional)</FormLabel>
                            <InputApp value={name} onChange={onChangeName}
                                placeholder="Nome da competência" />
                        </FormControl>
                        <FormControl flex="3" isRequired>
                            <FormLabel>Role</FormLabel>
                            <Select  focusBorderColor={focusBorderColor} colorScheme="green" size='md' onChange={(e) => {
                                console.log(e.target.value) 
                                setRole(e.target.value)}}>
                                <option selected value='user'>user</option>
                                <option value='admin'>admin</option>
                                <option value='admin-ti'>admin ti</option>
                            </Select>
                        </FormControl>
                    </HStack>
                    {error && <Text fontSize={"17"} fontWeight={500} color={colorErrorText} alignSelf="start">{error}</Text>}
                    <Button isDisabled={disabled} type="submit" onClick={(e) => handleSubmit(e)} isLoading={loading} width="100%" colorScheme="green">Criar</Button>
                </VStack>
                <Heading>Usuários</Heading>

                <HStack width="45%" minW="600px" justifyContent="space-between" alignItems="center">
                    <Input width="300px" focusBorderColor={focusBorderColor} onChange={onChangeSearch} placeholder="Buscar" />
                    <HStack>
                        <Button isLoading={buttonIsLoading} onClick={() => loadUsers(search, users.meta.current_page - 1)}
                            disabled={users.meta.current_page === 1} colorScheme="green" leftIcon={<MdArrowBack />}>Voltar</Button>
                        <Text>{`${users.meta.current_page} de ${users.meta.last_page}`}</Text>
                        <Button isLoading={buttonIsLoading} onClick={() => loadUsers(search, users.meta.current_page + 1)}
                            disabled={users.meta.current_page === users.meta.last_page} colorScheme="green" rightIcon={<MdArrowForward />}>Avançar</Button>
                    </HStack>
                </HStack>

                <VStack rounded="lg" shadow="lg" padding={8} width={"80%"} maxWidth="1280px" bg={bgColor}>

                    {

                        users.data.map(user => (

                            <HStack key={user.id} justifyContent="space-between" width="100%" padding={3} borderBottom="1px solid gray.300" borderBottomColor="gray.200" borderBottomWidth="1px">
                                <Text fontWeight="500" width="40%">{user.name}</Text>
                                <Text fontWeight="500" textAlign="justify" width="30%">{user.cpf}</Text>
                                <Text fontWeight="500" textAlign="justify" width="30%">{user.role}</Text>

                                <IconButton aria-label='Search database' colorScheme="green" onClick={() => myOnOpen(user.id, competency.name)} icon={<EditIcon />} />


                            </HStack>

                        ))
                    }
                    <Modal scrollBehavior={"inside"} size="md" onClose={() => {
                        setName('')
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