export default (state = [], action) => {
    switch (action.type) {
        case "MESSAGE_SELECT":
            return state.concat(action.messageId);
        case "MESSAGE_DESELECT":
            return state.filter(msgId => msgId !== action.messageId);
        case "MESSAGE_CLEAR_SELECTION":
            return [];
        default:
            return state;
    }
};