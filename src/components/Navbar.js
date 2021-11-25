import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import {ReactComponent as LogoBig} from "../assets/images/logo_label.svg"
import {Menu} from '@material-ui/icons';
import {ApiContext} from "../context/api/apiContext";
import {Avatar} from "./Avatar";


export const Navbar = () => {
    const {isAuth, me, refreshAuth, fetchMe, searchEvents} = useContext(ApiContext);
    const [openMenu, setOpenMenu] = useState(false);
    const [selectEvents, setEvents] = useState();

    useEffect(() => {
        refreshAuth();
        if (isAuth)
            fetchMe();
        // eslint-disable-next-line
    }, [isAuth])

    return (
        <div style={{position: "fixed", width: "100%", top: 0, zIndex: 99}}>
            <nav className="navbar navbar-expand-sm">
                <button id="nav-menu" data-bs-toggle="collapse"
                        data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                        aria-expanded="false" aria-label="Toggle navigation"
                        style={{width: "30px", padding: 0, marginRight: "8px", border: "none", background: "none"}}
                        onClick={() => setOpenMenu(!openMenu)}>
                    <Menu/>
                </button>
                <div className="navbar-brand">
                    <Link to="/"><LogoBig style={{height: "40px"}}/></Link>
                </div>
                <div className="nav-search" id="search-main">
                    <AsyncSelect
                        components={makeAnimated()}
                        value={selectEvents}
                        onChange={events => setEvents(events)}
                        loadOptions={(data, callback) => searchEvents(data, callback)}
                        placeholder="Search events"
                        theme={theme => ({
                            ...theme
                        })}/>
                </div>
                <div className="nav-profile">
                    {isAuth ? (
                        <NavLink to={`/profile`} style={{textDecoration: "none"}}>
                            <div className="nav-profile-box">
                                <Avatar avatar={me ? me.picture : null} size={35} username={me ? me.name : null} padding={8}/>
                                <span className="nav-profile-text">{me ? me.login : null}</span>
                            </div>
                        </NavLink>
                    ) : (
                        <ul className="navbar-nav hidden-phone">
                            <li className="nav-item">
                                <NavLink to="/login" style={{textDecoration: "none"}}>
                                    <span className="nav-link">Sign In</span>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
            <div className="collapse" style={{display: openMenu ? "block" : "none"}}>
                <div className="bg-light p-4">
                    <div className="nav-search" id="search-phone">
                        <AsyncSelect
                            components={makeAnimated()}
                            value={selectEvents}
                            onChange={events => setEvents(events)}
                            loadOptions={(data, callback) => searchEvents(data, callback)}
                            placeholder="Search events"
                            theme={theme => ({
                                ...theme
                            })}/>
                    </div>
                    <div onClick={() => setOpenMenu(false)}>
                        {!isAuth ? <NavLink className="nav-link" to="/login" style={{textDecoration: "none"}}>Sign In</NavLink> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}