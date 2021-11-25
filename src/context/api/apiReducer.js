import * as types from '../types';

const handlers = {
    [types.SHOW_LOADER]: state => ({...state, loading: true}),
    [types.FETCH_CALENDARS]: (state, {payload}) => ({...state, calendars: payload, loading: false}),
    [types.FETCH_CALENDAR]: (state, {payload}) => ({...state, calendar: payload, loading: false}),
    [types.FETCH_EVENT]: (state, {payload}) => ({...state, event: payload, loading: false}),
    [types.FETCH_USER]: (state, {payload}) => ({...state, user: payload, loading: false}),
    [types.FETCH_ME]: (state, {payload}) => ({...state, me: payload, loading: false}),
    [types.LOGIN]: (state, {isAuth}) => ({...state, isAuth: isAuth, loading: false}),
    DEFAULT: state => state
};

export const apiReducer = (state, action) => {
    const handle = handlers[action.type] || handlers.DEFAULT;
    return handle(state, action);
};