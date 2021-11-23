import { HStack, Text,Skeleton, Table, Input, Box, Tbody, Td, Th, Thead, Tooltip, Tr,useColorModeValue, useDisclosure, Heading, Grid, VStack } from "@chakra-ui/react"
import React, { useEffect, useMemo } from "react"
import api from "../services/api";
import { useHistory } from "react-router-dom";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useGlobalFilter } from "react-table"
import { CSVLink } from "react-csv"

export default function TableAllGrades({ teamId = 0 , teamArea = "Setor" , teamUnity="Unidade"}) {
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [grades, setGrades] = React.useState([])

  const [averages, setAverages] = React.useState([])
  const [overall, setOverall] = React.useState(0)

  const history = useHistory()

  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/team/grades/admin?team=${teamId}`, {
      headers: {
        Authorization: token
      }
    }).then(response => {
      let overall = 0;

      response.data.averages.forEach(average => overall += average.average)

      if(response.data.averages.length !== 0)
      overall = overall / response.data.averages.length
      
      setOverall(overall)
      setAverages(response.data.averages)
      setGrades(response.data.grades)
      setError(false)
      setIsLoaded(false)
    }).catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          localStorage.setItem("token", "")
          localStorage.setItem("isAuthenticated", 'false')
          history.push('/')
        } else {
          setError(true)
          setIsLoaded(false)
          return
        }
        setError(true)
        setIsLoaded(false)
      }
    })

  }, [])

  const columns = useMemo(() => [
    {
      Header: "Gestor",
      accessor: "mananger_name",
    },
    {
      Header: "Cargo Gestor",
      accessor: "mananger_role",
    },
    {
      Header: "Colaborador",
      accessor: "collaborator_name",
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
  ], [])

  const data = useMemo(() => [...grades], [grades])


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter
  } = useTable({ columns, data } , useGlobalFilter, useSortBy)

  const {globalFilter} = state
  const focusBorderColor = useColorModeValue("green.400", "green.200")

  if (isLoaded) {
    return (
      <VStack alignItems="center" w="100%" spacing={6}>
        <Skeleton height="28px" width={"25%"} borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
        <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
      </VStack>
    )
  }

  if (error) {
    return <Text>Ops, erro inesperado! table-my-grades</Text>
  }
  return (
    <>
      <HStack alignItems="center" justifyContent="space-between" mt="4" pr="20">
        <Heading fontSize="3xl" pl="10" >{`${teamUnity} - ${teamArea}`}</Heading>
        <Box cursor="pointer" borderRadius="lg" padding="2" display="inline-flex" bgColor="green.400" color="white">
          <CSVLink filename={"relatorio-avaliacao.csv"} data={data} headers={columns.map((column => ({ key: column.accessor, label: column.Header })))}>
            Exportar Excel
      </CSVLink>
        </Box>
      </HStack>
      <Heading fontWeight="500" textAlign="center" mt="10">Médias</Heading>
      
      <Grid mt="6" justifyItems="center" width="100%" templateColumns="repeat(3, 1fr)" gap={4}>
        <VStack spacing="3" >
            <Text fontSize="lg" fontWeight="500">
              Média Geral
            </Text>
            <Text fontSize="lg" fontWeight="700">
              {overall}
            </Text>
        </VStack>
        {averages.map(average => (
           <VStack spacing="3" >
           <Text fontSize="lg" fontWeight="500">
             {average.name}
           </Text>
           <Text fontSize="lg" fontWeight="700">
             {average.average}
           </Text>
       </VStack>
        ))}
      </Grid>
      <Heading fontWeight="500" textAlign="center" mt="10">Notas</Heading>
      <HStack justifyContent="center">
      <Input mt="3" focusBorderColor={focusBorderColor} maxWidth="300px" placeHolder="Filtrar" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}></Input>
      </HStack>
      <Table mt="6" {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
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
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </>
  )

}

