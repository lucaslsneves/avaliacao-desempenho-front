import { CheckCircleIcon, Icon } from "@chakra-ui/icons";
import {
  Button,
  Grid,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { MdFileDownload } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { useSortBy, useTable } from "react-table";
import api from "../services/api";

export default function TableMyGrades({ teamId = 0 }) {
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [grades, setGrades] = React.useState([]);

  const [averages, setAverages] = React.useState([]);
  const [overall, setOverall] = React.useState(0);
  const [memberId, setMemberId] = React.useState(0);
  const [alreadySeenFeedback, setAlreadySeenFeedback] = React.useState(false);
  const [buttonModalIsLoading, setButtonModalIsLoading] = React.useState(false);

  const history = useHistory();
  const toast = useToast();
  useEffect(() => {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(`/teams/members/grades/collaborator?team=${teamId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        let overall = 0;

        response.data.averages.forEach(
          (average) => (overall += average.average)
        );

        if (response.data.averages.length !== 0)
          overall = overall / response.data.averages.length;

        setOverall(overall);
        setAverages(response.data.averages);
        setMemberId(response.data.memberId);
        setAlreadySeenFeedback(response.data.alreadySeenFeedback);
        setGrades(response.data.grades);
        setError(false);
        setIsLoaded(false);
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
            return;
          }
          setError(true);
          setIsLoaded(false);
        }
      });
  }, []);

  const { onClose } = useDisclosure();

  function confirmFeedback() {
    setButtonModalIsLoading(true);
    const token = "Bearer " + localStorage.getItem("token");
    api
      .put(
        `/members/${memberId}`,
        { alreadySeenFeedback: true },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        setButtonModalIsLoading(false);
        window.location.reload();
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("isAuthenticated", "false");
            history.push("/");
          } else {
            toast({
              title: "Erro!",
              description: "Erro inesperado",
              position: "top-right",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
        setButtonModalIsLoading(false);
      });
  }

  async function generatePdf() {
    setButtonIsLoading(true);
    try {
      const token = "Bearer " + localStorage.getItem("token");
      const response = await api.get(
        `http://localhost:3333/grades/member-pdf?team=${teamId}&member=${memberId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: token,
          },
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      setButtonIsLoading(false);
    } catch (e) {
      console.log(e);
      setButtonIsLoading(false);
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Gestor",
        accessor: "mananger_name",
      },
      {
        Header: "Cargo",
        accessor: "mananger_role",
      },
      {
        Header: "Chapa",
        accessor: "mananger_registration",
      },
      {
        Header: "Competência",
        accessor: "competency",
      },
      {
        Header: "Nota",
        accessor: "grade",
      },
      {
        Header: "Justificativa",
        accessor: "justification",
      },
    ],
    []
  );

  const data = useMemo(() => [...grades], [grades]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  if (isLoaded) {
    return (
      <VStack alignItems="center" w="100%" spacing={6}>
        <Skeleton height="28px" width={"25%"} borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
      </VStack>
    );
  }

  if (error) {
    return <Text>Ops, erro inesperado! table-my-grades</Text>;
  }

  if (!alreadySeenFeedback) {
    return (
      <Modal
        scrollBehavior={"inside"}
        size="sm"
        onClose={onClose}
        isOpen={!alreadySeenFeedback}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedback</ModalHeader>
          <ModalBody>
            <VStack spacing="5">
              <Icon as={CheckCircleIcon} w="12" h="12" color="green.400" />
              <Text textAlign="center" fontWeight="500">
                Seu gestor já lhe deu o feedback da avaliação de desempenho ?
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button
              mr="5"
              colorScheme="red"
              onClick={() => {
                setAlreadySeenFeedback(true);
                onClose();
              }}
            >
              Não
            </Button>
            <Button
              isLoading={buttonModalIsLoading}
              onClick={confirmFeedback}
              colorScheme="green"
            >
              Sim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <HStack alignItems="center" justifyContent="space-between" mt="4" pr="20">
        <Heading fontSize="3xl" pl="10">{`${
          grades[0]?.collaborator_name || "Notas"
        } - ${grades[0]?.collaborator_role || "Colaborador"}`}</Heading>
        <Button
          onClick={generatePdf}
          isLoading={buttonIsLoading}
          rightIcon={<MdFileDownload />}
          colorScheme="green"
        >
          Gerar PDF
        </Button>
      </HStack>
      <Heading fontWeight="500" textAlign="center" mt="10">
        Médias
      </Heading>
      <Grid
        mt="6"
        justifyItems="center"
        width="100%"
        templateColumns="repeat(3, 1fr)"
        gap={8}
      >
        <VStack spacing="3">
          <Text fontSize="lg" fontWeight="500">
            Média Geral
          </Text>
          <Text fontSize="lg" fontWeight="700">
            {overall?.toFixed(1)}%
          </Text>
        </VStack>
        {averages.map((average) => (
          <VStack spacing="3">
            <Text fontSize="lg" fontWeight="500">
              {average.name}
            </Text>
            <Text fontSize="lg" fontWeight="700">
              {average.average?.toFixed(1)}%
            </Text>
          </VStack>
        ))}
      </Grid>
    </>
  );
}
