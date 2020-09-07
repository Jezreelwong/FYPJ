import React, { Component } from 'react';

export default class Navbar extends Component {
    state = {
        navOpen: true
    }
    handleLogOut = () => {
        window.location.href = "/logout";
    }
    handleProfile = () => {
        window.location.href = "/profile";
    }

    toggleNav = () => {
        if (this.state.navOpen) {
            if (document.getElementById("main-content") !== null)
                document.getElementById("main-content").style.marginLeft = "50px";
            this.setState({ navOpen: false })
        }
        else {
            if (document.getElementById("main-content") !== null)
                document.getElementById("main-content").style.marginLeft = "235px";
            this.setState({ navOpen: true })
        }
    }

    render() {
        if (!this.props.auth.isAuthenticated) {
            return (
                <nav className="my-navbar bg-white sticky-top">
                    <a className="my-navbar-brand" href="/">
                        <div className="brand-div-bigger text-dark">
                            <img alt="" src="logo.png" width="70" height="70" />
                            Sea Transportation E Portal Services (STEPS)
                        </div>
                    </a>
                </nav>
            )
        }
        else {
            return (
                <div>
                    <nav className="my-navbar bg-white sticky-top" style={{ textAlign: "left" }}>
                        {!this.state.navOpen && (<div className="openNavDiv"><span className="openNav" onClick={this.toggleNav}>&#9776;</span></div>)}
                        <a className="my-navbar-brand" href="/">
                            {(this.state.navOpen === true)
                                ? <div className="brand-div" style={{ backgroundColor: "#42D1B6" }}>
                                    <img alt="" src="logo.png" width="70" height="70" />
                                    STEPS
                                </div>
                                : <div className="brand-div text-dark">
                                    <img alt="" src="logo.png" width="70" height="70" />
                                    STEPS
                                </div>
                            }
                        </a>
                        <button className="my-navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fas fa-bars"></i>
                        </button>
                        <button title="Logout" className="log-out align-items-center" onClick={this.handleLogOut} type="image" src="logout.png">
                            <img alt="" src="logout.png" height="30px" width="30px" className="mr-2" />
                        </button>
                        <button className="profile align-items-center"  onClick={this.handleProfile}>
                            <img alt="" src="userprofile.png" height="30px" width="30px" className="mr-2"/>Hello {this.props.auth.user.preferred_username}!
                        </button>
                        <div className="my-navbar-collapse collapse" id="navbarSupportedContent">
                            <ul className="my-navbar-nav mr-auto">
                                <li className="my-nav-item my-active">
                                    <p className="nav-link align-items-center d-flex mb-0" data-toggle="collapse" data-target="#ProfileDiv" aria-controls="ProfileDiv" aria-expanded="false" aria-label="Toggle navigation"><img alt="" src="userprofile.png" height="20px" width="20px" className="mr-2" />{this.props.auth.user.preferred_username}<i className="ml-3 fas fa-arrows-alt-v"></i></p>
                                    <div className="collapse" id="ProfileDiv">
                                        <span className="my-nav-item my-active">
                                            <a className="nav-link" href="/profile">View profile</a>
                                        </span>
                                        <span className="my-nav-item my-active" onClick={this.handleLogOut}>
                                            <a className="nav-link" href="/logout"><img alt="" src="logout.png" height="10px" width="10px" className="mr-2" />Log Out</a>
                                        </span>
                                    </div>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "FollowUp") ? { backgroundColor: "orangered" } : {}} href="/follow-up"><img alt="" src="follow-up.png" height="20px" width="20px" className="mr-2" />Follow Up</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Booking") ? { backgroundColor: "orangered" } : {}} href="/booking"><img alt="" src="booking.png" height="20px" width="20px" className="mr-2" />Booking</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Schedule") ? { backgroundColor: "orangered" } : {}} href="/schedule"><img alt="" src="schedule.png" height="20px" width="20px" className="mr-2" />Schedule</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Purpose") ? { backgroundColor: "orangered" } : {}} href="/purpose"><img alt="" src="purpose.png" height="20px" width="20px" className="mr-2" />Purpose</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "User") ? { backgroundColor: "orangered" } : {}} href="/users"><img alt="" src="users.png" height="20px" width="20px" className="mr-2" />Users</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Vehicle") ? { backgroundColor: "orangered" } : {}} href="/vehicle"><img alt="" src="vehicles.png" height="20px" width="20px" className="mr-2" />Vehicle</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "FerryGuideline") ? { backgroundColor: "orangered" } : {}} href="/ferry-guidelines"><img alt="" src="ferryguidelines.png" height="20px" width="20px" className="mr-2" />Ferry Guideline</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Announcement") ? { backgroundColor: "orangered" } : {}} href="/announcement"><img alt="" src="announcements.png" height="20px" width="20px" className="mr-2" />Announcement</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Route") ? { backgroundColor: "orangered" } : {}} href="/route"><img alt="" src="route.png" height="20px" width="20px" className="mr-2" />Route</a>
                                </li>
                                <li className="my-nav-item my-active">
                                    <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "ServiceProvider") ? { backgroundColor: "orangered" } : {}} href="/service-provider"><img alt="" src="sp.png" height="20px" width="20px" className="mr-2" />Service Provider</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    {(!this.state.navOpen)
                        ?<div className="minisidenav">
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "FollowUp") ? { backgroundColor: "orangered" } : {}} href="/follow-up"><img alt="" src="follow-up.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Booking") ? { backgroundColor: "orangered" } : {}} href="/booking"><img alt="" src="booking.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Schedule") ? { backgroundColor: "orangered" } : {}} href="/schedule"><img alt="" src="schedule.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Purpose") ? { backgroundColor: "orangered" } : {}} href="/purpose"><img alt="" src="purpose.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "User") ? { backgroundColor: "orangered" } : {}} href="/users"><img alt="" src="users.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Vehicle") ? { backgroundColor: "orangered" } : {}} href="/vehicle"><img alt="" src="vehicles.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "FerryGuideline") ? { backgroundColor: "orangered" } : {}} href="/ferry-guidelines"><img alt="" src="ferryguidelines.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Announcement") ? { backgroundColor: "orangered" } : {}} href="/announcement"><img alt="" src="announcements.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Route") ? { backgroundColor: "orangered" } : {}} href="/route"><img alt="" src="route.png" height="20px" width="20px" /></a>
                            <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "ServiceProvider") ? { backgroundColor: "orangered" } : {}} href="/service-provider"><img alt="" src="sp.png" height="20px" width="20px" /></a>
                        </div> 
                        :<div className="sidenav">
                            <div style={{ paddingTop: "20px", width: "225px", display: "inline-block", float: "left" }}>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "FollowUp") ? { backgroundColor: "orangered" } : {}} href="/follow-up"><img alt="" src="follow-up.png" className="mr-2" height="20px" width="20px" />Follow Up</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Booking") ? { backgroundColor: "orangered" } : {}} href="/booking"><img alt="" src="booking.png" className="mr-2" height="20px" width="20px" />Booking</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Schedule") ? { backgroundColor: "orangered" } : {}} href="/schedule"><img alt="" src="schedule.png" className="mr-2" height="20px" width="20px" />Schedule</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Purpose") ? { backgroundColor: "orangered" } : {}} href="/purpose"><img alt="" src="purpose.png" className="mr-2" height="20px" width="20px" />Purpose</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "User") ? { backgroundColor: "orangered" } : {}} href="/users"><img alt="" src="users.png" className="mr-2" height="20px" width="20px" />Users</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Vehicle") ? { backgroundColor: "orangered" } : {}} href="/vehicle"><img alt="" src="vehicles.png" className="mr-2" height="20px" width="20px" />Vehicle</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "FerryGuideline") ? { backgroundColor: "orangered" } : {}} href="/ferry-guidelines"><img alt="" src="ferryguidelines.png" className="mr-2" height="20px" width="20px" />Ferry Guideline</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Announcement") ? { backgroundColor: "orangered" } : {}} href="/announcement"><img alt="" src="announcements.png" className="mr-2" height="20px" width="20px" />Announcement</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "Route") ? { backgroundColor: "orangered" } : {}} href="/route"><img alt="" src="route.png" className="mr-2" height="20px" width="20px" />Route</a>
                                <a className="nav-link align-items-center d-flex" style={(this.props.auth.navActive === "ServiceProvider") ? { backgroundColor: "orangered" } : {}} href="/service-provider"><img alt="" src="sp.png" className="mr-2" height="20px" width="20px" />Service Provider</a></div>
                            <div className="closeNavDiv"><span onClick={this.toggleNav}>|</span></div>
                        </div>
                    }
                </div>
            )
        }
    }
}
