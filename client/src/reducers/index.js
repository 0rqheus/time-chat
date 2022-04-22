import { combineReducers } from "redux";

import token from "./token";
import user from "./user";
import selectedMessages from "./selectedMessages";
import selectedPolls from "./selectedPolls";

export default combineReducers({
    token,
    user,
    selectedMessages,
    selectedPolls
});