import { Box, Text, Tooltip, Button, MenuButton, Menu, MenuList, Avatar, MenuItem, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';


const SideDrawer = () => {

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;

    const { user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/');
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const data = await axios.get(url + `/api/user?search=${search}`, config);
            setSearchResult(data.data);
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
            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post(url + '/api/chat', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                durattion: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }

    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth='5px'
            >
                <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <i className='fas fa-search'></i>
                        <Text display={{ base: 'none', md: "flex" }} px='4'>
                            Search User
                        </Text>

                    </Button>
                </Tooltip>

                <Text fontSize='2xl' fontFamily='Work Sans'>
                    Banter Box
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            {/* <NotificationBadge /> */}
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                        <MenuList style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {(notifications.length === 0) && (<>No New Messages</>)}
                            {(notifications.length > 0) && (
                                notifications.map((notif) => {
                                    return (
                                        <MenuItem
                                            key={notif._id}
                                            onClick={() => {
                                                setSelectedChat(notif.chat)
                                                setNotifications(notifications.filter((n) => n !== notif))
                                            }}
                                        >
                                            {notif.chat.isGroupChat ? (
                                                `New Message in ${notif.chat.chatName}`
                                            ) : (
                                                `New Message from ${getSender(user, notif.chat.users)}`
                                            )}
                                        </MenuItem>
                                    );
                                })
                            )}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as='button' icon={<ChevronDownIcon />}>
                            <Avatar size='sm' curson='pointer' name={user.name} src={user.pic} />
                        </MenuButton>

                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

                <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>

                        <DrawerBody>
                            <Box display='flex' pb={2}>
                                <Input
                                    placeholder='Search by name or email'
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button onClick={handleSearch}>Go</Button>
                            </Box>
                            {loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult.map(user => {
                                    return (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    )
                                })
                            )
                            }
                            {loadingChat && <Spinner ml='auto' display='flex' />}
                        </DrawerBody>
                    </DrawerContent>

                </Drawer>
            </Box>
        </>
    );
}

export default SideDrawer;