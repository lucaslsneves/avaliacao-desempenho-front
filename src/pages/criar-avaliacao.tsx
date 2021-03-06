import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import formatISO from "date-fns/formatISO";
import pt from "date-fns/locale/pt";
import * as React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import InputApp from "../components/input";
import api from "../services/api";

export default function CriarAvaliacao() {
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [members, setMembers] = React.useState(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [competencies, setCompetencies] = React.useState([]);
  const [competenciesManager, setCompetenciesManager] = React.useState([]);
  const [options, setOptions] = React.useState([]);

  const colorErrorText = useColorModeValue("red.400", "red.200");
  registerLocale("pt", pt);
  let history = useHistory();
  const toast = useToast();
  React.useEffect(() => {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(`/competencies?limit=50`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        setOptions([
          ...data.data.map((competency) => ({
            label: competency.name,
            value: competency.id,
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
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    try {
      setLoading(true);
      formData.append("members", members);
      formData.append("name", name);
      formData.append("assessmentName", description);
      // let startDateFormatted = formatISO(startDate).split('T')
      // let startDateDate = startDateFormatted[0]
      // let startDateHours = startDateFormatted[1].split('-')[0]

      formData.append(
        "start_date",
        formatISO(startDate, { representation: "date" })
      );
      formData.append(
        "end_date",
        formatISO(endDate, { representation: "date" })
      );

      for (var i = 0; i < competencies.length; i++) {
        formData.append("competencies[]", competencies[i].value);
      }

      for (var i = 0; i < competenciesManager.length; i++) {
        formData.append("competenciesManager[]", competenciesManager[i].value);
      }

      const token = "Bearer " + localStorage.getItem("token");

      const response = await api.post("/assessments/excel", formData, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Avalia????o criada",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        history.push("/todas-avaliacoes");
      } else {
        setError("Erro inesperado, tente novamente em alguns minutos!");
      }
    } catch (e) {
      if (e.response) {
        const data = e.response.data;
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
    } finally {
      setLoading(false);
    }
  }

  function onChangeMembers(e: any) {
    setMembers(e.target.files[0]);
    if (e.target.value && name !== "" && description !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  function onChangeName(e: any) {
    setName(e.target.value);
    if (e.target.value !== "" && members && description !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  function onChangeDescription(e: any) {
    setDescription(e.target.value);
    if (e.target.value !== "" && members && name !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  return (
    <>
      <VStack spacing="6" height="100%" width="100%">
        <Heading>Criar Avalia????o de Desempenho</Heading>
        <VStack
          padding={8}
          as="form"
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          shadow="lg"
          spacing={6}
          width={"70%"}
        >
          <FormControl isRequired>
            <FormLabel>Membros</FormLabel>

            <InputApp
              onChange={onChangeMembers}
              placeholder="Apenas n??meros"
              type="file"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <InputApp
              value={name}
              onChange={onChangeName}
              placeholder="Nome da avalia????o"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="500">Descri????o</FormLabel>
            <InputApp
              value={description}
              onChange={onChangeDescription}
              placeholder="Descri????o da avalia????o"
            />
          </FormControl>

          <Heading fontSize="md" fontWeight="500" width="100%">
            Compet??ncias Colaborador
          </Heading>
          <Box width="100%">
            <Select
              isMulti
              value={competencies}
              key={competencies.length}
              options={options}
              placeholder="Selecione as compet??ncias"
              onChange={(e) => {
                setCompetencies(e);
              }}
            />
          </Box>
          <Heading fontSize="md" fontWeight="500" width="100%">
            Compet??ncias Gestor
          </Heading>
          <Box width="100%">
            <Select
              isMulti
              value={competenciesManager}
              key={competenciesManager.length}
              options={options}
              placeholder="Selecione as compet??ncias"
              onChange={(e) => {
                setCompetenciesManager(e);
              }}
            />
          </Box>

          <HStack width="100%" justifyContent="space-between">
            <VStack justifyContent="flex-start" alignItems="fl">
              <FormLabel>Data de In??cio</FormLabel>
              <Box
                border="1px solid"
                borderColor="gray.200"
                padding="5px"
                borderRadius="lg"
              >
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  locale="pt"
                />
              </Box>
            </VStack>

            <VStack justifyContent="flex-start" alignItems="fl">
              <FormLabel>Data de Fim</FormLabel>
              <Box
                border="1px solid black"
                borderColor="gray.200"
                padding="5px"
                borderRadius="lg"
              >
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  locale="pt"
                />
              </Box>
            </VStack>
          </HStack>

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
            isDisabled={disabled}
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
