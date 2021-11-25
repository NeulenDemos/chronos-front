import React, {useReducer} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {ApiContext} from './apiContext';
import {apiReducer} from './apiReducer';
import * as types from '../types';
import {apiUrl, eventColors} from "../utils";
import toast from 'react-hot-toast';


export const ApiState = ({children}) => {
    const [state, dispatch] = useReducer(apiReducer, {loading: false});

    const showLoader = () => dispatch({type: types.SHOW_LOADER});

    const fetchCalendars = async () => {
        showLoader();
        const res = await axios.get(`${apiUrl}/calendars`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        const payload = res.data;
        dispatch({type: types.FETCH_CALENDARS, payload});
    };

    const fetchEvent = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/events/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        const payload = {...res.data, id};
        dispatch({type: types.FETCH_EVENT, payload});
    };

    const fetchCalendar = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/calendars/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        const payload = res.data;
        dispatch({type: types.FETCH_CALENDAR, payload});
    };

    const fetchUser = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/users/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        const payload = res.data;
        dispatch({type: types.FETCH_USER, payload});
    };

    const searchEvents = async (data, callback) => {
        const res = await axios.get(`${apiUrl}/events?search=${data}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        callback(res.data.map(event => ({label: <a href={`/events/${event.id}`}>{event.title}</a> , value: event.id})));
    }

    const fetchMe = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/me`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
            const payload = res.data;
            Cookies.set('me', JSON.stringify(payload), {sameSite: 'strict'});
            dispatch({type: types.FETCH_ME, payload});
        }
        catch (e) {
            if (state.isAuth) {
                dispatch({type: types.LOGIN, isAuth: false});
                Cookies.remove('me');
                Cookies.remove('token');
            }
        }
    };

    const login = async ({email, pass}) => {
        let success = true;
        const res = await axios.post(`${apiUrl}/auth/login`, {email, password: pass})
            .catch(() => success=false);
        if (!success) {
            toast.error("Incorrect email or password");
            dispatch({type: types.LOGIN, isAuth: false});
            return;
        }
        Cookies.set('token', res.data["access_token"], {expires: (res.data["expires_in"] / 86400), sameSite: 'strict'});
        dispatch({type: types.LOGIN, isAuth: true});
        await fetchMe();
    }

    const register = async ({email, username, name, pass}) => {
        let success = true;
        await axios.post(`${apiUrl}/auth/register`, {email, login: username, name, password: pass})
            .catch(e => {toast.error(e.response.data.error); success=false;});
        if (success) {
            await dispatch({type: types.REGISTER, success: true});
            await login({email, pass});
            await createCalendar({title: 'Holidays', description: 'Default holidays calendar', primary: true});
        }
    }

    const logout = async () => {
        let success = true;
        await axios.post(`${apiUrl}/auth/logout`, null, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}})
            .catch(() => success=false);
        if (!success) {
            toast.error("An error occurred");
            return;
        }
        Cookies.remove('me');
        Cookies.remove('token');
        dispatch({type: types.LOGIN, isAuth: false});
        toast.success("Successfully logged out");
    }

    const passwordReset = async ({email, token, password}) => {
        if (token && password)
            await axios.post(`${apiUrl}/auth/password-reset/${token}`, {password});
        else
            await axios.post(`${apiUrl}/auth/password-reset`, {email});
    }

    const refreshAuth = async () => {
        if (!state.isAuth && Cookies.get('token'))
            dispatch({type: types.LOGIN, isAuth: true});
    }

    const createCalendar = async ({title, description, primary=false, users, callback, cb_args}) => {
        const res = await axios.post(`${apiUrl}/calendars`,
            {title, description, primary}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (users)
            users.forEach(guest => addUserToCalendar(res.data["id"], guest.id));
        if (callback)
            callback(...cb_args);
    }

    const createEvent = async ({calendar_id, title, type, start_dt, all_day, description = null, end_dt = 0, color = eventColors[0], users, callback, cb_args}) => {
        const res = await axios.post(`${apiUrl}/calendars/${calendar_id}/event`,
            {title, description, type, start_dt, end_dt, all_day, color}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (users)
            users.forEach(guest => addUserToEvent(res.data["id"], guest.id));
        if (callback)
            callback(...cb_args);
    }

    const editCalendar = async ({id, title, description, hidden, users, callback, cb_args}) => {
        let data = {};
        if (title) data.title = title;
        if (description) data.description = description;
        if (hidden !== undefined) data.hidden = hidden;
        await axios.patch(`${apiUrl}/calendars/${id}`, data, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (users)
            users.forEach(guest => guest.has_been ? editUserToCalendar(id, guest.id, guest.permissions) : addUserToCalendar(id, guest.id, guest.permissions));
        if (callback)
            callback(...cb_args);
    }

    const editEvent = async ({id, title, description, type, start_dt, end_dt, all_day, color, users, callback, cb_args}) => {
        let data = {};
        if (title) data.title = title;
        if (description) data.description = description;
        if (type) data.type = type;
        if (start_dt) data.start_dt = start_dt;
        if (end_dt !== undefined) data.end_dt = end_dt;
        if (all_day !== undefined) data.all_day = all_day;
        if (color) data.color = color;
        await axios.patch(`${apiUrl}/events/${id}`, data, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (users)
            users.forEach(guest => addUserToEvent(id, guest.id));
        if (callback)
            callback(...cb_args);
    }

    const addUserToCalendar = async (id, user_id, permissions) => {
        await axios.post(`${apiUrl}/calendars/${id}/user`,
            {user_id, permissions}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const addUserToEvent = async (id, user_id) => {
        await axios.post(`${apiUrl}/events/${id}/user`,
            {user_id}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const editUserToCalendar = async (id, user_id, permissions) => {
        await axios.patch(`${apiUrl}/calendars/${id}/user`, {user_id, permissions}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const deleteCalendar = async (id, callback, cb_args) => {
        await axios.delete(`${apiUrl}/calendars/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (callback)
            callback(...cb_args);
    }

    const deleteEvent = async (id, callback, cb_args) => {
        await axios.delete(`${apiUrl}/events/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (callback)
            callback(...cb_args);
    }

    const editAvatar = async (image) => {
        const formData = new FormData();
        formData.append("image", image);
        await axios.post(`${apiUrl}/users/avatar`, formData, {headers: {Authorization: `Bearer ${Cookies.get('token')}`, 'Content-Type': 'multipart/form-data'}});
    }

    const editUser = async ({data, callback, cb_args}) => {
        await axios.patch(`${apiUrl}/users/update`, data, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (callback)
            callback(...cb_args);
    }

    const resetHooks = (hooks) => {
        hooks.forEach(hook => {
            switch (hook) {
                case state.user: dispatch({type: types.FETCH_USER, payload: null}); break;
                case state.calendars: dispatch({type: types.FETCH_CALENDARS, payload: null}); break;
                case state.calendar: dispatch({type: types.FETCH_CALENDAR, payload: null}); break;
                case state.event: dispatch({type: types.FETCH_EVENT, payload: null}); break;
                default: break;
            }
        });
    }

    return (
        <ApiContext.Provider value={{
            showLoader,
            fetchCalendars,
            fetchCalendar,
            fetchEvent,
            fetchUser,
            searchEvents,
            login,
            logout,
            register,
            passwordReset,
            refreshAuth,
            fetchMe,
            createCalendar,
            createEvent,
            editCalendar,
            deleteCalendar,
            editEvent,
            deleteEvent,
            editAvatar,
            editUser,
            addUserToCalendar,
            addUserToEvent,
            editUserToCalendar,
            resetHooks,

            loading: state.loading,
            calendars: state.calendars,
            calendar: state.calendar,
            event: state.event,
            user: state.user,
            isAuth: state.isAuth,
            isReg: state.isReg,
            isErr: state.isErr,
            me: state.me,
        }}>
            {children}
        </ApiContext.Provider>
    )
}