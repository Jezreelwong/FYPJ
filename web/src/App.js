import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-confirmation2";
import "popper.js/dist/popper.min.js";
import Navbar from "./components/Navbar";
import LogIn from "./components/authentication/Login";
import LogOut from "./components/authentication/Logout";
import Dashboard from "./components/Dashboard";
import FollowUp from "./components/FollowUp";
import Booking from "./components/Booking";
import Schedule from "./components/Schedule";
// import Purpose from "./components/Purpose";
import Purpose2 from "./components/Purpose2";
import Users from "./components/Users";
import Vehicle from "./components/Vehicle";
import FerryGuidelines from "./components/FerryGuidelines";
import Announcements from "./components/Announcements";
import RoutePage from "./components/Route";
import Profile from "./components/Profile";
import ServiceProvider from "./components/ServiceProvider";
import Error from "./components/Error";
import "@fortawesome/fontawesome-free/css/all.css";
import config from "./config.json";
import ScheduleTemplate from "./components/ScheduleTemplate";

class App extends Component {
  state = {
    navActive: "",
    isAuthenticated: false,
    isAuthenticating: true,
    user: null,
  };

  refreshUser = async () => {
    let url = config.api.invokeUrl + "/user/login";
    let data = { "body": `{"RefreshToken": "${JSON.parse(sessionStorage.getItem("userKeys"))["RefreshToken"]}"}` };

    await $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (response) => {
        if (!response.errorMessage) {
          let responseBody = JSON.parse(response["body"]);
          if (!responseBody["ChallengeName"]) {
            sessionStorage.setItem('userData', JSON.stringify(responseBody["userData"]));
            sessionStorage.setItem('userKeys', JSON.stringify(responseBody["keys"]));
            this.setAuthStatus(true);
            this.setUser(JSON.parse(sessionStorage.getItem("userData")));
          }
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  setAuthStatus = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  };

  setUser = (user) => {
    this.setState({ user: user });
  };

  setNav = (option) => {
    this.setState({ navActive: option });
  };

  async componentDidMount() {
    if (sessionStorage.getItem("userData") !== null) {
      // await this.refreshUser();
      this.setAuthStatus(true);
      this.setUser(JSON.parse(sessionStorage.getItem("userData")));
    }
    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      navActive: this.state.navActive,
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser,
      setNav: this.setNav,
    };
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <Router>
            <div>
              <Navbar auth={authProps} />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => <LogIn {...props} auth={authProps} formState="Login"/>}
                />
                <Route
                  exact
                  path="/login"
                  render={(props) => <LogIn {...props} auth={authProps} formState="Login"/>}
                />
                <Route
                  exact
                  path="/forget"
                  render={(props) => <LogIn {...props} auth={authProps} formState="Forget"/>}
                />
                <Route
                  exact
                  path="/logout"
                  render={(props) => <LogOut {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/dashboard"
                  render={(props) => <Dashboard {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/follow-up"
                  render={(props) => <FollowUp {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/booking"
                  render={(props) => <Booking {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/schedule"
                  render={(props) => <Schedule {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/purpose"
                  render={(props) => <Purpose2 {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/users"
                  render={(props) => <Users {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/vehicle"
                  render={(props) => <Vehicle {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/ferry-guidelines"
                  render={(props) => (
                    <FerryGuidelines {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/announcement"
                  render={(props) => (
                    <Announcements {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/route"
                  render={(props) => <RoutePage {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/profile"
                  render={(props) => <Profile {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/service-provider"
                  render={(props) => <ServiceProvider {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/schedule-template"
                  render={(props) => <ScheduleTemplate {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/error"
                  render={(props) => <Error {...props} auth={authProps} formState="Error404"/>}
                />
                <Route
                  exact
                  path="/maintenance"
                  render={(props) => <Error {...props} auth={authProps} formState="Maintenance"/>}
                />
                <Route
                  render={(props) => <Error {...props} auth={authProps} formState="Error404"/>}
                />
              </Switch>
            </div>
          </Router>
        </div>
      )
    );
  }
}

export default App;
