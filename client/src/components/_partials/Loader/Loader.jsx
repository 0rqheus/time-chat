import React from "react";
import spinner from "../../../assets/spinner.png";
import "./loader.scss";

const Loader = () => {
    return <img src={spinner} alt="loading..." className="loader"/>;
};

export default Loader;