import {useState} from "react";
import ReactMarkdown from 'react-markdown';
import {timestampToDate, daysInMonth, fmtTime, days} from "../context/utils";


export const CalendarMonth = ({calendar, currMonth, currYear, setEP, popup}) => {
    const [showFull, setShowFull] = useState();

    function createEvent(e, day, month, year, x, y) {
        if (popup && popup.open)
            setEP({open: false});
        setTimeout(setEP, 0, {open: true, pos: {x: e.pageX, y: e.pageY}, day, month, year, day_pos: {x: x, y: y}});
    }
    function showEvent(e, event, day, month, year, x, y) {
        if (popup && popup.open)
            setEP({open: false});
        setTimeout(setEP, 0, {open: true, pos: {x: e.pageX, y: e.pageY}, day, month, year, day_pos: {x: x, y: y}, event});
    }

    const today = new Date();
    let events_dt = [];
    if (calendar.events)
        calendar.events.forEach(event => {
            event.start_dt = timestampToDate(event.start_dt, today);
            event.end_dt = timestampToDate(event.end_dt, today);
            if (!event.color)
                event.color = "var(--su-primary)";
            if (currYear === event.start_dt.getFullYear() && currMonth === event.start_dt.getMonth())
                events_dt.push(event);
        });

    const curr_date = new Date(currYear, currMonth);
    const curr_month_last_day = daysInMonth(currMonth, currYear);
    const prev_month_last_day = daysInMonth((currMonth === 0) ? 11 : currMonth - 1, (currMonth === 0) ? currYear - 1 : currYear);
    let date = 1;
    let rows = [];
    let ended = false;
    for (let i = 0; i < 6; i++) {
        let row = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < (curr_date.getDay() === 0 ? 6 : curr_date.getDay() - 1)) {
                const tmp_date = prev_month_last_day - curr_date.getDay() + j + 2 - (curr_date.getDay() === 0 ? 7 : 0);
                const is_today = tmp_date === today.getDate() && currYear === today.getFullYear() && currMonth === today.getMonth() + 1;
                row.push(
                    <td key={date - j - 1} className={is_today ? "today" : null}>
                        <div className="day-box day-inactive">
                            <span>{tmp_date}</span>
                        </div>
                    </td>);
            }
            else if (date > curr_month_last_day) {
                const tmp_date = date - curr_month_last_day;
                const is_today = tmp_date === today.getDate() && currYear === today.getFullYear() && currMonth === today.getMonth() - 1;
                row.push(
                    <td key={date + j} className={is_today ? "today" : null}>
                        <div className="day-box day-inactive">
                            <span>{tmp_date}</span>
                        </div>
                    </td>);
                if (j === 0) ended = true;
                date++;
            }
            else {
                const is_today = date === today.getDate() && currYear === today.getFullYear() && currMonth === today.getMonth();
                const tmp_date = date;
                let events = [];
                events_dt.forEach(event => {
                    if (event.start_dt.getDate() === tmp_date && event.start_dt.getMonth() === currMonth)
                        events.push(event);
                });
                row.push(
                    <td key={date} className={is_today ? "today" : null}>
                        <div className="day-box">
                            <span onClick={() => setShowFull(null)}>{date}</span>
                            <div className="day-events">{
                                events.map((event, n) => {
                                    if (n < 3 || (showFull === tmp_date))
                                         return (<div className="day-event" key={n} style={{backgroundColor: event.color}} onClick={(e) => showEvent(e, event, tmp_date, currMonth, currYear, i, j)}>
                                            <ReactMarkdown>{(!event.all_day ? fmtTime(event.start_dt, true) + ' ' : '') + event.title}</ReactMarkdown></div>);
                                    else if (n === 3)
                                        return <div onClick={() => setShowFull(tmp_date)} className="show-more"><span>Show more</span></div>;
                                    return <div/>;
                                })
                            }</div>
                            <div style={{cursor: 'cell', height: 100 - (events.length * 30)}} onClick={(event) => createEvent(event, tmp_date, currMonth, currYear, i, j)}/>
                        </div>
                    </td>);
                date++;
            }
        }
        if (ended) break;
        rows.push(row);
    }

    return (
        <table className="calendar-month">
            <thead><tr>{
                days.map((day, i) => <th key={i}>{day}</th>)
            }</tr></thead>
            <tbody>{
                rows.map((row, i) => <tr key={i}>{row}</tr>)
            }</tbody>
        </table>
    );
}