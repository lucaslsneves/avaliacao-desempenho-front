import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Span, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSortBy, useTable } from "react-table";
import api from "../services/api";
export default function TableMembers({
  title = "Modal",
  assessmentId = 0,
  requestBody,
}) {
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [grades, setGrades] = React.useState([]);

  const history = useHistory();

  useEffect(() => {
    const token = "Bearer " + localStorage.getItem("token");
    api
      .get(`/assessments/${assessmentId}/competencies`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        api
          .get(`/teams/members/grades/manager?team=2`, {
            headers: {
              Authorization: token,
            },
          })
          .then((grades) => {
            setIsLoaded(false);
            setGrades(grades.data);
            setIsLoaded(false);
            setError(false);
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

  const columns = [
    {
      Header: "Nome",
      accessor: "name",
    },
    {
      Header: "Cargo",
      accessor: "role",
    },
    {
      Header: "Chapa",
      accessor: "registration",
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
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: grades }, useSortBy);

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render("Header")}
                <Span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </Span>
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
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );

  /**
   * 
   * 
   * 
   *  <>
      <Table minWidth="1000" marginTop="14" variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Cargo</Th>
            <Th>Chapa</Th>
            {
              competencies.map((competency: any) => (
                <Th key={`${competency.id}th`}>{competency.name}</Th>
              ))
            }
          </Tr>
        </Thead>
        <Tbody>
          {
            grades.map((competency : any) => (
              <Tr key={`${competency.competency_name}td`}>
               
              </Tr>
            ))
          }
          <Tr>
            <Td >inches</Td>
            <Td >millimetres (mm)</Td>
            <Td >25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td >30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td >0.91444</Td>
          </Tr>
        </Tbody>
      </Table>
    </>
   */
}
