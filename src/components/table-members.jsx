import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  Heading,
  HStack,
  Input,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import MyModal from "./modal";

import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import api from "../services/api";

export default function TableMembers({
  title = "Modal",
  assessmentId = 0,
  requestBody = { teamId: 0 },
  availableToAnswer,
}) {
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [isLoadedButton, setIsLoadedButton] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [grades, setGrades] = React.useState([]);

  const [averages, setAverages] = React.useState([]);
  const [overall, setOverall] = React.useState(0);

  const history = useHistory();

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = () => {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(`/teams/members/grades/manager?team=${requestBody?.teamId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        let overall = 0;
        response.data.averages.forEach(
          (average) => (overall += Number(average.average))
        );
        if (response.data.averages.length !== 0)
          overall = overall / response.data.averages.length;

        setOverall(overall);
        setAverages(response.data.averages);
        setGrades(
          response.data.grades.map((row) => ({
            ...row,
            grade: Number(row.grade).toFixed(1),
          }))
        );
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
  };
  const columns = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "name",
      },
      {
        Header: "Cargo",
        accessor: "role",
      },

      {
        Header: "Nota",
        accessor: "grade",
      },
      {
        Header: "Editar",
        accessor: "edit",
      },
    ],
    []
  );

  const data = useMemo(() => [...grades], [grades]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const { globalFilter } = state;

  const focusBorderColor = useColorModeValue("green.400", "green.200");

  if (error) {
    return <h1>Erro inesperado - table-members</h1>;
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
    <>
      <HStack
        alignItems="center"
        justifyContent="center"
        mt="4"
        pr="16"
        pl="16"
      ></HStack>
      <Accordion mt={10} defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading fontWeight="600" fontSize={"21px"} mt="10">
                  Notas por colaborador
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <HStack mt={5} justifyContent="space-between">
              <Input
                borderColor={"gray.300"}
                focusBorderColor={focusBorderColor}
                maxWidth="300px"
                placeHolder="Filtrar"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              ></Input>
              {/* <Box
                w="172px"
                cursor="pointer"
                justifyContent="center"
                borderRadius="lg"
                padding="2"
                display="inline-flex"
                bgColor="green.400"
                color="white"
              >
                <CSVLink
                  filename={"relatorio-avaliacao.csv"}
                  data={data}
                  headers={columns.map((column) => ({
                    key: column.accessor,
                    label: column.Header,
                  }))}
                >
                  Exportar Excel
                </CSVLink>
              </Box> */}
            </HStack>
            <Table mt="16" {...getTableProps()}>
              <Thead>
                {headerGroups.map((headerGroup) => (
                  <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        isNumeric={column.isNumeric}
                      >
                        {column.render("Header")}
                        <Box pl="4">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : null}
                        </Box>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        if (cell.column.id === "edit") {
                          return (
                            <Td>
                              <MyModal
                                loadTable={loadTable}
                                availableToAnswer={availableToAnswer}
                                requestBody={{
                                  teamId: requestBody.teamId,
                                  collaboratorId: row.original.collaborator,
                                  assessmentId: requestBody.assessmentId,
                                  managerId: row.original.manager,
                                  evalueted: 1,
                                }}
                                title={`${row.original.name} | ${row.original.role}`}
                                assessmentId={assessmentId}
                                edit={true}
                              />
                            </Td>
                          );
                        }

                        if (cell.column.id === "grade") {
                          const intGrade = Number(cell.value);
                          const color =
                            intGrade >= 80 ? "green.500" : "red.500";
                          return (
                            <Td
                              {...cell.getCellProps()}
                              isNumeric={cell.column.isNumeric}
                            >
                              <Text fontWeight={700} color={color}>
                                {cell.render("Cell")}%
                              </Text>
                            </Td>
                          );
                        }
                        return (
                          <Td
                            {...cell.getCellProps()}
                            isNumeric={cell.column.isNumeric}
                          >
                            {cell.render("Cell")}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading fontSize={"21px"} fontWeight="600" mt="10">
                  Notas por competência
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
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
                <Text
                  color={Number(overall) > 80 ? "green.500" : "red.500"}
                  fontSize="lg"
                  fontWeight="700"
                >
                  {overall?.toFixed(1)}%
                </Text>
              </VStack>
              {averages.map((average) => (
                <VStack spacing="3">
                  <Text fontSize="lg" fontWeight="500">
                    {average.name}
                  </Text>
                  <Text
                    color={
                      Number(average.average) > 80 ? "green.500" : "red.500"
                    }
                    fontSize="lg"
                    fontWeight="700"
                  >
                    {Number(average.average)?.toFixed(1)}%
                  </Text>
                </VStack>
              ))}
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
