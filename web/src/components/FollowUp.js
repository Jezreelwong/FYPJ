import React, { Component } from 'react';
import config from "../config.json";
import BookingIssueModel from "../models/BookingIssue";
import SPFeedbackModel from "../models/SPFeedback";
import $ from "jquery";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from 'react-bootstrap/Spinner'
var moment = require("moment");
$.DataTable = require("datatables.net-bs4")
require("datatables.net-plugins/sorting/datetime-moment");
$.fn.dataTable.moment(config.format.date);
$.fn.dataTable.moment(config.format.time);
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class FollowUp extends Component {
  state = {
    tableState: "nonCompliance",
    nonComplianceData: [],
    issuedata: [],
    isLoading: true,
    formState: "Create",
    editFollowUpId: "",
    bookingCode: "",
    departureDate: "",
    departureTime: "",
    displayUserName: "",
    routeName: "",
    purposeShort: "",
    reportIssue: "",
    findings: "",
    status: "",
    feedbackType: "",
    spFeedbackId: "",
    name: "",
    onBoardTime: "",
    deduct: "false",
    bookingUnit: "",
    apierrors: null,
    errors: {
      blankfield: false,
    }
  };

  getFollowUpNonCompliance = async () => {
    var url = config.api.invokeUrl + "/bookings/noncompliance";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        if (response["statusCode"] === 200) {
          let data = [];
          if(response["body"] !== "[]"){
          for (var i = 0; i < response["body"].length; i++) {
            let vehicles = ""
            if (response["body"][i]["serviceProviderType"] === "RPL"){
            for (var j = 0; j < response["body"][i]["Vehicle"].length; j++) {
              if (j === 0)
                vehicles = response["body"][i]["Vehicle"][j]["name"];
              else
                vehicles += ", " + response["body"][i]["Vehicle"][j]["name"];
            }
          }
            let timeBoard = new Date(response["body"][i]["onBoardTime"]);
            let dateReport = new Date(response["body"][i]["SPFFeedback"]["reportedDate"]);
            timeBoard.setHours(timeBoard.getHours() - 8)
            dateReport.setHours(dateReport.getHours() - 8)
            let followUp = ""
            followUp = [
              response["body"][i]["bookingCode"],
              moment(response["body"][i]["departureDate"]).format(config.format.date),
              moment(response["body"][i]["departureTime"], "HHmm").format(config.format.time),
              response["body"][i]["displayUserName"],
              response["body"][i]["routeName"],
              response["body"][i]["purposeShort"],
              response["body"][i]["SPFFeedback"]["comments"],
              response["body"][i]["SPFFeedback"]["status"],
              response["body"][i]["SPFFeedback"]["findings"],
              response["body"][i]["SPFFeedback"]["spFeedbackId"],
              response["body"][i]["SPFFeedback"]["feedbackType"],
              vehicles,
              moment(timeBoard).format(config.format.time),
              response["body"][i]["SPFFeedback"]["reportedBy"],
              moment(dateReport).format(config.format.datetime),
              response["body"][i]["bookingUnit"],
            ];         //add Id for edit
            if (followUp !== "")
              data.push(followUp);
          }
        }
          this.setState({ nonComplianceData: data });
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  getFollowUpIssue = async () => {
    var url = config.api.invokeUrl + "/bookings/issue";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        if (response["statusCode"] === 200) {
          let data = [];
          if(response["body"] !== "[]"){  
          for (var i = 0; i < response["body"].length; i++) {
            let vehicles = ""
            if (response["body"][i]["serviceProviderType"] === "RPL"){
            for (var j = 0; j < response["body"][i]["Vehicle"].length; j++) {
              if (j === 0)
                vehicles = response["body"][i]["Vehicle"][j]["name"];
              else
                vehicles += ", " + response["body"][i]["Vehicle"][j]["name"];
            }
          }
            let date = new Date(response["body"][i]["departureDate"]);  //2020-05-15
            let time = new Date(response["body"][i]["departureTime"]);  //2230
            let timeBoard = new Date(response["body"][i]["onBoardTime"]);
            let dateReport = new Date(response["body"][i]["BookingIssue"]["reportedDate"]);  //2020-04-30T10:49:22.000Z
            //time.setHours(timeBoard.getHours() - 8);
            timeBoard.setHours(timeBoard.getHours() - 8)
            dateReport.setHours(dateReport.getHours() - 8)
            let followUp = [
              response["body"][i]["bookingCode"],
              moment(date).format(config.format.date),
              moment(time, "HHmm").format(config.format.time),
              response["body"][i]["displayUserName"],
              response["body"][i]["routeName"],
              response["body"][i]["purposeShort"],
              response["body"][i]["BookingIssue"]["reportIssue"],
              response["body"][i]["BookingIssue"]["status"],
              response["body"][i]["BookingIssue"]["findings"],
              vehicles,
              moment(timeBoard).format(config.format.time),
              response["body"][i]["BookingIssue"]["reportedBy"],
              moment(dateReport).format(config.format.datetime),
              response["body"][i]["bookingUnit"],
            ];         //add Id for edit
            if (followUp !== "")
              data.push(followUp);
          }
        }
          this.setState({ issuedata: data });
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  toggleForm = () => {
    if (document.getElementById("FormModal").style.display === "none") {
      if (this.state.formState === "Edit")                                   // clears form after edit
        this.setState({ formState: "Create" });
      if (this.state.tableState === "nonCompliance") {
        document.getElementById("bookingCode").value = "";
        document.getElementById("departureDate").value = "";
        document.getElementById("departureTime").value = "";
        document.getElementById("displayUserName").value = "";
        document.getElementById("routeName").value = "";
        document.getElementById("purposeShort").value = "";
        document.getElementById("comments").value = "";
        document.getElementById("findings").value = "";
        document.getElementById("spFeedbackId").value = "";
        document.getElementById("feedbackType").value = "";
        document.getElementById("deduct").checked = false;
      }
      else {
        document.getElementById("bookingCode").value = "";
        document.getElementById("departureDate").value = "";
        document.getElementById("departureTime").value = "";
        document.getElementById("displayUserName").value = "";
        document.getElementById("routeName").value = "";
        document.getElementById("purposeShort").value = "";
        document.getElementById("reportIssue").value = "";
        document.getElementById("findings").value = "";
      }
      document.getElementById("FormModal").style.display = "block";
    }
    else
      document.getElementById("FormModal").style.display = "none"
  }

  closeForm = (event) => {
    if (event.target.id === "FormModal") {
      document.getElementById("FormModal").style.display = "none";
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  deductChange = async (event) => {
    let cdeduct = { "deduct": "true" }
    let value = cdeduct[event.target.id];
    if (event.target.checked) {
      await this.setState({ deduct: value });
    }
    else {
      value = false;
      await this.setState({ deduct: "false" });
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        apierrors: null,
        blankfield: false,
      }
    });
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
    else if (this.state.findings.trim() === ""){
      document.getElementById("form-error").innerText = "Findings cannot be empty.";
    }
    else {
      var url = config.api.invokeUrl;
      var FollowUp = "";
      if (this.state.tableState === "nonCompliance") {
        url += "/bookings/noncompliance";
        FollowUp = new SPFeedbackModel(
          this.state.spFeedbackId,
          this.state.editFollowUpId,
          this.state.feedbackType,
          this.state.reportIssue,
          this.state.status,
          entities.encode(this.state.findings),
          this.state.deduct,
          this.state.bookingUnit,
          this.props.auth.user.preferred_username);
      }
      else {
        url += "/bookings/issue";
        FollowUp = new BookingIssueModel(
          this.state.editFollowUpId,
          this.state.reportIssue,
          this.state.status,
          entities.encode(this.state.findings),
          this.state.deduct,
          this.state.bookingUnit,
          this.props.auth.user.preferred_username);
      }
      let httpType = "";
      let jsonData = "";
      if (this.state.formState === "Create") {
        url += "/add"
        httpType = "PUT";
      }
      else {
        url += "/update"
        httpType = "PATCH";
      }
      jsonData = FollowUp.convertObjToJSON();
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
            window.location.reload()
          }
        },
        error: (xhr, status, err) => {
          if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }           
      });
    }
  }

  initializeTable = (data) => {
    //to shorten the output of comments
    var dataOutside = [];
    for (var i = 0; i < data.length; i++){
      dataOutside[i] = data[i].slice();
    }
    for(var a = 0; a < dataOutside.length; a++) {
      if(dataOutside[a][6].length > 50){
        dataOutside[a][6] = dataOutside[a][6].substring(0,50);
        dataOutside[a][6] = dataOutside[a][6].concat("...");
      }
    }
  
    let columns = [];
    if (this.state.tableState === "nonCompliance") {
      columns = [        //set header for table
        { title: "Booking Code" },
        { title: "Booking Date" },
        { title: "Booking Time" },
        { title: "Booked By" },
        { title: "Direction" },
        { title: "Purpose" },
        { title: "Comments" },
        { title: "Status" },
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<button type='button' class='btn btn-link table_edit'><img alt='' src='bttn_edit.png' height='25px' /></button>",
          "targets": -1
        },
      ]
    }
    else {
      columns = [        //set header for table
        { title: "Booking Code" },
        { title: "Booking Date" },
        { title: "Booking Time" },
        { title: "Booked By" },
        { title: "Direction" },
        { title: "Purpose" },
        { title: "Report Issue" },
        { title: "Status" },
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<button type='button' class='btn btn-link table_edit'><img alt='' src='bttn_edit.png' height='25px' /></button>",
          "targets": -1
        },
      ]
    }

    $('#DataTable').DataTable({
      lengthChange: false,                  //data1       data2
      data: dataOutside,       //data must be in [ [col1,col2], [col1,col2] ] format
      "createdRow": function (row, data, dataIndex) {
        $(row).attr('id', data[0]);
      },
      columns: columns,
      order: [[ 1, "desc" ]],
      "initComplete": () => {
        $("#DataTable_filter label").contents().filter(function () {    //styling seachbar
          return this.nodeType === 3;
        }).remove()
        let searchbar = document.querySelector("#DataTable_filter label input");
        let searchbarDiv = document.getElementById("DataTable_filter");
        searchbar.setAttribute("placeholder", "Search Follow Up");           //set searchbarplaceholder
        searchbar.classList.remove("form-control-sm");
        searchbar.classList.add("ml-0");
        searchbar.style.width = "100%";
        searchbar.parentElement.style.width = "100%";
        searchbar.parentElement.style.marginBottom = "0";
        searchbarDiv.parentElement.classList.remove("col-md-6");
        searchbarDiv.classList.add("d-flex");
        let newDiv = document.createElement("Div");
        newDiv.setAttribute("class", "col-12 col-md-10 col-lg-8 mt-4");     //need to add the codes below based on how many table tabs you have. edit the value and text according to your table state
        if (this.state.tableState === "nonCompliance") {                          //eg users page has 4 tabs so 4 ifs statement and 4 button divs, annoucements has 2 tabs so 2 ifs and 2 button divs
          newDiv.innerHTML = `<div class="row mt-2 ml-0 mr-0">` +
            `<div class="col-3 table-btn-selected"><p>Non Compliance</p></div>` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='issue';document.getElementById('changeTable').click();"><p>Reported with Issues</p></div>` +
            `</div>`;
        }
        else if (this.state.tableState === "issue") {                          //eg users page has 4 tabs so 4 ifs statement and 4 button divs, annoucements has 2 tabs so 2 ifs and 2 button divs
          newDiv.innerHTML = `<div class="row mt-2 ml-0 mr-0">` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='nonCompliance';document.getElementById('changeTable').click();"><p>Non Compliance</p></div>` +
            `<div class="col-3 table-btn-selected"><p>Reported with Issues</p></div>` +
            `</div>`;
        }
        searchbarDiv.parentElement.parentElement.appendChild(newDiv);
        searchbarDiv.parentElement.parentElement.classList.add("ml-0", "mr-0", "tab-border");
        searchbarDiv.parentElement.parentElement.nextSibling.classList.add("overflow-auto");
        let listOfDivs = searchbarDiv.parentElement.parentElement.childNodes;
        for (var i = 0; i < listOfDivs.length; i++) {
          listOfDivs[i].classList.add("pl-0", "pr-0");
        }
      }
    });
  }

  setEditClick = () => {
    $('#DataTable').on('click', 'button.table_edit', async (event) => {                               //add click event listener function for edit
      let rowId = $(event.target).closest('tr').attr('id');
      let editData = "";
      var dataList = [];
      if (this.state.tableState === "nonCompliance") {
        dataList = this.state.nonComplianceData;
      }
      else {
        dataList = this.state.issuedata;
      }
      for (var i = 0; i < dataList.length; i++) {
        if (rowId.toString() === dataList[i][0]) {
          editData = dataList[i];
          break;
        }
      }

      if (editData !== "") {                                                          //set default values to the edit form
        if (this.state.tableState === "nonCompliance") {
          await this.setState({
            formState: "Edit",
            editFollowUpId: editData[0],
            departureDate: editData[1],
            departureTime: editData[2],
            displayUserName: editData[3],
            routeName: editData[4],
            purposeShort: editData[5],
            reportIssue: editData[6],
            status: editData[7],
            findings: editData[8],
            spFeedbackId: editData[9],
            feedbackType: editData[10],
            name: editData[11],
            onBoardTime: editData[12],
            reportedBy: editData[13],
            reportedDate: editData[14],
            bookingUnit: editData[15],
          });
          document.getElementById("bookingCode").innerText = editData[0];
          document.getElementById("departureDate").innerText = editData[1];
          document.getElementById("departureTime").innerText = editData[2];
          document.getElementById("displayUserName").innerText = editData[3];
          document.getElementById("routeName").innerText = editData[4];
          document.getElementById("purposeShort").innerText = editData[5];
          document.getElementById("reportIssue").innerText = editData[6];
          document.getElementById("findings").value = entities.decode(editData[8]);
          document.getElementById("status").value = editData[7];
          document.getElementById("feedbackType").innerText = editData[10];
          document.getElementById("name").innerText = editData[11];
          document.getElementById("onBoardTime").innerText = editData[12];
          document.getElementById("reportedBy").innerText = editData[13];
          document.getElementById("reportedDate").innerText = editData[14];
        }

        else {
          await this.setState({
            formState: "Edit",
            editFollowUpId: editData[0],
            departureDate: editData[1],
            departureTime: editData[2],
            displayUserName: editData[3],
            routeName: editData[4],
            purposeShort: editData[5],
            reportIssue: editData[6],
            status: editData[7],
            findings: editData[8],
            name: editData[9],
            onBoardTime: editData[10],
            reportedBy: editData[11],
            reportedDate: editData[12],
            bookingUnit: editData[13],
          });
          document.getElementById("bookingCode").innerText = editData[0];
          document.getElementById("departureDate").innerText = editData[1];
          document.getElementById("departureTime").innerText = editData[2];
          document.getElementById("displayUserName").innerText = editData[3];
          document.getElementById("routeName").innerText = editData[4];
          document.getElementById("purposeShort").innerText = editData[5];
          document.getElementById("reportIssue").innerText = editData[6];
          document.getElementById("status").value = editData[7];
          document.getElementById("findings").value = entities.decode(editData[8]);
          document.getElementById("name").innerText = editData[9];
          document.getElementById("onBoardTime").innerText = editData[10];
          document.getElementById("reportedBy").innerText = editData[11];
          document.getElementById("reportedDate").innerText = editData[12];

        }

        document.getElementById("FormModal").style.display = "block";
      }
    });
  }

  changeTable = async () => {
    let data = [];
    let newTableState = document.getElementById("changeTable").value;           //set which data display on which state

    if (newTableState === "nonCompliance") {
      data = this.state.nonComplianceData;
    }
    else {
      data = this.state.issuedata;
    }
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
    this.setEditClick();
  }

  async componentDidMount() {
    this.props.auth.setNav("FollowUp");                    //set change this according to the value in Navbar.js If dk just ask me. 
    await this.getFollowUpNonCompliance();     //api get data 
    await this.getFollowUpIssue();             //api get data   
    let data = this.state.nonComplianceData;
    await this.initializeTable(data);
    this.setEditClick();
    this.setState({ isLoading: false });
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
            <p className="table-title">MANAGE FOLLOW UP ACTIONS</p>
            <input onClick={this.toggleForm} type="hidden" id="addData" />
            <input onClick={this.changeTable} type="hidden" id="changeTable" />
            <div className="data-div shadow bg-white">
              <div className="data-table-div m-3">
                <table id="DataTable" className="data-table" width="100%"></table>
              </div>
              {this.state.isLoading && (<div className="text-center m-3">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>)}
            </div>

            <div className="form-modal" onClick={this.closeForm} style={{ display: "none" }} id="FormModal">
              <form autoComplete="off" onSubmit={this.handleSubmit} className="form-content animate pl-3 pr-3">
                <span onClick={this.toggleForm} className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>{(this.state.formState === "Create") ? "Create A New " : "Edit "}Follow Up Action</h5>
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">
                  <div style={{ border: "1px solid rgb(48, 110, 129)", width: "98%", margin: "20px" }}>
                    <div style={{ borderBottom: "1px solid rgb(48, 110, 129)", marginLeft: "15px", marginRight: "15px", marginTop: "5px", fontSize: "20px" }}>
                      <h5>Booking Details
                        <span id="bookingCode" style={{ float: "right" }}></span>
                      </h5>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        {this.state.tableState === "nonCompliance" && (
                          <div className="col-6 col-sm-3 mb-2"><b>Feedback Type:</b></div>
                        )}
                        {this.state.tableState === "nonCompliance" && (
                          <div className="col-6 col-sm-9 mb-2"><span id="feedbackType" /></div>
                        )}
                        <div className="col-6 col-sm-3 mb-2"><b>Booking Date:</b></div>
                        <div className="col-6 col-sm-3 mb-2"><span id="departureDate" /></div>
                        <div className="col-6 col-sm-3 mb-2"><b>Direction:</b></div>
                        <div className="col-6 col-sm-3 mb-2"><span id="routeName" /></div>
                        <div className="col-6 col-sm-3 mb-2"><b>Booking Time:</b></div>
                        <div className="col-6 col-sm-3 mb-2"><span id="departureTime" /></div>
                        <div className="col-6 col-sm-3 mb-2"><b>Purpose:</b></div>
                        <div className="col-6 col-sm-3 mb-2"><span id="purposeShort" /></div>
                        <div className="col-6 col-sm-3 mb-2"><b>Booked By:</b></div>
                        <div className="col-6 col-sm-3 mb-2"><span id="displayUserName" /></div>
                        <div className="col-6 col-sm-3 mb-2"><b>OnBoard Time:</b></div>
                        <div className="col-6 col-sm-3 mb-2"><span id="onBoardTime" /></div>
                        <div className="col-12 col-sm-3 mb-2"><b>Vehicle(s):</b></div>
                        <div className="col-12 col-sm-9 mb-2"><span id="name" /></div>

                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="reportIssue" style={{ marginRight: "10px" }}>Report Issue:</label>
                      <span id="reportIssue" />
                      <br />
                      <label htmlFor="reportedBy" style={{ marginRight: "10px" }}>Reported By:</label>
                      <span id="reportedBy" />
                      <br />
                      <label htmlFor="reportedDate" style={{ marginRight: "10px" }}>Reported Date:</label>
                      <span id="reportedDate" />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="findings">Findings:</label>
                      <textarea className="form-control" onChange={this.onInputChange} type="text" required rows="5" id="findings"></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="status">Status:</label>
                    <select id="status" className="form-control mb-3" required onChange={this.onInputChange}>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  {this.state.tableState === "nonCompliance" && this.state.status === "Completed" && (
                  <div className="col-12" style={{ marginBottom: "20px" }}>
                    <div className="custom-control custom-checkbox">
                      <input className="custom-control-input" onChange={this.deductChange} type="checkbox" id="deduct" />
                      <label className="custom-control-label" htmlFor="deduct">Deduct Booking Unit Performance Rating</label>
                    </div>
                  </div>
                  )}

                </div>
                <div className="row" style={{ backgroundColor: "#f1f1f1" }}>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 ml-auto mb-2 mt-2"><button type="reset" className="btn btn-block btn-outline-danger">Clear <i className="far fa-window-close"></i></button></div>
                  {(this.state.formState === "Create")
                    ? <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2 mt-2"><button type="submit" className="btn btn-block btn-success">Create <i className="far fa-plus-square"></i></button></div>
                    : <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2 mt-2"><button type="submit" className="btn btn-block btn-outline-primary">Update <i className="fas fa-edit"></i></button></div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default FollowUp;