import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import MyModal from "./modal";
export default function UserCard({
  requestBody = {},
  name = "Colaborador",
  role = "Cargo",
  checkedProps = false,
  availableToSee = false,
  avgProps = null,
  feedbackConfirmationProps = false,
  availableToAnswer = false,
  manager = false,
  handleClick = () => {},
  assessmentId = 0,
}) {
  async function generatePdf() {
    setButtonIsLoading(true);
    try {
      const token = "Bearer " + localStorage.getItem("token");
      const response = await api.get(
        `http://localhost:3333/grades/member-pdf?team=${requestBody.teamId}&member=${requestBody.collaboratorId}`,
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
      setButtonIsLoading(false);
    }
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  const [feedbackConfirmation, setFeedbackConfirmation] = React.useState(
    feedbackConfirmationProps
  );
  const [avg, setAvg] = React.useState(avgProps);
  const [checked, setChecked] = React.useState(checkedProps);
  async function handleFeedbackConfirmation() {
    const token = "Bearer " + localStorage.getItem("token");

    api
      .post(
        `/feedback`,
        {
          teamId: location.state?.teamId,
          managerId: location.state?.managerId,
          assessmentId: location.state?.assessmentId,
          collaboratorId: requestBody.collaboratorId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setFeedbackConfirmation(true);
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
            return;
          }
        }
      });
    console.log(requestBody);
  }
  const cancelRef = React.useRef();
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);
  return (
    <Box
      height="350px"
      w="14em"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"md"}
      overflow={"hidden"}
    >
      <Box
        h={"120px"}
        w={"full"}
        justifyContent="space-between"
        padding="3"
        paddingBottom="0"
        bg={useColorModeValue("green.400", "green.200")}
      >
        {checked && (
          <HStack justifyContent="space-between" alignItems="center">
            <Tag maxHeight="30px" size={"sm"} variant="subtle" color="gray.700">
              <TagLeftIcon boxSize="12px" as={FaCheck} />
              <TagLabel fontSize="md">Avaliado</TagLabel>
            </Tag>
            <Tooltip
              label={"Baixar Relatório do colaborador"}
              placement="top-start"
            >
              <IconButton
                disabled={!availableToSee}
                isLoading={buttonIsLoading}
                onClick={generatePdf}
                colorScheme="green"
                aria-label="Baixar PDF"
                icon={<MdFileDownload />}
                size="sm"
              />
            </Tooltip>
          </HStack>
        )}
        {avg && (
          <Text
            fontWeight={"700"}
            color={Number(avg) < 80 ? "red.600" : "#fff"}
            mt="30px"
            textAlign={"center"}
          >
            Média: {avg + "%"}
          </Text>
        )}
      </Box>

      <VStack height="230px" p={4}>
        <Stack
          h="100%"
          spacing={0}
          justifyContent="center"
          align={"center"}
          mb={5}
          marginTop="-20px !important"
        >
          <Heading
            mb="2"
            fontSize="lg"
            textAlign="center"
            fontWeight={500}
            fontFamily={"body"}
          >
            {name}
          </Heading>
          <Text color={"gray.500"}>{role}</Text>
        </Stack>
        <Button
          padding={"6px 0"}
          fontSize="14px"
          width={"100%"}
          colorScheme={"green"}
          variant="outline"
          rightIcon={feedbackConfirmation ? <FaCheck /> : <VscFeedback />}
          onClick={onOpen}
          disabled={feedbackConfirmation}
        >
          {feedbackConfirmation ? "Feedback realizado" : "Confirmar feedback"}
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirmação Feedbeck
              </AlertDialogHeader>

              <AlertDialogBody>
                Você confirma que deu o Feedback da para:
                <Text fontWeight={"bold"}>{name}</Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleFeedbackConfirmation}
                  ml={3}
                >
                  Confirmar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <MyModal
          manager={manager}
          availableToSee={availableToSee}
          availableToAnswer={availableToAnswer}
          requestBody={requestBody}
          title={`${name} | ${role}`}
          assessmentId={assessmentId}
          handleAvg={setAvg}
          handleChecked={setChecked}
          edit={false}
        />
      </VStack>
    </Box>
  );
}
