/* eslint-disable react/jsx-no-comment-textnodes */
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MdArrowBack, MdArrowForward, MdOutlineSearch } from "react-icons/md";
import { useHistory } from "react-router";
import api from "../services/api";

import { debounce } from "lodash";
import { useLocation } from "react-router-dom";
import TeamHorizontalCardAdmin from "../components/horizontal-card-team-admin";

export default function TodasEquipes(props) {
  const [teams, setTeams] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [contentIsLoading, setContentIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [unity, setUnity] = React.useState("");
  const [area, setArea] = React.useState("");
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);

  const history = useHistory();
  const location = useLocation();

  const focusBorder = useColorModeValue("green.400", "green.200");
  const headingColor = useColorModeValue("gray.700", "white");

  const onChangeUnity = debounce(async (e) => {
    loadTeams(area, e.target.value);
    setUnity(e.target.value);
  }, 700);

  const onChangeArea = debounce(async (e) => {
    loadTeams(e.target.value, unity);
    setArea(e.target.value);
  }, 700);

  function loadTeams(area = "", unity = "", page = 1) {
    setContentIsLoading(true);
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(
        `/assessments/teams/${location.state?.assessmentId}?area=${area}&unity=${unity}&page=${page}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          setTeams(response.data);
          setIsLoaded(false);
          setContentIsLoading(false);
        });
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
            setContentIsLoading(false);
          }
          setError(true);
          setIsLoaded(false);
          setContentIsLoading(false);
        }
      });
  }
  useEffect(() => {
    loadTeams();
  }, []);

  if (!location.state?.assessmentId || !location.state?.assessmentGroupName) {
    history.push("/todas-avaliacoes");
    return <div></div>;
  }

  if (error) {
    return <h1>Ops,algo deu errado! Tente novamente mais tarde!</h1>;
  }

  if (isLoaded) {
    return (
      <VStack alignItems="center" w="100%" spacing={6}>
        <Skeleton height="28px" width={"25%"} borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
      </VStack>
    );
  }
  return (
    <VStack spacing={6}>
      <Heading size="lg" marginTop={3} color={headingColor}>
        {" "}
        {`Todas Equipes - ${location.state?.assessmentGroupName} - ${teams.media}%`}
      </Heading>

      <HStack
        w={"100%"}
        maxWidth="1000px"
        alignItems="center"
        justifyContent={"center"}
      >
        <InputGroup maxWidth={"300px"}>
          <InputLeftElement
            pointerEvents="none"
            children={<MdOutlineSearch color="gray.200" />}
          />
          <Input
            onChange={onChangeUnity}
            maxWidth="300px"
            placeholder="Unidade"
            focusBorderColor={focusBorder}
          />
        </InputGroup>
        <InputGroup maxWidth={"300px"}>
          <InputLeftElement
            pointerEvents="none"
            children={<MdOutlineSearch color="gray.200" />}
          />
          <Input
            onChange={onChangeArea}
            maxWidth="300px"
            placeholder="Área"
            focusBorderColor={focusBorder}
          />
        </InputGroup>
      </HStack>
      <HStack>
        <Button
          isLoading={buttonIsLoading}
          onClick={() => loadTeams(filter, teams.meta.current_page - 1)}
          disabled={teams.meta.current_page === 1}
          colorScheme="green"
          leftIcon={<MdArrowBack />}
        >
          Voltar
        </Button>
        <Text>{`${teams.meta.current_page} de ${teams.meta.last_page}`}</Text>
        <Button
          isLoading={buttonIsLoading}
          onClick={() => loadTeams(filter, teams.meta.current_page + 1)}
          disabled={teams.meta.current_page === teams.meta.last_page}
          colorScheme="green"
          rightIcon={<MdArrowForward />}
        >
          Avançar
        </Button>
      </HStack>
      {contentIsLoading === true ? (
        <VStack
          height={"400px"}
          width={"400px"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {" "}
          <Spinner color="green.400" size="xl" />{" "}
        </VStack>
      ) : (
        teams.data.map((team) => (
          <TeamHorizontalCardAdmin
            key={team.id}
            area={team.area}
            areaNumber={team.area_number}
            unity={team.unity}
            unityNumber={team.unity_number}
            handleClick={() => {
              history.push("/todas-notas", {
                teamId: team.id,
                teamArea: team.area,
                teamUnity: team.unity,
              });
            }}
          />
        ))
      )}
    </VStack>
  );
}
