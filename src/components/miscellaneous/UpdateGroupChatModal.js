import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    const { user, selectedChat, setSelectedChat } = ChatState();

    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
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
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        if (!query) {
            return;
        }
        setSearch(query);

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
            setLoading(false);
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the search result',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User Already in group!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
        setLoading(false);
    }

    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: userToRemove._id,
            }, config)

            if (user._id === userToRemove._id) {
                setSelectedChat();
            }
            else {
                setSelectedChat(data);
            }
            setFetchAgain(!fetchAgain);
            fetchMessages();
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
        setLoading(false);
    }

    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Box display='flex' flexWrap='wrap' width='100%' pb={3}>
                            {selectedChat.users.map((u) => {
                                return (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                );
                            })}
                        </Box>

                        <FormControl display='flex'>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button
                                variant='solid'
                                backgroundColor='teal'
                                color="white"
                                ml={2}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button >
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder="Add users to group"
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size='lg' />
                        ) : (
                            <>
                                {searchResult &&
                                    searchResult.map((u) => {
                                        return (
                                            <UserListItem
                                                key={u._id}
                                                user={u}
                                                handleFunction={() => handleAddUser(u)}
                                            />
                                        );
                                    })
                                }
                            </>
                        )
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red'>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};

export default UpdateGroupChatModal;
