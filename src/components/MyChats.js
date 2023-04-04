import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';



const MyChats = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();
    const url = process.env.REACT_APP_BACKEND_URL;

    const fetchChats = async () => {

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.get(url + '/api/chat', config);
            setChats(data);
        }
        catch (error) {
            toast({
                title: 'Error Occured',
                description: "Failed to load chats",
                status: "error",
                durattion: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }


    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: 'flex' }}
            flexDir='column'
            alignItems='center'
            p={3}
            bg='white'
            w={{ base: '100%', md: '31%' }}
            h='100%'
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box
                pd={3}
                px={3}
                fontSize={{ base: '23px', md: '25px' }}
                fontFamily='Work Sans'
                display='flex'
                w='100%'
                marginBottom='10px'
                justifyContent='space-between'
                alignItems='center'
            >
                My Chats

                <GroupChatModal>
                    <Button
                        display='flex'
                        fontSize={{ base: '15px', md: '8px', lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display='flex'
                flexDirection='column'
                p={3}
                bg="#F8F8F8"
                w='100%'
                h='90%'
                borderRadius='lg'
                overflowY='hidden'
            >
                {chats ? (
                    <Stack overflowY='scroll'>
                        {chats.map((c) => {
                            return (
                                <Box
                                    onClick={() => setSelectedChat(c)}
                                    cursor='pointer'
                                    bg={selectedChat === c ? '#38B2AC' : "#E8E8E8"}
                                    color={selectedChat === c ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={c._id}
                                >
                                    <Text>
                                        {!c.isGroupChat ? getSender(loggedUser, c.users) : c.chatName}
                                    </Text>
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>

        </Box>
    );
}

export default MyChats;