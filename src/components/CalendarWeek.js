import ReactMarkdown from 'react-markdown';
import {timestampToDate, daysInMonth, fmtTime, days} from "../context/utils";


export const CalendarWeek = ({calendar, currMonth, currYear, currWeekM, setEP, popup}) => {
    function createEvent(e, day, month, year, x, y) {
        if (popup && popup.open)
            setEP({open: false});
        setTimeout(setEP, 0, {open: true, pos: {x: e.pageX, y: e.pageY}, day, month, year, day_pos: {x: 0, y: y}});
    }
    function showEvent(e, event, day, month, year, x, y) {
        if (popup && popup.open)
            setEP({open: false});
        setTimeout(setEP, 0, {open: true, pos: {x: e.pageX, y: e.pageY}, day, month, year, day_pos: {x: 0, y: y}, event});
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
    let row;

    for (let i = 0; i < 6; i++) {
        row = [];
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
                            <span>{date}</span>
                            <div className="day-events">{
                                (() => {
                                    let times = [];
                                    for (let i = 0; i <= 24; i++) {
                                        const hour_events = events.filter(event => (i === 0 && event.all_day) || (!event.all_day && event.start_dt.getHours() === i - 1));
                                        times.push(<div className="day-times" _time={i === 24 ? '23:59' : `${i}:00`}>{hour_events.length ?
                                            hour_events.map((event, n) => {
                                                return <div className="day-event" key={n} style={{backgroundColor: event.color}} onClick={(e) => showEvent(e, event, tmp_date, currMonth, currYear, 0, j)}>
                                                    <ReactMarkdown>{(!event.all_day ? fmtTime(event.start_dt, true) + ' ' : '') + event.title}</ReactMarkdown></div>})
                                            : <div className="new-event-zone" onClick={(event) => createEvent(event, tmp_date, currMonth, currYear, 0, j)}/>}</div>)
                                    }
                                    return times;
                                })()
                            }</div>
                        </div>
                    </td>);
                date++;
            }
        }
        if (currWeekM === i)
            break;
    }

    return (
        <table className="calendar-month calendar-week">
            <thead><tr>{
                days.map((day, i) => <th key={i}>{day}</th>)
            }</tr></thead>
            <tbody>
                <tr>{row}</tr>
            </tbody>
        </table>
    );
}