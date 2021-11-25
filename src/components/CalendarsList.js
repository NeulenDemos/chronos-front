import React, {useContext, useState} from 'react'
import {Link, Redirect} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import {eventColors, eventColorsLight, getDateString} from "../context/utils";
import * as Icons from "@material-ui/icons";
import {ApiContext} from "../context/api/apiContext";


export const CalendarsList = ({calendars, showHidden}) => {
    const {deleteCalendar} = useContext(ApiContext);
    const [success, setSuccess] = useState();

    if (success)
        return <Redirect to="/"/>;

    if (calendars)
    return (
        calendars.map(calendar =>
            <div className="resp-col col-sm-3 mt-3 calendars-block" style={{display: calendar.hidden && !showHidden ? "none" : "", transition: "all linear 0.5s"}}>
                <div className="card" style={{border: "4px solid " + eventColors[calendar.id % eventColors.length], borderRadius: "10px"}}>
                    {(() => {
                        let container = [];
                        for (let i = 0; i < 6; i++)
                            container.push(<div className="spring" style={{backgroundColor: eventColors[calendar.id % eventColors.length]}}/>);
                        return <div className="d-flex flex-row justify-content-evenly">{container}</div>;
                    })()}
                    <div className="d-flex flex-row justify-content-between card-header"
                         style={{borderColor: eventColors[calendar.id % eventColors.length],
                             background: eventColorsLight[calendar.id % eventColorsLight.length], padding: "0 0 0 1rem", borderRadius: "6px 6px 0 0", borderBottomWidth: "3px"}}>
                        <Link to={`/calendars/${calendar.id}`} style={{color: "#212529", textDecoration: "none", width: "100%", paddingTop: "0.5rem"}}>
                            <h5>{calendar.title}</h5>
                        </Link>
                        <button type="button" className="round-btn no-bg" onClick={() => document.getElementById(`more-${calendar.id}`).style.display = "flex"}><Icons.MoreVert/></button>
                        <div id={`more-${calendar.id}`} className="form-select calendar-opt" size="2" onMouseLeave={() =>
                            document.getElementById(`more-${calendar.id}`).style.display = "none"} onClick={() =>
                            document.getElementById(`more-${calendar.id}`).style.display = "none"}>
                            <Link to={`/calendars/${calendar.id}/edit`} style={{textDecoration: "none", color: "unset"}}><button className="btn btn-outline-primary w-100">Edit</button></Link>
                            <button className="btn btn-outline-danger" style={{marginTop: "4px"}} onClick={() => deleteCalendar(calendar.id, setSuccess, [true])}>Delete</button>
                        </div>
                    </div>
                    <div className="card-body" style={{ borderRadius: "0 0 6px 6px", background: "var(--su-gray-white)"}}>
                        <div>
                            <Icons.NotesRounded/>
                            <ReactMarkdown className="m-0 md">{calendar.description}</ReactMarkdown>
                        </div>
                        <div>
                            <Icons.EventRounded/>
                            <span>{calendar.events_count} event{calendar.events_count > 1 ? 's' : ''}</span>
                        </div>
                        <div>
                            <Icons.HistoryRounded/>
                            <span>{getDateString(calendar.created_at, true)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};