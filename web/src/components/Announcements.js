import React, { Component } from "react";
import config from "../config.json";
import $ from "jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import AnnouncementModel from "../models/Announcement";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from "react-bootstrap/Spinner";
var moment = require("moment");
$.DataTable = require("datatables.net-bs4");
require("datatables.net-plugins/sorting/datetime-moment");
$.fn.dataTable.moment(config.format.datetime);
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class Announcements extends Component {
  state = {
    tableState: "All",
    data: [],
    length: 250,
    targetAudience: "",
    message: "",
    isLoading: true,
    errors: {
      apierrors: null,
      blankfield: false,
    },
  };
  // add javascript functions here
  getAnnouncement = async () => {
    var url = config.api.invokeUrl + "/announcement?role=all&all=all"; //change according to which api you are using
    await $.ajax({
      type: "GET",
      url: url,
      crossDomain: true,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: async (response) => {
        this.setState({ data: response["body"] });
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  };

  toggleForm = () => {
    if (document.getElementById("FormModal").style.display === "none") {
      document.getElementById("message").value = "";
      document.getElementById("checkAll").checked = false;
      this.checkAll()
      this.setState({ message: "", targetAudience: "", length: 250 });
      this.resetWordCount();
      document.getElementById("FormModal").style.display = "block";
    }
    else document.getElementById("FormModal").style.display = "none";
  };

  closeForm = (event) => {
    if (event.target.id === "FormModal") {
      document.getElementById("FormModal").style.display = "none";
    }
  };

  onInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        apierrors: null,
        blankfield: false,
      },
    });
  };

  checkAll = async () => {
    if (document.getElementById("checkAll").checked === false) {
      document.getElementById("checkU").checked = false;
      document.getElementById("checkPU").checked = false;
      document.getElementById("checkSP").checked = false;
      document.getElementById("checkDP").checked = false;
      document.getElementById("checkA").checked = false;
      await this.setState({ targetAudience: "" });
    }
    else {
      document.getElementById("checkU").checked = true;
      document.getElementById("checkPU").checked = true;
      document.getElementById("checkSP").checked = true;
      document.getElementById("checkDP").checked = true;
      document.getElementById("checkA").checked = true;
      await this.setState({ targetAudience: "U;PU;SP;DP;A" });
    }
  }

  checkbox = async (event) => {
    let tAudience = { "checkU": "U", "checkPU": "PU", "checkDP": "DP", "checkSP": "SP", "checkA": "A" }
    let value = tAudience[event.target.id];
    if (event.target.checked) {
      if (this.state.targetAudience !== "")
        value = ";" + value;
      await this.setState({ targetAudience: this.state.targetAudience + value });
      if (this.state.targetAudience.length === 12)
        document.getElementById("checkAll").checked = true;
    }
    else {
      if (value.length <= this.state.targetAudience.length) {
        if (this.state.targetAudience.length === 1) {
        }
        else if (this.state.targetAudience.slice(0, value.length).includes(value))
          value += ";"
        else
          value = ";" + value;
        await this.setState({ targetAudience: this.state.targetAudience.replace(value, "") });
      }
      document.getElementById("checkAll").checked = false;
    }
  }

  initializeTable = (data) => {
    let columns = [];
    let order = [];
    if (this.state.tableState === "All") {
      columns = [        //set header for table
        { title: "Message" },
        { title: "TargetAudience" },
        { title: "Created On" },
        { title: "Created By" },
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<span class='table_delete  text-danger' data-toggle='confirmation' data-popout='true' data-singleton='true' data-placement='left' data-title='Confirm delete?'><i class='far fa-trash-alt'></i></span>",
          "targets": -1
        },
      ]
      order = [[ 2, "desc" ]];
    }
    else {
      columns = [        //set header for table
        { title: "Message" },
        { title: "Created On" },
        { title: "Created By" },
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<span class='table_delete text-danger' data-toggle='confirmation' data-popout='true' data-singleton='true' data-placement='left' data-title='Confirm delete?'><i class='far fa-trash-alt'></i></span>",
          "targets": -1
        },
      ]
      order = [[ 1, "desc" ]];
    }

    $("#DataTable").DataTable({
      lengthChange: false, //data1       data2
      data: data, //data must be in [ [col1,col2], [col1,col2] ] format
      "createdRow": function (row, data, dataIndex) {
        $(row).attr('id', data[4]);
      },
      columns: columns,
      order: order,
      initComplete: () => {
        $("#DataTable_filter label")
          .contents()
          .filter(function () {
            //styling seachbar
            return this.nodeType === 3;
          })
          .remove();
        let searchbar = document.querySelector("#DataTable_filter label input");
        let searchbarDiv = document.getElementById("DataTable_filter");
        searchbar.setAttribute("placeholder", "Search Announcement"); //set searchbarplaceholder
        searchbar.classList.remove("form-control-sm");
        searchbar.classList.add("ml-0");
        searchbar.style.width = "100%";
        searchbar.parentElement.style.width = "95%";
        searchbar.parentElement.style.marginBottom = "0";
        searchbarDiv.parentElement.classList.remove("col-md-6");
        searchbarDiv.classList.add("d-flex");
        let newBtn = document.createElement("Button");
        newBtn.setAttribute(
          "onClick",
          "document.getElementById('addData').click();"
        );
        newBtn.setAttribute("class", "btn btn-primary btn-circle ml-3");
        newBtn.innerHTML = '<span title="Add"><i class="fas fa-plus"></i></span>';
        searchbarDiv.appendChild(newBtn);
        let newDiv = document.createElement("Div");
        newDiv.setAttribute("class", "col-12 col-md-10 col-lg-8 mt-4"); //need to add the codes below based on how many table tabs you have. edit the value and text according to your table state
        if (this.state.tableState === "All") {
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
        searchbarDiv.parentElement.parentElement.classList.add(
          "ml-0",
          "mr-0",
          "tab-border"
        );
        searchbarDiv.parentElement.parentElement.nextSibling.classList.add(
          "overflow-auto"
        );
        let listOfDivs = searchbarDiv.parentElement.parentElement.childNodes;
        for (var i = 0; i < listOfDivs.length; i++) {
          listOfDivs[i].classList.add("pl-0", "pr-0");
        }
      },
    });
    $('[data-toggle=confirmation]').confirmation({
      rootSelector: '[data-toggle=confirmation]',
      // other options
    });
  };

  setDeleteClick = async (event) => {
    $('#DataTable').on('click', 'span.table_delete', async (event) => {                               //add click event listener function for edit
      let announcementId = $(event.target).closest('tr').attr('id');
      let data = { "body": `{"announcementId": ${parseInt(announcementId)} }` };
      let url = config.api.invokeUrl + "/announcement/delete";
      await $.ajax({
        type: 'DELETE',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {
            window.location.reload();
          }
        },
        error: (xhr, status, err) => {
          if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }
      });
    });
  }

  formatData = async (tableState) => {
    let data = [];
    for (var i = 0; i < this.state.data.length; i++) {
      let date = new Date(this.state.data[i]["createdDate"]);
      date.setHours(date.getHours() - 8)
      let annoucement = "";
      if (tableState === "All") {
        let tAudience = { "U": "User", "PU": "Privileged User", "SP": "Service Provider", "DP": "Duty Personnel", "A": "Admin" }
        let audienceList = this.state.data[i]["targetAudience"].split(";")
        let audienceString = "";
        for (var j = 0; j < audienceList.length; j++) {
          if (j === 0)
            audienceString = tAudience[audienceList[j]];
          else
            audienceString += ", " + tAudience[audienceList[j]];
        }

        annoucement = [
          this.state.data[i]["message"],
          audienceString,
          moment(date).format(config.format.datetime),
          this.state.data[i]["createdBy"],
          this.state.data[i]["announcementId"]
        ];
      } else {
        let listAudience = this.state.data[i]["targetAudience"].split(";");
        if (listAudience.includes(tableState))
          annoucement = [
            this.state.data[i]["message"],
            moment(date).format(config.format.datetime),
            this.state.data[i]["createdBy"],
            this.state.data[i]["announcementId"],
          ];
      }
      if (annoucement !== "") data.push(annoucement);
    }
    return data;
  };

  handleSubmit = async event => {
    if (event != null)
      event.preventDefault();
    this.clearErrorState();
    document.getElementById("form-error").innerText = "";
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }
    else if(this.state.message.trim() === ""){
      document.getElementById("form-error").innerText = "Message cannot be empty.";
    }
    else if (this.state.length < 0) {
      document.getElementById("form-error").innerText = "Message has a character limit of 250";
      document.getElementById("message").classList.add("border-danger");
    }
    else if (this.state.targetAudience === "") {
      document.getElementById("form-error").innerText = "Please tick at least 1 checkbox";
    }
    else {
      document.getElementById("FormModal").querySelector(".btn-success").disabled = true;
      var url = config.api.invokeUrl + "/announcement/add";
      var Announcement = new AnnouncementModel(this.props.auth.user.preferred_username, entities.encode(this.state.message), this.state.targetAudience);
      let httpType = "PUT";
      let jsonData = Announcement.convertObjToJSON();
      await $.ajax({
        type: httpType,
        url: url,
        data: jsonData,
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {
            window.location.reload();
          }
          else{
            if(response["body"]["sqlMessage"])
              document.getElementById("form-error").innerText = response["body"]["body"]["sqlMessage"];
              document.getElementById("FormModal").querySelector(".btn-success").disabled = false;
          }
        },
        error: (xhr, status, err) => {
          if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }
      });
    }
  }

  changeTable = async () => {
    let data = [];
    let newTableState = document.getElementById("changeTable").value; //set which data display on which state
    data = await this.formatData(newTableState);
    await this.setState({
      tableState: newTableState,
    });
    try {
      $("#DataTable").DataTable().destroy(true);
    } catch (e) {
      console.log(e);
    }
    document.querySelector(".data-table-div").innerHTML =
      '<table id="DataTable" class="data-table" width="100%"></table>';
    this.initializeTable(data);
    this.setDeleteClick();
  };

  resetWordCount = () => {
    document.getElementById("message").classList.remove("border-danger");
    document.getElementById("wordCount").innerText = "Characters Left 250";
    document.getElementById("wordCount").classList.remove("text-danger");
  }

  wordCount = event => {
    let newLength = 250 - event.target.value.length - (event.target.value.match(/\n/g) || []).length;
    this.setState({
      message: event.target.value, length: newLength
    });
    if (newLength < 0) {
      document.getElementById(event.target.id).classList.add("border-danger");
      document.getElementById("wordCount").innerText = "Character Limit Exceeded!";
      document.getElementById("wordCount").classList.add("text-danger");
    }
    else {
      document.getElementById(event.target.id).classList.remove("border-danger");
      document.getElementById("wordCount").innerText = "Characters Left " + newLength;
      document.getElementById("wordCount").classList.remove("text-danger");
    }
  };

  async componentDidMount() {
    this.props.auth.setNav("Announcement"); //set change this according to the value in Navbar.js If dk just ask me.
    await this.getAnnouncement();
    let data = await this.formatData(this.state.tableState);
    await this.initializeTable(data);
    this.setDeleteClick();
    this.setState({ isLoading: false });
  }
  async componentWillUnmount() {
    try {
      $("#DataTable").DataTable().destroy(true);
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/logout");
      return <div></div>;
    } else {
      return (
        <div className="container-fluid p-0">
          <script>{(document.body.style.backgroundColor = "#EEEEEE")}</script>
          <div className="row p-3 mr-0" id="main-content">
            <p className="table-title">MANAGE ANNOUNCEMENT</p>
            <input onClick={this.toggleForm} type="hidden" id="addData" />
            <input onClick={this.changeTable} type="hidden" id="changeTable" />
            <div className="data-div shadow bg-white">
              <div className="data-table-div m-3">
                <table
                  id="DataTable"
                  className="data-table"
                  width="100%"
                ></table>
              </div>
              {this.state.isLoading && (
                <div className="text-center m-3">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              )}
            </div>

            <div className="form-modal" onClick={this.closeForm} style={{ display: "none" }} id="FormModal">
              <form autoComplete="off" onSubmit={this.handleSubmit} className="form-content animate pl-3 pr-3" >
                <span onClick={this.toggleForm} className="close-form" title="Close Modal">
                  &times;
                </span>
                <div className="form-title-div mb-2">
                  <h5>Create A New Announcement</h5>
                </div>
                <FormErrors />
                <div id="form-error" className="form-errors text-center"></div>
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <label htmlFor="message">Message:</label>
                    <textarea required className="form-control mb-3" rows="5" type="text" id="message" onChange={this.wordCount} />
                    <p className="text-right" id="wordCount"> Characters Left: 250</p>
                  </div>
                  <div className="col-6 col-md-3">
                    <label> Target Audience:</label>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" onChange={this.checkAll} className="custom-control-input" id="checkAll" />
                      <label className="custom-control-label" htmlFor="checkAll">Select All</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" onChange={this.checkbox} className="custom-control-input" id="checkU" />
                      <label className="custom-control-label" htmlFor="checkU">User</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" onChange={this.checkbox} className="custom-control-input" id="checkPU" />
                      <label className="custom-control-label" htmlFor="checkPU">Privileged User</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" onChange={this.checkbox} className="custom-control-input" id="checkSP" />
                      <label className="custom-control-label" htmlFor="checkSP">Service Provider</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" onChange={this.checkbox} className="custom-control-input" id="checkDP" />
                      <label className="custom-control-label" htmlFor="checkDP">Duty Personnel</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 mb-3">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" onChange={this.checkbox} className="custom-control-input" id="checkA" />
                      <label className="custom-control-label" htmlFor="checkA">Admin</label>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ backgroundColor: "#f1f1f1" }}>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-2 mt-2">
                    <button
                      type="reset"
                      onClick={this.res}
                      className="btn btn-block btn-danger"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-2 mt-2">
                    <button type="submit" className="btn btn-block btn-success">
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      );
    }
  }
}

export default Announcements;
