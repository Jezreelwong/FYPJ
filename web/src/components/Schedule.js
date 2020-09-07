import React, { Component } from 'react';
import config from "../config.json";
import $ from "jquery";
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import Spinner from 'react-bootstrap/Spinner'
import ScheduleModel from "../models/Schedule";
import CalendarSingle from "./utility/CalendarSingle";
var moment = require("moment");
let today = new Date();
let threeMonthsLater = new Date();
let oneDayLater = new Date();
oneDayLater.setDate(oneDayLater.getDate() + 1)
threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
oneDayLater.setHours(0, 0, 0, 0);
threeMonthsLater.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);
let todayString = moment(today).format("YYYY-MM-DD");
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class Schedule extends Component {
  state = {
    scheduleState: "P",
    data: [],
    dataRoute: [],
    isLoading: true,
    formState: "Create",
    editScheduleId: "",
    departureDate: "",
    departureTime: "",
    maxLimit: "",
    routeId: "",
    routeName: "",
    status: "A",
    service: "P",
    serviceProviderName: "",
    recurring: "",
    days: "",
    endRepeatDate: "",
    repeat: "o",
    startDate: "",
    endDate: "",
    minDate: "",
    reason: "",
    confirm: "",
    apierrors: null,
    errors: {
      blankfield: false,
    }
  };

  handleTemplate = () => {
    window.location.href = "/schedule-template";
  }

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

  getSelectedSchedule = async (event) => {
    event.preventDefault();
    await this.getSchedule(event.target.dataset.date);
  }

  getSchedule = async (date) => {
    document.querySelector(".booking-cal-btn .text").innerText = date;
    var url = config.api.invokeUrl + "/schedule?serviceProviderType=all&&startDate=" + date + "&endDate=" + date;;            //change according to which api you are using
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

  setScheduleP = () => {
    var obj = [];
    let routeName = [];
    let departureDate = new Date();
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i]["serviceProviderType"] === "P") {
        departureDate = new Date(this.state.data[i]["departureDate"]);
        departureDate.setHours(0, 0, 0, 0);

        if (!routeName.includes(this.state.data[i]["routeName"])) {
          routeName.push(this.state.data[i]["routeName"]);
          obj.push(<h3 className="m-3" key={this.state.data[i]["routeName"]}>{this.state.data[i]["routeName"]}</h3>)
        }

        obj.push(
          <span key={this.state.data[i]["scheduleId"]}>
            <span>
              {departureDate > today && this.state.data[i]["status"] === "A" && (
                <button
                  onClick={this.setEditClick}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="scheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
              {departureDate > today && this.state.data[i]["status"] === "I" && (
                <button
                  onClick={this.setEditClick}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="IAscheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
              {departureDate <= today && this.state.data[i]["status"] === "A" && (
                <button
                  onClick={this.displaySchedule}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="scheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
              {departureDate <= today && this.state.data[i]["status"] === "I" && (
                <button
                  onClick={this.displaySchedule}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="IAscheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
            </span>
          </span>
        );
      }
    }
    if (obj.length === 0) {
      obj.push(<div key="empty" className="text-center font-weight-bold">No schedule available</div>)
    }
    return obj;
  }


  setScheduleRPL = () => {
    var obj = [];
    let routeName = [];
    let departureDate = new Date();
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i]["serviceProviderType"] === "RPL") {
        departureDate = new Date(this.state.data[i]["departureDate"]);
        departureDate.setHours(0, 0, 0, 0);

        if (!routeName.includes(this.state.data[i]["routeName"])) {
          routeName.push(this.state.data[i]["routeName"]);
          obj.push(<h3 className="m-3" key={this.state.data[i]["routeName"]}>{this.state.data[i]["routeName"]}</h3>)
        }

        obj.push(
          <span key={this.state.data[i]["scheduleId"]}>
            <span>
            {departureDate > today && this.state.data[i]["status"] === "A" && (
                <button
                  onClick={this.setEditClick}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="scheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
              {departureDate > today && this.state.data[i]["status"] === "I" && (
                <button
                  onClick={this.setEditClick}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="IAscheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
              {departureDate <= today && this.state.data[i]["status"] === "A" && (
                <button
                  onClick={this.displaySchedule}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="scheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
              {departureDate <= today && this.state.data[i]["status"] === "I" && (
                <button
                  onClick={this.displaySchedule}
                  data-scheduleid={this.state.data[i]["scheduleId"]}
                  id={this.state.data[i]["scheduleId"]}
                  className="IAscheduleTimebtn"
                >
                  {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}
                </button>
              )}
            </span>
          </span>
        );
      }
    }
    if (obj.length === 0) {
      obj.push(<div key="empty" className="text-center font-weight-bold">No schedule available</div>)
    }
    return obj;
  }


  displaySchedule = async (event) => {                              //add click event listener function for edit
    let displayData = "";
    for (var i = 0; i < this.state.data.length; i++) {
      if (parseInt(event.target.dataset.scheduleid) === this.state.data[i]["scheduleId"]) {
        displayData = this.state.data[i];
        break;
      }
    }
    if (displayData !== "") {      //set default values to the edit form
      await this.setState({
        formState: "Display",
      });
      document.getElementById("displaydepartureDate").innerText = displayData["departureDate"];
      document.getElementById("displaydepartureTime").innerText = moment(displayData["departureTime"], "HHmm").format(config.format.time);
      document.getElementById("displaymaxLimit").innerText = displayData["maxLimit"];
      document.getElementById("displayserviceProviderName").innerText = displayData["serviceProviderName"];
      document.getElementById("displayrouteName").innerText = displayData["routeName"];
      if (displayData["serviceProviderType"] === "P") {
        document.getElementById("displayserviceProviderType").innerText = "Passenger";
      }
      else {
        document.getElementById("displayserviceProviderType").innerText = "RPL";
      }
      this.setState({ formState: "Create", recurring: "o" });
      document.getElementById("DisplaySchedule").style.display = "block";
    }
  }

  setRoute = () => {
    var objR = [];
    for (var i = 0; i < this.state.dataRoute.length; i++) {
      let serviceProvider = this.state.dataRoute[i]["serviceProviderType"].split(";");
      if (serviceProvider.includes(this.state.service)) {
        objR.push(
          <option key={this.state.dataRoute[i]["routeId"]} data-routeid={this.state.dataRoute[i]["routeId"]}>{this.state.dataRoute[i]["routeName"]}</option>
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
      if (this.state.repeat === "r")
        document.getElementById("endRepeatDate").disabled = false;
    }
    //document.getElementById(event.target.id).classList.remove("border-danger");
  };

  onInputChangeTime = event => {
    this.setState({
      departureTime: moment(event.target.value, "HH:mm").format("HHmm")
    });
    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  onInputChangeClear = event => {
    if (event.target.id === "clearStartDate") {
      this.setState({ startDate: event.target.value });
      let mindate = new Date(event.target.value);
      mindate.setDate(mindate.getDate())
      this.setState({ minDate: moment(mindate).format("YYYY-MM-DD") })
      document.getElementById("clearEndDate").disabled = false;
    }
    else if (event.target.id === "clearEndDate")
      this.setState({ endDate: event.target.value });
    else if (event.target.id === "clearReason")
      this.setState({ reason: event.target.value });

    document.getElementById(event.target.id).classList.remove("border-danger");
  };

  onInputChangeBlock = event => {
    if (event.target.id === "blockStartDate") {
      this.setState({ startDate: event.target.value });
      let mindate = new Date(event.target.value);
      mindate.setDate(mindate.getDate())
      this.setState({ minDate: moment(mindate).format("YYYY-MM-DD") })
      document.getElementById("blockEndDate").disabled = false;
    }
    else if (event.target.id === "blockEndDate")
      this.setState({ endDate: event.target.value });
    else if (event.target.id === "blockReason")
      this.setState({ reason: event.target.value });
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
    else if (this.state.recurring === "" && this.state.repeat === "r") {
      document.getElementById("form-error").innerText = "Please tick at least 1 checkbox";
    }
    else if (this.state.departureDate === this.state.endRepeatDate && this.state.repeat === "r") {
      document.getElementById("form-error").innerText = "Start date cannot be the same as End Date";
    }

    else {
      var url = config.api.invokeUrl;
      url += "/schedule";
      var Schedule = new ScheduleModel(
        this.state.editScheduleId,
        this.state.departureDate,
        this.state.departureTime,
        this.state.maxLimit,
        this.state.routeId,
        this.state.status,
        this.state.service,
        this.state.endRepeatDate,
        this.state.recurring,
        this.props.auth.user.preferred_username,
        this.props.auth.user.preferred_username);

      let httpType = "";
      let jsonData = "";
      if (this.state.formState === "Create") {
        url += "/add"
        httpType = "PUT";
      }
      else if (this.state.formState === "Edit") {
        url += "/update"
        httpType = "POST";
      }
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

  toggleConfirm = async event => {
    event.preventDefault();
    document.getElementById("confirm").value = "";
    document.getElementById("Confirm").style.display = "block"
  }

  handleConfirm = async event => {
    event.preventDefault();
    if (this.state.confirm === "clear") {
      this.handleClear();
    }
    else {
      alert("Please Try again!")
      document.getElementById("confirm").focus = true;
    }
  }

  handleClear = async event => {
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

    var url = config.api.invokeUrl;
    url += "/schedule";
    var Schedule = {
      "body": `{"startDate": "${this.state.startDate}", "endDate": "${this.state.endDate}", "serviceProviderType": "${this.state.service}", "cancellationReason": "${entities.encode(this.state.reason)}", "updatedBy": "${this.props.auth.user.preferred_username}" }`
    };
    let httpType = "";
    let jsonData = "";
    if (this.state.formState === "clear") {
      url += "/clear"
      httpType = "DELETE"
    }
    jsonData = JSON.stringify(Schedule);
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

  handleBlock = async event => {
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

    var url = config.api.invokeUrl;
    url += "/schedule";
    var Schedule = {
      "body": `{ "serviceProviderType": "${this.state.service}", "startDate": "${this.state.startDate}", "endDate": "${this.state.endDate}", "cancellationReason": "${entities.encode(this.state.reason)}", "updatedBy": "${this.props.auth.user.preferred_username}" }`
    };
    let httpType = "PATCH";
    let jsonData = "";
    url += "/block"
    jsonData = JSON.stringify(Schedule);
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

  toggleForm = () => {
    if (document.getElementById("FormModal").style.display === "none") {
      if (this.state.formState === "Edit") {                                    // clears form after edit
        if (this.state.repeat === "r") {
          document.getElementById("endRepeatDate").value = "";
          document.getElementById("endRepeatDate").disabled = true;
        }
        document.getElementById("departureDate").value = "";
        document.getElementById("departureTime").value = "";
        document.getElementById("maxLimit").value = "";
        document.getElementById("routeName").value = "";
        document.getElementById("RadioPassenger").checked = true;
        this.setState({ formState: "Create" });
      }
      if (this.state.repeat === "r") {
        document.getElementById("endRepeatDate").value = "";
        document.getElementById("endRepeatDate").disabled = true;
        document.getElementById("mon").checked = false;
        document.getElementById("tue").checked = false;
        document.getElementById("wed").checked = false;
        document.getElementById("thu").checked = false;
        document.getElementById("fri").checked = false;
        document.getElementById("sat").checked = false;
        document.getElementById("sun").checked = false;
        this.setState({ recurring: "", repeat: "o" })
      }
      document.getElementById("departureDate").value = "";
      document.getElementById("departureDate").value = "";
      document.getElementById("departureTime").value = "";
      document.getElementById("maxLimit").value = "";
      document.getElementById("RadioPassenger").checked = true;
      document.getElementById("routeName").value = "";
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

  closeDisplay = (event) => {
    if (event.target.id === "DisplaySchedule" || event.target.id === "cls-details") {
      document.getElementById("DisplaySchedule").style.display = "none";
      this.setState({ formState: "Create" })
    }
  }

  closeClear = (event) => {
    if (event.target.id === "ClearSchedule" || event.target.id === "cls-clear") {
      document.getElementById("ClearSchedule").style.display = "none";
      this.setState({ formState: "Create" })
    }
  }

  closeBlock = (event) => {
    if (event.target.id === "BlockSchedule" || event.target.id === "cls-block") {
      document.getElementById("BlockSchedule").style.display = "none";
    }
    this.setState({ formState: "Create" })
  }

  closeConfirm = (event) => {
    if (event.target.id === "Confirm" || event.target.id === "cls-confirm") {
      document.getElementById("Confirm").style.display = "none";
      this.setState({ formState: "Create" })
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

  changeRepeat = async event => {
    if (this.state.repeat === "o") {
      await this.setState({
        repeat: "r",
      });
    }
    else {
      await this.setState({
        repeat: "o",
      });
    }

  }

  onRadioClick = async event => {
    await this.setState({
      service: event.target.value
    });
    document.getElementById("routeName").value = "";
  }

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

  setEditClick = async (event) => {                              //add click event listener function for edit
    let editData = "";
    for (var i = 0; i < this.state.data.length; i++) {
      if (parseInt(event.target.dataset.scheduleid) === this.state.data[i]["scheduleId"]) {
        editData = this.state.data[i];
        break;
      }
    }
    for (var j = 0; j < this.state.dataRoute.length; j++) {
      if (editData["routeName"] === this.state.dataRoute[j]["routeName"]) {
        await this.setState({
          routeId: this.state.dataRoute[j]["routeId"],
        });
      }
    }
    if (editData !== "") {                                                         //set default values to the edit form
      await this.setState({
        formState: "Edit",
        editScheduleId: editData["scheduleId"],
        departureDate: editData["departureDate"],
        departureTime: editData["departureTime"],
        maxLimit: editData["maxLimit"],
        //   serviceProviderName: editData["serviceProviderName"],
        service: editData["serviceProviderType"],
        status: editData["status"],
        routeName: editData["routeName"]
      });
      document.getElementById("departureDate").value = editData["departureDate"];
      document.getElementById("departureTime").value = moment(editData["departureTime"], "HHmm").format("HH:mm");
      document.getElementById("maxLimit").value = editData["maxLimit"];
      //  document.getElementById("serviceProviderName").value = editData["serviceProviderName"];
      document.getElementById("routeName").value = editData["routeName"];
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
  }

  ClearSchedule = async (event) => {
    if (document.getElementById("ClearSchedule").style.display === "none") {
      this.setState({ formState: "clear" })
      document.getElementById("clearStartDate").value = "";
      document.getElementById("clearEndDate").value = "";
      document.getElementById("clearEndDate").disabled = true;
      document.getElementById("clearRadioPassenger").checked = true;
      document.getElementById("clearReason").value = "";
      document.getElementById("ClearSchedule").style.display = "block";
    }
  }

  BlockSchedule = async (event) => {
    if (document.getElementById("BlockSchedule").style.display === "none") {
      document.getElementById("blockStartDate").value = "";
      document.getElementById("blockEndDate").value = "";
      document.getElementById("blockEndDate").disabled = true;
      document.getElementById("blockRadioPassenger").checked = true;
      document.getElementById("blockReason").value = "";
      document.getElementById("BlockSchedule").style.display = "block"
    }
  }


  async componentDidMount() {
    CalendarSingle();
    this.props.auth.setNav("Schedule");                    //set change this according to the value in Navbar.js If dk just ask me.
    await this.getSchedule(todayString, todayString);    //api get data
    this.getRoute();
    this.setState({ isLoading: false });
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
            <p className="table-title">MANAGE SCHEDULE</p>
            <input onClick={this.getSelectedSchedule} type="hidden" data-date="" id="scheduleSelectedDates" />
            <div className="data-div shadow bg-white">
              <div className="row ml-0 mr-0">
                <div className="col-12 col-sm-12 col-md-12 col-lg-4 text-center">
                  <div className="booking-cal-btn">
                    <div className="header">
                      Selected Date
                    </div>
                    <div className="text">
                      {todayString}
                    </div>
                  </div>
                  <div className="booking-calendar-divs">
                    <div className="calendar calendar-first" id="calendar_first">
                      <div className="calendar_header">
                        <button className="switch-month switch-left"> <i className="fa fa-chevron-left"></i></button>
                        <h2>placeholder</h2>
                        <button className="switch-month switch-right"> <i className="fa fa-chevron-right"></i></button>
                      </div>
                      <div className="calendar_weekdays"></div>
                      <div className="calendar_content"></div>
                    </div>
                    <div className="calendar calendar-second" id="calendar_second">
                      <div className="calendar_header">
                        <h2>placeholder</h2>
                        <button className="switch-month switch-right"> <i className="fa fa-chevron-right"></i></button>
                      </div>
                      <div className="calendar_weekdays"></div>
                      <div className="calendar_content"></div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 mb-3">
                    <br />
                    <button className="btn btn-block" style={{backgroundColor: "#01bfa5", color: "#fff"}} onClick={this.ClearSchedule}>Clear Schedule</button>
                    <br />
                    <button className="btn btn-block" style={{backgroundColor: "#2196f3", color: "#fff"}} onClick={this.BlockSchedule}>Block Schedule</button>
                    <br />
                    <button className="btn btn-block" style={{backgroundColor: "#19227d", color: "#fff"}} onClick={this.handleTemplate}>View Schedule Template</button>
                    <br />
                  </div>
                </div>
                {this.state.scheduleState === "P" && (
                  <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                    <div style={{ margin: "10px", float: "right" }}>
                      <button onClick={this.toggleForm} className="btn btn-primary btn-circle ml-3" id="addData">
                        <span key="addBtn"><i className="fas fa-plus"></i></span>
                      </button>
                    </div>
                    <div className="ml-0 mr-0 tab-border overflow-data-table" >
                      <div className="col-12 col-md-10 col-lg-8 mt-4">
                        <div className="row">
                          <div className="col-4 table-btn-selected"><p>Passenger</p></div>
                          <div className="col-4 table-btn" onClick={this.changeScheduleRPL}><p>RPL</p></div>
                        </div>
                      </div>
                    </div>
                    <div className="schedule-data-div m-3">
                      {this.setScheduleP()}

                      {this.state.isLoading && (<div className="text-center m-3">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>)}
                    </div>
                  </div>

                )}
                {this.state.scheduleState === "RPL" && (
                  <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                    <div style={{ margin: "10px", float: "right" }}>
                      <button onClick={this.toggleForm} className="btn btn-primary btn-circle ml-3" id="addData">
                        <span key="addBtn2"><i className="fas fa-plus"></i></span>
                      </button>
                    </div>
                    <div className="ml-0 mr-0 tab-border overflow-data-table" >
                      <div className="col-12 col-md-10 col-lg-8 mt-4">
                        <div className="row">
                          <div className="col-4 table-btn" onClick={this.changeSchedulePassenger}><p>Passenger</p></div>
                          <div className="col-4 table-btn-selected"><p>RPL</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="schedule-data-div m-3">
                      {this.setScheduleRPL()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-modal" onClick={this.closeForm} style={{ display: "none" }} id="FormModal">
              <form autoComplete="off" onSubmit={this.handleSubmit} className="form-content animate pl-3 pr-3">
                <span onClick={this.toggleForm} className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>{(this.state.formState === "Create") ? "Create A New " : "Edit "}Schedule</h5>
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">

                  {this.state.formState === "Create" && (
                    <span style={{ width: "100%" }}>
                      {this.state.repeat === "o" && (
                        <div className="col-12">
                          <div style={{ borderBottom: "3px solid rgb(48, 110, 129)", marginTop: "20px" }}>
                            <div className="form-group">
                              <span style={{ border: "1px solid rgb(48, 110, 129)", backgroundColor: "rgba(184, 234, 241, 0.5)", padding: "16px 20px", cursor: "pointer" }} >One Time</span>
                              <span style={{ border: "1px solid rgb(48, 110, 129)", backgroundColor: "grey", padding: "16px 20px", cursor: "pointer" }} onClick={this.changeRepeat}>Recurring</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {this.state.repeat === "r" && (
                        <div className="col-12">
                          <div style={{ borderBottom: "3px solid rgb(48, 110, 129)", marginTop: "20px" }}>
                            <div className="form-group">
                              <span style={{ border: "1px solid rgb(48, 110, 129)", backgroundColor: "grey", padding: "16px 20px", cursor: "pointer" }} onClick={this.changeRepeat}>One Time</span>
                              <span style={{ border: "1px solid rgb(48, 110, 129)", backgroundColor: "rgba(184, 234, 241, 0.5)", padding: "16px 20px", cursor: "pointer" }}>Recurring</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  )}


                  {this.state.repeat === "o" && (
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="departureDate">Departure Date:</label>
                        <input className="form-control" required onChange={this.onInputChange} type="date" min={moment(oneDayLater).format("YYYY-MM-DD")} max={moment(threeMonthsLater).format("YYYY-MM-DD")} id="departureDate" />
                      </div>
                    </div>
                  )}

                  {this.state.repeat === "r" && (
                    <div style={{ width: "100%" }}>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="departureDate">Start Date:</label>
                          <input className="form-control" required onChange={this.onInputChange} type="date" min={moment(oneDayLater).format("YYYY-MM-DD")} max={moment(threeMonthsLater).format("YYYY-MM-DD")} id="departureDate" />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="endRepeatDate">End Date:</label>
                          <input className="form-control" required disabled onChange={this.onInputChange} type="date" min={this.state.minDate} max={moment(threeMonthsLater).format("YYYY-MM-DD")} id="endRepeatDate" />
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.formState === "Create" && (
                    <div style={{ width: "100%" }}>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="departureTime">Departure Time:</label>
                          <input className="form-control" required onChange={this.onInputChangeTime} type="time" pattern="\d*" min="0000" max="2359" id="departureTime" />
                        </div>
                      </div>
                    </div>
                  )}

                  {this.state.formState === "Edit" && (
                    <div style={{ width: "100%" }}>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="departureTime">Departure Time:</label>
                          <input className="form-control" required onChange={this.onInputChangeTime} type="time" pattern="\d*" min="0000" max="2359" id="departureTime" />
                        </div>
                      </div>
                    </div>
                  )}

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
                  {this.state.service === "P" && (
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="maxLimit">Max Limit:</label>
                        <input className="form-control" required onChange={this.onInputChange} type="number" min="1" max="200" id="maxLimit" />
                      </div>
                    </div>
                  )}

                  {this.state.service === "RPL" && (
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="maxLimit">Max Limit:</label>
                        <input className="form-control" required onChange={this.onInputChange} type="number" min="1" max="15" id="maxLimit" />
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="routeName">Route:</label>
                      <select id="routeName" className="form-control mb-3" required defaultValue="" onChange={this.routeChange}>
                        <option value="">---Select A Route---</option>
                        {this.setRoute()}
                      </select>
                    </div>
                  </div>

                  {this.state.repeat === "r" && (
                    <div className="col-12">
                      <div className="form-group">
                        <div>
                          <label htmlFor="repeat">Repeat:</label>
                        </div>
                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="mon" />
                          <label className="custom-control-label" for="mon">Mon</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="tue" />
                          <label className="custom-control-label" for="tue">Tue</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="wed" />
                          <label className="custom-control-label" for="wed">Wed</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="thu" />
                          <label className="custom-control-label" for="thu">Thu</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="fri" />
                          <label className="custom-control-label" for="fri">Fri</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="sat" />
                          <label className="custom-control-label" for="sat">Sat</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left" }}>
                          <input className="custom-control-input" onChange={this.checkbox} type="checkbox" name="repeatday" id="sun" />
                          <label className="custom-control-label" for="sun">Sun</label>
                        </span>
                        <br />
                      </div>
                    </div>

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
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 ml-auto mb-2 mt-2"><button type="reset" className="btn btn-block btn-outline-danger">Clear <i className="far fa-window-close"></i></button></div>
                  {(this.state.formState === "Create")
                    ? <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2 mt-2"><button type="submit" className="btn btn-block btn-success">Create <i className="far fa-plus-square"></i></button></div>
                    : <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2 mt-2"><button type="submit" className="btn btn-block btn-outline-primary">Update <i className="fas fa-edit"></i></button></div>}
                </div>
              </form>
            </div>

            <div className="form-modal" onClick={this.closeDisplay} style={{ display: "none" }} id="DisplaySchedule">
              <div className="form-content animate pl-3 pr-3">
                <span onClick={this.closeDisplay} id="cls-details" className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>Schedule Details</h5>
                </div>
                <div style={{ border: "1px solid rgb(48, 110, 129)", width: "97%", margin: "10px" }}>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 col-sm-6 mb-2"><b>Departure Date :</b></div>
                      <div className="col-12 col-sm-6"><span id="displaydepartureDate" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Departure Time :</b></div>
                      <div className="col-12 col-sm-6 mb-2"><span id="displaydepartureTime" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Service Provider Type :</b></div>
                      <div className="col-12 col-sm-6 mb-2"><span id="displayserviceProviderType" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Service Provider Name :</b></div>
                      <div className="col-12 col-sm-6 mb-2"><span id="displayserviceProviderName" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Max Limit :</b></div>
                      <div className="col-12 col-sm-6 mb-2"><span id="displaymaxLimit" /></div>
                      <div className="col-12 col-sm-6 mb-2"><b>Route :</b></div>
                      <div className="col-12 col-sm-6 mb-2"><span id="displayrouteName" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-modal" onClick={this.closeClear} style={{ display: "none" }} id="ClearSchedule">
              <form onSubmit={this.toggleConfirm} className="form-content animate pl-3 pr-3">
                <span onClick={this.closeClear} id="cls-clear" className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>Clear Schedule</h5>
                </div>
                <div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="clearStartDate">Start Date:</label>
                          <input className="form-control" required onChange={this.onInputChangeClear} min={moment(oneDayLater).format("YYYY-MM-DD")} max={moment(threeMonthsLater).format("YYYY-MM-DD")} type="date" id="clearStartDate" />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="clearEndDate">End Date:</label>
                          <input className="form-control" required disabled onChange={this.onInputChangeClear} min={this.state.minDate} max={moment(threeMonthsLater).format("YYYY-MM-DD")} type="date" id="clearEndDate" />
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <label>Service Provider Type:</label>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="custom-control custom-radio">
                          <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="clearRadioPassenger" defaultChecked value="P" />
                          <label className="custom-control-label" htmlFor="clearRadioPassenger">Passenger</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-4 mb-3">
                        <div className="custom-control custom-radio">
                          <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="clearRadioRPL" value="RPL" />
                          <label className="custom-control-label" htmlFor="clearRadioRPL">RPL</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="clearReason">Reason:</label>
                          <input className="form-control" required onChange={this.onInputChangeClear} type="text" id="clearReason" />
                        </div>
                      </div>
                      <div className="col-12 mb-2 mt-2"><button type="submit" className="btn btn-block btn-outline-primary">Clear Schedule <i className="fas fa-edit"></i></button></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="form-modal" onClick={this.closeBlock} style={{ display: "none" }} id="BlockSchedule">
              <form onSubmit={this.handleBlock} className="form-content animate pl-3 pr-3">
                <span onClick={this.closeBlock} id="cls-block" className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>Block Schedule</h5>
                </div>
                <div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="blockStartDate">Start Date:</label>
                          <input className="form-control" required onChange={this.onInputChangeBlock} min={todayString} max={moment(threeMonthsLater).format("YYYY-MM-DD")} type="date" id="blockStartDate" />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="blockEndDate">End Date:</label>
                          <input className="form-control" required disabled onChange={this.onInputChangeBlock} min={this.state.minDate} max={moment(threeMonthsLater).format("YYYY-MM-DD")} type="date" id="blockEndDate" />
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <label>Service Provider Type:</label>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="custom-control custom-radio">
                          <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="blockRadioPassenger" defaultChecked value="P" />
                          <label className="custom-control-label" htmlFor="blockRadioPassenger">Passenger</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-4 mb-3">
                        <div className="custom-control custom-radio">
                          <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="blockRadioRPL" value="RPL" />
                          <label className="custom-control-label" htmlFor="blockRadioRPL">RPL</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="blockreason">Reason:</label>
                          <input className="form-control" required onChange={this.onInputChangeBlock} type="text" id="blockReason" />
                        </div>
                      </div>
                      <div className="col-12 mb-2 mt-2"><button type="submit" className="btn btn-block btn-outline-primary">Block Schedule <i className="fas fa-edit"></i></button></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="form-modal" onClick={this.closeConfirm} style={{ display: "none" }} id="Confirm">
              <form onSubmit={this.handleConfirm} className="form-content animate pl-3 pr-3">
                <span onClick={this.closeConfirm} id="cls-confirm" className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>Confirm clear schedule?</h5>
                </div>
                <div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="confirm">Type "clear" to clear schedule:</label>
                          <input className="form-control" required onChange={this.onInputChange} type="text" maxLength="5" id="confirm" />
                        </div>
                      </div>
                      <div className="col-12 mb-2 mt-2"><button type="submit" className="btn btn-block btn-outline-primary">Clear Schedule <i className="fas fa-edit"></i></button></div>
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

export default Schedule;