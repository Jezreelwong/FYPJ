import React, { Component } from 'react';
import config from "../config.json";
import $ from "jquery";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from 'react-bootstrap/Spinner'
import ScheduleTemplateModel from "../models/ScheduleTemplate";
var moment = require("moment");
let dayDisplay = { "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat", "7": "Sun" }

class ScheduleTemplate extends Component {
  state = {
    scheduleState: "P",
    data: [],
    dataRoute: [],
    isLoading: true,
    formState: "Create",
    status: "A",
    days: "",
    recurring: "",
    service: "P",
    templateSchedule: "",
    departureTime: "",
    routeId: "",
    apierrors: null,
    errors: {
      blankfield: false,
    }
  };

  changeSchedulePassenger = () => {
    this.setState({
      scheduleState: "P",
    });
  };

  changeScheduleRPL = () => {
    this.setState({
      scheduleState: "RPL",
    });
  };

  getTemplate = async () => {
    var url = config.api.invokeUrl + "/scheduletemplate/get";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        if (response["statusCode"] === 200)
          this.setState({ data: response["body"], isLoading: false });

      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  getRoute = async () => {
    var url = config.api.invokeUrl + "/route?serviceProviderType=all&status=A";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        this.setState({ dataRoute: response["body"] });
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  setTemplateP = () => {
    var obj = [];
    let route = [];
    let routeName;
    let timing = [];
    let day = [];
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i]["serviceProviderType"] === "P") {
        for (var k = 0; k < this.state.data[i]["timing"].split(", ").length; k++) {
          timing = this.state.data[i]["timing"].split(", ")

          if (!route.includes(this.state.data[i]["routeId"])) {
            for (var j = 0; j < this.state.dataRoute.length; j++) {
              if (this.state.dataRoute[j]["routeId"] === this.state.data[i]["routeId"])
                routeName = this.state.dataRoute[j]["routeName"];
            }
            obj.push(<hr style={{ backgroundColor: "#eee" }} key={i} />)
            route.push(this.state.data[i]["routeId"]);
            obj.push(<h3 className="ml-2" style={{ marginBottom:"-10px"}} key={this.state.data[i]["routeId"]}>{routeName}
              <button type='button' title='Edit' data-routeid={this.state.data[i]["routeId"]} onClick={this.setEditTemplate} className='btn btn-link table_edit'><img alt='' src='icon_edit.png' height='30px' /></button>
            </h3>)
            day = [];
          }
          if (!day.includes(this.state.data[i]["day"])) {
            day.push(this.state.data[i]["day"]);
            obj.push(<span className="row col-12" key={this.state.data[i]["routeId"] + this.state.data[i]["day"]}><span className="ml-2 mt-3" style={{ fontSize: "20px", display: "inline-block", width: "60px" }}><b>{dayDisplay[this.state.data[i]["day"]]}</b></span><br/></span>)
          }

          obj.push(
            <span key={this.state.data[i]["routeId"] + this.state.data[i]["day"] + timing[k]}>
              <button
                onClick={this.setEditClick}
                data-routeid={this.state.data[i]["routeId"]}
                className="scheduleTemplatebtn"
              >
                {moment(timing[k], "HHmm").format(config.format.time)}
              </button>
            </span>
          );
        }
      }
    }
    if (obj.length === 0) {
      obj.push(<div key="empty" className="text-center font-weight-bold">No Template available</div>)
    }
    return obj;
  }

  setTemplateRPL = () => {
    var obj = [];
    let route = [];
    let routeName;
    let day = [];
    let timing = [];
    for (var i = 0; i < this.state.data.length; i++) {

      if (this.state.data[i]["serviceProviderType"] === "RPL") {
        for (var k = 0; k < this.state.data[i]["timing"].split(", ").length; k++) {
          timing = this.state.data[i]["timing"].split(", ")

          if (!route.includes(this.state.data[i]["routeId"])) {
            for (var j = 0; j < this.state.dataRoute.length; j++) {
              if (this.state.dataRoute[j]["routeId"] === this.state.data[i]["routeId"])
                routeName = this.state.dataRoute[j]["routeName"];
            }
            obj.push(<hr style={{ backgroundColor: "#eee" }} key={i} />)
            route.push(this.state.data[i]["routeId"]);
            obj.push(<h3 className="ml-2" style={{ marginBottom:"-10px"}} key={this.state.data[i]["routeId"]}>{routeName}
              <button type='button' title='Edit' data-routeid={this.state.data[i]["routeId"]} onClick={this.setEditTemplate} className='btn btn-link table_edit'><img alt='' src='icon_edit.png' height='30px' /></button>
            </h3>)
            day = [];
          }
          if (!day.includes(this.state.data[i]["day"])) {
            day.push(this.state.data[i]["day"]);
            obj.push(<span className="row col-12" key={this.state.data[i]["routeId"] + this.state.data[i]["day"]}><span className="ml-2 mt-3" style={{ fontSize: "20px", display: "inline-block", width: "60px" }}><b>{dayDisplay[this.state.data[i]["day"]]}</b></span><br/></span>)
          }

          obj.push(
            <span key={this.state.data[i]["routeId"] + this.state.data[i]["day"] + timing[k]}>
              <button
                disabled
                data-scheduleid={this.state.data[i]["routeId"]}
                className="scheduleTemplatebtn"
              >
                {moment(timing[k], "HHmm").format(config.format.time)}
              </button>
            </span>
          );
        }
      }
    }
    if (obj.length === 0) {
      obj.push(<div key="empty" className="text-center font-weight-bold">No Template available</div>)
    }
    return obj;
  }

  closeTemplate = (event) => {
    if (event.target.id === "AddTemplate" || event.target.id === "cls-template") {
      document.getElementById("AddTemplate").style.display = "none";
      this.setState({ formState: "Create", templateSchedule: "" })
    }
  }

  setEditTemplate = async (event) => {
    let templateRoute = "";
    let routeId = event.currentTarget.dataset.routeid;
    let editData = "";
    let service = "";
    let timing = [];
    let time = [];
    let day = [];
    for (var i = 0; i < this.state.dataRoute.length; i++) {
      if (parseInt(routeId) === this.state.dataRoute[i]["routeId"]) {
        templateRoute = this.state.dataRoute[i]["routeName"];
        break;
      }
    }
    for (var j = 0; j < this.state.data.length; j++) {
      if (parseInt(routeId) === this.state.data[j]["routeId"]) {
        editData = this.state.data[j];

        for (var k = 0; k < this.state.data[j]["timing"].split(", ").length; k++) {
          timing = this.state.data[j]["timing"].split(", ")

          if (!time.includes(timing[k])) {
            //time array
            time.push(timing[k]);
          }

          for (var d = 0; d < time.length; d++) {
            if (timing[k].includes(time[d])) {
              //time + day not combined
              //loop thru day
              //if timing in day exists, add ;[number]
              //else push new timing to day
              var included = false;
              for (var l = 0; l < day.length; l++) {
                if (day[l].includes(time[d])) {
                  //this is if timing exists in the loop
                  day[l] = day[l] + ";" + this.state.data[j]["day"];
                  included = true;
                }
              }
              if (included === false)
                day.push(time[d] + "x" + this.state.data[j]["day"]);
            }
          }
        }
      }
    }
    if (editData !== "") {
      await this.setState({ formState: "Edit", routeId: routeId, service: editData["serviceProviderType"] });
      document.getElementById("departureTime").value = "";
      document.getElementById("mon").checked = false;
      document.getElementById("tue").checked = false;
      document.getElementById("wed").checked = false;
      document.getElementById("thu").checked = false;
      document.getElementById("fri").checked = false;
      document.getElementById("sat").checked = false;
      document.getElementById("sun").checked = false;
      for (var t = 0; t < day.length; t++) {
        if (this.state.templateSchedule === "") {
          await this.setState({ templateSchedule: day[t] });
        }
        else {
          await this.setState({ templateSchedule: this.state.templateSchedule + "," + day[t] })
        }
      }
      if (editData["serviceProviderType"] === "P")
        service = "Passenger";
      else
        service = "RPL"

      document.getElementById("editservice").innerText = service;
      document.getElementById("editrouteName").innerText = templateRoute;
      document.getElementById("AddTemplate").style.display = "block";
      this.addTemplateForm();
    }

  }

  addTemplete = () => {
    if (document.getElementById("AddTemplate").style.display === "none") {
      if (this.state.formState === "Edit") {                                    // clears form after edit
        document.getElementById("departureTime").value = "";
        document.getElementById("RadioPassenger").checked = true;
        if (document.getElementById("templateList") !== null);
        document.getElementById('templateList').innerHTML = '<p>No Schedule Added</p>';
        document.getElementById("departureTime").value = "";
        document.getElementById("mon").checked = false;
        document.getElementById("tue").checked = false;
        document.getElementById("wed").checked = false;
        document.getElementById("thu").checked = false;
        document.getElementById("fri").checked = false;
        document.getElementById("sat").checked = false;
        document.getElementById("sun").checked = false;
        this.setState({ formState: "Create", service: "P", templateSchedule: "", recurring: "" });
      }
      document.getElementById("departureTime").value = "";
      document.getElementById("mon").checked = false;
      document.getElementById("tue").checked = false;
      document.getElementById("wed").checked = false;
      document.getElementById("thu").checked = false;
      document.getElementById("fri").checked = false;
      document.getElementById("sat").checked = false;
      document.getElementById("sun").checked = false;
      if (document.getElementById("templateList") !== null)
        document.getElementById('templateList').innerHTML = '<p>No Schedule Added</p>'
      document.getElementById("AddTemplate").style.display = "block"
    }
    else
      document.getElementById("AddTemplate").style.display = "none"
  }

  addSchedule = async () => {
    document.getElementById("template-form-error").innerText = "";
    let departureTime = moment(document.getElementById("departureTime").value, "HH:mm").format("HHmm");
    let repeat = this.state.recurring;
    let noErrors = true;
    let Time = [];
    let schedules = this.state.templateSchedule.split(",");
    for (let i = 0; i < schedules.length; i++) {
      Time.push(schedules[i].split("x")[0]);
    }
    let repeatTime = false;
    for (var i = 0; i < Time.length; i++) {
      if (departureTime === Time[i])
        repeatTime = true;
    }
    if (departureTime === "Invalid date") {
      document.getElementById("departureTime").classList.add("border-danger");
      document.getElementById("template-form-error").innerText = "Enter Departure Time";
      noErrors = false;
    }
    else if (repeatTime === true) {
      document.getElementById("departureTime").classList.add("border-danger");
      document.getElementById("template-form-error").innerText = "Departure time already exists";
      noErrors = false;
    }
    else if (repeat === "") {
      document.getElementById("template-form-error").innerText = "Please choose at least 1 day";
      noErrors = false;
    }

    if (noErrors) {
      let schedule = departureTime + "x" + repeat;
      if (this.state.templateSchedule === "") {
        await this.setState({ templateSchedule: schedule });
      }
      else {
        await this.setState({ templateSchedule: this.state.templateSchedule + "," + schedule })
      }

      if (document.getElementById("template-form-error").innerText === "") {
        await this.setState({ recurring: "" });
        document.getElementById("departureTime").value = "";
        document.getElementById("mon").checked = false;
        document.getElementById("tue").checked = false;
        document.getElementById("wed").checked = false;
        document.getElementById("thu").checked = false;
        document.getElementById("fri").checked = false;
        document.getElementById("sat").checked = false;
        document.getElementById("sun").checked = false;
      }
      this.addTemplateForm();
    }
  }

  addTemplateForm = async () => {
    let value = [];
    let departureTime = "";
    let repeat = "";
    let days = "";
    document.getElementById('templateList').innerHTML = "";
    let schedules = this.state.templateSchedule.split(",");
    if (schedules !== null) { }
    for (let i = 0; i < schedules.length; i++) {
      departureTime = schedules[i].split("x")[0];
      if (departureTime !== "") {

        repeat = schedules[i].split("x")[1];
        days = repeat.split(";");
        for (var d = 0; d < days.length; d++) {
          if (days.length === 1) {
            value = dayDisplay[days[d]] + ";";
          }
          else {
            value += dayDisplay[days[d]] + ";";
          }
        }

        document.getElementById('templateList').innerHTML += '<div class="row mb-3 pl-0 pr-0"><div class="col-2">' +
          moment(departureTime, "HHmm").format(config.format.time) + '</div><div class="col-8"><b>Days: </b>' +
          value + '</div><div class="col-2"> <span type="button" class="text-danger" onclick="document.getElementById(`removeSchedule`).value=`' + departureTime.toString() + '`;document.getElementById(`removeSchedule`).click()"><i class="far fa-trash-alt"></i></span>'

      }
      else {
        document.getElementById('templateList').innerHTML = '<p>No Schedule Added</p>';

      }
      value = [];
    }
  }

  removeSchedule = async (para) => {
    let scheduleTime = para;
    if (typeof para !== "string")
      scheduleTime = para.target.value;
    let newSchedule = "";
    let schedule = this.state.templateSchedule.split(",");
    for (let i = 0; i < schedule.length; i++) {
      if (!schedule[i].includes(scheduleTime)) {
        if (newSchedule === "")
          newSchedule = schedule[i];
        else
          newSchedule += ',' + schedule[i];
      }
    }
    await this.setState({ templateSchedule: newSchedule });
    this.addTemplateForm();

  }

  setRoute = () => {
    var objR = [];
    for (var i = 0; i < this.state.dataRoute.length; i++) {
      let serviceProvider = this.state.dataRoute[i]["serviceProviderType"].split(";");
      if (serviceProvider.includes(this.state.service)) {
        objR.push(
          <option data-routeid={this.state.dataRoute[i]["routeId"]} key={this.state.dataRoute[i]["routeId"]}>{this.state.dataRoute[i]["routeName"]}</option>
        );
      }
    }
    return objR;
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    if (event.target.id === "departureDate") {
      let mindate = new Date(event.target.value);
      mindate.setDate(mindate.getDate() + 1)
      this.setState({ minDate: moment(mindate).format("YYYY-MM-DD") })
    }
    //document.getElementById(event.target.id).classList.remove("border-danger");
  };

  onInputChangeTime = event => {
    this.setState({
      departureTime: moment(event.target.value, "HH:mm").format("HHmm")
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  routeChange = async (event) => {
    this.setState({
      routeName: event.target.value,
    });
    for (var i = 0; i < this.state.dataRoute.length; i++) {
      if (this.state.dataRoute[i]["routeName"] === event.target.value) {
        await this.setState({
          routeId: this.state.dataRoute[i]["routeId"]
        })
        break;
      }
    }
  };

  checkbox = async (event) => {
    let repeat = { "mon": "1", "tue": "2", "wed": "3", "thu": "4", "fri": "5", "sat": "6", "sun": "7" }
    let value = repeat[event.target.id];
    if (event.target.checked) {
      if (this.state.recurring !== "")
        value = ";" + value;
      await this.setState({ recurring: this.state.recurring + value });
    }
    else {
      if (value.length <= this.state.recurring.length) {
        if (this.state.recurring.length === 1) {
        }
        else if (this.state.recurring.slice(0, value.length).includes(value))
          value += ";"
        else
          value = ";" + value;
        await this.setState({ recurring: this.state.recurring.replace(value, "") });
      }
    }
  }

  onRadioClick = async event => {
    await this.setState({
      service: event.target.value
    });
    document.getElementById("routeName").value = "";
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
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
    else if (this.state.templateSchedule === "") {
      document.getElementById("form-error").innerText = "Please add at least 1 Schedule Time.";
    }
    else if (
      document.getElementById("departureTime").value !== ""
      || document.getElementById("mon").checked === true
      || document.getElementById("tue").checked === true
      || document.getElementById("wed").checked === true
      || document.getElementById("thu").checked === true
      || document.getElementById("fri").checked === true
      || document.getElementById("sat").checked === true
      || document.getElementById("sun").checked === true) {
      document.getElementById("form-error").innerText = "Please add Schedule.";
    }

    else {
      var url = config.api.invokeUrl;
      url += "/scheduletemplate";
      var Schedule = new ScheduleTemplateModel(
        this.state.service,
        this.state.routeId,
        this.state.templateSchedule
      );

      let httpType = "";
      let jsonData = "";

      url += "/set"
      httpType = "PUT";

      jsonData = Schedule.convertObjToJSON();
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
          else {
          }
        },
        error: (xhr, status, err) => {
          if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }
      });
    }
  }

  async componentDidMount() {
    this.props.auth.setNav("ScheduleTemplate");                    //set change this according to the value in Navbar.js If dk just ask me.
    await this.getTemplate();    //api get data
    this.getRoute();
    this.setState({ isLoading: false });
  }

  render() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/logout");
      return <div></div>;
    } else {
      return (
        <div className="container-fluid mt-3">
          <script>
            {(document.body.style.backgroundColor = "#EEEEEE")}
          </script>
          <div id="main-content">
            <p className="table-title">MANAGE SCHEDULE TEMPLATE</p>
            <div className="data-div shadow bg-white">
              <div className="row">
                {this.state.scheduleState === "P" && (
                  <div className="col-12 col-sm-12 col-md-12">
                    <div style={{ margin: "10px", float: "right" }}>
                      <button onClick={this.addTemplete} className="btn btn-primary btn-circle ml-3" id="addData">
                        <span><i className="fas fa-plus"></i></span>
                      </button>
                    </div>
                    <div className="ml-4 mr-4 tab-border overflow-data-table" >
                      <div className="col-12 col-md-10 mt-4">
                        <div className="row">
                          <div className="col-3 table-btn-selected"><p>Passenger</p></div>
                          <div className="col-3 table-btn" onClick={this.changeScheduleRPL}><p>RPL</p></div>
                        </div>
                      </div>
                    </div>
                    <div className="schedule-data-div m-3">
                      {this.setTemplateP()}

                      {this.state.isLoading && (<div className="text-center m-3">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>)}
                    </div>
                  </div>

                )}
                {this.state.scheduleState === "RPL" && (
                  <div className="col-12 col-sm-12 col-md-12">
                    <div style={{ margin: "10px", float: "right" }}>
                      <button onClick={this.addTemplete} className="btn btn-primary btn-circle ml-3" id="addData">
                        <span><i className="fas fa-plus"></i></span>
                      </button>
                    </div>
                    <div className="ml-4 mr-4 tab-border overflow-data-table" >
                      <div className="col-12 col-md-10 mt-4">
                        <div className="row">
                          <div className="col-3 table-btn" onClick={this.changeSchedulePassenger}><p>Passenger</p></div>
                          <div className="col-3 table-btn-selected"><p>RPL</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="schedule-data-div m-3">
                      {this.setTemplateRPL()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-modal" onClick={this.closeTemplate} style={{ display: "none" }} id="AddTemplate">
              <form className="form-content animate pl-3 pr-3" onSubmit={this.handleSubmit} style={{ width: "70%" }}>
                <span onClick={this.closeTemplate} id="cls-template" className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>Set Schedule Template</h5>
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <div>
                  <div id="form-error" className="form-errors text-center"></div>
                  <FormErrors formerrors={this.state.errors} />
                  {this.state.formState === "Create" && (
                    <div className="col-12" style={{ marginTop: "-20px" }}>
                      <div className="row">
                        <div className="col-12 col-md-4">
                          <label>Service Provider Type:</label>
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

                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="routeName">Route:</label>
                            <select id="routeName" className="form-control mb-3" required defaultValue="" onChange={this.routeChange}>
                              <option value="">---Select A Route---</option>
                              {this.setRoute()}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {this.state.formState === "Edit" && (
                    <div className="col-12" style={{ marginTop: "-20px" }}>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="editservice">Service Provider Type:</label>
                            <label style={{ width: "80%", display: "inline" }} className="ml-3 mb-3" id="editservice" />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="editrouteName">Route:</label>
                            <label style={{ width: "90%", display: "inline" }} className="ml-3 mb-3" id="editrouteName" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 mb-3" id="templateList">
                      </div>
                      <input type="hidden" id="removeSchedule" onClick={this.removeSchedule} />
                      <div className="col-12" id="TemplateForm">
                        <div id="template-form-error" className="form-errors text-center"></div>
                        <div className="row">
                          <div className="col-4">
                            <div className="form-group">
                              <label htmlFor="departureTime">Departure Time:</label>
                              <input className="form-control" onChange={this.onInputChangeTime} type="time" pattern="\d*" min="0000" max="2359" id="departureTime" />
                            </div>
                          </div>

                          <div className="col-5">
                            <div className="form-group">
                              <div>
                                <label htmlFor="repeat">Repeat:</label>
                              </div>
                              <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="mon" />
                                <label className="custom-control-label" htmlFor="mon">Mon</label>
                              </span>

                              <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="tue" />
                                <label className="custom-control-label" htmlFor="tue">Tue</label>
                              </span>

                              <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="wed" />
                                <label className="custom-control-label" htmlFor="wed">Wed</label>
                              </span>

                              <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="thu" />
                                <label className="custom-control-label" htmlFor="thu">Thu</label>
                              </span>

                              <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="fri" />
                                <label className="custom-control-label" htmlFor="fri">Fri</label>
                              </span>

                              <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="sat" />
                                <label className="custom-control-label" htmlFor="sat">Sat</label>
                              </span>

                              <span className="custom-control custom-checkbox" style={{ float: "left" }}>
                                <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="sun" />
                                <label className="custom-control-label" htmlFor="sun">Sun</label>
                              </span>
                              <br />
                            </div>
                          </div>

                          <div className="col-3" style={{ paddingRight: "2px"}}>
                            <button className="btn btn-circle btn-success" style={{ marginTop: "2em"}} type="button" onClick={this.addSchedule}>
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mb-2 mt-4"><button type="submit" className="btn btn-block btn-outline-primary">Set Schedule Template <i className="fas fa-edit"></i></button></div>
                    </div>
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

export default ScheduleTemplate;