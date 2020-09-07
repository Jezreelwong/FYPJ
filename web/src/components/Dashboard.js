import React, { Component } from "react";
import config from "../config.json";
import $ from "jquery";
import Gauge from "./utility/Gauge";
import Spinner from 'react-bootstrap/Spinner';
import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import BookingModel from "../models/Booking";
var moment = require("moment");
$.DataTable = require("datatables.net-bs4");
require("datatables.net-plugins/sorting/datetime-moment");
$.fn.dataTable.moment(config.format.datetime);
let today = new Date();
today.setHours(0, 0, 0, 0);
let todayDate = moment(today).format("Do MMM YYYY");
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();


class Dashboard extends Component {

  state = {
    todayState: "passenger",
    pendingState: "passenger",
    length: 250,
    cancellationReason: "",
    remarks: "",
    rejectedReason: "",
    bookingCode: "",
    bookingUnit: "",
    todayRPL: [],
    todayP: [],
    pendingData: {},
    bookingGroup: "",
    rbookingGroup: "false",
    todayLoading: true,
    rplLoading: true,
    pendingLoading: true,
    avgLoading: true,
    formState: "Reject",
  };

  changeTodayPassenger = async () => {
    try {
      $('#DataTable').DataTable().destroy(true);
    }
    catch (e) {
    }
    await this.setState({
      todayState: "passenger",
    });
    document.querySelector(".data-table-div").innerHTML = '<table id="DataTable" class="data-table dashboard-table" width="100%"></table>';
    this.initializeTable(this.state.todayP)
  };

  changeTodayRPL = async () => {
    try {
      $('#DataTable').DataTable().destroy(true);
    }
    catch (e) {
    }
    await this.setState({
      todayState: "rpl",
    });
    document.querySelector(".data-table-div").innerHTML = '<table id="DataTable" class="data-table dashboard-table" width="100%"></table>';
    this.initializeTable(this.state.todayRPL)
  };

  changePendingPassenger = () => {
    this.setState({
      pendingState: "passenger",
    });
  };

  changePendingRPL = () => {
    this.setState({
      pendingState: "rpl",
    });
  };

  onRadioClickBooking = async event => {
    await this.setState({
      rbookingGroup: event.target.value
    });
  }

  setTimeout = (() => {
  }, 3000);

