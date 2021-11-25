import React, {Fragment, useContext, useEffect} from 'react';
import {Link} from "react-router-dom";
import Cookies from 'js-cookie';
import {ApiContext} from "../context/api/apiContext";
import * as Icons from "@material-ui/icons";
import {getDateString} from "../context/utils";
import {Helmet} from "react-helmet";
import {Avatar} from "../components/Avatar";
import {CalendarsList} from "../components/CalendarsList";


export const Profile = () => {
    const {me, fetchMe, isAuth, logout, fetchCalendars, calendars} = useContext(ApiContext);
    const cashed_me = Cookies.get('me') ? JSON.parse(Cookies.get('me')) : null;
    const user = me || cashed_me;

    useEffect(() => {
        if (!isAuth)
            return;
        fetchCalendars();
        fetchMe();
        // eslint-disable-next-line
    }, []);

    function count_events(cal) {
        let cnt = 0;
        cal.forEach(c => cnt += c.events_count);
        return cnt;
    }

    return (
        <Fragment>
            <Helmet title={user ? user.name : "User"}/>
            {user ?
                <div className="container main-container" style={{marginTop: "20px", marginBottom: "20px"}}>
                    <div className="content">
                        <div className="d-flex flex-row user-block">
                            <div className="d-flex flex-column user-params" style={{width: "30%", marginRight: "15px"}}>
                                <Avatar avatar={user.picture} size={150} username={user.name} padding={70}/>
                                <span style={{textAlign: "center", marginTop: "15px", fontSize: "18px", fontWeight: 500}}>{user.name}</span>
                                <span style={{textAlign: "center", fontSize: "16px", color: "#706c64"}}>@{user.login}</span>
                                <hr/>
                                <div className="d-flex flex-row align-items-center" style={{paddingLeft: "15px"}}>
                                    <Icons.CalendarTodayOutlined className="user-params-icon"/>
                                    <div className="d-flex flex-column" style={{lineHeight: 0.9}}>
                                        <span style={{fontWeight: 500}}>{calendars ? calendars.length : 0}</span>
                                        <span style={{marginTop: "5px"}}>Calendars</span>
                                    </div>
                                </div>
                                <hr/>
                                <div className="d-flex flex-row align-items-center" style={{paddingLeft: "15px"}}>
                                    <Icons.EventRounded className="user-params-icon"/>
                                    <div className="d-flex flex-column" style={{lineHeight: 0.9}}>
                                        <span style={{fontWeight: 500}}>{calendars ? count_events(calendars) : 0}</span>
                                        <span style={{marginTop: "5px"}}>Events</span>
                                    </div>
                                </div>
                                <hr/>
                                <div className="d-flex flex-row align-items-center" style={{paddingLeft: "15px"}}>
                                    <Icons.HistoryRounded className="user-params-icon"/>
                                    <div className="d-flex flex-column" style={{lineHeight: 0.9}}>
                                        <span style={{fontWeight: 500}}>{getDateString(user.created_at, true)}</span>
                                        <span style={{ marginTop: "5px"}}>Joined</span>
                                    </div>
                                </div>
                                <hr/>
                                <Link to={`/settings`}><button style={{width: "100%"}}>Profile settings</button></Link>
                                <button id="log-out" style={{width: "100%"}} onClick={logout}>Log out</button>
                            </div>
                            <div className="user-addons" style={{width: "80%"}}>
                                <div className="row">
                                    {calendars ? <CalendarsList calendars={calendars}/> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </Fragment>
    );
}