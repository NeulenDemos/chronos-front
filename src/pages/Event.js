import React, {Fragment, useContext, useEffect, useState} from "react";
import {ApiContext} from "../context/api/apiContext";
import {Redirect} from "react-router-dom";
import * as Icons from "@material-ui/icons";
import {eventColors, eventColorsLight, categories, fmtDateISO, fmtTime, emailRegexp, timestampToDate} from "../context/utils";
import toast from "react-hot-toast";
import {Avatar} from "../components/Avatar";
import {Helmet} from "react-helmet";


function moveCarriage(pos) {
    const carriage = document.getElementById("button-menu-carriage");
    const items = document.getElementsByClassName("button-menu-item");
    if (!carriage || !items)
        return;
    // eslint-disable-next-line default-case
    switch (pos) {
        case categories[0]:
            carriage.style.transform = "translateX(0px)";
            carriage.style.width = "120px";
            [...items].forEach(item => item.style.color = "#787878")
            items[0].style.color = "#282c34";
            break;
        case categories[1]:
            carriage.style.transform = "translateX(130px)";
            carriage.style.width = "90px";
            [...items].forEach(item => item.style.color = "#787878")
            items[1].style.color = "#282c34";
            break;
        case categories[2]:
            carriage.style.transform = "translateX(230px)";
            carriage.style.width = "50px";
            [...items].forEach(item => item.style.color = "#787878")
            items[2].style.color = "#282c34";
            break;
    }
}

export const EditEvent = ({match}) => {
    return Event(match, true);
}

export const CreateEvent = ({match}) => {
    return Event(match, false);
}

