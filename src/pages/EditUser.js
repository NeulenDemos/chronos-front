import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Redirect} from "react-router-dom";
import {ApiContext} from "../context/api/apiContext";
import Cookies from "js-cookie";
import {Helmet} from "react-helmet";
import {emailRegexp, passRegexp} from "../context/utils";
import {Avatar} from "../components/Avatar";


export const EditUser = () => {
    const {fetchMe, isAuth, editUser, editAvatar} = useContext(ApiContext);
    const [success, setSuccess] = useState();
    const [passCol, setPassCol] = useState("#aaaaaa");
    const me = Cookies.get('me') ? JSON.parse(Cookies.get('me')) : null;

    useEffect(() => {
        if (!isAuth)
            return;
        fetchMe();
        // eslint-disable-next-line
    }, []);

    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        if (formData.email && !formData.email.match(emailRegexp))
            toast.error("Incorrect email");
        else if (formData.pass && !formData.pass.match(passRegexp))
            toast.error("Incorrect password");
        else if (formData.pass && formData.pass !== formData.pass2)
            toast.error("Passwords are not matches");
        else {
            for (const [key, value] of Object.entries(formData))
                if (!value || !value.trim())
                    delete formData[key];
            delete formData.pass2;
            editUser({data: formData, callback: setSuccess, cb_args: [true]});
            toast.success("Profile edited!");
        }
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
        if ((event.target.name === "password" || event.target.name === "pass2") && formData.pass2) {
            if (formData.password === formData.pass2)
                setPassCol("#4bb359");
            else
                setPassCol("#e15f5f");
        }
    }
    if (!isAuth)
        return <Redirect to="/login"/>;
    if (success)
        return <Redirect to={`/profile`}/>;
    if (me) {
        const items = document.getElementsByClassName("user-inputs");
        [...items].forEach(item => {
            if ((formData[item.name] = item.value ? item.value : me[item.name]))
                item.value = formData[item.name];
        });
    }

    return (
        <Fragment>
            <Helmet title="Edit profile"/>
            <div className="container" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Profile settings</h1>
            </div>
            {me ?
                <div className="container main-container">
                    <div className="content">
                        <form className="edit-user d-flex flex-column" style={{margin: "0 auto 0 auto", width: "min-content"}}>
                            <Avatar avatar={me.picture} size={150} username={me.name} padding={70}/>
                            <label htmlFor="image" style={{cursor: "pointer", textAlign: "center"}}>Upload an image</label>
                            <input id="image" type="file" accept="image/png, image/jpg, image/jpeg, image/gif" onChange={() => editAvatar(document.getElementById("image").files[0])}/>
                        </form>
                        <form className="edit-user">
                            <label htmlFor="email">Email</label>
                            <input className="user-inputs" type="email" id="email" name="email" autoComplete="username" onChange={inputChangeHandler}/>
                            <label htmlFor="login">Username</label>
                            <input className="user-inputs" type="text" id="login" name="login" maxLength="10" onChange={inputChangeHandler}/>
                            <label htmlFor="name">Full name</label>
                            <input className="user-inputs" type="text" id="name" name="name" onChange={inputChangeHandler}/>
                            <label htmlFor="password">Password</label>
                            <input className="user-inputs" type="password" id="password" name="password" style={{borderColor: passCol}} onChange={inputChangeHandler}/>
                            <label htmlFor="pass2">Confirm password</label>
                            <input className="user-inputs" type="password" id="pass2" name="pass2" style={{borderColor: passCol}} onChange={inputChangeHandler}/>
                            <button className="btn-primary" type="submit" onClick={formSubmitHandler}>Save changes</button>
                        </form>
                    </div>
                </div> : null}
        </Fragment>
    );
}