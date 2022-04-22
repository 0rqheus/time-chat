export default (state = "", action) => {
    switch (action.type) {
        case "TOKEN_SET":
            return action.token;
        default:
            return state;
    }
};