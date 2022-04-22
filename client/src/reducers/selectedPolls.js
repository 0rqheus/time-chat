export default (state = [], action) => {
    switch (action.type) {
        case "POLL_SELECT":
            return state.concat(action.pollId);
        case "POLL_DESELECT":
            return state.filter(pollId => pollId !== action.pollId);
        case "POLL_CLEAR_SELECTION":
            return [];
        default:
            return state;
    }
};