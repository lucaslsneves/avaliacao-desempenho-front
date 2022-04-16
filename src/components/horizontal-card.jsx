import { WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import { useHistory } from "react-router";
import api from "../services/api";

export default function HorizontalCard({
  handleClick = () => {},
  startDate = "",
  endDate = "",
  name = "Avaliaçao",
  subHeader = "Avaliação de Desempenho",
  description = "",
  admin = false,
  availableToSee = 0,
  availableToAnswer = 0,
  availableToSeeCollaborator = 0,
  assessmentId = 0,
  assessmentGroupId = 0,
}) {
  const textColor = useColorModeValue("white", "gray.600");
  const warnColor = useColorModeValue("red.400", "red.200");
  const toast = useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingButton, setIsLoadingdButton] = React.useState(false);

  function handleDelete() {
    setIsLoadingdButton(true);
    const token = "Bearer " + localStorage.getItem("token");
    api
      .put(
        `/assessments-groups/${assessmentGroupId}`,
        { active: false },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        setIsLoadingdButton(false);
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
              title: "Danger!",
              description: "Erro ao deletar avaliação",
              position: "top-right",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
        setIsLoadingdButton(false);
      });
  }

  return (
    <HStack
      cursor="pointer"
      maxWidth={admin === true ? "800px" : "700px"}
      as="li"
      height="48"
      w="100%"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.700")}
      shadow="lg"
    >
      <VStack
        spacing={5}
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
        height="100%"
        padding="5"
        flex="35"
        bg={useColorModeValue("green.400", "green.200")}
      >
        <Text fontSize="sm" color={textColor}>
          {subHeader}
        </Text>
        <Heading
          size={subHeader !== "Avaliação de Desempenho" ? "4xl" : "md"}
          color={textColor}
        >
          {name}
        </Heading>
      </VStack>
      <VStack
        justifyContent="space-between"
        alignItems="flex-start"
        height="100%"
        padding="5"
        flex="65"
        width="100%"
      >
        <VStack alignItems="flex-start" width="100%" position="relative">
          {startDate !== "" && endDate !== "" ? (
            <>
              <Text fontSize="md">{`Data de início: ${startDate}`}</Text>
              <Text fontSize="md">{`Data de término: ${endDate}`}</Text>
            </>
          ) : (
            <Text textAlign="center" size="2lx">
              {description}
            </Text>
          )}
          {admin && (
            <>
              <IconButton
                onClick={onOpen}
                aria-label="Excluir Avaliação"
                colorScheme="red"
                icon={<FaTrash />}
                right="0"
                top="-10px"
                position="absolute"
              />
              <Modal
                scrollBehavior={"inside"}
                size="md"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Excluir Avaliação: {name}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody padding="5">
                    <VStack>
                      <WarningIcon
                        marginBottom="5"
                        w={12}
                        h={12}
                        color={warnColor}
                      />
                      <Text fontWeight="500">
                        Tem certeza que deseja excluir esta avaliação ?
                      </Text>
                    </VStack>
                    <HStack
                      margin="0 auto"
                      marginTop="5"
                      spacing="5"
                      width="50%"
                      justifyContent="center"
                    >
                      <Button onClick={onClose} colorScheme="green">
                        Cancelar
                      </Button>
                      <Button
                        isLoading={isLoadingButton}
                        onClick={handleDelete}
                        colorScheme="red"
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
          {admin && (
            <HStack justifyContent="space-between" width="100%">
              <HStack>
                <Text fontWeight="500">Feedback Gestor</Text>{" "}
                <Switch
                  defaultIsChecked={availableToSee}
                  onChange={async () => {
                    const token = "Bearer " + localStorage.getItem("token");
                    api
                      .put(
                        `/assessments/${assessmentId}`,
                        { availableToSee: !availableToSee },
                        {
                          headers: {
                            Authorization: token,
                          },
                        }
                      )
                      .then(({ data }) => {
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
                              title: "Danger!",
                              description: "Erro ao liberar",
                              position: "top-right",
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            });
                          }
                        }
                      });
                  }}
                  colorScheme="green"
                  size="lg"
                />
              </HStack>
              <HStack>
                <Text fontWeight="500">Responder</Text>{" "}
                <Switch
                  onChange={async () => {
                    const token = "Bearer " + localStorage.getItem("token");
                    api
                      .put(
                        `/assessments/${assessmentId}`,
                        { availableToAnswer: !availableToAnswer },
                        {
                          headers: {
                            Authorization: token,
                          },
                        }
                      )
                      .then(({ data }) => {
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
                              title: "Danger!",
                              description: "Erro ao liberar",
                              position: "top-right",
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            });
                          }
                        }
                      });
                  }}
                  defaultIsChecked={availableToAnswer}
                  colorScheme="green"
                  size="lg"
                />
              </HStack>
            </HStack>
          )}
        </VStack>

        {admin === true ? (
          <HStack
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            <HStack>
              <Text fontWeight="500">Feedback Colaborador</Text>{" "}
              <Switch
                defaultIsChecked={availableToSeeCollaborator}
                onChange={async () => {
                  const token = "Bearer " + localStorage.getItem("token");
                  api
                    .put(
                      `/assessments/${assessmentId}`,
                      {
                        availableToSeeCollaborator: !availableToSeeCollaborator,
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      }
                    )
                    .then(({ data }) => {
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
                            title: "Danger!",
                            description: "Erro ao liberar",
                            position: "top-right",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          });
                        }
                      }
                    });
                }}
                colorScheme="green"
                size="lg"
              />
            </HStack>
            <Button
              onClick={handleClick}
              colorScheme="green"
              rightIcon={<FaArrowRight />}
            >
              Acessar
            </Button>
          </HStack>
        ) : (
          <Button
            onClick={handleClick}
            alignSelf="flex-end"
            colorScheme="green"
            rightIcon={<FaArrowRight />}
          >
            Acessar
          </Button>
        )}
      </VStack>
    </HStack>
  );
}
