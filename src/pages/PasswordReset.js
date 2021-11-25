import React, {Fragment, useContext} from 'react';
import toast from 'react-hot-toast';
import {ApiContext} from "../context/api/apiContext";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {emailRegexp, passRegexp} from "../context/utils";

export const PasswordReset = ({match}) => {
    const {passwordReset} = useContext(ApiContext);

    const token = match.params.token;
    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        if (token) {
            if (!formData.password || !formData.password.match(passRegexp))
                toast.error("Incorrect password");
            else {
                passwordReset({token, password: formData.password});
                toast.success("Password updated!");
            }
        }
        else {
            if (!formData.email || !formData.email.match(emailRegexp))
                toast.error("Incorrect email");
            else {
                passwordReset({email: formData.email});
                toast.success("Password reset confirmation sent!");
            }
        }
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
    }

    return (
        <Fragment>
            <Helmet title="Password reset"/>
            <div className="main-container" style={{display: "flex", flexDirection: "column", maxWidth: "300px", padding: "10px", margin: "auto"}}>
                <span style={{textAlign: "center", fontSize: "28px"}}>Password reset</span>
                <form style={{backgroundColor: "#f6f8fa", border: "1px solid #ebedef", borderRadius: "5px", marginTop: "15px"}}>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px 20px 20px 20px"}} className="login-form">
                        {token ?
                            <div className="d-flex flex-column">
                                <label htmlFor="email">New password</label>
                                <input type="password" id="pass" name="password" onChange={inputChangeHandler}/>
                            </div>
                        :
                            <div className="d-flex flex-column">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" onChange={inputChangeHandler}/>
                            </div>
                        }
                        <button onClick={formSubmitHandler}>Submit</button>
                    </div>
                </form>
                <span style={{textAlign: "center", fontSize: "14px", color: "#706c64", fontWeight: 500}}>
                    Suddenly remembered the password?<br/><Link to="/login" style={{textDecoration: "none"}}>Sign In</Link></span>
            </div>
        </Fragment>
    );
};
