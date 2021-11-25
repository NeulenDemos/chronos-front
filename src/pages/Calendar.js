import React, {Fragment, useContext, useEffect, useState} from "react";
import {ApiContext} from "../context/api/apiContext";
import {Helmet} from "react-helmet";
import {CalendarMonth} from "../components/CalendarMonth";
import {CalendarWeek} from "../components/CalendarWeek";
import {CalendarYear} from "../components/CalendarYear";
import {months, weekNum, weeksInMonth} from "../context/utils";
import {EventPopup} from "../components/EventPopup";
import * as Icons from "@material-ui/icons";

export const Calendar = ({match}) => {
    const {calendar, fetchCalendar, isAuth, resetHooks} = useContext(ApiContext);
    const calendar_id = match.params.id;

    /* eslint-disable */
    useEffect(() => {
        if (!isAuth)
            return;
        fetchCalendar(calendar_id);
    }, [isAuth]);
    useEffect(() => () => {
        resetHooks([calendar]);
    }, []);

    const today = new Date();
    const [currYear, setCurrYear] = useState(today.getFullYear());
    const [currMonth, setCurrMonth] = useState(today.getMonth());
    const [currWeekM, setCurrWeekM] = useState(0);
    const [eventPopup, setEventPopup] = useState({open: false});
    const [mode, setMode] = useState(1);  // 1 - month, 2 - week, 3 - year

    function goNext() {
        function month() {
            setCurrYear(currMonth === 11 ? currYear + 1 : currYear);
            setCurrMonth((currMonth + 1) % 12);
        }
        switch (mode) {
            case 1: month(); break;
            case 2:
                if (currWeekM === weeksInMonth(currMonth, currYear) - 1) {
                    setCurrWeekM(0);
                    month();
                }
                else
                    setCurrWeekM(currWeekM + 1);
                break;
            case 3: setCurrYear(currYear + 1); break;
        }
    }
    function goPrevious() {
        function month() {
            setCurrYear(currMonth === 0 ? currYear - 1 : currYear);
            setCurrMonth(currMonth === 0 ? 11 : currMonth - 1);
        }
        switch (mode) {
            case 1: month(); break;
            case 2:
                if (currWeekM === 0) {
                    setCurrWeekM(weeksInMonth(currMonth === 0 ? 11 : currMonth - 1, currMonth === 0 ? currYear - 1 : currYear) - 1);
                    month();
                }
                else
                    setCurrWeekM(currWeekM - 1);
                break;
            case 3: setCurrYear(currYear - 1); break;
        }
    }
    function goToday() {
        setCurrYear(today.getFullYear());
        setCurrMonth(today.getMonth());
    }

    const week_num = weekNum({month: currMonth, year: currYear}) + currWeekM;

    return (
        <Fragment>
            <Helmet title={calendar ? calendar.title : "Calendar"}/>
            {calendar ?
                <div className="container main-container">
                    <div className="d-flex flex-row justify-content-between">
                        <h1>{(mode !== 3 ? months[currMonth] : '') + " " + currYear + (mode === 2 ? ` (week ${week_num})` : '')}</h1>
                        <div className="d-flex flex-row">
                            {(() => {
                                switch (mode) {
                                    case 1: return <button type="button" className="round-btn no-bg hover" _title="View&nbsp;Week" onClick={() => setMode(2)}><Icons.ViewColumnRounded/></button>;
                                    case 2: return <button type="button" className="round-btn no-bg hover" _title="View&nbsp;Year" onClick={() => setMode(3)}><Icons.ViewComfyRounded/></button>;
                                    case 3: return <button type="button" className="round-btn no-bg hover" _title="View&nbsp;Month" onClick={() => setMode(1)}><Icons.ViewModuleRounded/></button>;
                                }
                            })()}
                            <button type="button" className="round-btn no-bg hover" _title="Today" onClick={() => goToday()}><Icons.TodayRounded/></button>
                            <button type="button" className="round-btn no-bg hover" _title="Next&nbsp;month" onClick={() => goPrevious()}><Icons.ArrowBackIosRounded/></button>
                            <button type="button" className="round-btn no-bg hover" _title="Previous&nbsp;month" onClick={() => goNext()}><Icons.ArrowForwardIosRounded/></button>
                        </div>
                    </div>
                    {eventPopup && eventPopup.open ? <EventPopup calendar={calendar} data={eventPopup} setPopup={setEventPopup}/> : null}
                    {(() => {
                        switch (mode) {
                            case 1: return <CalendarMonth calendar={calendar} currMonth={currMonth} currYear={currYear} setEP={setEventPopup} popup={eventPopup}/>;
                            case 2: return <CalendarWeek calendar={calendar} currMonth={currMonth} currYear={currYear} currWeekM={currWeekM} setEP={setEventPopup} popup={eventPopup}/>
                            case 3: return <CalendarYear currYear={currYear}/>
                        }
                    })()}
                </div>
                : null}
        </Fragment>
    );
}