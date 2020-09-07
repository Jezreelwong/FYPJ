import React, { Component } from 'react';
import config from "../config.json";
import $ from "jquery";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from 'react-bootstrap/Spinner';
import CryptoJS from 'crypto-js';
var moment = require("moment");

class Profile extends Component {
  state = {
    isLoading: true,
    formState: "Edit",
    status: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    data: [],
    errors: {
      apierrors: null,
      blankfield: false,
    }
  };
  // add javascript functions here
  getAllUsers = async () => {
    var url = config.api.invokeUrl + "/user";
    await $.ajax({
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      type: 'GET',
      url: url,
      contentType: "application/json",
      success: (response) => {
        if (response["statusCode"] === 200)
          this.setState({ data: response["Users"] });
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  displayUser = () => {
    for (var i = 0; i < this.state.data.length; i++) {
      let email, firstName, lastName, performanceRating, safUnit, role, createdBy, updatedBy, status;
      let username = this.props.auth.user.preferred_username;
      let createdDate = new Date(this.state.data[i]["UserCreateDate"]);
      let updatedDate = new Date(this.state.data[i]["UserLastModifiedDate"]);
      status = (this.state.data[i]["Enabled"]) ? "Active" : "Inactive";
      let userFound = false;
      let userAttributes = this.state.data[i]["Attributes"];
      for (var j = 0; j < userAttributes.length; j++) {
        if (userAttributes[j]["Name"] === "preferred_username" && userAttributes[j]["Value"] === username)
          userFound = true;
        if (userAttributes[j]["Name"] === "email")
          email = userAttributes[j]["Value"] + " ";
        if (userAttributes[j]["Name"] === "given_name")
          firstName = userAttributes[j]["Value"] + " ";
        if (userAttributes[j]["Name"] === "family_name")
          lastName = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:performanceRating")
          performanceRating = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:safUnit")
          safUnit = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:role")
          role = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:createdBy")
          createdBy = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:updatedBy")
          updatedBy = userAttributes[j]["Value"];
      }

      if (userFound) {
        document.getElementById("DisplayUsername").innerText = username;
        document.getElementById("profileLetter").innerText = firstName.charAt(0);
        document.getElementById("DisplayEmail").innerText = email;
        document.getElementById("DisplayFirstName").innerText = firstName;
        document.getElementById("DisplayLastName").innerText = lastName;
        document.getElementById("DisplayPerformanceRating").innerText = performanceRating + "% ";
        if (performanceRating === "100") {
          document.getElementById("starone").classList.add("ratingsRed");
          document.getElementById("startwo").classList.add("ratingsRed");
          document.getElementById("starthree").classList.add("ratingsRed");
          document.getElementById("starfour").classList.add("ratingsRed");
          document.getElementById("starfive").classList.add("ratingsRed");
        }
        else if (performanceRating < "100" && performanceRating >= "80") {
          document.getElementById("starone").classList.add("ratingsRed");
          document.getElementById("startwo").classList.add("ratingsRed");
          document.getElementById("starthree").classList.add("ratingsRed");
          document.getElementById("starfour").classList.add("ratingsRed");
          document.getElementById("starfive").classList.add("ratingsBlack");
        }
        else if (performanceRating < "80" && performanceRating >= "60") {
          document.getElementById("starone").classList.add("ratingsRed");
          document.getElementById("startwo").classList.add("ratingsRed");
          document.getElementById("starthree").classList.add("ratingsRed");
          document.getElementById("starfour").classList.add("ratingsBlack");
          document.getElementById("starfive").classList.add("ratingsBlack");
        }
        else if (performanceRating < "60" && performanceRating >= "40") {
          document.getElementById("starone").classList.add("ratingsRed");
          document.getElementById("startwo").classList.add("ratingsRed");
          document.getElementById("starthree").classList.add("ratingsBlack");
          document.getElementById("starfour").classList.add("ratingsBlack");
          document.getElementById("starfive").classList.add("ratingsBlack");
        }
        else if (performanceRating < "40" && performanceRating >= "20") {
          document.getElementById("starone").classList.add("ratingsRed");
          document.getElementById("startwo").classList.add("ratingsBlack");
          document.getElementById("starthree").classList.add("ratingsBlack");
          document.getElementById("starfour").classList.add("ratingsBlack");
          document.getElementById("starfive").classList.add("ratingsBlack");
        }
        else {
          document.getElementById("starone").classList.add("ratingsBlack");
          document.getElementById("startwo").classList.add("ratingsBlack");
          document.getElementById("starthree").classList.add("ratingsBlack");
          document.getElementById("starfour").classList.add("ratingsBlack");
          document.getElementById("starfive").classList.add("ratingsBlack");
        }
        document.getElementById("DisplayRole").innerText = role;
        document.getElementById("DisplaySAFUnit").innerText = safUnit;
        document.getElementById("DisplayCreatedBy").innerText = createdBy;
        if (createdBy === null || createdBy === undefined || createdBy === "")
          document.getElementById("DisplayCreatedBy").innerText = "-";
        document.getElementById("DisplayCreatedDate").innerText = moment(createdDate).format(config.format.datetime);
        document.getElementById("DisplayUpdatedBy").innerText = updatedBy;
        document.getElementById("DisplayUpdatedDate").innerText = moment(updatedDate).format(config.format.datetime);
        document.getElementById("DisplayStatus").innerText = status;
        break
      }
    }
  }

  toggleForm = async () => {
    if (document.getElementById("CreateModal").style.display === "none") {
      this.clearFormInputs();
      await this.setState({ formState: "Edit" })
      document.getElementById("CreateModal").style.display = "block";
    }
    else
      document.getElementById("CreateModal").style.display = "none";
  }

  closeForm = (event) => {
    if (event.target.id === "CreateModal") {
      document.getElementById("CreateModal").style.display = "none";
    }
  }

  clearFormInputs = () => {
    if (document.getElementById("currentPassword") !== null)
      document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  }

  openForm = async () => {
    this.clearFormInputs();
    await this.setState({ formState: "Edit" })
    document.getElementById("CreateModal").style.display = "block";

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  matchPassword = event => {
    //console.log(this.state.newPassword)
    //console.log(this.state.confirmPassword)
    if (event.target.value !== this.state.newPassword) {
      document.getElementById("confirmPassword").title = "Password does not match";
      document.getElementById("confirmPassword").required = false;
    }
    this.setState({
      confirmPassword: event.target.value
    })
  };

  //encrypt: 
  encrypt = (data, secretkey) => {
    var encryptedData = CryptoJS.AES.encrypt(data, secretkey);
    var encryptedString = encryptedData.toString();
    return encryptedString;
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleForm = async event => {
    if (event != null)
      event.preventDefault();
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }
    else {
      var url = config.api.invokeUrl + "/user";
      let data = "";
      if (this.state.formState === "Create") {
        data = { "body": `{"CreatorEmail": "${this.props.auth.user.email}", "Email":"${this.state.email}", "Role":"${this.state.role}", "SAFUnit":"${this.state.safUnit}", "FirstName":"${this.state.first_name}", "LastName":"${this.state.last_name}"}` };
        await $.ajax({
          headers: {
            Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
          },
          type: 'PUT',
          url: url,
          data: JSON.stringify(data),
          contentType: "application/json",
          success: (response) => {
            if (!response.errorMessage) {
              window.location.reload()
            }
            else {
              if (response.errorType === "UsernameExistsException") {
                this.setState({
                  errors: {
                    ...this.state.errors,
                    cognito: { "message": response.errorMessage.replace("An error occurred (UsernameExistsException) when calling the AdminCreateUser operation: ", "") }
                  }
                });
              }
            }
          },
          error: (xhr, status, err) => {
            if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
              this.props.history.push("/logout");
          }
        });
      }
      else if (this.state.formState === "Edit") {
        if (!(this.state.newPassword === this.state.currentPassword)) {
          if (this.state.newPassword === this.state.confirmPassword) {
            var AccessToken = JSON.parse(sessionStorage.getItem("userKeys"))["AccessToken"];

            //encrypt the passwords
            const SECRET_KEY = config.secretkey;
            var encryptedCurrentPW = this.encrypt(this.state.currentPassword, SECRET_KEY);
            var encryptedNewPW = this.encrypt(this.state.newPassword, SECRET_KEY);
            var encryptedAccessToken = this.encrypt(AccessToken, SECRET_KEY);

            //send the pw to lambda
            data = { "body": `{"CurrentPassword":"${encryptedCurrentPW}", "NewPassword":"${encryptedNewPW}", "AccessToken":"${encryptedAccessToken}"}` };
            var urlChangePW = config.api.invokeUrl + "/user/changepassword";
            await $.ajax({
              headers: {
                Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
              },
              type: 'POST',
              url: urlChangePW,
              data: JSON.stringify(data),
              contentType: "application/json",
              success: (response) => {
                var responsebody = response["body"];
                console.log(JSON.stringify(response));
                if (response["statusCode"] === 200) {
                  window.location.reload();
                } else if (responsebody["message"]["code"] === "NotAuthorizedException"){
                  this.props.history.push("/logout");
                } else if (responsebody["message"]["message"] !== null) {
                  this.setState({
                    errors: {
                      ...this.state.errors,
                      cognito: {
                        message: responsebody["message"]["message"]
                      }
                    }
                  });
                }
              },
              error: (xhr, status, err) => {
                if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                  this.props.history.push("/logout");
              }
             });
          } else {
            this.setState({
              errors: {
                ...this.state.errors,
                passwordmatch: true
              }
            });
          }
        } else {
          //cannot have same new and old password
          this.setState({
            errors: {
              ...this.state.errors,
              cognito: {
                message: "New Password cannot be same as Current Password"
              }
            }
          });
        }
      }
    }
  }

  async componentDidMount() {
    this.props.auth.setNav("User");
    await this.getAllUsers();
    this.setState({ isLoading: false });
    //console.log(this.props.auth.user.preferred_username);
    //console.log(this.state.data);
  }

  async componentWillUnmount() {
    try {
      $('#DataTable').DataTable().destroy(true)
    }
    catch (e) {
      console.log(e)
    }
  }

  render() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/logout");
      return (<div></div>);
    }
    else {
      return (
        <div className="container-fluid p-0">
          <script>
            {(document.body.style.backgroundColor = "#EEEEEE")}
          </script>
          <div className="row p-3 mr-0" id="main-content">
            {this.displayUser()}
            <p className="table-title">USER PROFILE</p>
            <div className="data-div shadow bg-white">
              <div className="data-table-div m-3">
                <div style={{ float: "right", color: "#aaa" }}>
                  <span style={{ height: "13px", width: "13px", borderRadius: "50%", display: "inline-block", backgroundColor: "green", marginRight: "5px" }}></span>
                  <span id="DisplayStatus" />
                </div>
                <br />
                <div>
                  <div className="row">
                    <div className="col-4" style={{ borderRight: "2px solid #ccc" }}>
                      <center>
                        <b
                          id="profilePic"
                          style={{
                            height: "100px",
                            width: "100px",
                            borderRadius: "50%",
                            backgroundColor: "#42D0BA",
                            display: "inline-block",
                            lineHeight: "100px",
                            fontSize: "45px",
                            color: "#fff",
                            textAlign: "center"
                          }}>
                          <span id="profileLetter" /></b>
                        <div className="col-sm-6"> <b><span id="DisplayUsername" /></b></div>
                        <br />
                        <div><p>Performance Ratings</p>
                          <hr style={{ width: "90%", border: "1px solid red" }} /></div>
                        <div>
                          <span style={{ fontSize: "40px" }} id="DisplayPerformanceRating" />
                          <span className="ratingsBlack" class="fa fa-star" id="starone" />
                          <span className="ratingsBlack" class="fa fa-star" id="startwo" />
                          <span className="ratingsBlack" class="fa fa-star" id="starthree" />
                          <span className="ratingsBlack" class="fa fa-star" id="starfour" />
                          <span className="ratingsBlack" class="fa fa-star" id="starfive" />
                        </div>
                      </center>
                    </div>
                    <div className="col-8">
                      <br />
                      <div>
                        <span style={{ color: "#aaa" }}>User Profile</span>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <span>First Name : </span>
                          <b id="DisplayFirstName" />
                        </div>
                        <div className="col-6">
                          <span>Last Name : </span>
                          <b id="DisplayLastName" />
                        </div>
                        <div className="col-6">
                          <span>Email : </span>
                          <b id="DisplayEmail" />
                        </div>
                      </div>
                      <br />
                      <div style={{ color: "#aaa" }}>
                        <span>Credentials</span>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <span>Role : </span>
                          <b id="DisplayRole" />
                        </div>
                        <div className="col-6">
                          <span>SAF Unit : </span>
                          <b id="DisplaySAFUnit" />
                        </div>
                      </div>
                      <br />
                      <div>
                        <span style={{ color: "#aaa" }}>Account</span>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <span>Created By : </span>
                          <b id="DisplayCreatedBy" />
                        </div>
                        <div className="col-6">
                          <span>Created Date : </span>
                          <b id="DisplayCreatedDate" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <span>Updated By : </span>
                          <b id="DisplayUpdatedBy" />
                        </div>
                        <div className="col-6">
                          <span>Updated Date : </span>
                          <b id="DisplayUpdatedDate" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <button onClick={this.openForm} className="btn btn-block btn-outline-primary"><b>Change Password</b></button>
                <br />
              </div>
              {this.state.isLoading && (<div className="text-center m-3">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>)}
            </div>

            <div className="form-modal" onClick={this.closeForm} style={{ display: "none" }} id="CreateModal">
              <form autoComplete="off" onSubmit={this.handleForm} className="form-content animate pl-3 pr-3">
                <span onClick={this.toggleForm} className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>Change Password</h5>
                </div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">
                  <div className="col-12">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input className="form-control mb-3" type="password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                      required onChange={this.onInputChange} id="currentPassword"></input></div>
                  <div className="col-12">
                    <label htmlFor="newPassword">New Password:</label>
                    <input className="form-control mb-3"
                      type="password"
                      required
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                      onChange={this.onInputChange} id="newPassword"></input></div>
                  <div className="col-12">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input className="form-control mb-3" type="password"
                      required onChange={this.matchPassword} id="confirmPassword"></input></div>
                </div>
                <div className="row" style={{ backgroundColor: "#f1f1f1" }}>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-2 mt-2"><button type="reset" className="btn btn-block btn-outline-danger">Clear <i className="far fa-window-close"></i></button></div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-2 mt-2"><button type="submit" className="btn btn-block btn-success">Change Password <i className="far fa-edit"></i></button></div>
                </div>
              </form>
            </div>
            {/* add content here */}
          </div>
        </div>
      );
    }
  }
}

export default Profile;