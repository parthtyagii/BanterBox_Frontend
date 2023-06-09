import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useStatStyles, VStack } from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';


const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useNavigate();
    const url = process.env.REACT_APP_BACKEND_URL;

    const { user, setUser } = ChatState();

    const handleClick = () => {
        setShow(!show);
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!email && !password) {
            toast({
                title: 'Please Fill all fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            const { data } = await axios.post(url + '/api/user/login', { email, password }, config);
            toast({
                title: 'Login Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            setLoading(false);
            history('/chats');
        }
        catch (error) {
            toast({
                title: 'Error occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input value={email} placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input value={password} type={show ? 'text' : 'password'} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />

                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick} >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme='blue' width='100%' style={{ marginTop: 15 }} onClick={submitHandler}>
                Login
            </Button>

        </VStack>
    );
};

export default Login;
