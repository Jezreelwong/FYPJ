import React, { Component } from 'react';
import config from "../config.json";
import VehicleModel from "../models/Vehicle";
import $ from "jquery";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from 'react-bootstrap/Spinner'
var moment = require("moment");
$.DataTable = require("datatables.net-bs4")
require("datatables.net-plugins/sorting/datetime-moment");
$.fn.dataTable.moment(config.format.datetime);
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

//static vehicle data[{"vehicleId":5,"name":"Bus (40 seater)","load":3,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":1,"name":"Lorry (12 FT)","load":0.7,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":2,"name":"Lorry (24 FT)","load":1.3,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":3,"name":"Lorry (30 FT)","load":2,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":19,"name":"my2ndtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T00:55:25.000Z","updatedBy":null,"updatedDate":"2020-04-26T00:55:25.000Z"},{"vehicleId":20,"name":"my3rdtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T01:00:54.000Z","updatedBy":null,"updatedDate":"2020-04-26T01:00:54.000Z"},{"vehicleId":213,"name":"my3rdtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T04:43:16.000Z","updatedBy":null,"updatedDate":"2020-04-26T04:43:16.000Z"},{"vehicleId":214,"name":"my5thtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T04:44:59.000Z","updatedBy":null,"updatedDate":"2020-04-26T04:44:59.000Z"},{"vehicleId":216,"name":"myAPItestcar","load":1,"status":"A","createdBy":null,"createdDate":"2020-04-26T05:54:43.000Z","updatedBy":null,"updatedDate":"2020-04-26T05:54:43.000Z"},{"vehicleId":18,"name":"myedittestcar","load":0.1,"status":"A","createdBy":null,"createdDate":"2020-04-24T06:16:26.000Z","updatedBy":null,"updatedDate":"2020-04-24T06:16:26.000Z"},{"vehicleId":215,"name":"mylambdatestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T05:10:52.000Z","updatedBy":null,"updatedDate":"2020-04-26T05:10:52.000Z"},{"vehicleId":13,"name":"Tank","load":2.3,"status":"A","createdBy":null,"createdDate":"2020-04-22T02:01:36.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:01:36.000Z"},{"vehicleId":14,"name":"Tank4","load":3.2,"status":"A","createdBy":null,"createdDate":"2020-04-22T02:06:33.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:06:33.000Z"},{"vehicleId":6,"name":"Updated Test Car","load":1.4,"status":"A","createdBy":null,"createdDate":"2020-04-17T03:10:46.000Z","updatedBy":null,"updatedDate":"2020-04-17T03:10:46.000Z"},{"vehicleId":4,"name":"Van","load":0.7,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":16,"name":"van","load":1.3,"status":"A","createdBy":null,"createdDate":"2020-04-22T03:26:49.000Z","updatedBy":null,"updatedDate":"2020-04-22T03:26:49.000Z"},{"vehicleId":11,"name":"Van Test","load":1.2,"status":"A","createdBy":null,"createdDate":"2020-04-20T09:20:38.000Z","updatedBy":null,"updatedDate":"2020-04-20T09:20:38.000Z"},{"vehicleId":17,"name":"Van2","load":3.2,"status":"A","createdBy":null,"createdDate":"2020-04-23T01:39:32.000Z","updatedBy":null,"updatedDate":"2020-04-23T01:39:32.000Z"},{"vehicleId":12,"name":"Test2","load":9.9,"status":"NA","createdBy":null,"createdDate":"2020-04-22T02:00:42.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:00:42.000Z"},{"vehicleId":7,"name":"Van Test","load":0.7,"status":"NA","createdBy":null,"createdDate":"2020-04-20T08:29:23.000Z","updatedBy":null,"updatedDate":"2020-04-20T08:29:23.000Z"},{"vehicleId":15,"name":"Van2","load":1,"status":"NA","createdBy":null,"createdDate":"2020-04-22T02:11:54.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:11:54.000Z"}];

class Vehicle extends Component {

  state = {
    tableState: "All",
    data: [],
    isLoading: true,
    formState: "Create",
    editVehicleId: "",
    name: "",
    load: "",
    status: "A",
    apierrors: null,
    errors: {
      blankfield: false,
    }
  };

