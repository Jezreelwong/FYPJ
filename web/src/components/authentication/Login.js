import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import config from "../../config";
import $ from "jquery";
import CryptoJS from 'crypto-js';
import OtpInput from 'react-otp-input';
const SECRET_KEY = config.secretkey;

class LogIn extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    newpassword: "",
    confirmpassword: "",
    forgetcode: "",
    firstpassword: "",
    confirmfirstpassword: "",
    verificationcode: "",
    formState: this.props.formState,
    user: null,
    preferredusername: "",
    currentusername: "",
    session: "",
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false
    },
    number1: null,
    number2: null,
    number3: null,
    number4: null,
    number5: null,
    number6: null,
    otp: '',
  };

  timerForget30 = () => {
    var timeLeft = 30;
    var elem = document.getElementById('resendCode');
    elem.disabled = true;
    elem.className = "text-secondary btn btn-link";
    elem.innerText = "Code resend available in " + timeLeft + " seconds"
    elem.style.cursor = "default";
    var timerId = setInterval(() => {
      if (timeLeft === 0) {
        clearTimeout(timerId);
        elem.disabled = false;
        elem.className = "text-info btn btn-link";
        elem.innerText = "Send Code Again?"
        elem.style.cursor = "pointer";
      } else {
        elem.innerText = "Code resend available in " + timeLeft + ' seconds';
        timeLeft--;
      }
    }, 1000);
  }

  timerMFA30 = () => {
    //call sendOTP first
    var dataSendOTP = { email: this.state.email };
    var urlSendOTP = config.api.invokeUrl + "/user/sendotp";
    console.log("to be sent to server " + JSON.stringify(dataSendOTP));
    $.ajax({
      type: 'POST',
      url: urlSendOTP,
      data: JSON.stringify(dataSendOTP),
      contentType: "application/json",
      success: (response) => {
        var addedRows = JSON.parse(response.body)["body"]["addedRows"];
        var updatedRows = JSON.parse(response.body)["body"]["updatedRows"];
        if ((updatedRows === 1 && addedRows === 0) || (updatedRows === 0 && addedRows === 1)) {
          document.getElementById("form-error").innerText = "A new OTP has been sent, please check your email and enter the OTP below";

          //change the text and start the timer
          var timeLeft = 30;
          var elem2 = document.querySelector('.OTP-text');
          elem2.disabled = true;
          elem2.className = "text-white btn btn-link";
          elem2.innerHTML = "OTP resend available in <span id='resendMFA'></span> secs";
          var elem = document.getElementById('resendMFA');
          elem.innerText = timeLeft;
          elem2.style.cursor = "default";
          var timerId = setInterval(() => {
            if (timeLeft === 0) {
              clearTimeout(timerId);
              elem2.disabled = false;
              elem2.className = "text-info btn btn-link OTP-text";
              elem2.innerText = "Send Code Again?"
              elem2.style.cursor = "pointer";
            } else {
              elem.innerText = timeLeft;
              timeLeft--;
            }
          }, 1000);
        } else {
          document.getElementById("form-error").innerText = "OTP could not be sent, please try again later, if this problem persists, please contact the administrator";
          //console.log(JSON.stringify(response));
        }
      }
    });
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false
      }
    });
  };

  setBackgroundImage = () => {
    document.body.style.backgroundImage = "url('/background_image.jpg')";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "#1D2681";
    document.body.style.backgroundSize = "cover"
  }

  removeBackgroundImage = () => {
    document.body.style.backgroundImage = "";
    document.body.style.backgroundPosition = "";
    document.body.style.backgroundRepeat = "";
    document.body.style.backgroundAttachment = "";
    document.body.style.backgroundSize = ""
  }

  changeFormState = (event) => {
    this.setState({ formState: event.target.id });
  }

  changeFormOTP = async () => {
    await this.setState({ formState: "2FA" });
    this.timerMFA30();
  }

  sendForgetCode = () => {
    var url = config.api.invokeUrl + "/user/forget";
    var data = { "body": `{"UserInfo": "${this.state.email}"}` };

    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: async (response) => {
        if (response["statusCode"] === 200) {
          this.setState({ formState: "Confirm" });
          this.timerForget30();
        } else {
          document.getElementById("form-error").innerText = response["body"]["message"];
        }
      },
    });
  }

  //encrypt: 
  encrypt = (data, secretkey) => {
    var encryptedData = CryptoJS.AES.encrypt(data, secretkey);
    var encryptedString = encryptedData.toString();
    return encryptedString;
  }

  //decrypt: 
  decrypt = (data, secretkey) => {
    var decryptedData = CryptoJS.AES.decrypt(data, secretkey);
    var decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  }

  handleSubmit = async event => {
    if (event != null)
      event.preventDefault();
    this.clearErrorState();
    if (document.getElementById("loginMessage") !== null) {
      document.getElementById("loginMessage").innerText = "Welcome!";
      document.getElementById("loginMessage").style.color = "";
    }
    document.getElementById("form-error").innerText = "";
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }
    else {
      if (this.state.formState === "Login") {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;


        //bypass 2FA for lionadmin, please remove before actual usage
        if (username === "lionadmin") {
          //call the old login and bypass 2FA
          var urlAdmin = config.api.invokeUrl + "/user/login";
          var userBody = this.encrypt(`{"UserInfo": "${username}", "UserPass": "${password}"}`, SECRET_KEY);
          let loginData = { "body": userBody };
          $.ajax({
            type: 'POST',
            url: urlAdmin,
            data: JSON.stringify(loginData),
            contentType: "application/json",
            success: (response) => {
              if (response["statusCode"] === 200) {
                if (!response["body"]["ChallengeName"]) {
                  let responseBody = JSON.parse(response["body"]);
                  if (responseBody["userData"]["custom:role"] === "A") {
                    this.props.auth.setUser(responseBody["userData"]);
                    sessionStorage.setItem('userData', JSON.stringify(responseBody["userData"]));
                    sessionStorage.setItem('userKeys', JSON.stringify(responseBody["keys"]));
                    this.props.auth.setAuthStatus("true");
                    window.location.href = "/dashboard"
                  }
                  else {
                    document.getElementById("form-error").innerText = "Only administrators are allowed";
                  }
                }
              }
              else {
                try{
                  document.getElementById("form-error").innerText = response["body"]["message"];
                } catch (e){
                  document.getElementById("form-error").innerText = "Error occurred";
                }
                
              }
            },
          });
        } else {
          //normal login with 2FA for all other users
          let url = config.api.invokeUrl + "/user/lionlogin";

          //encrypt the passwords
          var userinfo = this.encrypt(`{"UserInfo": "${username}", "UserPass": "${password}", "WebPortal": "true"}`, SECRET_KEY);
          let data = { "body": userinfo };
          $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: (response) => {
              if (response["statusCode"] === 200) {
                if (!response["body"]["ChallengeName"]) {
                  var userData = JSON.parse(this.decrypt(response["data"], SECRET_KEY));
                  if (userData["custom:role"] === "A") {
                    var addedRows = response.body["addedRows"];
                    var updatedRows = response.body["updatedRows"];
                    if (addedRows === 1 || updatedRows === 1) {
                      //successful login and OTP sent, redirect to verify OTP page
                      this.setState({ formState: "2FA", email: response["email"], user: { userData: userData } });
                    } else {
                      document.getElementById("form-error").innerText = response["errorMessage"];
                    }
                  }
                  else {
                    document.getElementById("form-error").innerText = "Only administrators are allowed. For non-administrators, please download the STEPS app.";
                  }
                }
                else if (response["body"]["ChallengeName"] === "NEW_PASSWORD_REQUIRED") {
                  var newPwUname = "";
                  try{
                    newPwUname = JSON.parse(response["body"]["ChallengeParameters"]["userAttributes"])["preferred_username"];
                  } catch(e){
                  }
                  if(newPwUname === "" || newPwUname === undefined || newPwUname === null){
                    this.setState({ formState: "Setup", session: response["body"]["Session"] });
                  }
                  else{
                    this.setState({ formState: "Setup", session: response["body"]["Session"], currentusername: newPwUname });
                  }
                }
                else if (response["body"]["ChallengeName"] === "SMS_MFA") {
                  this.setState({ formState: "2FA", session: response["body"]["Session"] });
                }
              }
              else {
                try {
                  document.getElementById("form-error").innerText = response["body"]["message"];
                } catch (e) {
                  try {
                    var errormsg = "";
                    errormsg = response["errorMessage"];
                    if (errormsg.includes("Email address is not verified.")) {
                      document.getElementById("form-error").innerText = "Email address is not verified.";
                    } else if (errormsg.includes("Only Administrators are allowed.")) {
                      document.getElementById("form-error").innerText = errormsg;
                    } else {
                      document.getElementById("form-error").innerText = "An error occurred, please try again later, if this error persists, please contact an administrator";
                    }
                  } catch (e) {
                    document.getElementById("form-error").innerText = "An error occurred, please try again later, if this error persists, please contact an administrator";
                  }
                }
              }
            },
          });
        }
      }
      else if (this.state.formState === "Setup") {
        let pusername;
        if(this.state.currentusername === undefined || this.state.currentusername === null || this.state.currentusername === "")
          pusername = document.getElementById('preferredusername').value;
        else
          pusername = this.state.currentusername;
        // validation to check if username contains spaces
        if (/\s/.test(pusername)) {
          // it has any kind of whitespace
          document.getElementById("form-error").innerText = "Username cannot contain any spaces";
        } else {
          let password = document.getElementById('firstpassword').value;
          let url = config.api.invokeUrl + "/user/firsttimelogin";
          var setupPayload = this.encrypt(`{"UserInfo": "${this.state.username}", "Session": "${this.state.session}", "NewPass": "${password}", "NewUsername": "${pusername}"}`, SECRET_KEY);
          let data = { "body": setupPayload };
  
          $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: (response) => {
              if (response["statusCode"] === 200) {
                this.setState({ formState: "Login", username: "", email: "", password: "" });
                document.getElementById("loginMessage").innerText = "Account Created Successfully!";
                document.getElementById("loginMessage").style.color = "green";
              }
              else {
                if (response["body"]["code"] === "AliasExistsException") {
                  document.getElementById("form-error").innerText = "This username has already been taken. Please try another username.";
                } else {
                  document.getElementById("form-error").innerText = response["body"]["message"];
                }
              }
            },
          });
        }
      }
      else if (this.state.formState === "2FA") {
        if (this.state.otp.length === 6) {
          let url = config.api.invokeUrl + "/user/verifyotp";
          var verifyOTPpayload = this.encrypt(`{"email": "${this.state.email}", "otpDigit": "${this.state.otp}"}`, SECRET_KEY);
          let data = { "body": verifyOTPpayload };
          $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: (response) => {
              try {
                var message = response["message"];
                if (message === "Valid") {
                  //need to decrypt the idtoken, should be encrypted at server
                  var encryptedReturnPayload = response["data"];
                  var returnPayload = JSON.parse(this.decrypt(encryptedReturnPayload, SECRET_KEY));
                  var idToken = returnPayload["idToken"];
                  var accessToken = returnPayload["accessToken"];
                  this.props.auth.setUser(this.state.user.userData);
                  sessionStorage.setItem('userData', JSON.stringify(this.state.user.userData));
                  sessionStorage.setItem('userKeys', JSON.stringify({ "IdToken": idToken, "AccessToken": accessToken }));
                  this.props.auth.setAuthStatus("true");

                  //clear sessionstorage before login, for booking
                  sessionStorage.setItem("vehicleRPLData", "");
                  sessionStorage.setItem("vehicleRPLList", "");
                  sessionStorage.setItem("routePData", "");
                  sessionStorage.setItem("routePList", "");
                  sessionStorage.setItem("routeRPLData", "");
                  sessionStorage.setItem("routeRPLList", "");
                  sessionStorage.setItem("purposePData", "");
                  sessionStorage.setItem("purposePList", "");
                  sessionStorage.setItem("purposeRPLData", "");
                  sessionStorage.setItem("purposeRPLList", "");

                  window.location.href = "/dashboard";
                } else if (message === "Invalid") {
                  document.getElementById("form-error").innerText = "This code is invalid, please try again.";
                } else if (message === "Expired") {
                  document.getElementById("form-error").innerText = "This code is expired, please click the resend button below to request for another code.";
                } else {
                  document.getElementById("form-error").innerText = "Error in verifying code, please contact administrators";
                }
              } catch (err) {
                document.getElementById("form-error").innerText = response["errorMessage"];
              }

            },
          });
        } else {
          document.getElementById("form-error").innerText = "Please enter a 6 digit long number";
        }
      }

      else if (this.state.formState === "Forget") {
        this.sendForgetCode();
      }
      else if (this.state.formState === "Confirm") {
        let url = config.api.invokeUrl + "/user/verifyforgetpassword";
        var confirmPayload = this.encrypt(`{"UserInfo": "${this.state.email}", "UserPass":"${this.state.newpassword}", "Code": "${this.state.forgetcode}"}`, SECRET_KEY);
        let data = { "body": confirmPayload };
        //let data = { "body": `{"UserInfo": "${this.state.email}", "UserPass":"${this.state.newpassword}", "Code": "${this.state.forgetcode}"}` };

        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify(data),
          contentType: "application/json",
          success: async (response) => {
            if (response["statusCode"] === 400) {
              if (response["body"]["code"] === "InvalidParameterException") {
                document.getElementById("form-error").innerText = "Password must be 8 characters and contain at least 1 numeric, 1 uppercase and 1 special character";
              }
              else if (response["body"]["code"] === "CodeMismatchException") {
                document.getElementById("form-error").innerText = "Invalid verification Code provided, please try again";
              }
              else if (response["body"]["code"] === "ExpiredCodeException") {
                document.getElementById("form-error").innerText = "Invalid code provided, please request a code again";
              }
            }
            else {
              await this.setState({ formState: "Login", sendForgetCode: "", confirmpassword: "", newpassword: "", password: "", username: "", email: "" });
              document.getElementById("loginMessage").innerText = "Successfully Reset Password!";
              document.getElementById("loginMessage").style.color = "green";
            }
          },
        });
      }
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  passwordmask = (event) => {
    let timeLeft = 1;
    var passwordInput = document.getElementById(event.target.dataset.group.replace("Eye", ""));
    var toggleIcon = document.getElementById(event.target.dataset.group);
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash")
      var timerId = setInterval(() => {
        if (timeLeft === 0) {
          passwordInput.type = "password";
          toggleIcon.classList.remove("fa-eye-slash");
          toggleIcon.classList.add("fa-eye")
          clearTimeout(timerId);
        } else {
          timeLeft--;
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  handleChange = otp => {
    this.setState({ otp });
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      this.removeBackgroundImage();
      this.props.history.push("/dashboard")
      return (
        <div>
        </div>
      );
    }
    else {
      return (
        <div className="container">
          {(this.setBackgroundImage())}
          {this.state.formState === "Login" && (
            <div className="row" style={{ margin: "auto", marginTop: "8%" }}>
              <div className="col-sm-10 col-md-6 col-lg-4 ml-auto mr-auto bg-white p-5">
                <h5 className="text-center mb-0" id="loginMessage">Welcome!</h5>
                <h6 className="text-center mt-0 mb-4">Log in to access all your services</h6>
                <FormErrors formerrors={this.state.errors} />
                <div id="form-error" className="form-errors text-center"></div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input className="form-control mb-1" type="text" placeholder="Email, Username" value={this.state.username}
                      onChange={this.onInputChange} id="username"></input>
                    <div className="input-group">
                      <input className="form-control" type="password" placeholder="Password" value={this.state.password}
                        onChange={this.onInputChange} id="password"></input>
                      <div className="input-group-append" name="passwordEye" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="passwordEye"><i id="passwordEye" data-group="passwordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                    <p className="text-right"><span onClick={this.changeFormState} id="Forget" className="text-info" style={{ fontSize: "12px", cursor: "pointer" }}>Forget Password?</span></p>
                    {/* <p className="text-right"><span onClick={this.changeFormOTP} className="text-info" style={{ fontSize: "12px", cursor: "pointer" }}>OTP example</span></p> */}
                  </div>
                  <div className="form-group">
                    <button className="btn btn-block login-btn" style={{ backgroundColor: "#00BE91", color: "white" }}>Log in</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {(this.state.formState === "Setup" && (this.state.currentusername === undefined || this.state.currentusername === null || this.state.currentusername === "")) && (
            <div className="row" style={{ margin: "10% auto" }}>
              <div className="col-sm-10 col-md-8 col-lg-6 ml-auto mr-auto bg-white p-5">
                <h5 className="text-center mb-0">Account Set Up</h5>
                <h6 className="text-center mt-0 mb-4">Please enter a new username and password.</h6>
                <FormErrors formerrors={this.state.errors} />
                <div id="form-error" className="form-errors text-center"></div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input className="form-control mb-1" type="text" placeholder="New Username" 
                      onChange={this.onInputChange} id="preferredusername"></input>
                    <div className="input-group mb-1">
                      <input className="form-control" type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required placeholder="Password" value={this.state.firstpassword}
                        onChange={this.onInputChange} id="firstpassword"></input>
                      <div className="input-group-append" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="firstpasswordEye"><i id="firstpasswordEye" data-group="firstpasswordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                    <div className="input-group mb-1">
                      <input className="form-control" type="password" placeholder="Confirm Password" value={this.state.confirmfirstpassword}
                        onChange={this.onInputChange} id="confirmfirstpassword"></input>
                      <div className="input-group-append" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="confirmfirstpasswordEye"><i id="confirmfirstpasswordEye" data-group="confirmfirstpasswordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-block login-btn" style={{ backgroundColor: "#00BE91", color: "white" }}>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {(this.state.formState === "Setup" && this.state.currentusername) && (
            <div className="row" style={{ margin: "10% auto" }}>
              <div className="col-sm-10 col-md-8 col-lg-6 ml-auto mr-auto bg-white p-5">
                <h5 className="text-center mb-0">Reset Account Password</h5>
                <h6 className="text-center mt-0 mb-4">Please enter a new password.</h6>
                <FormErrors formerrors={this.state.errors} />
                <div id="form-error" className="form-errors text-center"></div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <div className="input-group mb-1">
                      <input className="form-control" type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required placeholder="Password" value={this.state.firstpassword}
                        onChange={this.onInputChange} id="firstpassword"></input>
                      <div className="input-group-append" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="firstpasswordEye"><i id="firstpasswordEye" data-group="firstpasswordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                    <div className="input-group mb-1">
                      <input className="form-control" type="password" placeholder="Confirm Password" value={this.state.confirmfirstpassword}
                        onChange={this.onInputChange} id="confirmfirstpassword"></input>
                      <div className="input-group-append" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="confirmfirstpasswordEye"><i id="confirmfirstpasswordEye" data-group="confirmfirstpasswordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-block login-btn" style={{ backgroundColor: "#00BE91", color: "white" }}>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {this.state.formState === "2FA" && (
            <div className="row">
              {(document.body.style.backgroundImage = "")}
              <div className="col-sm-10 col-md-8 col-lg-6 ml-auto mr-auto p-5 text-center text-white">
                <h4 className="mb-0">Enter One-time Password</h4>
                <p className="mt-0 mb-5">We have sent an OTP to your email</p>
                <p className="mt-0 mb-5">
                  Please enter the verification code within 7 minutes <br />
                  The verification code is a 6 digit code e.g, 665544
                </p>
                <div id="form-error" className="form-errors-dark-bg text-center"></div>
                <form autoComplete="off" onSubmit={this.handleSubmit} method="get" className="digit-group" data-group-name="digits" data-autosubmit="false">
                  <div className="otpOuterDiv" id="otpFlex">
                    <OtpInput
                      value={this.state.otp}
                      onChange={this.handleChange}
                      numInputs={6}
                      isInputNum={true}
                      containerStyle="otpDiv"
                      separator={<span className="splitter">&ndash;</span>}

                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-block login-btn" id="loginVerifyBtn">Verify</button>
                  </div>
                </form>
                <button type="button" onClick={this.timerMFA30} className="btn btn-link OTP-text">Resend OTP<span id="resendMFA" style={{ color: "orange" }}></span></button>
              </div>
            </div>
          )}
          {this.state.formState === "Forget" && (
            <div className="row" style={{ margin: "10% auto" }}>
              <div className="col-sm-10 col-md-8 col-lg-6 ml-auto mr-auto bg-white p-5">
                <h5 className="text-center mb-0">Forget Password</h5>
                <h6 className="text-center mt-0 mb-4">Please enter the email address associated with your account and we'll
              email you a password reset code.</h6>
                <FormErrors formerrors={this.state.errors} />
                <div id="form-error" className="form-errors text-center"></div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input className="form-control mb-1" type="email" placeholder="Email Address" value={this.state.email}
                      onChange={this.onInputChange} id="email"></input>
                    <p className="text-right"><span id="Login" onClick={this.changeFormState} className="text-info" style={{ fontSize: "12px", cursor: "pointer" }}>Login?</span></p>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-block login-btn" style={{ backgroundColor: "#00BE91", color: "white" }}>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {this.state.formState === "Confirm" && (
            <div className="row" style={{ margin: "10% auto" }}>
              <div className="col-sm-10 col-md-8 col-lg-6 ml-auto mr-auto bg-white p-5">
                <h5 className="text-center mb-0">Set a new password</h5>
                <h6 className="text-center mt-0 mb-4">Please enter the verification code sent to your email address below,
            your email address and a new password.</h6>
                <FormErrors formerrors={this.state.errors} />
                <div id="form-error" className="form-errors text-center"></div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input className="form-control mb-1" type="text" placeholder="Verification Code" value={this.state.forgetcode}
                      onChange={this.onInputChange} id="forgetcode"></input>
                    <div className="input-group mb-1">
                      <input className="form-control" type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required placeholder="New Password" value={this.state.newpassword}
                        onChange={this.onInputChange} id="newpassword"></input>
                      <div className="input-group-append" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="newpasswordEye"><i id="newpasswordEye" data-group="newpasswordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                    <div className="input-group mb-1">
                      <input className="form-control" type="password" placeholder="Confirm New Password" value={this.state.confirmpassword}
                        onChange={this.onInputChange} id="confirmpassword"></input>
                      <div className="input-group-append" onClick={this.passwordmask}>
                        <span className="input-group-text border-left-0 bg-white" data-group="confirmpasswordEye"><i id="confirmpasswordEye" data-group="confirmpasswordEye" className="far fa-eye"></i></span>
                      </div>
                    </div>
                    <p className="text-right"><button id="resendCode" onClick={this.sendForgetCode} type="button" className="btn btn-link text-secondary" style={{ fontSize: "12px" }}>Code resend available in 30 seconds</button></p>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-block login-btn" style={{ backgroundColor: "#00BE91", color: "white" }}>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

export default LogIn;