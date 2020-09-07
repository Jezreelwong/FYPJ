import React, { Component } from 'react';
import config from "../config.json";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import $ from "jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Spinner from 'react-bootstrap/Spinner';
$.DataTable = require("datatables.net-bs4");
var moment = require("moment");

class Users extends Component {
  state = {
    isLoading: true,
    tableState: "All",
    email: "",
    first_name: "",
    last_name: "",
    safUnit: "",
    role: "",
    formState: "Create",
    performanceRating: 0,
    status: "A",
    username: "",
    data: [],
    roles: [],
    safUnitLbl: "SAF Unit:",
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

  getRoles = async () => {
    var url = config.api.invokeUrl + "/role";
    await $.ajax({
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      type: 'GET',
      url: url,
      contentType: "application/json",
      success: (response) => {
        if (response["statusCode"] === 200)
          this.setState({ roles: response["body"] });
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  setRoles = () => {
    let obj = [];
    let options = [];
    for (var i = 0; i < this.state.roles.length; i++) {
      options.push(<option key={this.state.roles[i]["roleId"]} value={this.state.roles[i]["roleId"]}>{this.state.roles[i]["roleName"]}</option>)
    }
    obj.push(
      <div key="selecteRole" className="col-12">
        <label htmlFor="role">Role:</label>
        <select id="role" className="form-control mb-3" defaultValue="" onChange={this.onRoleChange}>
          <option value="">-- Select A Role --</option>
          {options}
        </select>
      </div>
    )
    return obj;
  }

  toggleStatus = (event) => {
    let status = ""
    if (this.state.status === "A") {
      event.target.classList.remove("btn-outline-success");
      event.target.classList.add("btn-danger");
      event.target.innerText = "Inactive";
      status = "I";
    }
    else {
      event.target.classList.remove("btn-danger");
      event.target.classList.add("btn-outline-success");
      event.target.innerText = "Active";
      status = "A";
    }
    this.setState({ status: status })
  }

  toggleForm = async () => {
    if (document.getElementById("CreateModal").style.display === "none") {
      this.clearFormInputs();
      this.clearErrorState();
      document.getElementById("form-error").innerText = "";
      await this.setState({ formState: "Create" })
      document.getElementById("CreateModal").style.display = "block";
    }
    else
      document.getElementById("CreateModal").style.display = "none";
  }

  closeForm = (event) => {
    if (event.target.id === "CreateModal") {
      document.getElementById("form-error").innerText = "";
      this.clearErrorState();
      document.getElementById("CreateModal").style.display = "none";
    }
  }

  clearFormInputs = () => {
    if (document.getElementById("email") !== null)
      document.getElementById("email").value = "";
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("safUnit").value = "";
    document.getElementById("role").value = "";
    if (document.getElementById("performanceRating") !== null)
      document.getElementById("performanceRating").value = "";
  }

  openEdit = async () => {
    this.clearFormInputs();
    await this.setState({ formState: "Edit" })
    document.getElementById("CreateModal").style.display = "block";
    document.getElementById("DisplayDetails").style.display = "none";
    if (this.state["status"] === "A") {
      document.getElementById("status-toggle-btn").classList.remove("btn-danger");
      document.getElementById("status-toggle-btn").classList.add("btn-outline-success");
      document.getElementById("status-toggle-btn").innerText = "Active";
    }
    else {
      document.getElementById("status-toggle-btn").classList.remove("btn-outline-success");
      document.getElementById("status-toggle-btn").classList.add("btn-danger");
      document.getElementById("status-toggle-btn").innerText = "Inactive";
    }
    document.getElementById("first_name").value = this.state.first_name;
    document.getElementById("last_name").value = this.state.last_name;
    document.getElementById("safUnit").value = this.state.safUnit;
    document.getElementById("role").value = this.state.role;
    document.getElementById("performanceRating").value = this.state.performanceRating;
  }

  closeDisplay = (event) => {
    if (event.target.id === "DisplayDetails" || event.target.id === "cls-details") {
      document.getElementById("DisplayDetails").style.display = "none";
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  onRoleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("border-danger");

    if(event.target.id === "role" && event.target.value === "SP"){
      this.setState({safUnitLbl: "Service Provider:"});
    } else {
      this.setState({safUnitLbl: "SAF Unit:"});
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
    document.getElementById("form-error").innerText = "";
  };

  handleForm = async event => {
    if (event != null)
      event.preventDefault();
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      // this.setState({
      //   errors: { ...this.state.errors, ...error }
      // });
      if(error["blankfield"] === true){
        document.getElementById("form-error").innerText = "All fields are required";
      } else {
        document.getElementById("form-error").innerText = "The passwords entered do not match, please try again";
      }
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
            if(response["statusCode"] !== 400){
              if (!response.errorMessage) {
                window.location.reload()
              }
              else {
                if (response.errorType === "UsernameExistsException") {
                  document.getElementById("form-error").innerText = response.errorMessage.replace("An error occurred (UsernameExistsException) when calling the AdminCreateUser operation: ", "");
                }
              }
            } else {
              document.getElementById("form-error").innerText = JSON.parse(response["body"])["message"];
            }
          },
          error: (xhr, status, err) => {
            if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
              this.props.history.push("/logout");
          }
        });
      }
      else if (this.state.formState === "Edit") {
        data = { "body": `{"UpdatedBy": "${this.props.auth.user.email}", "UserInfo":"${this.state.email}", "Role":"${this.state.role}", "SafUnit":"${this.state.safUnit}", "PerformanceRating":"${this.state.performanceRating}", "Status":"${this.state.status}", "FirstName":"${this.state.first_name}", "LastName":"${this.state.last_name}"}` };
        await $.ajax({
          headers: {
            Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
          },
          type: 'PATCH',
          url: url,
          data: JSON.stringify(data),
          contentType: "application/json",
          success: (response) => {
            if (response["statusCode"] === 200)
              window.location.reload();
          },
          error: (xhr, status, err) => {
            if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
              this.props.history.push("/logout");
          }
        });
      }
    }
  }

  displayDetails = () => {
    let email = document.getElementById("showEmail").value;
    for (var i = 0; i < this.state.data.length; i++) {
      let preferredUsername, firstName, lastName, performanceRating, safUnit, role, createdBy, updatedBy, status;
      let createdDate = new Date(this.state.data[i]["UserCreateDate"]);
      let updatedDate = new Date(this.state.data[i]["UserLastModifiedDate"]);
      status = (this.state.data[i]["Enabled"]) ? "Active" : "Inactive";
      let userFound = false
      let userAttributes = this.state.data[i]["Attributes"];
      for (var j = 0; j < userAttributes.length; j++) {
        if (userAttributes[j]["Name"] === "email" && userAttributes[j]["Value"] === email)
          userFound = true;
        if (userAttributes[j]["Name"] === "preferred_username")
          preferredUsername = userAttributes[j]["Value"] + " ";
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
        this.setState({ email: email, first_name: firstName, last_name: lastName, status: (this.state.data[i]["Enabled"]) ? "A" : "I", performanceRating: performanceRating, safUnit: safUnit, role: role, username: this.state.data[i]["Username"] });
        if (preferredUsername === undefined)
          document.getElementById("DisplayUsername").innerText = "-";
        else
          document.getElementById("DisplayUsername").innerText = preferredUsername;

        document.getElementById("DisplayEmail").innerText = email;
        document.getElementById("DisplayFirstName").innerText = firstName;
        document.getElementById("DisplayLastName").innerText = lastName;
        document.getElementById("DisplayPerformanceRating").innerText = performanceRating;
        document.getElementById("DisplayRole").innerText = role;
        document.getElementById("DisplaySAFUnit").innerText = safUnit;
        document.getElementById("DisplayCreatedBy").innerText = createdBy;
        document.getElementById("DisplayCreatedDate").innerText = moment(createdDate).format(config.format.datetime);
        document.getElementById("DisplayUpdatedBy").innerText = updatedBy;
        document.getElementById("DisplayUpdatedDate").innerText = moment(updatedDate).format(config.format.datetime);
        if (preferredUsername === undefined)
          document.getElementById("DisplayStatus").innerText = "Pending";
        else
          document.getElementById("DisplayStatus").innerText = status;
        document.getElementById("DisplayDetails").style.display = "block";
        if (preferredUsername !== undefined){
          document.getElementById("resetTempPwBtn").style.display = "none";
          document.getElementById("resetUserPwBtn").style.display = "block";
        } else {
          document.getElementById("resetTempPwBtn").style.display = "block";
          document.getElementById("resetUserPwBtn").style.display = "none";
        }
        break
      }
    }
  }

  resetTempPw = () => {
    //for new users, who did not receive the temporary password email or their temporary passwords have expired

    //call api gateway
    //call lambda function, need to create new function
    //call cognito to reset temp pw and send user a new email
    var username = this.state.username;
    var data = { data: username, type: "newUser" }
    var url = config.api.invokeUrl + "/user/resettemppassword";
    $.ajax({
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (response) => {
        if (!response.errorMessage) {
          window.location.reload();
        }
        else {
          //change to use form-errors
          document.getElementById("form-error").innerText = response.errorMessage;
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  resetUserPw = () => {
    var username = this.state.username;
    var email = this.state.email;
    var data = { data: username, type: "createdUser", email: email }
    var url = config.api.invokeUrl + "/user/resettemppassword";
    $.ajax({
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (response) => {
        if (!response.errorMessage) {
          window.location.reload();
        }
        else {
          //change to use form-errors
          document.getElementById("form-error").innerText = response.errorMessage;
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  deleteUser = () => {
    var username = this.state.username;
    var data = { data: username }
    var url = config.api.invokeUrl + "/user/deleteuser";
    $.ajax({
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (response) => {
        if (!response.errorMessage) {
          window.location.reload();
        }
        else {
          //change to use form-errors
          document.getElementById("form-error").innerText = response.errorMessage;
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  goToDeleteUser = () => {
    var r = window.confirm("Are you sure you want to delete this user?");
    if (r === true) {
      this.deleteUser();
    } else {
      window.location.reload();
    } 
  }

  initializeTable = (data) => {
    let columns = []
    if (this.state.tableState === "All") {
      columns = [        //set header for table
        { title: "Name" },
        { title: "Email" },
        { title: "Username" },
        { title: "Performance Rating" },
        { title: "SAF Unit" },
        { title: "Status" },
        { title: "Role" },
      ]
    }
    else {
      columns = [        //set header for table
        { title: "Name" },
        { title: "Email" },
        { title: "Username" },
        { title: "Performance Rating" },
        { title: "SAF Unit" },
        { title: "Status" }
      ]
    }
    $('#DataTable').DataTable({
      lengthChange: false,                           //data1                           data2
      data: data,       //data must be in [ [col1,col2,col3,col4,col5,col6], [col1,col2,col3,col4,col5,col6] ] format
      columns: columns
    });

    $(document).ready(() => {
      var table = $('#DataTable').DataTable();
      $('#DataTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if (data) {
          document.getElementById("showEmail").value = data[1];
          document.getElementById("showEmail").click();
        }
      });
      $("#DataTable_filter label").contents().filter(function () {    //styling seachbar
        return this.nodeType === 3;
      }).remove()
      let searchbar = document.querySelector("#DataTable_filter label input");
      let searchbarDiv = document.getElementById("DataTable_filter");
      searchbar.setAttribute("placeholder", "Search User");           //set searchbarplaceholder
      searchbar.classList.remove("form-control-sm");
      searchbar.classList.add("ml-0");
      searchbar.style.width = "100%";
      searchbar.parentElement.style.width = "95%";
      searchbar.parentElement.style.marginBottom = "0";
      searchbarDiv.parentElement.classList.remove("col-md-6");
      searchbarDiv.classList.add("d-flex");
      let newBtn = document.createElement("Button");
      newBtn.setAttribute("onClick", "document.getElementById('addData').click();");
      newBtn.setAttribute("class", "btn btn-primary btn-circle ml-3");
      newBtn.innerHTML = '<span title="Add"><i class="fas fa-plus"></i></span>';
      searchbarDiv.appendChild(newBtn)
      let newDiv = document.createElement("Div");
      newDiv.setAttribute("class", "col-12 col-md-8 col-lg-6 mt-4");
      if (this.state.tableState === "All") {                          //eg users page has 4 tabs so 4 ifs statement and 4 button divs, annoucements has 2 tabs so 2 ifs and 2 button divs
        //eg users page has 4 tabs so 4 ifs statement and 4 button divs, annoucements has 2 tabs so 2 ifs and 2 button divs
        newDiv.innerHTML =
          `<div class="row mt-2 ml-0 mr-0">` +
          `<div class="col-2 table-btn-selected"><p>All</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='U';document.getElementById('changeTable').click();"><p class="users-tab-btn">Users</p><p class="users-tab-btn-mobile">U</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='PU';document.getElementById('changeTable').click();"><p class="users-tab-btn">Privileged User</p><p class="users-tab-btn-mobile">PU</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='SP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Service Provider</p><p class="users-tab-btn-mobile">SP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='DP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Duty Personnel</p><p class="users-tab-btn-mobile">DP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='A';document.getElementById('changeTable').click();"><p class="users-tab-btn">Admin</p><p class="users-tab-btn-mobile">A</p></div>` +
          `</div>`;
      } else if (this.state.tableState === "U") {
        newDiv.innerHTML =
          `<div class="row mt-2 ml-0 mr-0">` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
          `<div class="col-2 table-btn-selected"><p class="users-tab-btn">Users</p><p class="users-tab-btn-mobile">PU</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='PU';document.getElementById('changeTable').click();"><p class="users-tab-btn">Privileged User</p><p class="users-tab-btn-mobile">U</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='SP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Service Provider</p><p class="users-tab-btn-mobile">SP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='DP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Duty Personnel</p><p class="users-tab-btn-mobile">DP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='A';document.getElementById('changeTable').click();"><p class="users-tab-btn">Admin</p><p class="users-tab-btn-mobile">A</p></div>` +
          `</div>`;
      } else if (this.state.tableState === "PU") {
        newDiv.innerHTML =
          `<div class="row mt-2 ml-0 mr-0">` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='U';document.getElementById('changeTable').click();"><p class="users-tab-btn">Users</p><p class="users-tab-btn-mobile">U</p></div>` +
          `<div class="col-2 table-btn-selected"><p class="users-tab-btn">Privileged Users</p><p class="users-tab-btn-mobile">PU</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='SP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Service Provider</p><p class="users-tab-btn-mobile">SP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='DP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Duty Personnel</p><p class="users-tab-btn-mobile">DP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='A';document.getElementById('changeTable').click();"><p class="users-tab-btn">Admin</p><p class="users-tab-btn-mobile">A</p></div>` +
          `</div>`;
      } else if (this.state.tableState === "SP") {
        newDiv.innerHTML =
          `<div class="row mt-2 ml-0 mr-0">` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='U';document.getElementById('changeTable').click();"><p class="users-tab-btn">Users</p><p class="users-tab-btn-mobile">U</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='PU';document.getElementById('changeTable').click();"><p class="users-tab-btn">Privileged User</p><p class="users-tab-btn-mobile">PU</p></div>` +
          `<div class="col-2 table-btn-selected"><p class="users-tab-btn">Service Provider</p><p class="users-tab-btn-mobile">SP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='DP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Duty Personnel</p><p class="users-tab-btn-mobile">DP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='A';document.getElementById('changeTable').click();"><p class="users-tab-btn">Admin</p><p class="users-tab-btn-mobile">A</p></div>` +
          `</div>`;
      } else if (this.state.tableState === "DP") {
        newDiv.innerHTML =
          `<div class="row mt-2 ml-0 mr-0">` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='U';document.getElementById('changeTable').click();"><p class="users-tab-btn">Users</p><p class="users-tab-btn-mobile">U</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='PU';document.getElementById('changeTable').click();"><p class="users-tab-btn">Privileged User</p><p class="users-tab-btn-mobile">PU</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='SP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Service Provider</p><p class="users-tab-btn-mobile">SP</p></div>` +
          `<div class="col-2 table-btn-selected"><p class="users-tab-btn">Duty Personnel</p><p class="users-tab-btn-mobile">DP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='A';document.getElementById('changeTable').click();"><p class="users-tab-btn">Admin</p><p class="users-tab-btn-mobile">A</p></div>` +
          `</div>`;
      } else if (this.state.tableState === "A") {
        newDiv.innerHTML =
          `<div class="row mt-2 ml-0 mr-0">` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='U';document.getElementById('changeTable').click();"><p class="users-tab-btn">Users</p><p class="users-tab-btn-mobile">U</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='PU';document.getElementById('changeTable').click();"><p class="users-tab-btn">Privileged User</p><p class="users-tab-btn-mobile">PU</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='SP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Service Provider</p><p class="users-tab-btn-mobile">SP</p></div>` +
          `<div class="col-2 table-btn" onclick="document.getElementById('changeTable').value='DP';document.getElementById('changeTable').click();"><p class="users-tab-btn">Duty Personnel</p><p class="users-tab-btn-mobile">DP</p></div>` +
          `<div class="col-2 table-btn-selected"><p class="users-tab-btn">Admin</p><p class="users-tab-btn-mobile">A</p></div>` +
          `</div>`;
      }
      searchbarDiv.parentElement.parentElement.appendChild(newDiv);
      searchbarDiv.parentElement.parentElement.classList.add("ml-0", "mr-0", "tab-border");
      searchbarDiv.parentElement.parentElement.nextSibling.classList.add("overflow-data-table");
      let listOfDivs = searchbarDiv.parentElement.parentElement.childNodes;
      for (var i = 0; i < listOfDivs.length; i++) {
        listOfDivs[i].classList.add("pl-0", "pr-0");
      }
    });
  }

  changeTable = async () => {
    let data = [];
    let newTableState = document.getElementById("changeTable").value;           //set which data display on which state
    data = await this.formatData(newTableState);
    await this.setState({
      tableState: newTableState
    });
    try {
      $('#DataTable').DataTable().destroy(true)
    }
    catch (e) {
      console.log(e)
    }
    document.querySelector(".data-table-div").innerHTML = '<table id="DataTable" class="data-table" width="100%"></table>';
    this.initializeTable(data);
  }

  formatData = (tableState) => {
    let data = []
    for (var i = 0; i < this.state.data.length; i++) {
      let user = ["", "", "", "", "", "", ""];
      user[5] = (this.state.data[i]["Enabled"]) ? "Active" : "Inactive";
      let userFound = false;
      let userAttributes = this.state.data[i]["Attributes"];           
      var usernameExists = false;
      //retrieve data 
      for (var j = 0; j < userAttributes.length; j++) {
        if (userAttributes[j]["Name"] === "given_name")
          user[0] = userAttributes[j]["Value"] + " ";
        if (userAttributes[j]["Name"] === "family_name")
          user[0] += userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "email")
          user[1] = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "preferred_username") {
          user[2] = userAttributes[j]["Value"];
          usernameExists = true;
        }
        if (userAttributes[j]["Name"] === "custom:performanceRating")
          user[3] = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:safUnit")
          user[4] = userAttributes[j]["Value"];
        if (userAttributes[j]["Name"] === "custom:role") {
          user[6] = userAttributes[j]["Value"];
          if (tableState !== "All" && user[6] === tableState)
            userFound = true;
        }
      }
      if(usernameExists === false){
        user[5] = "Pending";
      }
      if (tableState === "All" || userFound)
        data.push(user);
    }
    return data
  }

  async componentDidMount() {
    this.props.auth.setNav("User");
    await this.getAllUsers();
    let data = await this.formatData(this.state.tableState);
    await this.initializeTable(data);
    this.setState({ isLoading: false });
    await this.getRoles();
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
            <p className="table-title">MANAGE USERS</p>
            <input onClick={this.toggleForm} type="hidden" id="addData" />
            <input onClick={this.displayDetails} type="hidden" id="showEmail" />
            <input onClick={this.changeTable} type="hidden" id="changeTable" />
            <div className="data-div shadow bg-white">
              <div className="data-table-div m-3">
                <table id="DataTable" className="data-table" width="100%" ref={tbl => this.tbl = tbl}></table>
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
                  {(this.state.formState === "Edit")
                    ? <h5>Edit User</h5>
                    : <h5>Create A New User</h5>
                  }
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">
                  {this.state.formState === "Create" && (
                    <div className="col-12">
                      <label htmlFor="email">Email:</label>
                      <input className="form-control mb-3" type="text"
                        onChange={this.onInputChange} id="email"></input></div>)}
                  <div className="col-12">
                    <label htmlFor="first_name">First Name:</label>
                    <input className="form-control mb-3" type="text"
                      onChange={this.onInputChange} id="first_name"></input></div>
                  <div className="col-12">
                    <label htmlFor="last_name">Last Name:</label>
                    <input className="form-control mb-3" type="text"
                      onChange={this.onInputChange} id="last_name"></input></div>
                  {this.setRoles()}
                  <div className="col-12">
                    <label htmlFor="safUnit">{this.state.safUnitLbl}</label>
                    {this.state.safUnitLbl === "SAF Unit:" && (
                      <input className="form-control mb-3" type="text"
                      onChange={this.onInputChange} id="safUnit"></input>
                    )}
                    {this.state.safUnitLbl === "Service Provider:" && (
                      <select id="safUnit" className="form-control mb-3" defaultValue="" onChange={this.onInputChange}>
                        <option value="">-- Select A Type --</option>
                        <option value="Passenger">Passenger</option>
                        <option value="RPL">RPL</option>
                      </select>
                    )}
                    </div>
                  {this.state.formState === "Edit" && (
                    <div className="col-12">
                      <label htmlFor="performanceRating">Performance Rating:</label>
                      <input className="form-control mb-3" type="text"
                        onChange={this.onInputChange} id="performanceRating"></input></div>
                  )}
                  {this.state.formState === "Edit" && (
                    <div className="col-12">
                      <div className="form-group">
                        Status: <span className="form-hint mr-3">(Click to change)</span>
                        <div id="status-toggle-btn" onClick={this.toggleStatus} className="btn"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row" style={{ backgroundColor: "#f1f1f1" }}>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-2 mt-2"><button type="reset" className="btn btn-block btn-outline-danger">Clear <i className="far fa-window-close"></i></button></div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-2 mt-2"><button type="submit" className="btn btn-block btn-success">{(this.state.formState === "Edit") ? "Update" : "Create"} <i className="far fa-plus-square"></i></button></div>
                </div>
              </form>
            </div>

            <div className="form-modal" onClick={this.closeDisplay} style={{ display: "none" }} id="DisplayDetails">
              <div className="form-content animate pl-3 pr-3">
                <span onClick={this.closeDisplay} id="cls-details" className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>User Details</h5>
                </div>
                <div style={{ border: "1px solid rgb(48, 110, 129)", width: "97%", margin: "10px" }}>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 col-sm-6 mb-2"><b>UserName :</b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayUsername" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>First Name : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayFirstName" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Last Name : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayLastName" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Email : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayEmail" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Role : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayRole" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Performance Rating : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayPerformanceRating" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>SAF Unit : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplaySAFUnit" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Created By : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayCreatedBy" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Created Date : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayCreatedDate" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Updated By : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayUpdatedBy" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Updated Date : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayUpdatedDate" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Status : </b></div>
                      <div className="col-12 col-sm-6"><span id="DisplayStatus" /></div>
                    </div>
                  </div>
                </div>
                <div>
                  <button type="button" onClick={this.openEdit} className="btn btn-block btn-outline-primary">Edit User <i className="fas fa-edit"></i></button>
                  <button type="button" onClick={this.resetTempPw} id="resetTempPwBtn" className="btn btn-block btn-outline-danger">Reset Temporary Password</button>
                  <button type="button" onClick={this.resetUserPw} id="resetUserPwBtn" className="btn btn-block btn-outline-danger">Reset User Password</button>
                  <button type="button" onClick={this.goToDeleteUser} id="deleteUserBtn" className="btn btn-block btn-outline-danger">Delete User</button>
                  <br />
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }
  }
}

export default Users;