  getPending = async () => {
    var url = config.api.invokeUrl + "/bookings/status?status=pending";            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"]
      },
      success: (response) => {
        if (response["statusCode"] === 200)
          this.setState({ pendingData: response["body"], pendingLoading: false });
      },
      error: (xhr, status, err) => {
        //xhr gives the whole error {"readyState":4,"responseText":"{\"messageU\":\"The incoming token has expired\"}","responseJSON":{"messageU":"The incoming token has expired"},"status":401,"statusText":"Unauthorized"} 
        //status gives "error"
        //err gives "Unauthorized"
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  getTodayPassenger = async () => {
    var url = config.api.invokeUrl + "/bookings/approved/startdateenddate?serviceProviderType=P&startDate=" + moment(today).format("YYYY-MM-DD") + "&endDate=" + moment(today).format("YYYY-MM-DD");
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"]
      },
      success: (response) => {
        if (response["statusCode"] === 200) {
          let data = [];
          if (response["body"] !== "[]") {
            for (var i = 0; i < response["body"].length; i++) {
              let booking = ""
              booking = [
                moment(response["body"][i]["departureTime"], "HHmm").format(config.format.time),
                response["body"][i]["routeName"],
                response["body"][i]["bookingCode"],
                response["body"][i]["displayUserName"],
                response["body"][i]["purposeShort"],
                response["body"][i]["bookingUnit"],
                response["body"][i]["advancedNotice"],
                response["body"][i]["numPassenger"],
                response["body"][i]["updatedBy"],
                moment(response["body"][i]["updatedDate"]).format(config.format.datetime),
                response["body"][i]["bookingGroup"],
              ];         //add Id for edit
              if (booking !== "")
                data.push(booking);
            }
          }
          this.setState({ todayP: data, todayLoading: false });
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  getTodayRPL = async () => {
    var url = config.api.invokeUrl + "/bookings/approved/startdateenddate?serviceProviderType=RPL&startDate=" + moment(today).format("YYYY-MM-DD") + "&endDate=" + moment(today).format("YYYY-MM-DD");
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"]
      },
      success: (response) => {
        if (response["statusCode"] === 200) {
          let data = [];
          if (response["body"] !== "[]") {
            for (var i = 0; i < response["body"].length; i++) {
              let vehicles = ""
              for (var j = 0; j < response["body"][i]["Vehicle"].length; j++) {
                if (j === 0)
                  vehicles = response["body"][i]["Vehicle"][j]["name"];
                else
                  vehicles += ", " + response["body"][i]["Vehicle"][j]["name"];
              }
              let booking = ""
              booking = [
                moment(response["body"][i]["departureTime"], "HHmm").format(config.format.time),
                response["body"][i]["routeName"],
                response["body"][i]["bookingCode"],
                response["body"][i]["displayUserName"],
                response["body"][i]["purposeShort"],
                response["body"][i]["bookingUnit"],
                response["body"][i]["advancedNotice"],
                vehicles,
                response["body"][i]["updatedBy"],
                moment(response["body"][i]["updatedDate"]).format(config.format.datetime),
                response["body"][i]["bookingGroup"],
                response["body"][i]["totalLoad"],
              ];         //add Id for edit
              if (booking !== "")
                data.push(booking);
            }
          }
          this.setState({ todayRPL: data, rplLoading: false });
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });
  }

  initializeTable = (data) => {
    $.fn.dataTable.moment(config.format.time);
    $("#DataTable").DataTable({
      lengthChange: false,                  //data1       data2
      "searching": false,
      data: data,       //data must be in [ [col1,col2], [col1,col2] ] format
      order: [[0, "asc"]],
      columns: [        //set header for table
        { title: "Time" },
        { title: "Route" },
        { title: "Booking Code" },
        { title: "Booked By" },
        { title: "Purpose" },
      ],

      "initComplete": () => {
        var table = $('#DataTable').DataTable();
        $('#DataTable tbody').on('click', 'tr', function () {
          var data = table.row(this).data();
          if (data) {
            document.getElementById("showDetails").value = data[2];
            document.getElementById("showDetails").click();
          }
        });
        document.querySelectorAll("#DataTable_wrapper .row")[1].classList.add("overflow-data-table");
      }
    });
  }

  displayDetails = () => {                              //add click event listener function for edit
    let bookingCode = document.getElementById("showDetails").value;
    let displayData;

    if (this.state.todayState === "passenger") {
      for (var i = 0; i < this.state.todayP.length; i++) {
        if (bookingCode === this.state.todayP[i][2]) {
          displayData = this.state.todayP[i];
          break;
        }
      }
    }
    else {
      for (var j = 0; j < this.state.todayRPL.length; j++) {
        if (bookingCode === this.state.todayRPL[j][2]) {
          displayData = this.state.todayRPL[j];
          break;
        }
      }
    }

    if (displayData !== "") {
      document.getElementById("displaydepartureTime").innerText = displayData[0];
      document.getElementById("displayroute").innerText = displayData[1];
      document.getElementById("displaybookingCode").innerText = displayData[2];
      document.getElementById("displaybookedBy").innerText = displayData[3];
      document.getElementById("displaypurpose").innerText = displayData[4];
      document.getElementById("displaybookingUnit").innerText = displayData[5];
      if (displayData[6] === null || displayData[6] === "")
        document.getElementById("displayadvancedNotice").innerText = "No Notice Available";
      else
        document.getElementById("displayadvancedNotice").innerText = displayData[6];
      if (this.state.todayState === "passenger") {
        document.getElementById("loadLabel").innerText = "Number of Passengers: ";
        document.getElementById("totalLabel").innerText = "";
        document.getElementById("displayTotalLoad").innerText = "";
      }
      else {
        document.getElementById("totalLabel").innerText = "Total Load: ";
        document.getElementById("displayTotalLoad").innerText = displayData[11];
        document.getElementById("loadLabel").innerText = "Vehicle(s): ";
      }

      document.getElementById("displayload").innerText = displayData[7];
      document.getElementById("displayupdatedBy").innerText = displayData[8];
      document.getElementById("displayupdatedDate").innerText = displayData[9];
      if (displayData[10] === null || displayData[10] === "") {
        this.setState({ bookingGroup: "" });
      }
      else {
        this.setState({ bookingGroup: displayData[10] });
        document.getElementById("displaybookingGroup").innerText = displayData[10];
      }

      document.getElementById("DisplayDetails").style.display = "block";
    }
  }

  resetWordCount = () => {
    document.getElementById("rejectionReason").classList.remove("border-danger");
    document.getElementById("wordCount").innerText = "Characters Left 250";
    document.getElementById("wordCount").classList.remove("text-danger");
  }

  wordCount = event => {
    let newLength = 250 - event.target.value.length - (event.target.value.match(/\n/g) || []).length;
    this.setState({
      rejectedReason: event.target.value, length: newLength
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


  toggleForm = (event) => {

    document.getElementById("clearBtn").style.display = "block";

    document.getElementById("form-error").innerText = "";
    if (this.state.formState === "Reject") {
      this.resetWordCount();
    }

    var selectedBookingCode = this.state.bookingCode;
    var selectedBookingGroup = "";
    var selectedDepartureDate = "";
    var selectedDepartureTime = "";
    var selectedBookingUnit = "";
    for (var check = 0; check < this.state.pendingData.length; check++) {
      if (selectedBookingCode === this.state.pendingData[check].bookingCode) {
        selectedBookingGroup = this.state.pendingData[check].bookingGroup
        selectedDepartureDate = this.state.pendingData[check].departureDate;
        selectedDepartureTime = this.state.pendingData[check].departureTime;
        selectedBookingUnit = this.state.pendingData[check].bookingUnit;
      }
    }

    if (document.getElementById("FormModal").style.display === "none") {
      this.setState({ bookingUnit: selectedBookingUnit, bookingGroup: selectedBookingGroup, departureDate: selectedDepartureDate, departureTime: selectedDepartureTime, bookingCode: selectedBookingCode })
      if (this.state.formState === "Reject") {
        document.getElementById("rejectionReason").value = "";
      }

      if (this.state.formState === "Approve") {
        document.getElementById("clearBtn").style.display = "none"
      }
      document.getElementById("FormModal").style.display = "block";
    }
    else {
      document.getElementById("FormModal").style.display = "none";
    }

  }

  //   document.getElementById("form-error").innerText = "";
  //   if (this.state.formState === "Reject") {
  //     this.resetWordCount();
  //   }

  //   var selectedBookingCode = this.state.bookingCode;
  //   console.log(selectedBookingCode);
  //   var selectedBookingGroup = "";
  //   var selectedDepartureDate = "";
  //   var selectedDepartureTime = "";
  //   var selectedBookingUnit = "";
  //   for (var check = 0; check < this.state.pendingData.length; check++) {
  //     if (selectedBookingCode === this.state.pendingData[check].bookingCode) {
  //       selectedBookingGroup = this.state.pendingData[check].bookingGroup
  //       selectedDepartureDate = this.state.pendingData[check].departureDate;
  //       selectedDepartureTime = this.state.pendingData[check].departureTime;
  //       selectedBookingUnit = this.state.pendingData[check].bookingUnit;
  //     }
  //   }

  //   if (document.getElementById("FormModal").style.display === "none") {
  //     this.setState({ bookingUnit: selectedBookingUnit, bookingGroup: selectedBookingGroup, departureDate: selectedDepartureDate, departureTime: selectedDepartureTime, bookingCode: selectedBookingCode })
  //     console.log("bookinggroup state is " + selectedBookingGroup);
  //     if (this.state.formState === "Reject") {
  //       document.getElementById("rejectionReason").value = "";
  //     }

  //   }

  //   else {
  //     document.getElementById("FormModal").style.display = "block";
  //   }
  //   console.log("form state is " + this.state.formState);
  // }
  //   else {
  // document.getElementById("FormModal").style.display = "none";
  //}

  // }

  closeDisplay = (event) => {
    if (event.target.id === "DisplayDetails" || event.target.id === "cls-details") {
      document.getElementById("DisplayDetails").style.display = "none";
    }
  }

  closeForm = (event) => {
    if (event.target.id === "FormModal") {
      document.getElementById("FormModal").style.display = "none";
    }

  }

  setPendingRPL = () => {
    var obj = [];
    let depDate = new Date();
    for (var i = 0; i < this.state.pendingData.length; i++) {
      depDate = new Date(this.state.pendingData[i]["departureDate"]);
      depDate.setHours(0, 0, 0, 0);
      if (this.state.pendingData[i]["serviceProviderType"] === "RPL") {
        if (depDate > today) {
          if (obj.length !== 0)
            obj.push(<hr key={i} />);
          obj.push(
            <div key={this.state.pendingData[i]["bookingCode"]} id={this.state.pendingData[i]["bookingCode"]} className="row">
              <div className="col-8">
                <p className="mb-0">
                  Date <b>{this.state.pendingData[i]["departureDate"]}</b>
                </p>
                <p className="mb-0">
                  Time <b>{moment(this.state.pendingData[i]["departureTime"], "HHmm").format(config.format.time)}</b>
                </p>
                <p className="mb-0">
                  From <b>{this.state.pendingData[i]["routeName"]}</b>
                </p>
                <p className="mb-0">
                  Booking Code <b>{this.state.pendingData[i]["bookingCode"]}</b>
                </p>
                <p className="mb-0">
                  Purpose <b>{this.state.pendingData[i]["purposeShort"]}</b>
                </p>
                <p className="mb-0">
                  Booking Unit <b>{this.state.pendingData[i]["bookingUnit"]}</b>
                </p>
              </div>
              <div className="col-2 pending-btn align-items-center d-flex">
                <img alt="" title='Reject' src="bttn-reject.png" height="50px" onClick={this.rejectBooking} width="50px" data-bookingunit={this.state.pendingData[i]["bookingUnit"]} data-bookingcode={this.state.pendingData[i]["bookingCode"]} />
              </div>
              <div className="col-2 pending-btn align-items-center d-flex">
                <img alt="" title='Approve' src="bttn-approve.png" height="50px" onClick={this.approveBooking} width="50px" data-bookingcode={this.state.pendingData[i]["bookingCode"]} />
              </div>
            </div>);
        }
      }
    }
    if (obj.length === 0) {

      obj.push(<div key="empty" className="text-center font-weight-bold">No bookings available</div>)
    }
    return obj;
  }

  setPendingP = () => {
    var obj = [];
    let depDate = new Date();
    for (var i = 0; i < this.state.pendingData.length; i++) {
      depDate = new Date(this.state.pendingData[i]["departureDate"]);
      depDate.setHours(0, 0, 0, 0);
      if (this.state.pendingData[i]["serviceProviderType"] === "P") {
        if (depDate > today) {
          if (obj.length !== 0)
            obj.push(<hr key={i} />);
          obj.push(
            <div key={this.state.pendingData[i]["bookingCode"]} id={this.state.pendingData[i]["bookingCode"]} className="row">
              <div className="col-8">
                <p className="mb-0">
                  Date <b>{this.state.pendingData[i]["departureDate"]}</b>
                </p>
                <p className="mb-0">
                  Time <b>{moment(this.state.pendingData[i]["departureTime"], "HHmm").format(config.format.time)}</b>
                </p>
                <p className="mb-0">
                  From <b>{this.state.pendingData[i]["routeName"]}</b>
                </p>
                <p className="mb-0">
                  Booking Code <b>{this.state.pendingData[i]["bookingCode"]}</b>
                </p>
                <p className="mb-0">
                  Purpose <b>{this.state.pendingData[i]["purposeShort"]}</b>
                </p>
                <p className="mb-0">
                  Booking Unit <b>{this.state.pendingData[i]["bookingUnit"]}</b>
                </p>
              </div>
              <div className="col-2 pending-btn align-items-center d-flex">
                <img alt="" title='Reject' src="bttn-reject.png" height="50px" onClick={this.rejectBooking} width="50px" data-bookingunit={this.state.pendingData[i]["bookingUnit"]} data-bookingcode={this.state.pendingData[i]["bookingCode"]} />
              </div>
              <div className="col-2 pending-btn align-items-center d-flex">
                <img alt="" title='Approve' src="bttn-approve.png" height="50px" onClick={this.approveBooking} width="50px" data-bookingcode={this.state.pendingData[i]["bookingCode"]} />
              </div>
            </div>);
        }
      }
    }
    if (obj.length === 0) {
      obj.push(<div key="empty" className="text-center font-weight-bold">No bookings available</div>)
    }
    return obj;
  }

  setGauges = async () => {
    var passengerValue = "";
    var rplValue = "";

    var url = config.api.invokeUrl + "/averagerating"            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        if (response["statusCode"] === 200) {
          passengerValue = response["body"][0]["avgRating"];
          rplValue = response["body"][1]["avgRating"];
        }
      },
      error: (xhr, status, err) => {
        if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
      }
    });

    Gauge(document.getElementById("gaugePassenger"), {
      max: 5,
      dialStartAngle: -180,
      dialEndAngle: -360,
      value: passengerValue,
      label: function (value) {
        return value;
      }
    });


    document.querySelector("#gaugePassenger svg").setAttribute("viewBox", "0 0 100 50");
    document.querySelector("#gaugePassenger .value-text").innerHTML = '&#x2605;' + passengerValue;

    Gauge(document.getElementById("gaugeRPL"), {
      max: 5,
      dialStartAngle: -180,
      dialEndAngle: -360,
      value: rplValue,
      label: function (value) {
        return value;
      }
    });
    document.querySelector("#gaugeRPL svg").setAttribute("viewBox", "0 0 100 50");
    document.querySelector("#gaugeRPL .value-text").innerHTML = '&#x2605;' + rplValue;
    this.setState({ avgLoading: false });
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
    console.log("it goes in handlesubmit")
    this.clearErrorState();
    document.getElementById("form-error").innerText = "";
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }
    else if (this.state.length < 0) {
      document.getElementById("form-error").innerText = "Guideline has a character limit of 250";
      document.getElementById("rejectionReason").classList.add("border-danger");
    }


    else {

      if (this.state.formState === "Approve") {

        let data1 = ""

        if (this.state.rbookingGroup === "false") {

          data1 = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
            this.state.bookingUnit, "", "", "",
            "", "", "", "", "Approved", "", "", "", "", "",
            "", this.props.auth.user.preferred_username, "", "", "", "", "");
        }

        else if (this.state.rbookingGroup === "true") {

          data1 = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
            this.state.bookingUnit, "", "", "",
            "", "", "", "", "Approved", "", "", "", "", this.state.bookingGroup,
            "", this.props.auth.user.preferred_username, "", "", "", "", "");

        }

        let url1 = config.api.invokeUrl + "/booking/update";
        let bc2 = this.state.bookingCode;

        await $.ajax({
          type: 'PATCH',
          url: url1,
          data: data1.convertObjToJSON(),
          contentType: "application/json",
          headers: {
            Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
          },
          success: (response) => {
            if (response["statusCode"] === 200) {

              for (var z2 = 0; z2 < this.state.pendingData.length; z2++) {
                if (bc2 === this.state.pendingData[z2].bookingCode) {
                  this.state.pendingData.splice(z2, 1);
                }
              }

              let targetElement1 = ""
              targetElement1 = document.getElementById(bc2);

              if (targetElement1 !== null) {

                if (targetElement1.nextElementSibling !== null) {
                  targetElement1.nextElementSibling.style.display = "none"
                }

                targetElement1.style.display = "none";

              }
              this.toggleForm();
              document.getElementById("AlertEntireDiv1").style.display = "block";
              setInterval(function () { document.getElementById("AlertEntireDiv1").style.display = "none" }, 3000);
              window.location.reload();
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if(thrownError === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
              this.props.history.push("/logout");
            document.getElementById("AlertEntireDiv2").style.display = "block";
            setInterval(function () { document.getElementById("AlertEntireDiv2").style.display = "none" }, 3000);
          }
        });
      }

      else if (this.state.formState === "Reject") {

        console.log("it comes in reject");

        if (document.getElementById("rejectionReason").value === "") {
          document.getElementById("form-error").innerText = "Please enter a rejection reason";
          document.getElementById("rejectionReason").classList.add("border-danger");
        }

        else {

          let data = ""

          if (this.state.rbookingGroup === "true") {
            //data = { "body": `{"bookingCode": "${this.state.bookingCode}", "bookingGroup":"${this.state.bookingGroup}", "status": "Rejected", "rejectedReason":"${this.state.cancellationReason}", "departureDate": "${this.state.departureDate}", "departureTime": "${this.state.departureTime}", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "Rejected", "", "", "", "", this.state.bookingGroup,
              "", this.props.auth.user.preferred_username, "", "", "", "", entities.encode(document.getElementById("rejectionReason").value));

          }

          else if (this.state.rbookingGroup === "false") {
            // data = { "body": `{"bookingCode": "${this.state.bookingCode}", "status": "Rejected", "rejectedReason":"${this.state.cancellationReason}", "departureDate": "${this.state.departureDate}", "departureTime": "${this.state.departureTime}", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "Rejected", "", "", "", "", "",
              "", this.props.auth.user.preferred_username, "", "", "", "", entities.encode(document.getElementById("rejectionReason").value));
          }

          let url = config.api.invokeUrl + "/booking/update";
          let bc1 = this.state.bookingCode;

          await $.ajax({
            type: 'PATCH',
            url: url,
            data: data.convertObjToJSON(),
            contentType: "application/json",
            headers: {
              Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
            },
            success: (response) => {
              if (response["statusCode"] === 200) {

                for (var z1 = 0; z1 < this.state.pendingData.length; z1++) {
                  if (bc1 === this.state.pendingData[z1].bookingCode) {
                    this.state.pendingData.splice(z1, 1);
                  }
                }

                let targetElement = ""
                targetElement = document.getElementById(bc1);

                if (targetElement !== null) {

                  if (targetElement.nextElementSibling !== null) {
                    targetElement.nextElementSibling.style.display = "none"
                  }

                  targetElement.style.display = "none";

                }
                this.toggleForm();
                document.getElementById("AlertEntireDiv1").style.display = "block";
                setInterval(function () { document.getElementById("AlertEntireDiv1").style.display = "none" }, 3000);
                window.location.reload();
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              if(thrownError === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                this.props.history.push("/logout");
              document.getElementById("AlertEntireDiv2").style.display = "block";
              setInterval(function () { document.getElementById("AlertEntireDiv2").style.display = "none" }, 3000);
            }
          });
        }
      }
    }
  }

  rejectBooking = async (event) => {

    await this.setState({ formState: "Reject", bookingCode: event.target.dataset.bookingcode });
    this.toggleForm();

  }

  approveBooking = async (event) => {


    await this.setState({ formState: "Approve", bookingCode: event.target.dataset.bookingcode });
    var selectedBookingGroup1 = "";
    var selectedDepartureDate1 = "";
    var selectedDepartureTime1 = "";
    var selectedBookingUnit1 = "";

    for (var check1 = 0; check1 < this.state.pendingData.length; check1++) {
      if (this.state.bookingCode === this.state.pendingData[check1].bookingCode) {
        selectedBookingGroup1 = this.state.pendingData[check1].bookingGroup
        selectedDepartureDate1 = this.state.pendingData[check1].departureDate
        selectedDepartureTime1 = this.state.pendingData[check1].departureTime
        selectedBookingUnit1 = this.state.pendingData[check1].bookingUnit
      }
    }

    if (selectedBookingGroup1 === "" || selectedBookingGroup1 === null || selectedBookingGroup1 === undefined) {
      let data1 = new BookingModel("", this.state.bookingCode, selectedDepartureDate1, selectedDepartureTime1.replace(":", ""),
        selectedBookingUnit1, "", "", "",
        "", "", "", "", "Approved", "", "", "", "", "",
        "", this.props.auth.user.preferred_username, "", "", "", "", "");

      let url1 = config.api.invokeUrl + "/booking/update";
      let bc2 = this.state.bookingCode;

      await $.ajax({
        type: 'PATCH',
        url: url1,
        data: data1.convertObjToJSON(),
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {

            for (var z2 = 0; z2 < this.state.pendingData.length; z2++) {
              if (bc2 === this.state.pendingData[z2].bookingCode) {
                this.state.pendingData.splice(z2, 1);
              }
            }

            let targetElement1 = ""
            targetElement1 = document.getElementById(bc2);

            if (targetElement1 !== null) {

              if (targetElement1.nextElementSibling !== null) {
                targetElement1.nextElementSibling.style.display = "none"
              }

              targetElement1.style.display = "none";

            }
            document.getElementById("AlertEntireDiv").style.display = "block";
            setInterval(function () { document.getElementById("AlertEntireDiv1").style.display = "none" }, 3000);
            window.location.reload();
          }
        },
        error: (xhr, status, err) => {
          if(err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
          document.getElementById("AlertEntireDiv2").style.display = "block";
          setInterval(function () { document.getElementById("AlertEntireDiv2").style.display = "none" }, 3000);
        }
      });
    }

    else {
      this.toggleForm();
    }

    // let data = { "body": `{"bookingCode": "${event.target.dataset.bookingcode}", "status": "Approved", "remarks":"", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
    // let url = config.api.invokeUrl + "/booking/update";
    // let bc = event.target.dataset.bookingcode;
    // await $.ajax({
    //   type: 'PATCH',
    //   url: url,
    //   data: JSON.stringify(data),
    //   contentType: "application/json",
    //   success: (response) => {
    //     if (response["statusCode"] === 200) {

    //       for (var z = 0; z < this.state.pendingData.length; z++) {
    //         if (bc === this.state.pendingData[z].bookingCode) {
    //           this.state.pendingData.splice(z, 1);
    //         }
    //       }

    //       let targetElement1 = ""
    //       targetElement1 = document.getElementById(bc);

    //       if (targetElement1 !== null) {
    //         if (targetElement1.nextElementSibling !== null) {
    //           targetElement1.nextElementSibling.style.display = "none";
    //         }

    //         targetElement1.style.display = "none";
    //       }

    //       document.getElementById("AlertEntireDiv").style.display = "block";
    //       setInterval(function () { document.getElementById("AlertEntireDiv").style.display = "none" }, 3000);
    //     }
    //   },
    //   error: () => {
    //     document.getElementById("AlertEntireDiv2").style.display = "block";
    //     setInterval(function () { document.getElementById("AlertEntireDiv2").style.display = "none" }, 3000);
    //   }
    // });
  }

  async componentDidMount() {
    try {
      this.setGauges();
    }
    catch{
      this.setState({ avgLoading: false });
    }
    try {
      this.getPending();
    }
    catch{
      this.setState({ pendingLoading: false });
    }
    try {
      this.getTodayRPL();
    }
    catch{
      this.setState({ rplLoading: false });
    }
    try {
      await this.getTodayPassenger();
    }
    catch{
      this.setState({ todayLoading: false });
    }
    await this.initializeTable(this.state.todayP);


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
      return <div></div>;
    } else {
      return (
        <div className="container-fluid p-0">
          <script>
            {(document.body.style.backgroundColor = "#EEEEEE")}
          </script>
          <div className="row p-3 mr-0" id="main-content">
            {this.state.todayState === "passenger" && (
              <div className="dashboard-left-div shadow bg-white">
                <div className="row" style={{ margin: 0 }}>
                  <div className="col-8 mb-1 align-items-center d-flex">
                    Today's Bookings: {todayDate}
                  </div>
                  <div className="col-2 mb-1 p-0">
                    <div
                      className="dashboard-button-div">
                      <img
                        src="bttn_passenger-selected.png"
                        alt=""
                        width="50"
                        height="50"
                      />
                    </div>
                  </div>
                  <div
                    className="col-2 mb-1 p-0"
                    onClick={this.changeTodayRPL}
                    style={{ backgroundColor: "#1D2681" }}
                  >
                    <div className="dashboard-button-div">
                      <img src="bttn_rpl.png" alt="" width="50" height="50" />
                    </div>
                  </div>
                </div>
                <div className="dashboard-table-div">
                  <div className="data-table-div m-3">
                    <table id="DataTable" className="data-table dashboard-table" width="100%"></table>
                  </div>
                  {this.state.todayLoading && (<div className="text-center m-3">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>)}
                </div>
              </div>
            )}
            {this.state.todayState === "rpl" && (
              <div className="dashboard-left-div shadow bg-white">
                <div className="row" style={{ margin: 0 }}>
                  <div className="col-8 mb-1 align-items-center d-flex">
                    Today's Bookings: {todayDate}
                  </div>
                  <div
                    className="col-2 mb-1 p-0"
                    onClick={this.changeTodayPassenger}
                    style={{ backgroundColor: "#42D1B6" }}
                  >
                    <div className="dashboard-button-div" id="todaypassenger">
                      <img
                        src="bttn_passenger.png"
                        alt=""
                        width="50"
                        height="50"
                      />
                    </div>
                  </div>
                  <div className="col-2 mb-1 p-0">
                    <div className="dashboard-button-div">
                      <img
                        src="bttn_rpl-selected.png"
                        alt=""
                        width="50"
                        height="50"
                      />
                    </div>
                  </div>
                </div>
                <div className="dashboard-table-div">
                  <div className="data-table-div m-3">
                  </div>
                </div>
              </div>
            )}
            <div className="dashboard-right-div">
              <div className="row">
                <div className="bg-white shadow p-2 bg-white passenger-rating">
                  <span className="ml-2">Average Rating</span>
                  <div className="card-body gauge-container" id="gaugePassenger"></div>
                  {this.state.avgLoading && (
                    <div className="text-center m-3">
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>)}
                  <p className="">Passenger Ferry Service Provider</p>
                </div>
                <div className="bg-white shadow p-2 bg-white rpl-rating">
                  <span className="ml-2">Average Rating</span>
                  <div className="card-body gauge-container" id="gaugeRPL"></div>
                  {this.state.avgLoading && (
                    <div className="text-center m-3">
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>)}
                  <p className="">RPL Service Provider</p>
                </div>
              </div>

              <div id="AlertEntireDiv" style={{ display: "none" }}>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous"></link>
                <div className="alert alert-success" role="alert" style={{ fontSize: 20 }}>
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <strong>Success!</strong> You have approved the booking.
                </div>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossOrigin="anonymous"></script>
              </div>

              <div id="AlertEntireDiv1" style={{ display: "none" }}>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous"></link>
                <div className="alert alert-success" role="alert" style={{ fontSize: 20 }}>
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <strong>Success!</strong> You have rejected the booking.
                </div>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossOrigin="anonymous"></script>
              </div>

              <div id="AlertEntireDiv2" style={{ display: "none" }}>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous"></link>
                <div className="alert alert-danger" role="alert" style={{ fontSize: 20 }}>
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <strong>Failed!</strong> An Error Occured
                </div>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossOrigin="anonymous"></script>
              </div>


              {this.state.pendingState === "passenger" && (
                <div className="pending-dashboard-div bg-white shadow">
                  <div className="row ml-0 mr-0">
                    <div className="text-white col-8 col-lg-6 mb-3 mt-3">
                      <img alt="" src="icon-pending.png" height="40px" width="40px" className="mr-2" />
                      Pending Request
                    </div>
                    <div className="col-2 col-lg-3 p-0 bg-white">
                      <div className="dashboard-button-div" id="pendingpassenger" >
                        <img src="bttn_passenger-selected-request.png" alt="" width="50" height="50" />
                      </div>
                    </div>
                    <div className="col-2 col-lg-3 p-0">
                      <div className="dashboard-button-div" id="pendingrpl" onClick={this.changePendingRPL} >
                        <img src="bttn_rpl.png" alt="" width="50" height="50" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 content" id="pendingBookingDiv">
                    {this.setPendingP()}
                    {this.state.pendingLoading && (
                      <div className="text-center m-3">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {this.state.pendingState === "rpl" && (
                <div className="pending-dashboard-div bg-white shadow">
                  <div className="row ml-0 mr-0">
                    <div className="text-white col-8 col-lg-6 mb-3 mt-3">
                      <img alt="" src="icon-pending.png" height="40px" width="40px" className="mr-2" />
                      Pending Request
                    </div>
                    <div className="col-2 col-lg-3 p-0">
                      <div className="dashboard-button-div" id="pendingpassenger" onClick={this.changePendingPassenger} >
                        <img src="bttn_passenger.png" alt="" width="50" height="50" />
                      </div>
                    </div>
                    <div className="col-2 col-lg-3 p-0 bg-white">
                      <div className="dashboard-button-div bg-white" id="pendingrpl" >
                        <img src="bttn_rpl-selected-request.png" alt="" width="50" height="50" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 content">
                    {this.setPendingRPL()}
                    {this.state.pendingLoading && (
                      <div className="text-center m-3">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="form-modal" onClick={this.closeForm} style={{ display: "none" }} id="FormModal">
              <input onClick={this.displayDetails} type="hidden" id="showDetails" />
              <form autoComplete="off" onSubmit={this.handleSubmit} className="form-content animate pl-3 pr-3">
                <span onClick={this.toggleForm} className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>{this.state.formState} Booking</h5>
                </div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                <div className="row">
                  {this.state.formState === "Reject" && (
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="rejectionReason">Rejection Reason:</label>
                        <textarea className="form-control" onChange={this.wordCount} rows="5" type="text" id="rejectionReason"></textarea>
                        <p className="text-right" id="wordCount"> Characters Left: 250</p>
                      </div>
                    </div>
                  )}

                  {(this.state.bookingGroup !== "" && this.state.bookingGroup !== undefined && this.state.bookingGroup !== null) && (
                    <div className="row" style={{ margin: "10px" }} id="bookingGroupRadio">
                      <div className="col-12 col-sm-6 mb-2">
                        <div className="custom-control custom-radio">
                          <input className="custom-control-input" onClick={this.onRadioClickBooking} type="radio" name="inlineRadioOptions" id="RadioFalse" value="false" defaultChecked="true" />
                          <label className="custom-control-label" htmlFor="RadioFalse">This booking Only</label>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 mb-2">
                        <div className="custom-control custom-radio">
                          <input className="custom-control-input" onClick={this.onRadioClickBooking} type="radio" name="inlineRadioOptions" id="RadioTrue" value="true" />
                          <label className="custom-control-label" htmlFor="RadioTrue">This and future bookings</label>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
                <div className="row" style={{ backgroundColor: "#f1f1f1" }}>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 ml-auto mb-2 mt-2"><button type="reset" id="clearBtn" onClick={this.resetWordCount} className="btn btn-block btn-outline-danger">Clear <i className="far fa-window-close"></i></button></div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2 mt-2"><button type="submit" className="btn btn-block btn-success">Submit <i className="far fa-plus-square"></i></button></div>
                </div>
              </form>
            </div>

            <div className="form-modal" onClick={this.closeDisplay} style={{ display: "none" }} id="DisplayDetails">
              <div className="form-content" style={{ width: "850px" }}>
                <span onClick={this.closeDisplay} style={{ marginRight: "5px" }} id="cls-details" className="close-form" title="Close Modal">&times;</span>
                <div style={{ margin: "10px" }}>
                  <div className="card mb-2 mx-auto border-dark" style={{ margin: "10px" }}>
                    <div className="card-header" style={{ backgroundColor: "#2082dd" }}>
                      <h5 className="text-white d-inline-block" id="displaybookingCode" style={{ width: "85%" }}>Booking</h5>
                    </div>
                    <div className="card-body pb-0 overflow">
                      <div className="row booking-data-row">
                        <div className="col-sm-6 col-md-6 col-lg-3">
                          <p className="font-weight-bold mb-1 booking-header">Time</p>
                          <p className="text-data" id="displaydepartureTime" />
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                          <p className="font-weight-bold mb-1 booking-header">Route</p>
                          <p className="text-data" id="displayroute" />
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                          <p className="font-weight-bold mb-1 booking-header">Booked By</p>
                          <p className="text-data" id="displaybookedBy" />
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                          <p className="font-weight-bold mb-1 booking-header">Purpose</p>
                          <p className="text-data" id="displaypurpose" />
                        </div>
                      </div>
                    </div>

                    <div className="card-body mt-3" style={{ backgroundColor: "rgba(204, 255, 248, 0.5)" }}>
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                          <a className="nav-link active" id={"details-tab"} data-toggle="tab" href={"#details"} role="tab" aria-controls={"details"} aria-selected="true">Booking Details</a>
                        </li>
                        {this.state.bookingGroup !== "" && (
                          <li className="nav-item">
                            <a className="nav-link" id={"bookingGroup-tab"} data-toggle="tab" href={"#bookingGroup"} role="tab" aria-controls={"bookingGroup"} aria-selected="false">Booking Group</a>
                          </li>
                        )}
                      </ul>

                      <div style={{
                        borderLeft: "1px solid #dee2e6",
                        borderRight: "1px solid #dee2e6",
                        borderBottom: "1px solid #dee2e6",
                        backgroundColor: "white",
                        padding: "1em",
                      }} id="myTabContent">
                        <div className="tab-pane fade show active" id={"details"} role="tabpanel" aria-labelledby={"details-tab"}>
                          <p><b>Booking Unit: </b><span id="displaybookingUnit" /></p>
                          <p><b>Advanced Notice: </b><span id="displayadvancedNotice" /></p>
                          <p><b id="totalLabel" /><b id="displayTotalLoad" /></p>
                          <p><b id="loadLabel" /><span id="displayload" /></p>
                          <p className="mb-0"><b>Updated By </b><span id="displayupdatedBy" /><b> On </b><span id="displayupdatedDate" /> </p>
                        </div>
                        {(this.state.bookingGroup !== undefined) && (
                          <div className="tab-pane fade" id={"bookingGroup"} role="tabpanel" aria-labelledby={"bookingGroup-tab"}>
                            <p><b>Booking Group: </b><span id="displaybookingGroup" /></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
