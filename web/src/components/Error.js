import React, { Component } from "react";

class Error extends Component {
  state = {
    formState: this.props.formState,
  };

  setBackgroundImage = () => {
    document.body.style.backgroundImage = "url('/background_page-withlogo.jpg')";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "#1D2681";
    document.body.style.backgroundSize = "cover"
  }

  redirectToHomepage = () => {
    try {
      this.props.history.push("/logout");
    }
    catch (e) {
      window.location.href = "/";
    }
  }

  render() {
    return (
      <div className="container">
        {(this.setBackgroundImage())}
        {this.state.formState === "Maintenance" && (
          <div className="row" style={{ margin: "10% auto" }}>
            <div style={{ width: "100%", margin: "auto", textAlign: "center" }}>
              <img src="/underconstruction_icon.png" alt="Error 404" className="error404Image" />
            </div>
            <div style={{ width: "100%", paddingTop: "1%", margin: "auto", textAlign: "center", color: "white" }}>
              <h1>We will be back soon!</h1>
              <h3>Sorry for the inconvenience but we are performing <br />
               some maintenance at the moment.</h3>
            </div>
            <img src="/underconstruction_bottom.png" alt="Error 404" className="maintenance_bottom" />
          </div>
        )}
        {this.state.formState === "Error404" && (
          <div className="row" style={{ margin: "10% auto" }}>
            <div style={{ width: "100%", margin: "auto", textAlign: "center" }}>
              <img src="/errorpage.png" alt="Error 404" className="error404Image" />
            </div>
            <div style={{ width: "100%", paddingTop: "5%", margin: "auto", textAlign: "center" }}>
              <img src="/bttn_gotohomepg.png" alt="Error 404" className="error404Image" onClick={this.redirectToHomepage} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Error;
