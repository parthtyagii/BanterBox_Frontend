export const getSender = (loggedUser, users) => {
    return ((loggedUser && users[0] && users[1] && users[0]._id === loggedUser._id) ? users[1].name : users[0].name);
};

export const getSenderFull = (loggedUser, users) => {
    return ((loggedUser && users[0] && users[1] && users[0]._id === loggedUser._id) ? users[1] : users[0]);
};

export const isSameSender = (messages, m, i, userId) => {
    return ((i < messages.length - 1) &&
        (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined)
    );
};

export const isLastMessage = (messages, i, userId) => {
    return ((i === messages.length - 1) && (messages[messages.length - 1].sender._id));
};

export const leftMarginCheck = (messages, m, i, userId) => {
    if (m.sender._id === userId) {
        return 'auto';
    }
    return '40px';
};

export const rightMarginCheck = (messages, m, i, userId) => {
    if (m.sender._id === userId) {
        return '0px';
    }
    return 'auto';
}

export const isSameUser = (messages, m, i) => {
    return ((i > 0) && (messages[i - 1].sender._id === m.sender._id));
};