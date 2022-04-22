import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./_partials/Header/Header";
import Home from "./Home";
import Storage from "./Storage/Storage";
import StorageChat from "./Storage/StorageChat";
import CreateChat from "./CreateChat";
import Chat from "./Chat";
import Chats from "./Chats";
import SignUp from "./SignUp";
import LogIn from "./Login";
import Tasks from "./Tasks";
import Invite from "./_partials/Invite";

const checkCredentials = (reduxToken, reduxUser, dispatch) => {
    const localToken = localStorage.getItem("jwt");
    const localUser = JSON.parse(localStorage.getItem("user"));

    if((localUser?.id && !reduxUser.id) && (localToken && !reduxToken)) {
        dispatch({type: "USER_LOGIN", user: localUser});
        dispatch({type: "TOKEN_SET", token: localToken});
    }
};

const FreeRoute = ({ component: Component, path }) => {
    const reduxToken = useSelector(state => state.token);
    const reduxUser = useSelector(state => state.user);
    const dispatch = useDispatch();
    checkCredentials(reduxToken, reduxUser, dispatch);
    return <Route path={path} render={ ({match}) => <Component match={match}/> } />;
};

const AuthRoute = ({ component: Component, path }) => {

    const localToken = localStorage.getItem("jwt");
    const localUser = JSON.parse(localStorage.getItem("user"));
    const reduxToken = useSelector(state => state.token);
    const reduxUser = useSelector(state => state.user);
    const dispatch = useDispatch();
    

    if(localToken && localUser.id) {
        checkCredentials(reduxToken, reduxUser, dispatch);
        return <Route path={path} render={ ({match}) => <Component match={match}/> } />;
    } else {
        return <Redirect to="/login"/>;
    }
};

const App = () => {
    return (
        <Router>

            <Header />

            <Switch>

                <FreeRoute path="/" component={Home} exact />

                <FreeRoute path="/signup" component={SignUp} exact />

                <FreeRoute path="/login" component={LogIn} exact />

                <AuthRoute path="/chats" component={Chats} exact />

                <AuthRoute path="/chats/create" component={CreateChat} exact />

                <FreeRoute path="/chats/:id/join/:code" component={Invite} exact />

                <AuthRoute path="/chats/:id" component={Chat} exact />

                <AuthRoute path="/storage" component={Storage} exact />

                <AuthRoute path="/tasks" component={Tasks} exact />

                <AuthRoute path="/storage/:chatId" component={StorageChat} exact />

                <FreeRoute path="*" component={ () => <h3>Error 404. Page not Found</h3> } />

            </Switch>

        </Router>
    );
};


export default App;
