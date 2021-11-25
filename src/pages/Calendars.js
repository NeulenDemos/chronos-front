import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {ApiContext} from "../context/api/apiContext";
import * as Icons from "@material-ui/icons";
import {Helmet} from "react-helmet";
import {CalendarsList} from "../components/CalendarsList";


export const Calendars = () => {
    const {fetchCalendars, calendars, isAuth} = useContext(ApiContext);
    const [showHidden, setShowHidden] = useState();

    useEffect(() => {
        if (!isAuth)
            return;
        fetchCalendars();
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <Helmet title="Calendars"/>
            {calendars ?
                <div className="container main-container">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <h1>Calendars</h1>
                        <div className="d-flex flex-row">
                            {showHidden ? <div className="link-button" onClick={() => setShowHidden(false)}><Icons.VisibilityOffOutlined/>&nbsp;Hide&nbsp;Hidden</div> :
                                <div className="link-button" onClick={() => setShowHidden(true)}><Icons.VisibilityOutlined/>&nbsp;Show&nbsp;Hidden</div>}
                            <Link to="/calendars/create" className="link-button" style={{marginLeft: "10px"}}><div className="d-flex flex-row"><Icons.AddRounded/>&nbsp;Create&nbsp;Calendar</div></Link>
                        </div>
                    </div>
                    <div className="content full row">
                        <CalendarsList calendars={calendars} showHidden={showHidden}/>
                    </div>
                </div>
                : null}
        </Fragment>
    );
}