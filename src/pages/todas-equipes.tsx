/* eslint-disable react/jsx-no-comment-textnodes */
import { useColorModeValue } from '@chakra-ui/color-mode';
import { VStack, Heading } from '@chakra-ui/layout';
import { Input, Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../services/api';

import { useLocation } from 'react-router-dom';
import TeamHorizontalCardAdmin from '../components/horizontal-card-team-admin';

export default function TodasEquipes(props) {
    const [teams, setTeams] = React.useState([])
    const [isLoaded, setIsLoaded] = React.useState(true)
    const [error, setError] = React.useState(false)

    const history = useHistory()
    const location = useLocation();

    const focusBorder = useColorModeValue("green.400" , "green.200")
    const headingColor = useColorModeValue('gray.700', 'white');
    useEffect(() => {
        const token = 'Bearer ' + localStorage.getItem('token')
        api.get(`/assessments/teams/${location.state?.assessmentId}`, {
            headers: {
                Authorization: token
            }
        }).then((response) => {
            setTimeout(() => {
                setTeams(response.data.data)
                setIsLoaded(false)
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
                }
                setError(true)
                setIsLoaded(false)
            }
        })
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
            <Input maxWidth="250px" placeholder="Filtrar" focusBorderColor={focusBorder}/>
            {teams.map(team =>
                <TeamHorizontalCardAdmin
                    key={team.id}
                    area={team.area}
                    areaNumber={team.area_number}
                    unity={team.unity}
                    unityNumber={team.unity_number}
                    handleClick={() => {
                        history.push('/minhas-notas', { teamId: team.id })
                    }}
                />)}
        </VStack>
    )


}