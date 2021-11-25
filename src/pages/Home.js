import React, {Fragment, useContext} from 'react';
import {ApiContext} from "../context/api/apiContext";
import {Link, Redirect} from "react-router-dom";
import {Helmet} from "react-helmet";

export const Home = () => {
    const {isAuth} = useContext(ApiContext);

    if (isAuth)
        return <Redirect to="/calendars"/>;

    return (
        <Fragment>
            <Helmet title="Home"/>
            <div className="main-container d-flex flex-column home" style={{maxWidth: "1300px", padding: "10px", margin: "4rem auto"}}>
                <div>
                    <h1 className="fw-light">Organize meetings, tasks and events</h1>
                    <h1 className="fw-bold">Easier with Chronos</h1>
                    <p className="mt-4">Incredibly beautiful design, streamlined interface and amazing UX.
                        Always be aware of what you have planned, whether it be an important meeting or a household reminder.</p>
                </div>
                <div className="home-content">
                    <div>
                        <h1 className="fw-bold">Chronos</h1>
                        <p className="mt-4 fw-light">Check out our versatile event planner that makes it easy to schedule a
                            wide variety of reminders in different designs and formats for any purpose with this calendar.</p>
                        <div className="buttons">
                            <Link to="/registration"><button className="btn btn-primary">Sign Up</button></Link>
                            <Link to="/login"><button className="btn btn-outline-primary">Sign In</button></Link>
                        </div>
                    </div>
                    <div>
                        <img src="/demo.png" alt="" style={{width: "500px", height: "500px"}}/>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
