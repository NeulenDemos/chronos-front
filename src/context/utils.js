import React from "react";


export const eventColors = [
    "#cc2714",
    "#cc5b14",
    "#cc9214",
    "#0f9962",
    "#143fcc",
    "#5e14cc",
    "#5e5e5e"];

export const eventColorsLight = [
    "#ff8a80",
    "#ffb080",
    "#ffd780",
    "#66cca3",
    "#809dff",
    "#aa80ff",
    "#9a9a9a"];

export const appUrl = "https://chronos.neulen.dev" // process.env.APP_URL
export const apiUrl = "https://chronos-back.vercel.app";
export const storageUrl = appUrl + "/storage";
export const emailRegexp = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/g;
export const passRegexp = /^.{8,}$/g;
export const categories = ['arrangement', 'reminder', 'task'];
export const catColors = {'arrangement': eventColors[0], 'reminder': eventColors[3], 'task': eventColors[4]};
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const permissions = ['None', 'Read', 'Write', 'Delete', 'Creator'];
export const permissionsColors = ['var(--su-gray)', 'var(--su-gray)', 'var(--su-green)', 'var(--su-orange)', 'var(--su-purple)'];

export function getDateString(str, squeeze=false) {
    const date = new Date(str);
    if (squeeze)
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.toLocaleTimeString()}`;
}

export function fmtTime(dt, md=false) {
    if (!dt) return null;
    if (typeof dt === 'number')
        dt = new Date(dt * 1000);
    let h = dt.getHours();
    let m = dt.getMinutes();
    if (m < 10) m = '0' + m;
    if (h < 10) h = '0' + h;
    if (md) return `\`${h}:${m}\``;
    return `${h}:${m}`;
}

export function fmtDateISO(dt) {
    if (!dt) return null;
    if (typeof dt === 'number')
        dt = new Date(dt * 1000);
    let d = dt.getDate();
    let m = dt.getMonth() + 1;
    let y = dt.getFullYear();
    if (d < 10) d = '0' + d;
    if (m < 10) m = '0' + m;
    return `${y}-${m}-${d}`;
}
export function timestampToDate(timestamp) {
    if (typeof timestamp === 'number')
        return new Date(timestamp * 1000);
    return timestamp;
}
export function daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
}
export function weeksInMonth(month, year) {
    return Math.ceil((new Date(year, month, 1).getDay() + 6 + daysInMonth(month, year)) / 7) - 1;
}
export function weekNum({date, month, year}) {
    if (!date && Number.isInteger(month) && year) {
        if (month === 0)
            return 1;
        date = new Date(year, month, 1);
    }
    let dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
export function weeksInYear(year) {
    return weekNum(new Date(year, 11, 31)) === 1 ? 52 : 53;
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function useViewport() {
    const [width, setWidth] = React.useState(window.innerWidth);
    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
    return width;
}
