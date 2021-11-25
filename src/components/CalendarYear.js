import {daysInMonth, months, days} from "../context/utils";


export const CalendarYear = ({currYear}) => {
    const today = new Date();
    let rows_month = [];
    let currMonth = 0;
    for (let m = 0; m < 3; m++) {
        let row_month = [];
        for (let mr = 0; mr < 4; mr++) {
            const curr_date = new Date(currYear, currMonth);
            const curr_month_last_day = daysInMonth(currMonth, currYear);
            let rows_weeks = [];
            let date = 1;
            let ended = false;
            for (let i = 0; i < 6; i++) {
                let row = [];
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < (curr_date.getDay() === 0 ? 6 : curr_date.getDay() - 1)) {
                        row.push(<td className="day"/>);
                    } else if (date > curr_month_last_day) {
                        row.push(<td className="day"/>);
                        if (j === 0) ended = true;
                        date++;
                    } else {
                        const is_today = date === today.getDate() && currYear === today.getFullYear() && currMonth === today.getMonth();
                        row.push(<td className={is_today ? "day today" : "day"}>{date}</td>);
                        date++;
                    }
                }
                if (ended) break;
                rows_weeks.push(row);
            }
            row_month.push(
                <td>
                    <div className="month-name"><span>{months[currMonth]}</span></div>
                    <table className="calendar-month">
                    <thead>
                        <tr>{days.map((day, i) => <th key={i}>{day}</th>)}</tr>
                    </thead>
                    <tbody>{rows_weeks.map((row, i) => <tr key={i}>{row}</tr>)}</tbody>
                </table></td>
            );
            currMonth++;
        }
        rows_month.push(row_month);
    }

    return (
        <table className="calendar-month calendar-year">
            <tbody>{
                rows_month.map((row, i) => <tr key={i}>{row}</tr>)
            }</tbody>
        </table>
    );
}