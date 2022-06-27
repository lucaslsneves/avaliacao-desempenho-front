import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import pt from "date-fns/locale/pt";
import { debounce } from "lodash";
import * as React from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import InputApp from "../components/input";
import api from "../services/api";

export default function AdicionarMembro() {
  const theme = useColorModeValue("light", "dark");
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [members, setMembers] = React.useState<{ data: Array<any>; meta: {} }>({
    data: [],
    meta: {},
  });
  const [name, setName] = React.useState("");
  const [registration, setRegistration] = React.useState("");
  const [hierarchy, setHierarchy] = React.useState("0");
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [roleNumber, setRoleNumber] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [id, setId] = React.useState(0);
  const [assessment, setAssessment] = React.useState({});
  const [team, setTeam] = React.useState({});
  const [optionsAssessments, setOptionsAssessments] = React.useState([]);
  const [optionsTeams, setOptionsTeams] = React.useState([]);
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);
  const [buttonModalIsLoading, setButtonModalIsLoading] = React.useState(false);
  const [loadingMembers, setLoadingMembers] = React.useState(false);

  const borderBottomColor = useColorModeValue("gray.200", "gray.600");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.700");

  function loadMembers(filter = "", page = 1): Promise<{}> {
    setButtonIsLoading(true);
    const token = "Bearer " + localStorage.getItem("token");
    return api
      .get(`/members?filter=${filter}&page=${page}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        setButtonIsLoading(false);
        return data;
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          }
        }
        setButtonIsLoading(false);
      });
  }

  const onChangeSearch = debounce(async (e) => {
    loadMembers(e.target.value);
    setSearch(e.target.value);
  }, 800);

  const colorErrorText = useColorModeValue("red.400", "red.200");
  registerLocale("pt", pt);
  let history = useHistory();
  const toast = useToast();

  React.useEffect(() => {
    setLoadingMembers(true);
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(`/assessments-groups`, {
        headers: {
          Authorization: token,
        },
      })
      .then(async ({ data }) => {
        try {
          const members = await loadMembers();
          setMembers(members);
          setOptionsAssessments([
            ...data.data.map((assessment) => ({
              label: assessment.name,
              value: assessment.id,
            })),
          ]);
        } catch (e) {
          toast({
            title: "Erro!",
            description: "Erro inesperado ao carregar a página",
            position: "top-right",
            status: "success",
            duration: 10000,
            isClosable: true,
          });
        }
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            setError("Erro inesperado, tente novamente em alguns minutos!");
          }
        } else {
          setError("Erro inesperado, tente novamente em alguns minutos!");
        }
      })
      .finally(() => {
        setLoadingMembers(false);
      });
  }, []);

  React.useEffect(() => {
    setTeam({});
    setOptionsTeams([]);
    console.log(assessment.value);
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(`/assessments/teams/${assessment.value}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        console.log(data);
        setOptionsTeams([
          ...data.data.map((team) => ({
            label: `${team.unity} - ${team.area}`,
            value: team.id,
          })),
        ]);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            setError("Erro inesperado, tente novamente em alguns minutos!");
          }
        } else {
          setError("Erro inesperado, tente novamente em alguns minutos!");
        }
      });
  }, [assessment]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const token = "Bearer " + localStorage.getItem("token");

      const response = await api.post(
        "/members",
        {
          name,
          registration,
          hierarchy,
          cpf,
          email,
          role,
          roleNumber,
          assessmentGroupId: assessment.value,
          teamId: team.value,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Membro Adicionado",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);

        setName("");
        setRegistration("");
        setHierarchy("");
        setCpf("");
        setEmail("");
        setRole("");
        setRoleNumber("");
        setAssessment({});
        setTeam({});
        setError("");
      } else {
        setError(e.response.data);
      }
    } catch (e) {
      if (e.response) {
        const data = e.response.data;
        if (e.response.status === 401) {
          localStorage.setItem("token", "");
          localStorage.setItem("isAuthenticated", "false");
          history.push("/");
        } else if (e.response.status === 400) {
          if (data.rule === "required") {
            setError("Preencha todos os campos obrigatórios");
          } else {
            setError(e.response.data.error);
          }
        }
      } else {
        setError("Erro inesperado, tente novamente em alguns minutos!");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate() {
    setButtonModalIsLoading(true);
    const token = "Bearer " + localStorage.getItem("token");
    api
      .put(
        `/users/${id}`,
        {
          name,
          cpf,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        toast({
          title: "Sucesso!",
          description: "Competência atualizada",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setButtonModalIsLoading(false);
        setUsers(data);
        setName("");
        setCpf("");
        setEmail("");
        setRole("");
        setSearch("");
        setPassword("");
        setId(0);
        onClose();
      })
      .catch((e) => {
        setButtonModalIsLoading(false);
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else if (e.response.status === 400) {
            if (e.response.data?.error) {
              toast({
                title: `Campo já utilizado`,
                description: e.response.data?.error,
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else if (e.response.data?.rule === "CPF") {
              toast({
                title: `Campo inválido`,
                description: "CPF inválido",
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else if (e.response.data?.rule === "required") {
              toast({
                title: `Preencha os campos obrigatórios`,
                description: `${e.response.data.message} ${e.response.data.field}`,
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              toast({
                title: `Erro! ${e.response.status}`,
                description: "Erro ao editar usuário",
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          }
        }
      });
  }

  function myOnOpen(
    memberId: number,
    name: string,
    cpf: string,
    email: string,
    hierarchy: string,
    registration: string,
    role: string,
    roleNumber: string,
    assessment: {},
    team: {}
  ) {
    setHierarchy(hierarchy);
    setName(name);
    setCpf(cpf);
    setEmail(email);
    setRegistration(registration);
    setAssessment(assessment);
    setTeam(team);
    setRole(role);
    setRoleNumber(roleNumber);
    setId(memberId);
    onOpen();
  }

  const focusBorderColor = useColorModeValue("green.400", "green.200");
  if (loadingMembers) {
    return (
      <VStack
        height={"400px"}
        width={"400px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner color="green.400" size="xl" />
      </VStack>
    );
  }
  return (
    <>
      <VStack spacing="6" height="100%" width="100%">
        <Heading>Adicionar colaborador em uma avaliação</Heading>
        <VStack
          padding={8}
          as="form"
          rounded="lg"
          bg={bgColor}
          shadow="lg"
          spacing={6}
          width={"70%"}
        >
          <HStack width="100%" spacing="5">
            <FormControl isRequired flex="5">
              <FormLabel>Nome</FormLabel>
              <InputApp
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="Nome do colaborador"
              />
            </FormControl>
            <FormControl isRequired flex="2.5">
              <FormLabel>Chapa</FormLabel>
              <InputApp
                type="number"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="Matrícula do colaborador"
              />
            </FormControl>
            <FormControl isRequired flex="2.5">
              <FormLabel>Hierarquia</FormLabel>
              <NumberInput
                focusBorderColor={focusBorderColor}
                value={hierarchy}
                onChange={(value) => {
                  setHierarchy(value);
                }}
                placeholder="Hierarquia do colaborador"
                step={1}
                defaultValue={0}
                min={0}
                max={10}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </HStack>

          <HStack width="100%" spacing="5">
            <FormControl flex="3" isRequired>
              <FormLabel>CPF</FormLabel>
              <Input
                focusBorderColor={focusBorderColor}
                as={InputMask}
                mask="999.999.999-99"
                maskChar={null}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Apenas números"
              />
            </FormControl>

            <FormControl flex="7">
              <FormLabel>Email (Opcional)</FormLabel>
              <InputApp
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </FormControl>
          </HStack>

          <HStack width="100%" spacing="5">
            <FormControl flex="6" isRequired>
              <FormLabel>Cargo</FormLabel>
              <InputApp
                value={role}
                onChange={(e) => setRole(e.target.value.toUpperCase())}
                placeholder="Função do colaborador - Ex: Analista de RH PL"
              />
            </FormControl>

            <FormControl flex="4">
              <FormLabel>Código da Função No RM (Opcional)</FormLabel>
              <InputApp
                value={roleNumber}
                onChange={(e) => setRoleNumber(e.target.value)}
                placeholder="N° Função do colaborador no RM"
              />
            </FormControl>
          </HStack>

          <Heading fontSize="md" fontWeight="500" width="100%">
            Avaliação de desempenho
          </Heading>
          <Box width="100%">
            <Select
              value={assessment}
              key={assessment?.value}
              options={optionsAssessments}
              placeholder="Selecione as competências"
              onChange={(e) => {
                setAssessment(e);
              }}
            />
          </Box>

          <Box width="100%">
            <Heading mb="5" fontSize="md" fontWeight="500">
              Equipe
            </Heading>
            <Select
              isDisabled={optionsTeams.length === 0 ? true : false}
              value={team}
              key={team?.value}
              options={optionsTeams}
              placeholder="Selecione o unidade do colaborador"
              onChange={(e) => {
                setTeam(e);
              }}
            />
          </Box>

          {error && (
            <Text
              fontSize={"17"}
              fontWeight={500}
              color={colorErrorText}
              alignSelf="start"
            >
              {error}
            </Text>
          )}
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            isLoading={loading}
            width="100%"
            colorScheme="green"
          >
            Entrar
          </Button>
        </VStack>
      </VStack>
    </>
  );
}

/**
 * 
 *  <Heading>Membros</Heading>
        <HStack width="45%" minW="600px" justifyContent="space-between" alignItems="center">
          <Input width="300px" focusBorderColor={focusBorderColor} onChange={onChangeSearch} placeholder="Buscar" />
          <HStack>
            <Button isLoading={buttonIsLoading} onClick={() => loadMembers(search, members.meta.current_page - 1)}
              disabled={members.meta.current_page === 1} colorScheme="green" leftIcon={<MdArrowBack />}>Voltar</Button>
            <Text>{`${members.meta.current_page} de ${members.meta.last_page}`}</Text>
            <Button isLoading={buttonIsLoading} onClick={() => loadMembers(search, members.meta.current_page + 1)}
              disabled={members.meta.current_page === members.meta.last_page} colorScheme="green" rightIcon={<MdArrowForward />}>Avançar</Button>
          </HStack>
        </HStack>

        <VStack rounded="lg" shadow="lg" padding={8} width={"80%"} maxWidth="1280px" bg={bgColor}>
          <HStack justifyContent="space-between" width="100%" padding={3} borderBottom="1px solid gray.300" borderBottomColor={borderBottomColor} borderBottomWidth="1px">
            <Text width="25%" fontWeight="900">Nome</Text>
            <Text width="16.75%" fontWeight="900" textAlign="justify">CPF</Text>
            <Text width="16.75%" fontWeight="900" textAlign="justify">Equipe</Text>
            <Text width="16.75%" fontWeight="900" textAlign="justify">Unidade</Text>
            <Text width="16.75%" fontWeight="900" textAlign="justify">Avaliação</Text>
            <Text width="8%" fontWeight="900" textAlign="end">Editar</Text>
          </HStack>
          {

            members.data.map(member => (

              <HStack key={member.member_id} justifyContent="space-between" width="100%" padding={3} borderBottom="1px solid gray.300" borderBottomColor={borderBottomColor} borderBottomWidth="1px">
                <Text fontWeight="500" width="25%">{member.name}</Text>
                <Text fontWeight="500" width="16.75%" textAlign="justify" >{member.cpf}</Text>
                <Text fontWeight="500" width="16.75%" textAlign="justify" >{member.area}</Text>
                <Text fontWeight="500" width="16.75%" textAlign="justify" >{member.unity}</Text>
                <Text fontWeight="500" width="16.75%" textAlign="justify" >{member.assessment_group_name}</Text>

                <Box width="8%" textAlign="right">
                  <IconButton aria-label='Search database' colorScheme="green" onClick={() => myOnOpen(
                    member.id,
                    member.name,
                    member.cpf,
                    member.email,
                    member.hierarchy,
                    member.registration,
                    member.role,
                    member.role_number,
                    {value: member.assessment_group_id, label: member.assessment_group_name},
                    {value: member.team_id, label: `${member.unity} - ${member.area}`}
                  )} icon={<EditIcon />} />
                </Box>

              </HStack>

            ))
          }

          <Modal scrollBehavior={"inside"} size="4xl" onClose={() => {
            setName('')
            setCpf('')
            setEmail('')
            setRole('')
            setId(0)
            setAssessment(1)
            onClose()
          }} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody padding="6" >
                <VStack padding={8}
                  as="form"
                  bg={bgColor}
                  spacing={6} width={"100%"} >
                  <HStack width="100%" spacing="5">
                    <FormControl isRequired flex="5">
                      <FormLabel>Nome</FormLabel>
                      <InputApp disabled={true} value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Nome do colaborador" />
                    </FormControl>
                    <FormControl isRequired flex="2.5">
                      <FormLabel>Chapa</FormLabel>
                      <InputApp type="number" value={registration} onChange={(e) => setRegistration(e.target.value)} placeholder="Matrícula do colaborador" />
                    </FormControl>
                    <FormControl isRequired flex="2.5">
                      <FormLabel>Hierarquia</FormLabel>
                      <NumberInput focusBorderColor={focusBorderColor} value={hierarchy} onChange={(value) => {
                        setHierarchy(value)
                      }} placeholder="Hierarquia do colaborador" step={1}  min={0} max={10}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                    </FormControl>
                  </HStack>

                  <HStack width="100%" spacing="5">
                    <FormControl flex="3" isRequired>
                      <FormLabel>CPF</FormLabel>
                      <Input
                      disabled={true}
                        focusBorderColor={focusBorderColor}
                        as={InputMask} mask="999.999.999-99"
                        maskChar={null}
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Apenas números" />
                    </FormControl>

                    <FormControl flex="7">
                      <FormLabel>Email (Opcional)</FormLabel>
                      <InputApp disabled={true} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </FormControl>
                  </HStack>


                  <HStack width="100%" spacing="5">
                    <FormControl flex="6" isRequired>
                      <FormLabel>Cargo</FormLabel>
                      <InputApp value={role} onChange={(e) => setRole(e.target.value.toUpperCase())} placeholder="Função do colaborador - Ex: Analista de RH PL" />
                    </FormControl>

                    <FormControl flex="4">
                      <FormLabel>Código da Função No RM (Opcional)</FormLabel>
                      <InputApp value={roleNumber} onChange={(e) => setRoleNumber(e.target.value)} placeholder="N° Função do colaborador no RM" />
                    </FormControl>
                  </HStack>



                  <Heading fontSize="md" fontWeight="500" width="100%">Avaliação de desempenho</Heading>
                  <Box width="100%">
                    <Select
                      value={assessment}
                      key={assessment?.value}
                      options={optionsAssessments}
                      placeholder="Selecione as competências"
                      onChange={(e) => {
                        setAssessment(e)
                      }}
                    />
                  </Box>

                  <Box width="100%">
                    <Heading mb="5" fontSize="md" fontWeight="500">Equipe</Heading>
                    <Select
                      value={team}
                      key={team?.value}
                      options={optionsTeams}
                      placeholder="Selecione o unidade do colaborador"
                      onChange={(e) => {
                        setTeam(e)
                      }}
                    />
                  </Box>
                </VStack>
              </ModalBody>
              <ModalHeader display="flex" w="100%" justifyContent="flex-end">
                <Button isLoading={buttonModalIsLoading} onClick={handleUpdate} colorScheme="green">Salvar</Button>
              </ModalHeader>
            </ModalContent>
          </Modal>


        </VStack >
 * 
 * 
 */
