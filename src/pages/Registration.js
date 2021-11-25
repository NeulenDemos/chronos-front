import React, {Fragment, useContext, useState} from 'react';
import toast from 'react-hot-toast';
import {ApiContext} from "../context/api/apiContext";
import {Link, Redirect} from "react-router-dom";
import {Helmet} from "react-helmet";
import {emailRegexp, passRegexp} from "../context/utils";

export const Registration = () => {
    const {register, isAuth} = useContext(ApiContext);
    const [passCol, setPassCol] = useState("#aaaaaa");
    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        if (!formData.email || !formData.username || !formData.name || !formData.pass || !formData.pass2)
            toast.error("Please fill in all fields");
        else if (!formData.email.match(emailRegexp))
            toast.error("Incorrect email");
        else if (!formData.pass.match(passRegexp))
            toast.error("Incorrect password");
        else if (formData.pass !== formData.pass2)
            toast.error("Passwords are not matches");
        else
            register(formData);
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
        if ((event.target.name === "pass" || event.target.name === "pass2") && formData.pass2) {
            if (formData.pass === formData.pass2)
                setPassCol("#4bb359");
            else
                setPassCol("#e15f5f");
        }
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
            <Helmet title="Registration"/>
            <div className="main-container" style={{display: "flex", flexDirection: "column", maxWidth: "300px", padding: "10px", margin: "auto"}}>
                <span style={{textAlign: "center", fontSize: "28px"}}>Sign Up</span>
                <form style={{backgroundColor: "#f6f8fa", border: "1px solid #ebedef", borderRadius: "5px", marginTop: "15px"}}>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px 20px 20px 20px"}} className="login-form">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={inputChangeHandler}/>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" maxLength="10" onChange={inputChangeHandler}/>
                        <label htmlFor="name">Full name</label>
                        <input type="text" id="name" name="name" onChange={inputChangeHandler}/>
                        <label htmlFor="pass">Password</label>
                        <input type="password" id="pass" name="pass" style={{borderColor: passCol}} onChange={inputChangeHandler}/>
                        <label htmlFor="pass2">Confirm password</label>
                        <input type="password" id="pass2" name="pass2" style={{borderColor: passCol}} onChange={inputChangeHandler}/>
                        <button onClick={formSubmitHandler}>Sign up</button>
                    </div>
                </form>
                <span style={{textAlign: "center", fontSize: "14px", color: "#706c64", fontWeight: 500}}>
                    Already have an account? <Link to="/login" style={{textDecoration: "none"}}>Sign In</Link></span>
            </div>
        </Fragment>
    );
};
