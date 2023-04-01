import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';



function ChatPage() {

    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}

            <Box display='flex' justifyContent='space-between' columnGap='10px' w='100%' h='91.5vh' p='10px' >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>

        </div >
    )
};

export default ChatPage
