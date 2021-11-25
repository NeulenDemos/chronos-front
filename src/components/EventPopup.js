import React, {useContext, useEffect, useState} from "react";
import {ApiContext} from "../context/api/apiContext";
import {Link} from "react-router-dom";
import * as Icons from "@material-ui/icons";
import {eventColors, catColors, categories, fmtTime, months, emailRegexp, timestampToDate} from "../context/utils";
import toast from "react-hot-toast";
import {Avatar} from "./Avatar";


function popupMove(event, shift) {
    let elem = document.getElementById("create-event-popup");
    elem.style.top = event.pageY - 20 + "px";
    elem.style.left = event.pageX - shift * 2 + "px";
}

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

export const EventPopup = ({calendar, data, setPopup}) => {
    const {user, event, fetchUser, fetchEvent, createEvent, editEvent, fetchCalendar, deleteEvent, resetHooks} = useContext(ApiContext);

    const [title, setTitle] = useState(data.event ? data.event.title : null);
    const [description, setDescription] = useState(data.event ? data.event.description : null);
    const [type, setType] = useState(data.event ? data.event.type : categories[0]);
    const [guests, setGuests] = useState([]);
    const [startTime, setStartTime] = useState(data.event ? fmtTime(data.event.start_dt) : null);
    const [endTime, setEndTime] = useState(data.event ? fmtTime(data.event.end_dt) : null);
    const [allDay, setAllDay] = useState(data.event ? data.event.all_day : false);
    const [color, setColor] = useState(data.event ? data.event.color : catColors[categories[0]]);

    useEffect(() => {
        if (user && !guests.some(g => g.id === user.id))
            setGuests(guests.concat(user));
        // eslint-disable-next-line
    }, [user]);
    useEffect(() => {
        if (!data.event)
            setColor(catColors[type]);
        // eslint-disable-next-line
    }, [type]);
    useEffect(() => {
        if (!data.event || data.event.type !== categories[0])
            return;
        fetchEvent(data.event.id);
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (!event)
            return;
        setGuests(event.users);
        // eslint-disable-next-line
    }, [event]);
    useEffect(() => () => {
        resetHooks([user, event]);
        // eslint-disable-next-line
    }, []);

    const my_event = data.event ? event || data.event : null;
    if (my_event) {
        function f() {
            const titleEl = document.getElementById("title");
            const descEl = document.getElementById("description");
            const allDayEl = document.getElementById("all-day");
            const startDtEl = document.getElementById("start-dt");
            const endDtEl = document.getElementById("end-dt");
            if (titleEl && !titleEl.value &&
                allDayEl && !allDayEl.checked &&
                (my_event.all_day || (startDtEl && !startDtEl.value)) &&
                (!my_event.description || (descEl && !descEl.value)) &&
                (!my_event.end_dt || (endDtEl && !endDtEl.value))) {
                if (event) {
                    event.start_dt = timestampToDate(event.start_dt);
                    event.end_dt = timestampToDate(event.end_dt);
                }
                titleEl.value = my_event.title;
                allDayEl.checked = my_event.all_day;
                if (!my_event.all_day)
                    startDtEl.value = fmtTime(my_event.start_dt);
                if (my_event.description)
                    descEl.value = my_event.description;
                if (my_event.end_dt)
                    endDtEl.value = fmtTime(my_event.end_dt);
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
        let start_dt = new Date(data.year, data.month, data.day,
            startTime ? startTime.split(':')[0] : 0, startTime ? startTime.split(':')[1] : 0);
        let end_dt = endTime && !allDay && type === categories[0] ?
            new Date(data.year, data.month, data.day, Number.parseInt(endTime.split(':')[0]), Number.parseInt(endTime.split(':')[1])) : null;
        let users = guests.map(g => {return {id: g.id}});
        if (is_delete)
            deleteEvent(my_event.id, fetchCalendar, [calendar.id]);
        else if (my_event)
            editEvent({id: my_event.id, title, description, type, start_dt, end_dt, all_day: allDay, color, users, callback: fetchCalendar, cb_args: [calendar.id]});
        else
            createEvent({calendar_id: calendar.id, title, description, type, start_dt, end_dt, all_day: allDay, color, users, callback: fetchCalendar, cb_args: [calendar.id]});
        setPopup({open: false});
    }

    const width = 400;
    const height = 300;
    const shift = 100;
    let x = data.pos.x;
    let y = data.pos.y;
    if (!data.move) {
        if (data.day_pos.y < 4) x += shift;
        else if (data.day_pos.y >= 4) x -= width + shift;
        if (data.day_pos.x >= 1 && data.day_pos.x <= 3) y -= height / 2;
        else if (data.day_pos.x > 3) y -= height;
    }
    let move_is_down = false;
    setTimeout(moveCarriage, 0, type);

    return (
        <div id="create-event-popup" className={"popup " + (data.open ? "open" : "close")} style={{top: y, left: x}}>
            <div className="popup-header"
                 onMouseMove={event => {if (move_is_down) popupMove(event, shift)}}
                 onMouseDown={() => move_is_down = true}
                 onMouseUp={() => move_is_down = false}>
                <span>{data.day + " " + months[data.month] + " " + data.year}</span>
                <div>
                    <button type="button" className="round-btn"><Link to={my_event ? `/events/${my_event.id}` : `/calendars/${calendar.id}/create`}><Icons.OpenInNewRounded/></Link></button>
                    <button type="button" className="round-btn" onClick={() => setPopup({open: false})}><Icons.CloseRounded/></button>
                </div>
            </div>
            <form>
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
                            <input type="time" id="start-dt" onChange={event => setStartTime(event.target.value)}/>
                            {type === categories[0] ? <span>&nbsp;—&nbsp;</span> : null}
                            {type === categories[0] ? <input type="time" id="end-dt" onChange={event => setEndTime(event.target.value)}/> : null}
                        </div>
                    : null}
                </div>
                {type === categories[0] ?
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
                                    <Avatar avatar={guest.picture} size={26} username={guest.name} padding={2}/>
                                    <span>{guest.name}</span>
                                </div>
                                <button type="button" className="round-btn no-bg"
                                        onClick={() => setGuests(guests.filter(g => g !== guest))}><Icons.Close/>
                                </button>
                            </div>
                        )}
                    </div>
                : null}
                {type === categories[0] || type === categories[1] ?
                    <textarea id="description" data-rows="1" tabindex="0" placeholder="Description" data-initial-value="" data-previous-value=""
                              maxLength="4096" onChange={event => setDescription(event.target.value)}/>
                : null}
                <div className="color-picker">
                    {eventColors.map(col =>
                        <div className="color-circle" style={{backgroundColor: col}} onClick={() => setColor(col)}>
                            {color === col ? <Icons.Check style={{color: "white", fontSize: "16px", marginTop: "-8px", marginLeft: "2px"}}/> : null}
                        </div>
                    )}
                </div>
                {!my_event ? <button className="btn-primary" type="submit" onClick={e => formSubmitHandler(e)}>Create event</button> : null}
                {my_event ? <div className="d-flex flex-row">
                    <button className="btn-primary" type="submit" onClick={e => formSubmitHandler(e)}>Edit</button>
                    <button className="btn-danger" style={{marginLeft: "10px"}} type="submit" onClick={e => formSubmitHandler(e, true)}>Delete</button>
                </div> : null}
            </form>
        </div>
    );
}