import { HStack,Text, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Table, TableCaption, Box, Tbody, Td, Th, Thead, Tooltip, Tr, useDisclosure, Heading } from "@chakra-ui/react"
import React, { useEffect, useMemo } from "react"
import api from "../services/api";
import { useHistory } from "react-router-dom";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy } from "react-table"
import { CSVLink } from "react-csv"

export default function TableMyGrades({ teamId = 0 }) {
  const [isLoaded, setIsLoaded] = React.useState(true)
  const [isLoadedButton, setIsLoadedButton] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [grades, setGrades] = React.useState([])

  const history = useHistory()

  useEffect(() => {
    const token = 'Bearer ' + localStorage.getItem('token')
    api.get(`/teams/members/grades/collaborator?team=${teamId}`, {
      headers: {
        Authorization: token
      }
    }).then(grades => {
      setGrades(grades.data)
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
  ], [])

  const data = useMemo(() => [...grades], [grades])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy)

  if(error) {
    return <Text>Ops, erro inesperado! table-my-grades</Text>
  }
  return (
    <>
    <HStack alignItems="center" justifyContent="space-between" mt="4" pr="20">
      <Heading>{`${grades[0]?.collaborator_name} - ${grades[0]?.collaborator_role}`}</Heading>
      <Box cursor="pointer"  borderRadius="lg" padding="2" display="inline-flex" bgColor="green.400" color="white">
      <CSVLink  filename={"relatorio-avaliacao.csv"} data={data} headers={columns.map((column => ({key: column.accessor , label: column.Header})))}>
          Exportar Excel
      </CSVLink>
      </Box>
      </HStack>
      <Table mt="16" {...getTableProps()}>
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