const Event = (match, edit) => {
    const {user, event, fetchUser, fetchEvent, createEvent, editEvent, deleteEvent, resetHooks, isAuth} = useContext(ApiContext);
    const calendar_id = edit ? null : match.params.id;
    const event_id = edit ? match.params.id : null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState();
    const [type, setType] = useState(categories[0]);
    const [guests, setGuests] = useState([]);
    const [date, setDate] = useState();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [allDay, setAllDay] = useState();
    const [color, setColor] = useState();
    const [success, setSuccess] = useState(false);

    /* eslint-disable */
    useEffect(() => {
        if (!isAuth || !event_id)
            return;
        fetchEvent(event_id);
    }, [isAuth]);
    useEffect(() => {
        if (!event)
            return;
        setTitle(event.title);
        setDescription(event.description);
        setType(event.type);
        setGuests(event.users);
        setDate(fmtDateISO(event.start_dt));
        setStartTime(fmtTime(event.start_dt));
        setEndTime(fmtTime(event.end_dt));
        setAllDay(event.all_day);
        setColor(event.color);
    }, [event]);
    useEffect(() => {
        if (user)
            setGuests(guests.concat(user));
    }, [user]);
    useEffect(() => () => {
        resetHooks([user, event]);
    }, []);

    if (success)
        return <Redirect to={`/calendars/${calendar_id || event.calendar_id}`}/>;

    if (event) {
        function f() {
            const titleEl = document.getElementById("title");
            const descEl = document.getElementById("description");
            const allDayEl = document.getElementById("all-day");
            const startDtEl = document.getElementById("start-dt");
            const startDateEl = document.getElementById("start-date");
            const endDtEl = document.getElementById("end-dt");
            if (titleEl && !titleEl.value &&
                allDayEl && !allDayEl.checked &&
                (event.all_day || (startDtEl && !startDtEl.value)) &&
                (!event.description || (descEl && !descEl.value)) &&
                (!event.end_dt || (endDtEl && !endDtEl.value))) {
                event.start_dt = timestampToDate(event.start_dt);
                event.end_dt = timestampToDate(event.end_dt);
                titleEl.value = event.title;
                allDayEl.checked = event.all_day;
                if (!event.all_day) {
                    startDateEl.value = fmtDateISO(event.start_dt);
                    startDtEl.value = fmtTime(event.start_dt);
                }
                if (event.description)
                    descEl.value = event.description;
                if (event.end_dt)
                    endDtEl.value = fmtTime(event.end_dt);
            }
        }
        setTimeout(f, 0);
    }

    function formSubmitHandler(e, is_delete=false) {
        e.preventDefault();
        // if submitted by pressing Enter, not by submit button
        if (e.nativeEvent.pointerId === -1)
            return;
        if (!title || !title.trim()) {
            toast.error("Title is incorrect!");
            return;
        }
        if (!allDay && !startTime) {
            toast.error("Specify a time of event!");
            return;
        }
        let start_date = new Date(date);
        let start_dt = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate(),
            startTime ? startTime.split(':')[0] : 0, startTime ? startTime.split(':')[1] : 0);
        let end_dt = endTime && !allDay && type === categories[0] ?
            new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate(), Number.parseInt(endTime.split(':')[0]),
                Number.parseInt(endTime.split(':')[1])) : null;
        let users = guests.map(g => {return {id: g.id}});
        if (is_delete)
            deleteEvent(event.id, setSuccess, [true]);
        else if (event)
            editEvent({id: event.id, title, description, type, start_dt, end_dt, all_day: allDay, color, users, callback: setSuccess, cb_args: [true]});
        else
            createEvent({calendar_id: calendar_id, title, description, type, start_dt, end_dt, all_day: allDay, color, users, callback: setSuccess, cb_args: [true]});
    }

    setTimeout(moveCarriage, 0, type);

    let mixColors = [];
    eventColors.forEach((col, i) => {mixColors.push(col); mixColors.push(eventColorsLight[i])});

    return (
        <Fragment>
            <Helmet title={event ? event.title : "Create event"}/>
            <div className="container main-container">
                <h1>{event_id ? 'Edit' : 'Create'} event</h1>
                <div className="content event">
                    <div className="d-flex flex-row">
                        <form style={type !== categories[0] ? {width: "100%"} : null}>
                            <input type="text" id="title" className="title" placeholder="Title" maxLength="64" onChange={event => setTitle(event.target.value)}/>
                            <div className="d-flex flex-row button-menu-block">
                                <button type="button" id="btn-type-1" className="button-menu-item" onClick={() => setType(categories[0])}>Arrangement</button>
                                <button type="button" id="btn-type-2" className="button-menu-item" onClick={() => setType(categories[1])}>Reminder</button>
                                <button type="button" id="btn-type-3" className="button-menu-item" onClick={() => setType(categories[2])}>Task</button>
                            </div>
                            <div style={{width: "100%", marginTop: "10px", backgroundColor: "rgb(229, 227, 221)"}}>
                                <div id="button-menu-carriage" style={{width: "120px", height: "1px", backgroundColor: "#333333"}}/>
                            </div>
                            <div className="time-range">
                                <div>
                                    <input className="form-check-input" type="checkbox" id="all-day" onChange={event => setAllDay(event.target.checked)}/>
                                    <label className="form-check-label" htmlFor="all-day">All day</label>
                                </div>
                                {!allDay ?
                                    <div>
                                        <input type="date" id="start-date" onChange={event => setDate(event.target.value)} style={{marginRight: "10px"}}/>
                                        <input type="time" id="start-dt" onChange={event => setStartTime(event.target.value)}/>
                                        {type === categories[0] ? <span>&nbsp;—&nbsp;</span> : null}
                                        {type === categories[0] ? <input type="time" id="end-dt" onChange={event => setEndTime(event.target.value)}/> : null}
                                    </div>
                                    : null}
                            </div>
                            {type === categories[0] || type === categories[1] ?
                                <textarea id="description" data-rows="1" tabindex="0" placeholder="Description" data-initial-value="" data-previous-value=""
                                          maxLength="4096" onChange={event => setDescription(event.target.value)}/>
                                : null}
                            <div className="color-picker">
                                {mixColors.map(col =>
                                    <div className="color-circle" style={{backgroundColor: col}} onClick={() => setColor(col)}>
                                        {color === col ? <Icons.Check style={{color: "white", fontSize: "16px", marginTop: "-8px", marginLeft: "2px"}}/> : null}
                                    </div>
                                )}
                            </div>
                            {!event ? <button className="btn-primary" type="submit" onClick={e => formSubmitHandler(e)}>Create event</button> : null}
                            {event ? <div className="d-flex flex-row">
                                <button className="btn-primary" type="submit" onClick={e => formSubmitHandler(e)}>Edit</button>
                                <button className="btn-danger" style={{marginLeft: "10px"}} type="submit" onClick={e => formSubmitHandler(e, true)}>Delete</button>
                            </div> : null}
                        </form>
                        {type === categories[0] ?
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
                                                <div className="d-flex flex-column">
                                                    <span>{guest.name}</span>
                                                    <span><a href={`mailto:${guest.email}`}>{guest.email}</a></span>
                                                </div>
                                            </div>
                                            <button type="button" className="round-btn no-bg"
                                                    onClick={() => setGuests(guests.filter(g => g !== guest))}><Icons.Close/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            : null}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}