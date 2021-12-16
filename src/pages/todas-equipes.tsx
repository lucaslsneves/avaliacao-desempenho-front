/* eslint-disable react/jsx-no-comment-textnodes */
import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading, HStack, Text } from '@chakra-ui/layout';
import { Button, Input, Skeleton, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

import { useLocation } from 'react-router-dom';
import TeamHorizontalCardAdmin from '../components/horizontal-card-team-admin';
import { debounce } from 'lodash';

export default function TodasEquipes(props) {
    const [teams, setTeams] = React.useState([])
    const [isLoaded, setIsLoaded] = React.useState(true)
    const [contentIsLoading, setContentIsLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [filter, setFilter] = React.useState("")
    const [buttonIsLoading, setButtonIsLoading] = React.useState(false);

    const history = useHistory()
    const location = useLocation();

    const focusBorder = useColorModeValue("green.400", "green.200")
    const headingColor = useColorModeValue('gray.700', 'white');

    const onChangeSearch = debounce(async (e) => {
        loadTeams(e.target.value)
        setFilter(e.target.value)
    }, 700)

    function loadTeams(filter = '', page = 1) {
        setContentIsLoading(true)
        const token = 'Bearer ' + localStorage.getItem('token')
        api.get(`/assessments/teams/${location.state?.assessmentId}?filter=${filter}&page=${page}`, {
            headers: {
                Authorization: token
            }
        }).then((response) => {
            setTimeout(() => {
                setTeams(response.data)
                setIsLoaded(false)
                setContentIsLoading(false)
                

            }, 1000)
        }).catch(e => {
            if (e.response) {
                if (e.response.status === 401) {
                    localStorage.setItem("token", "")
                    localStorage.setItem("isAuthenticated", 'false')
                    history.push('/')
                } else {
                    setError(true)
                    setIsLoaded(false)
                    setContentIsLoading(false)
                }
                setError(true)
                setIsLoaded(false)
                setContentIsLoading(false)

            }
        })
    }
    useEffect(() => {
        loadTeams()
    }, [])


    if (!location.state?.assessmentId ||
        !location.state?.assessmentGroupName) {
        history.push('/todas-avaliacoes')
        return <div></div>;
    }


    if (error) {
        return <h1>Ops,algo deu errado! Tente novamente mais tarde!</h1>
    }

    if (isLoaded) {
        return (
            <VStack alignItems="center" w="100%" spacing={6}>
                <Skeleton height="28px" width={"25%"} borderRadius="lg" />
                <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
                <Skeleton height="48" width="100%" maxWidth="800px" borderRadius="lg" />
            </VStack>
        )
    }
    return (
        <VStack spacing={6}>
            <Heading size="lg" marginTop={3} color={headingColor}> {`Todas Equipes - ${location.state?.assessmentGroupName}`}</Heading>
            <HStack width="40%" minW="500px" maxWidth="700px" justifyContent="space-between" alignItems="center">
                <Input onChange={onChangeSearch} maxWidth="250px" placeholder="Filtrar" focusBorderColor={focusBorder} />
                <HStack>
                    <Button isLoading={buttonIsLoading} onClick={() => loadTeams(filter, teams.meta.current_page - 1)}
                        disabled={teams.meta.current_page === 1} colorScheme="green" leftIcon={<MdArrowBack />}>Voltar</Button>
                    <Text>{`${teams.meta.current_page} de ${teams.meta.last_page}`}</Text>
                    <Button isLoading={buttonIsLoading} onClick={() => loadTeams(filter, teams.meta.current_page + 1)}
                        disabled={teams.meta.current_page === teams.meta.last_page} colorScheme="green" rightIcon={<MdArrowForward />}>Avançar</Button>
                </HStack>
            </HStack>
            {
                contentIsLoading === true ?
                    (<VStack height={"400px"} width={"400px"} justifyContent={"center"} alignItems={"center"} > <Spinner  color="green.400" size="xl" /> </VStack>) :
                    (
                        teams.data.map(team =>
                            <TeamHorizontalCardAdmin
                                key={team.id}
                                area={team.area}
                                areaNumber={team.area_number}
                                unity={team.unity}
                                unityNumber={team.unity_number}
                                handleClick={() => {
                                    history.push('/todas-notas', { teamId: team.id, teamArea: team.area, teamUnity: team.unity })
                                }}
                            />))}
        </VStack>
    )


}