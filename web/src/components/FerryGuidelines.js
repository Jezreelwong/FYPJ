import React, { Component } from 'react';
import config from "../config.json";
import $ from "jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import FerryGuidelineModel from "../models/FerryGuideline";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from 'react-bootstrap/Spinner'
var moment = require("moment");
$.DataTable = require("datatables.net-bs4");
require("datatables.net-plugins/sorting/datetime-moment");
$.fn.dataTable.moment(config.format.datetime);
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class FerryGuidelines extends Component {
  state = {
    tableState: "All",
    data: [],
    length:600,
    isLoading: true,
    formState: "Create",
    editGuidelineId: "",
    guidelines: "",
    service: "P",
    status: "A",
    apierrors: null,
    errors: {
      blankfield: false,
    }
  };

  getFerryGuideline = async () => {
    var url = config.api.invokeUrl + "/ferryguideline?status=all";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      crossDomain: true,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: async (response) => {  
          this.setState({ data: response});
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  toggleForm = () => {
    this.resetWordCount();
    if (document.getElementById("FormModal").style.display === "none") {
      if (this.state.formState === "Edit") {   
        document.getElementById("form-error").innerText = "";                                 // clears form after edit
        document.getElementById("RadioPassenger").checked = true;
        this.setState({ formState: "Create", service:"P", length:600 });
      }
      document.getElementById("guidelines").value = "";
      document.getElementById("form-error").innerText = "";
      document.getElementById("FormModal").style.display = "block"
    }
    else
      document.getElementById("FormModal").style.display = "none"
  }

  closeForm = (event) => {
    if (event.target.id === "FormModal") {
      document.getElementById("FormModal").style.display = "none";
    }
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

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  resetWordCount = () =>{
    document.getElementById("guidelines").classList.remove("border-danger");
    document.getElementById("wordCount").innerText = "Characters Left 600";
    document.getElementById("wordCount").classList.remove("text-danger");
  }

  wordCount = event => {
    let newLength = 600 - event.target.value.length - (event.target.value.match(/\n/g)||[]).length;
    this.setState({
      guidelines: event.target.value, length: newLength
    });
    if(newLength < 0){
      document.getElementById(event.target.id).classList.add("border-danger");
      document.getElementById("wordCount").innerText = "Character Limit Exceeded!";
      document.getElementById("wordCount").classList.add("text-danger");
    }
    else{
      document.getElementById(event.target.id).classList.remove("border-danger");
      document.getElementById("wordCount").innerText = "Characters Left " + newLength;
      document.getElementById("wordCount").classList.remove("text-danger");
    }
  };

  onRadioClick = async event => {
    await this.setState({
      service: event.target.value
    });
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
    else if(this.state.length < 0){
      document.getElementById("form-error").innerText = "Guideline has a character limit of 600";
      document.getElementById("guidelines").classList.add("border-danger");
    }
    else if(this.state.guidelines.trim() === ""){
      document.getElementById("form-error").innerText = "Guideline cannot be empty.";
    }
    else {
      var url = config.api.invokeUrl + "/ferryguideline";
      var FerryGuideline = new FerryGuidelineModel(this.state.editGuidelineId, this.state.service, entities.encode(this.state.guidelines.replace(/\n/g, '~')), this.state.status, this.props.auth.user.preferred_username, this.props.auth.user.preferred_username);
      let httpType = "";
      let jsonData = "";
      if (this.state.formState === "Create") {
        url+="/add"
        httpType = "PUT";
      }
      else {
        url+="/update"
        httpType = "PATCH";
      }
      jsonData = FerryGuideline.convertObjToJSON();
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
    let columns = [];
    let order = [];
    if (this.state.tableState === "All") {
      columns = [        //set header for table
        { title: "Guidelines" },
        { title: "Service Provider Type" },
        { title: "Status" },
        { title: "Updated By"},
        { title: "Updated Date"},
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<button type='button' title='Edit' class='btn btn-link table_edit'><img alt='' src='icon_edit.png' height='25px' /></button>",
          "targets": -1
        },
      ]
      order = [[ 4, "desc" ]];
    }
    else{
      columns = [        //set header for table
        { title: "Guidelines" },
        { title: "Service Provider Type" },
        { title: "Updated By"},
        { title: "Updated Date"},
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<button type='button' title='Edit' class='btn btn-link table_edit'><img alt='' src='icon_edit.png' height='25px' /></button>",
          "targets": -1
        },
      ]
      order = [[ 3, "desc" ]];
    }

    $('#DataTable').DataTable({
      lengthChange: false,                  //data1       data2
      data: data,       //data must be in [ [col1,col2], [col1,col2] ] format
      "createdRow": function (row, data, dataIndex) {
        $(row).attr('id', data[5]);
      },
      columns: columns,
      "order": order,
      "initComplete": () => {
        $("#DataTable_filter label").contents().filter(function () {    //styling seachbar
          return this.nodeType === 3;
        }).remove()
        let searchbar = document.querySelector("#DataTable_filter label input");
        let searchbarDiv = document.getElementById("DataTable_filter");
        searchbar.setAttribute("placeholder", "Search Ferry Guideline");           //set searchbarplaceholder
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
        newBtn.innerHTML = '<span title="Add" ><i class="fas fa-plus"></i></span>';
        searchbarDiv.appendChild(newBtn)
        let newDiv = document.createElement("Div");
        newDiv.setAttribute("class", "col-12 col-md-10 col-lg-8 mt-4");     //need to add the codes below based on how many table tabs you have. edit the value and text according to your table state
        if (this.state.tableState === "All") {                          //eg users page has 4 tabs so 4 ifs statement and 4 button divs, annoucements has 2 tabs so 2 ifs and 2 button divs
          newDiv.innerHTML = `<div class="row mt-2 ml-0 mr-0">` +
            `<div class="col-3 table-btn-selected"><p>All</p></div>` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='P';document.getElementById('changeTable').click();"><p>Passenger</p></div>` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='RPL';document.getElementById('changeTable').click();"><p>RPL</p></div>` +
            `</div>`;
        }
        else if (this.state.tableState === "P") {
          newDiv.innerHTML = `<div class="row mt-2 ml-0 mr-0">` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
            `<div class="col-3 table-btn-selected"><p>Passenger</p></div>` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='RPL';document.getElementById('changeTable').click();"><p>RPL</p></div>` +
            `</div>`;
        }
        else if (this.state.tableState === "RPL") {
          newDiv.innerHTML = `<div class="row mt-2 ml-0 mr-0">` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='All';document.getElementById('changeTable').click();"><p>All</p></div>` +
            `<div class="col-3 table-btn" onclick="document.getElementById('changeTable').value='P';document.getElementById('changeTable').click();"><p>Passenger</p></div>` +
            `<div class="col-3 table-btn-selected"><p>RPL</p></div>` +
            `</div>`;
        }
        searchbarDiv.parentElement.parentElement.appendChild(newDiv);
        searchbarDiv.parentElement.parentElement.classList.add("ml-0", "mr-0", "tab-border");
        searchbarDiv.parentElement.parentElement.nextSibling.classList.add("overflow-data-table");
        let listOfDivs = searchbarDiv.parentElement.parentElement.childNodes;
        for (var i = 0; i < listOfDivs.length; i++) {
          listOfDivs[i].classList.add("pl-0", "pr-0");
        }
      }
    });
  }

  formatData = async (tableState) => {
    let data = [];
    for (var i = 0; i < this.state.data.length; i++) {
      let ferryguideline = ""
      let status = this.state.data[i]["status"] === "A" ? "Active" : "Inactive";
      let date = new Date(this.state.data[i]["updatedDate"]);
      date.setHours(date.getHours()-8)
      if (tableState === "All") {
        let service = this.state.data[i]["serviceProviderType"] === "P" ? "Passenger" : this.state.data[i]["serviceProviderType"];
        ferryguideline = [this.state.data[i]["guidelines"].replace(/~/g,"<br/>"), service, status, this.state.data[i]["updatedBy"], moment(date).format(config.format.datetime), this.state.data[i]["ferryGuidelineId"]];         //add Id for edit
      }
      else{
        if (this.state.data[i]["serviceProviderType"] === tableState)
          ferryguideline = [this.state.data[i]["guidelines"].replace(/~/g,"<br/>"), status, this.state.data[i]["updatedBy"], moment(date).format(config.format.datetime), this.state.data[i]["ferryGuidelineId"]];         //add Id for edit
      }
      if (ferryguideline !== "")
        data.push(ferryguideline);
    }
    return data
  }

  setEditClick = () =>{
    $('#DataTable').on('click', 'button.table_edit', async (event) => {                               //add click event listener function for edit
      let rowId = $(event.target).closest('tr').attr('id');
      let editData = "";
      for (var i = 0; i < this.state.data.length; i++) {
        if (parseInt(rowId) === this.state.data[i]["ferryGuidelineId"]) {
          editData = this.state.data[i];
          break;
        }
      }
      if (editData !== "") {                                                          //set default values to the edit form
        await this.setState({ formState: "Edit", editGuidelineId: editData["ferryGuidelineId"], service: editData["serviceProviderType"], guidelines: editData["guidelines"], status: editData["status"], length: 600 - editData["guidelines"].length });
        document.getElementById("guidelines").value = entities.decode(editData["guidelines"].replace(/~/g, String.fromCharCode(13, 10)));
        document.getElementById("guidelines").classList.remove("border-danger");
        document.getElementById("wordCount").innerText = "Characters Left " + this.state.length;
        document.getElementById("wordCount").classList.remove("text-danger");
        document.getElementById("form-error").innerText = "";
        if (editData["status"] === "A") {
          document.getElementById("status-toggle-btn").classList.remove("btn-danger");
          document.getElementById("status-toggle-btn").classList.add("btn-outline-success");
          document.getElementById("status-toggle-btn").innerText = "Active";
        }
        else {
          document.getElementById("status-toggle-btn").classList.remove("btn-outline-success");
          document.getElementById("status-toggle-btn").classList.add("btn-danger");
          document.getElementById("status-toggle-btn").innerText = "Inactive";
        }
        if (editData["serviceProviderType"] === "RPL")
          document.getElementById("RadioRPL").checked = true;
        else
          document.getElementById("RadioPassenger").checked = true;
        document.getElementById("FormModal").style.display = "block";
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
    this.setEditClick();
  }

  async componentDidMount() {
    this.props.auth.setNav("FerryGuideline");                    //set change this according to the value in Navbar.js If dk just ask me.
    await this.getFerryGuideline();    //api get data    below is api static data
    // await this.setState({ data: [{ "ferryGuidelineId": 1, "serviceProviderType": "P", "guidelines": "1. Indented strength should be as accurate as possible. Over indenting of strength to a large degree will be followed up on as a waste of funds.  2. Sea Transport Section is to be informed should the Unit is unable to make it for the timing. Failure ", "status": "A", "createdBy": "system", "createdDate": "2020-03-17T08:23:00.000Z", "updatedBy": "system", "updatedDate": "2020-03-17T08:23:00.000Z" }, { "ferryGuidelineId": 2, "serviceProviderType": "RPL", "guidelines": "1. All vehicles are to enter the RPL through Gate 3 at SFT.  2. Please note that RPL gate will only be opened 30 minutes prior to stated RPL timing.  3. Any vehicles attempting to enter SFT earlier than the stated timings will be rejected and asked t", "status": "A", "createdBy": "system", "createdDate": "2020-03-17T08:23:00.000Z", "updatedBy": "system", "updatedDate": "2020-03-17T08:23:00.000Z" }, { "ferryGuidelineId": 3, "serviceProviderType": "RPL", "guidelines": "1. Test", "status": "NA", "createdBy": null, "createdDate": "2020-04-17T03:31:09.000Z", "updatedBy": null, "updatedDate": "2020-04-17T03:31:09.000Z" }, { "ferryGuidelineId": 4, "serviceProviderType": "P", "guidelines": "1. Updated Guidelines", "status": "NA", "createdBy": null, "createdDate": "2020-04-21T05:09:55.000Z", "updatedBy": null, "updatedDate": "2020-04-21T05:09:55.000Z" }] })
    let data = await this.formatData(this.state.tableState);
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
            <p className="table-title">MANAGE FERRY GUIDELINE</p>
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
                  <h5>{(this.state.formState === "Create") ? "Create A New " : "Edit "}Ferry Guideline</h5>
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="guidelines">Guideline:</label>
                      <textarea className="form-control" onChange={this.wordCount} rows="5" type="text" id="guidelines"></textarea>
                      <p className="text-right" id="wordCount"> Characters Left: 600</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label> Service Provider:</label>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="custom-control custom-radio">
                      <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="RadioPassenger" defaultChecked value="P" />
                      <label className="custom-control-label" htmlFor="RadioPassenger">Passenger</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 mb-3">
                    <div className="custom-control custom-radio">
                      <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="RadioRPL" value="RPL" />
                      <label className="custom-control-label" htmlFor="RadioRPL">RPL</label>
                    </div>
                  </div>
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
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 ml-auto mb-2 mt-2"><button type="reset" onClick={this.resetWordCount} className="btn btn-block btn-outline-danger">Clear <i className="far fa-window-close"></i></button></div>
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

export default FerryGuidelines;