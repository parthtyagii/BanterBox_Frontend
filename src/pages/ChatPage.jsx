import { withDefaultColorScheme, Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/Authentication/miscellaneous/SideDrawer';
import MyChats from '../components/Authentication/miscellaneous/MyChats';
import ChatBox from '../components/Authentication/miscellaneous/ChatBox';



function ChatPage() {

    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}

            <Box d='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px' >
                {/* {user && <MyChats />} */}
                {/* {user && <ChatBox />} */}
            </Box>

        </div >
    )
};

export default ChatPage