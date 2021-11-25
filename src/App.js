import React from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Toaster} from "./components/Toaster";
import {Helmet} from 'react-helmet'
import {Navbar} from './components/Navbar';
import {Footer} from "./components/Footer";
import {Home} from "./pages/Home";
import {Profile} from './pages/Profile';
import {ApiState} from "./context/api/ApiState";
import {EditUser} from './pages/EditUser'
import {Calendar} from './pages/Calendar';
import {Calendars} from './pages/Calendars';
import {CreateCalendar} from "./pages/CreditCalendar";
import {EditCalendar} from "./pages/CreditCalendar";
import {CreateEvent} from './pages/Event';
import {EditEvent} from './pages/Event';
import {Login} from "./pages/Login";
import {Registration} from "./pages/Registration";
import {PasswordReset} from "./pages/PasswordReset";

function App() {
  return (
      <ApiState>
          <BrowserRouter>
              <Helmet defaultTitle="Chronos" titleTemplate="%s ∣ Chronos"/>
              <div>
                  <Navbar/>
                  <Switch>
                      <Route path={'/'} exact component={Home}/>
                      <Route path={'/calendars'} exact component={Calendars}/>
                      <Route path={'/calendars/create'} exact component={CreateCalendar}/>
                      <Route path={'/calendars/:id'} exact component={Calendar}/>
                      <Route path={'/calendars/:id/edit'} exact component={EditCalendar}/>
                      <Route path={'/calendars/:id/create'} exact component={CreateEvent}/>
                      <Route path={'/events/:id'} component={EditEvent}/>
                      <Route path={'/profile'} exact component={Profile}/>
                      <Route path={'/settings'} exact component={EditUser}/>
                      <Route path={'/login'} first component={Login}/>
                      <Route path={'/registration'} first component={Registration}/>
                      <Route path={'/password-reset'} exact component={PasswordReset}/>
                      <Route path={'/password-reset/:token'} exact component={PasswordReset}/>
                  </Switch>
                  <Toaster/>
              </div>
              <Footer/>
          </BrowserRouter>
      </ApiState>
  );
}

export default App;
