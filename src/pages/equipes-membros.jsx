import { useColorModeValue } from "@chakra-ui/color-mode";
import { Heading, HStack, VStack } from "@chakra-ui/layout";
import {
  Badge,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { debounce } from "lodash";
import React, { useEffect } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdClose,
  MdGridView,
  MdList,
  MdOutlineCheck,
} from "react-icons/md";

import { VscGraph } from "react-icons/vsc";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import TableMembers from "../components/table-members";
import UserCard from "../components/user-card";
import api from "../services/api";

export default function EquipesMembros(props) {
  const [members, setMembers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({});
  const [isTable, setIsTable] = React.useState(false);
  const focusColor = useColorModeValue("green.400", "green.200");
  const [status, setStatus] = React.useState("");
  // Estado avaliacao por competencia
  const [competencies, setCompetencies] = React.useState([]);
  const [competenciesIndex, setCompetenciesIndex] = React.useState(0);
  const [memberGrades, setMemberGrades] = React.useState([]);
  const [isListView, setIsListView] = React.useState(true);
  const [isLoadingButtonListView, setIsLoadingButtonListView] =
    React.useState(false);
  const [feedback, setFeedback] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();

  const onChangeSearch = debounce(async (e) => {
    loadMembers(e.target.value, 0);
    setSearch(e.target.value);
  }, 800);

  function loadCompetencies() {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(
        `/competencies/assessment/${location.state.assessmentId}/team/${location.state.teamId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        const competencies = [
          ...response.data.competenciesManagerOnly,
          ...response.data.competencies,
        ];

        loadGrades(
          competencies[competenciesIndex || 0]?.competency_id,
          competencies[competenciesIndex || 0].is_mananger
        );
        setCompetencies(competencies);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            setError(true);
            setIsLoaded(false);
          }
          setError(true);
          setIsLoaded(false);
        }
      });
  }

  function confirmFeedback() {
    const token = "Bearer " + localStorage.getItem("token");

    api
      .post(
        `/feedback`,
        {
          teamId: location.state?.teamId,
          managerId: location.state?.managerId,
          assessmentId: location.state?.assessmentId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setFeedback(true);
        onClose();
        toast({
          title: "Sucesso",
          description: "Confirmação de Feedback realizada com sucesso!",
          position: "top",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            toast({
              title: "Erro ao confirmar!",
              description: "Não foi possível confirmar o Feedback!",
              position: "top-right",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            setIsLoadingButtonListView(false);
            return;
          }
        }
      });
  }

  function loadGrades(competencyId, isManager = false) {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(
        `/members/grades/competency/${competencyId}/team/${location.state?.teamId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (isManager === 1) {
          setMemberGrades(response.data.filter((grade) => grade.hierarchy > 0));
        } else {
          setMemberGrades(response.data);
        }
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            setError(true);
            setIsLoaded(false);
          }
          setError(true);
          setIsLoaded(false);
        }
      });
  }

  function loadMembers(filter = "", timeout = 1000, page = 1) {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(
        `/logged-in-user/assessments/teams/members/${location.state?.teamId}?filter=${filter}&page=${page}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          setMembers(response.data.newCollaborates);
          setManagers(
            response.data.newCollaborates.filter((c) => c.hierarchy > 0)
          );
          setPagination(response.data.collaborates.meta);
          setIsLoaded(false);
        }, timeout);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            setError(true);
            setIsLoaded(false);
          }
          setError(true);
          setIsLoaded(false);
        }
      });
  }

  function getStatus() {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .post(
        `/manager-status`,
        {
          teamId: location.state?.teamId,
          managerId: location.state?.managerId,
          assessmentId: location.state?.assessmentId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response.data.statusAlreadyExists[0].status === "finalizado") {
          setIsListView(false);
        }
        if (response.data?.feedbackAlreadyExists) {
          setFeedback(true);
        }
        setStatus(response.data.statusAlreadyExists[0].status);
      })
      .catch((e) => {});
  }

  function updateStatus(status) {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .put(
        `/manager-status`,
        {
          status,
          teamId: location.state?.teamId,
          managerId: location.state?.managerId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {})
      .catch((e) => {});
  }
  function addGradesListView() {
    let allFieldsAreFilleds = true;
    for (let i = 0; i < memberGrades.length; i++) {
      if (memberGrades[i]?.grade === null) {
        allFieldsAreFilleds = false;
      }
    }

    if (!allFieldsAreFilleds) {
      toast({
        title: "Campo nota é obrigatório",
        description: "Preencha todos os campos obrigatórios",
        position: "top-right",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const token = "Bearer " + localStorage.getItem("token");
    setIsLoadingButtonListView(true);

    api
      .post(
        `/grades-list-view`,
        {
          teamId: location.state?.teamId,
          competencyId: competencies[competenciesIndex].competency_id,
          grades: memberGrades,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (competenciesIndex === competencies.length - 1) {
          setStatus("finalizado");
          updateStatus("finalizado");
          setIsListView(false);
          toast({
            title: "Sucesso!",
            description: "Você concluíu a avaliação",
            position: "top",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          if (status !== "finalizado") {
            setStatus("andamento");
            updateStatus("andamento");
          }
          setCompetenciesIndex(competenciesIndex + 1);
          toast({
            title: "Sucesso!",
            description: "Notas enviadas!",
            position: "top-right",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        setIsLoadingButtonListView(false);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            toast({
              title: "Erro ao avaliar!",
              description: "Não foi possível avaliar este colaborador",
              position: "top-right",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            setIsLoadingButtonListView(false);
            return;
          }
        }
      });
  }

  function handleChangeGrade(i, value) {
    let vals = [...memberGrades];
    vals[i].grade = value;
    setMemberGrades(vals);
  }

  function handleChangeJustification(i, value) {
    let vals = [...memberGrades];
    vals[i].justification = value;
    setMemberGrades(vals);
  }

  const handleTabsChange = (index) => {
    setCompetenciesIndex(index);
  };

  const handleSubmit = async (event) => {
    addGradesListView();

    event.preventDefault();
  };

  const focusBorderColor = useColorModeValue("green.400", "green.200");

  const headingColor = useColorModeValue("gray.700", "white");

  useEffect(() => {
    if (!isListView) loadMembers();
  }, [isListView]);

  useEffect(() => {
    if (isListView) {
      loadCompetencies();
      window.scrollTo(0, 0);
    }
  }, [isListView, competenciesIndex]);

  useEffect(() => {
    getStatus();
  }, []);
  if (
    !location.state?.teamId ||
    !location.state?.teamName ||
    location.state.availableToSee === undefined ||
    location.state.availableToSee === null
  ) {
    history.push("/");

    return <div></div>;
  }

  if (error) {
    return <h1>Ops,algo deu errado! Tente novamente mais tarde!</h1>;
  }

  if (isListView) {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmação de Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text textAlign={"center"} fontSize={"lg"}>
                Você confirma que deu o
                <Text fontWeight={700}>feedback da avaliação</Text> para sua
                equipe ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                rightIcon={<MdClose />}
                colorScheme="blue"
                mr={3}
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button
                rightIcon={<MdOutlineCheck />}
                colorScheme={"green"}
                variant="ghost"
                onClick={() => confirmFeedback()}
              >
                Confirmo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <VStack mb={5}>
          <HStack
            w={"100%"}
            flexDirection={{ base: "column", md: "column", lg: "row" }}
            min-width={"500px"}
            alignItems="center"
            justifyContent="space-between"
            paddingX="16"
            mb={10}
          >
            <VStack alignItems={"flex-start"}>
              <HStack>
                <IconButton
                  variant="outline"
                  cursor={"pointer"}
                  colorScheme="green"
                  icon={<MdGridView />}
                  onClick={() => setIsListView(false)}
                  disabled={status !== "finalizado"}
                />
                <IconButton
                  variant="outline"
                  cursor={"pointer"}
                  colorScheme="green"
                  icon={<MdList />}
                  onClick={() => {
                    setIsListView(true);
                  }}
                />
                <Button
                  colorScheme={"green"}
                  disabled={!location.state.availableToSee || feedback}
                  onClick={() => onOpen()}
                >
                  {feedback === true
                    ? "Feedback confirmado"
                    : "Confirmar Feedback"}
                </Button>
              </HStack>
            </VStack>

            <VStack>
              <HStack mt="5" spacing="5" display="inline-flex">
                {status === "finalizado" && (
                  <Badge fontSize={"sm"} colorScheme={"green"}>
                    Status da Avaliação: Concluída
                  </Badge>
                )}
                {status === "andamento" && (
                  <Badge fontSize={"sm"} colorScheme={"blue"}>
                    Status da Avaliação: Andamento
                  </Badge>
                )}
                {status === "pendente" && (
                  <Badge fontSize={"sm"}>Status da Avaliação: Pendente</Badge>
                )}
                {/* <Button
                cursor="pointer"
                onClick={() => setIsTable(!isTable)}
                variant="outline"
                leftIcon={<VscGraph />}
                colorScheme="green"
              >
                Relatórios
              </Button> */}
              </HStack>
            </VStack>
          </HStack>
          <Tabs
            width={"100%"}
            mb={"21px !important"}
            isFitted
            colorScheme={"green"}
            index={competenciesIndex}
            onChange={handleTabsChange}
          >
            <TabList>
              {competencies.map((competency, i) => (
                <Tab>{i + 1}ª</Tab>
              ))}
            </TabList>
          </Tabs>
          <Heading
            fontWeight={500}
            fontSize={{ base: "22px", md: "26px", lg: "33px" }}
            marginTop={3}
            color={headingColor}
          >
            {competencies[competenciesIndex]?.name}
          </Heading>
          <Text
            color={"gray.500"}
            fontWeight={500}
            maxW={500}
            textAlign="center"
          >
            {competencies[competenciesIndex]?.description}
          </Text>
        </VStack>
        <VStack maxWidth={700} margin="0 auto" alignItems={"flex-start"}>
          {memberGrades.map((grade, i) => (
            <VStack
              key={grade.hash}
              width={"100%"}
              mb={"18px !important"}
              marginTop={"0 !important"}
              boxShadow={"base"}
              padding={4}
              borderRadius={"6px"}
              backgroundColor="#fff"
              alignItems={"flex-start"}
              boxShadow={"base"}
            >
              <HStack
                width={"100%"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <VStack alignItems={"flex-start"}>
                  <Text fontWeight={500}>{grade.username}</Text>
                  <Text
                    fontSize={"13px"}
                    mt={"0 !important"}
                    fontWeight={500}
                    color={"gray.500"}
                  >
                    {grade.role}
                  </Text>

                  <Text fontWeight={700}>Nota: {grade.grade}</Text>
                </VStack>
              </HStack>
              <FormControl>
                <Slider
                  step={5}
                  maxW="750px"
                  colorScheme="green"
                  onChangeEnd={(value) => {
                    handleChangeGrade(i, value);
                  }}
                  defaultValue={grade?.grade || 0}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>
              <Textarea
                borderRadius="md"
                focusBorderColor={focusColor}
                m="12px 0"
                placeholder="Digite observações sobre a nota aqui, este campo é opcional"
                size="sm"
                resize={"none"}
                defaultValue={grade?.justification || ""}
                onChange={(event) => {
                  handleChangeJustification(i, event.target.value);
                }}
              />
            </VStack>
          ))}
          <Button
            type="submit"
            disabled={isLoadingButtonListView}
            colorScheme={"green"}
            onClick={handleSubmit}
            alignSelf={"flex-end"}
          >
            {isLoadingButtonListView ? "Carregando..." : "Enviar"}
          </Button>
        </VStack>
      </>
    );
  }

  if (isTable) {
    return (
      <>
        <HStack
          min-width={"500px"}
          spacing={12}
          alignItems="center"
          justifyContent="space-between"
          paddingX="16"
        >
          <Heading size="lg" marginTop={3} color={headingColor}>
            Minhas avaliações - {localStorage.getItem("user_name")}
          </Heading>
          <HStack display="inline-flex">
            <Button
              cursor="pointer"
              onClick={() => setIsTable(!isTable)}
              variant="outline"
              leftIcon={<VscGraph />}
              colorScheme="green"
            >
              Avaliações
            </Button>
          </HStack>
        </HStack>
        <TableMembers
          assessmentId={location.state.assessmentId}
          requestBody={{
            members,
            teamId: location.state.teamId,
            teamName: location.state.teamName,
          }}
        />
      </>
    );
  }

  if (isLoaded) {
    return (
      <>
        <Skeleton
          margin="0 auto"
          height="28px"
          width={"25%"}
          borderRadius="lg"
        />
        <Grid
          mt="10"
          justifyItems="center"
          width="100%"
          templateColumns="repeat(4, 1fr)"
          gap={4}
        >
          <Skeleton height="400" width="270px" borderRadius="lg" />
          <Skeleton height="400" width="270px" borderRadius="lg" />
          <Skeleton height="400" width="270px" borderRadius="lg" />
          <Skeleton height="400" width="270px" borderRadius="lg" />
        </Grid>
      </>
    );
  }

  if (!isLoaded) {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmação de Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text textAlign={"center"} fontSize={"lg"}>
                Você confirma que deu o
                <Text fontWeight={700}>feedback da avaliação</Text> para sua
                equipe ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                rightIcon={<MdClose />}
                colorScheme="blue"
                mr={3}
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button
                rightIcon={<MdOutlineCheck />}
                colorScheme={"green"}
                variant="ghost"
                onClick={() => confirmFeedback()}
              >
                Confirmo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <HStack
          flexDirection={{ base: "column", md: "column", lg: "row" }}
          min-width={"500px"}
          w
          alignItems="center"
          justifyContent="space-between"
          paddingX="16"
        >
          <VStack alignItems={"flex-start"}>
            {status === "finalizado" && (
              <Badge fontSize={"sm"} colorScheme={"green"}>
                Status da Avaliação: Concluída
              </Badge>
            )}
            {status === "andamento" && (
              <Badge fontSize={"sm"} colorScheme={"blue"}>
                Status da Avaliação: Andamento
              </Badge>
            )}
            {status === "pendente" && (
              <Badge fontSize={"sm"}>Status da Avaliação: Pendente</Badge>
            )}
            <Heading
              fontSize={{ base: "22px", md: "26px", lg: "33px" }}
              marginTop={3}
              color={headingColor}
            >
              {" "}
              {location.state.teamName}
            </Heading>

            <HStack>
              <IconButton
                variant="outline"
                cursor={"pointer"}
                colorScheme="green"
                icon={<MdGridView />}
                onClick={() => setIsListView(false)}
                disabled={status !== "finalizado"}
              />
              <IconButton
                variant="outline"
                cursor={"pointer"}
                colorScheme="green"
                icon={<MdList />}
                onClick={() => setIsListView(true)}
              />

              <Button
                colorScheme={"green"}
                disabled={!location.state.availableToSee || feedback}
                onClick={() => onOpen()}
              >
                {feedback === true
                  ? "Feedback confirmado"
                  : "Confirmar Feedback"}
              </Button>
            </HStack>
          </VStack>

          <VStack>
            <HStack mt="5" spacing="5" display="inline-flex">
              <Input
                focusBorderColor={focusBorderColor}
                width="300px"
                onChange={onChangeSearch}
                placeholder="Buscar"
              />

              {/* <Button
                cursor="pointer"
                onClick={() => setIsTable(!isTable)}
                variant="outline"
                leftIcon={<VscGraph />}
                colorScheme="green"
              >
                Relatórios
              </Button> */}
            </HStack>
            <HStack paddingTop="4">
              <Button
                onClick={() =>
                  loadMembers(search, 0, pagination.current_page - 1)
                }
                disabled={pagination.current_page === 1}
                colorScheme="green"
                leftIcon={<MdArrowBack />}
              >
                Voltar
              </Button>
              <Text>{`${pagination.current_page} de ${pagination.last_page}`}</Text>
              <Button
                onClick={() =>
                  loadMembers(search, 0, pagination.current_page + 1)
                }
                disabled={pagination.current_page === pagination.last_page}
                colorScheme="green"
                rightIcon={<MdArrowForward />}
              >
                Avançar
              </Button>
            </HStack>
          </VStack>
        </HStack>
        <SimpleGrid
          mt="10"
          justifyItems="center"
          width="100%"
          minChildWidth="270px"
          gap={10}
        >
          {members.map((member) => (
            <UserCard
              manager={location.state.manager}
              assessmentId={location.state.assessmentId}
              key={member.id}
              name={member.name}
              checked={member.evalueted === 1}
              role={member.role}
              availableToSee={location.state.availableToSee}
              availableToAnswer={location.state.availableToAnswer}
              requestBody={{
                teamId: location.state.teamId,
                collaboratorId: member.id,
                teamName: location.state.teamName,
                evalueted: member.evalueted === 1,
              }}
            />
          ))}
        </SimpleGrid>
      </>
    );
  }
}
