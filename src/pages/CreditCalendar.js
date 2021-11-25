import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Redirect} from "react-router-dom";
import {Helmet} from "react-helmet";
import {ApiContext} from "../context/api/apiContext";
import {permissions, emailRegexp, permissionsColors} from "../context/utils";
import {Avatar} from "../components/Avatar";
import * as Icons from "@material-ui/icons";


export const EditCalendar = ({match}) => {
    return CreditCalendar(match, true);
}

export const CreateCalendar = ({match}) => {
    return CreditCalendar(match, false);
}

const CreditCalendar = (match, edit) => {
    const {isAuth, calendar, user, createCalendar, editCalendar, fetchCalendar, resetHooks, fetchUser} = useContext(ApiContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hidden, setHidden] = useState(false);
    const [guests, setGuests] = useState([]);
    const [success, setSuccess] = useState();
    const calendar_id = match.params.id;

    /* eslint-disable */
    useEffect(() => {
        if (!isAuth || !calendar_id)
            return;
        fetchCalendar(calendar_id);
    }, [isAuth]);
    useEffect(() => {
        if (!calendar)
            return;
        setTitle(calendar.title);
        setDescription(calendar.description);
        console.log(calendar)
        setGuests(calendar.users.map(guest => { guest.has_been = true; return guest; }));
    }, [calendar]);
    useEffect(() => {
        if (user)
            setGuests(guests.concat(user));
    }, [user]);
    useEffect(() => () => {
        resetHooks([calendar, user]);
    }, []);
    console.log(guests)

    if (success)
        return <Redirect to="/calendars"/>;

    if (calendar) {
        function f() {
            const titleEl = document.getElementById("title");
            const descEl = document.getElementById("description");
            const hiddenEl = document.getElementById("hidden");
            if (titleEl && !titleEl.value &&
                (!calendar.description || (descEl && !descEl.value))) {
                titleEl.value = calendar.title;
                if (calendar.description)
                    descEl.value = calendar.description;
                if (calendar.hidden)
                    hiddenEl.click();
            }
        }
        setTimeout(f, 0);
    }

    function formSubmitHandler(event) {
        event.preventDefault();
        if (!title || !description || !title.trim() || !description.trim()) {
            toast.error("Title or description are incorrect!");
            return;
        }
        let users = guests.map(g => { if (g.permissions === undefined) g.permissions = 1; return g; });
        console.log(users)

        if (edit) {
            editCalendar({id: calendar_id, title, description, hidden, users, callback: setSuccess, cb_args: [true]});
            toast.success("Calendar edited!");
        }
        else {
            createCalendar({title, description, callback: setSuccess, users, cb_args: [true]});
            toast.success("Calendar created!");
        }
    }

    return (
        <Fragment>
            <Helmet title={calendar ? calendar.title : 'Create'}/>
                <div className="container main-container">
                    <h1 className="display-6">{calendar_id ? 'Edit' : 'Create'} calendar</h1>
                    <div className="content create-calendar-content" style={{marginTop: "20px", padding: "20px"}}>
                        <div className="d-flex flex-row">
                            <form className="create-calendar">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" name="title" maxLength="64" placeholder="Write a calendar title..." onChange={(event) => setTitle(event.target.value)}/>
                                <label htmlFor="content">Description</label>
                                <textarea id="description" name="description" maxLength="4000" placeholder="Write a calendar description..." onChange={(event) => setDescription(event.target.value)}/>
                                <span style={{color: "#868686", fontSize: "12px", marginLeft: "5px"}}>Tips: <code>`code`</code> <b>**bold**</b> <i>*italic*</i></span>
                                <div>
                                    <label htmlFor="hidden">Hidden</label>
                                    <input type="checkbox" id="hidden" name="hidden" className="form-check-input" style={{margin: "22px 0 0 10px"}} onChange={(event) => setHidden(event.target.checked)}/>
                                </div>
                                <button type="submit" className="btn-primary" onClick={(event) =>
                                    formSubmitHandler(event)}>{calendar_id ? 'Edit' : 'Create'} calendar</button>
                            </form>
                            <div className="guests-wrapper">
                                <div style={{marginLeft: "10px", width: "2px", borderRadius: "99px", backgroundColor: "#e5e3dd"}}/>
                                <div className="guests">
                                    <input type="email" className="email" placeholder="Add guests" maxLength="64"
                                           onKeyDown={event => {
                                               if (event.key === 'Enter' && event.target.value.match(emailRegexp)) {
                                                   const email = event.target.value;
                                                   event.target.value = '';
                                                   fetchUser(email);
                                               }
                                           }}/>
                                    {guests.map(guest =>
                                        <div className="guest">
                                            <div className="d-flex flex-row">
                                                <Avatar avatar={guest.picture} size={32} username={guest.name} padding={6}/>
                                                <div className={`d-flex flex-column ${guest.permissions === 0 ? 'text-decoration-line-through' : ''}`}>
                                                    <span>{guest.name}</span>
                                                    <span><a href={`mailto:${guest.email}`}>{guest.email}</a></span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row">
                                                <button type="button" className="round-btn no-bg" onClick={() => document.getElementById(`perm-${guest.id}`).style.display = "block"}>
                                                    <Icons.SecurityRounded style={{color: guest.permissions ? permissionsColors[guest.permissions] : null}}/></button>
                                                <select id={`perm-${guest.id}`} className="form-select permissions" size="3" onChange={e => {
                                                    document.getElementById(`perm-${guest.id}`).style.display = "none";
                                                    setGuests(guests.map(g => { if (g === guest) g.permissions = Number.parseInt(e.target.value); return g; }));
                                                }}>
                                                    <option value="1">{permissions[1]}</option>
                                                    <option value="2">{permissions[2]}</option>
                                                    <option value="3">{permissions[3]}</option>
                                                </select>
                                                <button type="button" className="round-btn no-bg"
                                                        onClick={() => setGuests(guests.map(g => { if (g === guest) g.permissions = 0; return g; }))}><Icons.Close/>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </Fragment>
    );
}