import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useStatStyles } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';
import { useNavigate } from 'react-router-dom';



function Homepage() {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));

        if (user) {
            navigate('/chats');
        }
    }, []);

    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg='white'
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text w='fit-content' mx='auto' fontSize='4xl' fontFamily='Work sans' color='black'>
                    Banter Box
                </Text>
            </Box>

            <Box bg='white' w='100%' marginBottom='40px' p={4} borderRadius='lg' borderWidth='1px' color='black'>
                <Tabs variant='soft-rounded'>
                    <TabList mb='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

        </Container>
    )
};

export default Homepage
