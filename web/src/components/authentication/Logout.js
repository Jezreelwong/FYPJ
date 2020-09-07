import React, { Component } from 'react';

class Logout extends Component {

    async componentDidMount() {
        try {
            sessionStorage.clear('userData');
            sessionStorage.clear('userKeys');
            sessionStorage.clear("vehicleRPLData");
            sessionStorage.clear("vehicleRPLList");
            sessionStorage.clear("routePData");
            sessionStorage.clear("routePList");
            sessionStorage.clear("routeRPLData");
            sessionStorage.clear("routeRPLList");
            sessionStorage.clear("purposePData");
            sessionStorage.clear("purposePList");
            sessionStorage.clear("purposeRPLData");
            sessionStorage.clear("purposeRPLList");
            sessionStorage.clear("bookingUnitList");
            await this.props.auth.setAuthStatus(false);
            window.location.href = "/";
        } catch (error) {
            window.location.href = "/";
        }
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Logout;