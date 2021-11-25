import React, {Fragment, useContext} from 'react';
import toast from 'react-hot-toast';
import {ApiContext} from "../context/api/apiContext";
import {Link, Redirect} from "react-router-dom";
import {Helmet} from "react-helmet";
import {emailRegexp, passRegexp} from "../context/utils";

export const Login = () => {
    const {login, isAuth} = useContext(ApiContext);

    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        if (!formData.email || !formData.email.match(emailRegexp) ||
            !formData.pass || !formData.pass.match(passRegexp))
            toast.error("Incorrect email or password");
        else
            login(formData);
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
    }
    if (isAuth)
        return <Redirect to="/calendars"/>;
    const inputs = [...document.getElementsByTagName("input")];
    inputs.forEach(input => {
        if (!formData[input.name])
            formData[input.name] = input.value;
    });

    return (
        <Fragment>
            <Helmet title="Login"/>
            <div className="main-container" style={{display: "flex", flexDirection: "column", maxWidth: "300px", padding: "10px", margin: "auto"}}>
                <span style={{textAlign: "center", fontSize: "28px"}}>Sign in</span>
                <form style={{backgroundColor: "#f6f8fa", border: "1px solid #ebedef", borderRadius: "5px", marginTop: "15px"}}>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px 20px 20px 20px"}} className="login-form">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={inputChangeHandler}/>
                        <div className="d-flex flex-row justify-content-between">
                            <label htmlFor="pass">Password</label>
                            <Link to="password-reset"><label style={{cursor: "pointer"}}>Forgot password?</label></Link>
                        </div>
                        <input type="password" id="pass" name="pass" onChange={inputChangeHandler}/>
                        <button onClick={formSubmitHandler}>Sign in</button>
                    </div>
                </form>
                <span style={{textAlign: "center", fontSize: "14px", color: "#706c64", fontWeight: 500}}>
                    Don't have an account? <Link to="/registration" style={{textDecoration: "none"}}>Sign Up</Link></span>
            </div>
        </Fragment>
    );
};
