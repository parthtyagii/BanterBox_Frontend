import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
let socket = null, selectedChatCompare = null;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);

            socket.emit('join chat', selectedChat._id);
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load messages!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
        setLoading(false);
    }

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                };

                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);


                socket.emit('new message', data);
                setMessages([...messages, data]);
            }
            catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send the message!',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
            }
        }
    }

    const typingHandler = async (e) => {
        setNewMessage(e.target.value);

        // if (!socketConnected) {
        //     return;
        // }

        // // so that we do not have to emit again and again
        // if (!typing) {
        //     setTyping(true);
        //     socket.emit('typing', selectedChat._id);
        // }

        // let lastTypingTime = new Date().getTime();
        // let timerLength = 3000;
        // setTimeout(() => {
        //     let timeNow = new Date().getTime();
        //     let timeDiff = new Date().getTime();

        //     if (timeDiff >= timerLength && typing) {
        //         socket.emit('stop typing', selectedChat._id);
        //         setTyping(false);
        //     }

        // }, timerLength);
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(true));
    }, []);

    useEffect(() => {
        selectedChatCompare = selectedChat;
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if ((!selectedChatCompare) || (selectedChatCompare._id !== newMessageReceived.chat._id)) {
                if (!notifications.includes(newMessageReceived)) {
                    setNotifications([newMessageReceived, ...notifications]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        width='100%'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users).toUpperCase()}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </>
                        )}
                    </Text>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        h='100%'
                        w='100%'
                        borderRadius="lg"
                        overflowY="hidden"
                    >

                        {loading ? (
                            <Spinner
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={(e) => sendMessage(e)} isRequired mt={3}>

                            {/* {isTyping ? <>Loading...</> : <></>} */}

                            <Input
                                variant='filled'
                                bg='#E0E0E0'
                                placeholder='Enter a message...'
                                onChange={(e) => typingHandler(e)}
                                value={newMessage}
                            />

                        </FormControl>

                    </Box>
                </>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' h='100%' w='100%'>
                    <Text fontSize='3xl' pb={3} fontFamily="Work sans" >
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
            }
        </>
    )
};

export default SingleChat;
