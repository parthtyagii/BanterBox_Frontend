import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';



const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState();
    const [newMessage, setNewMessage] = useState("");

    const { user, selectedChat, setSelectedChat } = ChatState();
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

    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

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
                            onClick={() => setSelectedChat("")}
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
                            <div
                                display='flex'
                                flexdirection='column'
                                overflowy='scroll'
                                scrollbarwidth='none'
                            >
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={(e) => sendMessage(e)} isRequired mt={3}>
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
