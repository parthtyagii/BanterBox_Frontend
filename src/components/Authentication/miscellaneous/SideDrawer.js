import { Box, Text, Tooltip, Button, MenuButton, Menu, MenuList, Avatar, MenuItem, MenuDivider } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../../Context/ChatProvider';
import ProfileModal from './ProfileModal';


const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user } = ChatState();

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
                    <Button variant='ghost'>
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
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
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
                            <MenuItem>Logout</MenuItem>
                        </MenuList>
                    </Menu>

                </div>

            </Box>

        </>
    );
}

export default SideDrawer;