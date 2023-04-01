import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();
    const toast = useToast();

    const handleSearch = async (query) => {
        if (!query) {
            return;
        }
        setSearch(query);

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
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
        setLoading(false);
    }

    const handleGroup = async (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleSubmit = async () => {
        if (!groupChatName && !selectedUsers) {
            toast({
                title: 'Please fill all fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((s) => s._id))
            }, config);

            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
        catch (error) {
            toast({
                title: 'Failed to create the chat!',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }

    const handleDelete = async (userToDelete) => {
        setSelectedUsers(
            selectedUsers.filter(s => s._id !== userToDelete._id)
        )
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work Sans'
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column' alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users"
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box display='flex' flexWrap='wrap' width='100%'>
                            {selectedUsers && (
                                selectedUsers.map((u) => {
                                    return (
                                        <UserBadgeItem
                                            key={u._id}
                                            user={u}
                                            handleFunction={() => handleDelete(u)}
                                        />
                                    );
                                })
                            )}
                        </Box>

                        {loading ? <div>loading...</div> : (searchResult &&
                            searchResult.slice(0, 4).map((u) => {
                                return (
                                    <UserListItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleGroup(u)}
                                    />
                                )
                            })
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default GroupChatModal;