  getVehicle = async () => {
    var url = config.api.invokeUrl + "/vehicle?status=all";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        if (response["statusCode"] === 200) {
          this.setState({ data: response["body"] });
          let vehicleRPLList = []
          let vehicleRPLData = []
          if (sessionStorage.getItem("vehicleRPLList")) {
            for (var x = 0; x < this.state.data.length; x++) {
              vehicleRPLList.push(this.state.data[x].name)
              vehicleRPLData.push(this.state.data[x]);
            }
            sessionStorage.setItem("vehicleRPLList", JSON.stringify(vehicleRPLList));
            sessionStorage.setItem("vehicleRPLData", JSON.stringify(vehicleRPLData));
          }
        }
      },
      error: (xhr, status, err) => {
        if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  toggleForm = () => {
    if (document.getElementById("FormModal").style.display === "none") {
      if (this.state.formState === "Edit")
        this.setState({ formState: "Create" });
      document.getElementById("name").value = "";
      document.getElementById("load").value = "";
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
    else if (this.state.name.trim() === "") {
      document.getElementById("form-error").innerText = "Name cannot be empty."
    }
    else {
      var url = config.api.invokeUrl + "/vehicle";
      var Vehicle = new VehicleModel(this.state.editVehicleId, entities.encode(this.state.name), this.state.load, this.state.status, this.props.auth.user.preferred_username, this.props.auth.user.preferred_username);
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
      jsonData = Vehicle.convertObjToJSON();
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
          else {
            console.log(response);
          }
        },
        error: (xhr, status, err) => {
          if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }
      });
    }
  }

  initializeTable = (data) => {
    let columns = [];
    if (this.state.tableState === "All") {
      columns = [        //set header for table
        { title: "Name" },
        { title: "Load" },
        { title: "Status" },
        { title: "Updated By" },
        { title: "Updated Date" },
        {
          "data": null,                                                                               //add these for edit columns
          "defaultContent": "<button type='button' title='Edit' class='btn btn-link table_edit'><img alt='' src='icon_edit.png' height='25px' /></button>",
          "targets": -1
        },
      ]
    }

    $('#DataTable').DataTable({
      lengthChange: false,                  //data1       data2
      data: data,       //data must be in [ [col1,col2], [col1,col2] ] format
      "createdRow": function (row, data, dataIndex) {
        $(row).attr('id', data[5]);
      },
      columns: columns,
      order: [[4, "desc"]],
      "initComplete": () => {
        $("#DataTable_filter label").contents().filter(function () {    //styling seachbar
          return this.nodeType === 3;
        }).remove()
        let searchbar = document.querySelector("#DataTable_filter label input");
        let searchbarDiv = document.getElementById("DataTable_filter");
        searchbar.setAttribute("placeholder", "Search Vehicle");           //set searchbarplaceholder
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
        newDiv.setAttribute("class", "col-12 col-md-10 col-lg-8 mt-4");     //need to add the codes below based on how many table tabs you have. edit the value and text according to your table state
        searchbarDiv.parentElement.parentElement.appendChild(newDiv);
        searchbarDiv.parentElement.parentElement.classList.add("ml-0", "mr-0");
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
    let condition = "";
    if (tableState !== "All")
      condition = "tableState";
    for (var i = 0; i < this.state.data.length; i++) {
      let vehicle = ""
      let status = this.state.data[i]["status"] === "A" ? "Active" : "Inactive";
      let date = new Date(this.state.data[i]["updatedDate"]);
      date.setHours(date.getHours() - 8)
      if (condition === "") {
        vehicle = [this.state.data[i]["name"], this.state.data[i]["load"], status, this.state.data[i]["updatedBy"], moment(date).format(config.format.datetime), this.state.data[i]["vehicleId"]];         //add Id for edit
      }
      if (vehicle !== "")
        data.push(vehicle);
    }
    return data
  }

  setEditClick = () => {
    $('#DataTable').on('click', 'button.table_edit', async (event) => {                               //add click event listener function for edit
      let rowId = $(event.target).closest('tr').attr('id');
      let editData = "";
      for (var i = 0; i < this.state.data.length; i++) {
        if (parseInt(rowId) === this.state.data[i]["vehicleId"]) {
          editData = this.state.data[i];
          break;
        }
      }

      if (editData !== "") {                                                          //set default values to the edit form
        await this.setState({ formState: "Edit", editVehicleId: editData["vehicleId"], name: editData["name"], load: editData["load"], status: editData["status"] });
        document.getElementById("name").value = entities.decode(editData["name"]);
        document.getElementById("load").value = editData["load"];
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
        document.getElementById("FormModal").style.display = "block";
      }
    });
  }

  async componentDidMount() {
    this.props.auth.setNav("Vehicle");                    //set change this according to the value in Navbar.js If dk just ask me.
    await this.getVehicle();    //api get data    below is api static data
    //await this.setState({ data: [{ "vehicleId":5,"name":"Bus (40 seater)","load":3,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":1,"name":"Lorry (12 FT)","load":0.7,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":2,"name":"Lorry (24 FT)","load":1.3,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":3,"name":"Lorry (30 FT)","load":2,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":19,"name":"my2ndtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T00:55:25.000Z","updatedBy":null,"updatedDate":"2020-04-26T00:55:25.000Z"},{"vehicleId":20,"name":"my3rdtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T01:00:54.000Z","updatedBy":null,"updatedDate":"2020-04-26T01:00:54.000Z"},{"vehicleId":213,"name":"my3rdtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T04:43:16.000Z","updatedBy":null,"updatedDate":"2020-04-26T04:43:16.000Z"},{"vehicleId":214,"name":"my5thtestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T04:44:59.000Z","updatedBy":null,"updatedDate":"2020-04-26T04:44:59.000Z"},{"vehicleId":216,"name":"myAPItestcar","load":1,"status":"A","createdBy":null,"createdDate":"2020-04-26T05:54:43.000Z","updatedBy":null,"updatedDate":"2020-04-26T05:54:43.000Z"},{"vehicleId":18,"name":"myedittestcar","load":0.1,"status":"A","createdBy":null,"createdDate":"2020-04-24T06:16:26.000Z","updatedBy":null,"updatedDate":"2020-04-24T06:16:26.000Z"},{"vehicleId":215,"name":"mylambdatestcar","load":2,"status":"A","createdBy":null,"createdDate":"2020-04-26T05:10:52.000Z","updatedBy":null,"updatedDate":"2020-04-26T05:10:52.000Z"},{"vehicleId":13,"name":"Tank","load":2.3,"status":"A","createdBy":null,"createdDate":"2020-04-22T02:01:36.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:01:36.000Z"},{"vehicleId":14,"name":"Tank4","load":3.2,"status":"A","createdBy":null,"createdDate":"2020-04-22T02:06:33.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:06:33.000Z"},{"vehicleId":6,"name":"Updated Test Car","load":1.4,"status":"A","createdBy":null,"createdDate":"2020-04-17T03:10:46.000Z","updatedBy":null,"updatedDate":"2020-04-17T03:10:46.000Z"},{"vehicleId":4,"name":"Van","load":0.7,"status":"A","createdBy":"system","createdDate":"2020-03-17T08:31:08.000Z","updatedBy":"system","updatedDate":"2020-03-17T08:31:08.000Z"},{"vehicleId":16,"name":"van","load":1.3,"status":"A","createdBy":null,"createdDate":"2020-04-22T03:26:49.000Z","updatedBy":null,"updatedDate":"2020-04-22T03:26:49.000Z"},{"vehicleId":11,"name":"Van Test","load":1.2,"status":"A","createdBy":null,"createdDate":"2020-04-20T09:20:38.000Z","updatedBy":null,"updatedDate":"2020-04-20T09:20:38.000Z"},{"vehicleId":17,"name":"Van2","load":3.2,"status":"A","createdBy":null,"createdDate":"2020-04-23T01:39:32.000Z","updatedBy":null,"updatedDate":"2020-04-23T01:39:32.000Z"},{"vehicleId":12,"name":"Test2","load":9.9,"status":"NA","createdBy":null,"createdDate":"2020-04-22T02:00:42.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:00:42.000Z"},{"vehicleId":7,"name":"Van Test","load":0.7,"status":"NA","createdBy":null,"createdDate":"2020-04-20T08:29:23.000Z","updatedBy":null,"updatedDate":"2020-04-20T08:29:23.000Z"},{"vehicleId":15,"name":"Van2","load":1,"status":"NA","createdBy":null,"createdDate":"2020-04-22T02:11:54.000Z","updatedBy":null,"updatedDate":"2020-04-22T02:11:54.000Z" }] })
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
            <p className="table-title">MANAGE VEHICLE</p>
            <input onClick={this.toggleForm} type="hidden" id="addData" />
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
                  <h5>{(this.state.formState === "Create") ? "Create A New " : "Edit "}Vehicle</h5>
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="name">Name:</label>
                      <input className="form-control" onChange={this.onInputChange} required type="text" id="name" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="load">Load:</label>
                      <input className="form-control" onChange={this.onInputChange} required type="number" min="0.1" max="9.9" step=".1" id="load" />
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

export default Vehicle;