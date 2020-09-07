import React, { Component } from 'react';
import config from "../config.json";
import $ from "jquery";
// import FormErrors from "./FormErrors";
import Validate from "./utility/FormValidation";
import FormErrors from "./FormErrors";
import Spinner from 'react-bootstrap/Spinner'
import Calendar from "./utility/Calendar";
import BookingModel from "../models/Booking";
import Autocomplete from "./utility/AutoComplete";
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
let moment = require("moment");
let today = new Date();
let twoDayslater = new Date();
twoDayslater.setDate(twoDayslater.getDate() + 2);
twoDayslater.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);
let todayString = moment(today).format("YYYY-MM-DD");
let selDate;
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class Booking extends Component {

  constructor(props) {
    super(props);
    this.vehicleTimeout = 0;
    this.purposeTimeout = 0;
    this.routeTimeout = 0;
    this.bookingUnitTimeout = 0;
    this.genReportClick = this.genReportClick.bind(this);

  }

  state = {
    data: [],
    length: 250,
    formState: "Cancel",
    service: "P",
    vehicles: "",
    purposeId: "",
    switchForm: "",
    routeId: "",
    departureDate: "",
    departureTime: "",
    bookingGroup: "",
    defaultOption: "",
    rbookingGroup: "false",
    numPassenger: 0,
    vehicleRPLData: [],
    vehicleRPLList: [],
    purposeRPLData: [],
    purposeRPLList: [],
    purposePData: [],
    purposePList: [],
    routeRPLData: [],
    routeRPLList: [],
    routePData: [],
    routePList: [],
    bookingUnitList: [],
    repeatedBookings: false,
    selectedVehicles: [],
    isLoading: true,
    formLoading: true,
    apierrors: null,
    errors: {
      blankfield: false,
    }
  };

  getBooking = async (startdate, enddate) => {
    console.log(startdate);
    console.log(enddate);
    selDate = (startdate === enddate) ? moment(startdate).format(config.format.date) : moment(startdate).format(config.format.date) + " - " + moment(enddate).format(config.format.date);
    document.querySelector(".booking-cal-btn .text").innerText = (startdate === enddate) ? moment(startdate).format(config.format.date) : moment(startdate).format(config.format.date) + " - " + moment(enddate).format(config.format.date);
    let url = config.api.invokeUrl + "/bookings/startdateenddate?serviceProviderType=all&startDate=" + startdate + "&endDate=" + enddate;            //change according to which api you are using
    await $.ajax({
      type: 'GET',
      url: url,
      contentType: "application/json",
      headers: {
        Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
      },
      success: (response) => {
        if (response["statusCode"] === 200){
          this.setState({ data: response["body"], isLoading: false });
        }          
      },
      error: (xhr, status, err) => {
        if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
          this.props.history.push("/logout");
        this.setState({ data: [] });
      }
    });
    this.setAccordions();
  }

  getBookingUnit = async () => {

    if (sessionStorage.getItem("bookingUnitList")) {
      this.setState({ isLoading: false, bookingUnitList: JSON.parse(sessionStorage.getItem("bookingUnitList")) });
    }

    else {
      let url = config.api.invokeUrl + "/user/safunit";            //change according to which api you are using
      await $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        crossDomain: true,
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {
            this.setState({ bookingUnitList: response["body"], isLoading: false });
          }
          sessionStorage.setItem("bookingUnitList", JSON.stringify(response["body"]));
        },
        error: (xhr, status, err) => {
          if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
          this.setState({ bookingUnitList: [], isLoading: false });
        }
      });
      this.setAccordions();
    }
  }

  getVehicle = async () => {

    if (sessionStorage.getItem("vehicleRPLData")) {
      this.setState({ formLoading: false, vehicleRPLData: JSON.parse(sessionStorage.getItem("vehicleRPLData")), vehicleRPLList: JSON.parse(sessionStorage.getItem("vehicleRPLList")) });
    }

    else {
      var url = config.api.invokeUrl + "/vehicle?status=A";            //change according to which api you are using
      await $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {
            let vehicleRPLList = []
            for (let i = 0; i < response["body"].length; i++) {
              vehicleRPLList.push(response["body"][i]["name"])
            }
            //this.setState({ formLoading: false, vehicleRPLData: response["body"], vehicleRPLList: vehicleRPLList });
            sessionStorage.setItem("vehicleRPLData", JSON.stringify(response["body"]));
            sessionStorage.setItem("vehicleRPLList", JSON.stringify(vehicleRPLList));
            this.setState({ formLoading: false, vehicleRPLData: JSON.parse(sessionStorage.getItem("vehicleRPLData")), vehicleRPLList: JSON.parse(sessionStorage.getItem("vehicleRPLList")) });
          }
        },
        error: (xhr, status, err) => {
          if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }
      });
    }
  }

  getRoute = async () => {

    if (sessionStorage.getItem("routePData")) {
      this.setState({ formLoading: false, routePData: JSON.parse(sessionStorage.getItem("routePData")), routePList: JSON.parse(sessionStorage.getItem("routePList")), routeRPLData: JSON.parse(sessionStorage.getItem("routeRPLData")), routeRPLList: JSON.parse(sessionStorage.getItem("routeRPLList")) })
    }

    else {
      var url = config.api.invokeUrl + "/route?status=A&serviceProviderType=all";            //change according to which api you are using
      await $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {
            let routePList = [];
            let routeRPLList = [];
            let routePData = [];
            let routeRPLData = [];
            for (let i = 0; i < response["body"].length; i++) {
              if (response["body"][i]["serviceProviderType"] === "P") {
                routePData.push(response["body"][i]);
                routePList.push(response["body"][i]["routeName"]);
              } else {
                routeRPLData.push(response["body"][i]);
                routeRPLList.push(response["body"][i]["routeName"]);
              }
            }
            // this.setState({ routePData: routePData, routePList: routePList, routeRPLData: routeRPLData, routeRPLList: routeRPLList });
            sessionStorage.setItem("routePData", JSON.stringify(routePData));
            sessionStorage.setItem("routePList", JSON.stringify(routePList));
            sessionStorage.setItem("routeRPLData", JSON.stringify(routeRPLData));
            sessionStorage.setItem("routeRPLList", JSON.stringify(routeRPLList));
            this.setState({ formLoading: false, routePData: JSON.parse(sessionStorage.getItem("routePData")), routePList: JSON.parse(sessionStorage.getItem("routePList")), routeRPLData: JSON.parse(sessionStorage.getItem("routeRPLData")), routeRPLList: JSON.parse(sessionStorage.getItem("routeRPLList")) });
          }
        },
        error: (xhr, status, err) => {
          if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
          this.setState({ formLoading: true });
        }
      });
    }
  }

  getPurpose = async () => {

    if (sessionStorage.getItem("purposePData")) {
      this.setState({ formLoading: false, purposePData: JSON.parse(sessionStorage.getItem("purposePData")), purposePList: JSON.parse(sessionStorage.getItem("purposePList")), purposeRPLData: JSON.parse(sessionStorage.getItem("purposeRPLData")), purposeRPLList: JSON.parse(sessionStorage.getItem("purposeRPLList")) });
    }

    else {
      var url = config.api.invokeUrl + "/purpose?status=A&serviceprovidertype=all";            //change according to which api you are using
      await $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          if (response["statusCode"] === 200) {
            let purposePList = [];
            let purposeRPLList = [];
            let purposePData = [];
            let purposeRPLData = [];
            for (let i = 0; i < response["body"].length; i++) {
              if (response["body"][i]["serviceProviderType"] === "P") {
                purposePData.push(response["body"][i]);
                purposePList.push(response["body"][i]["purposeDesc"]);
              } else {
                purposeRPLData.push(response["body"][i]);
                purposeRPLList.push(response["body"][i]["purposeDesc"]);
              }
            }
            // this.setState({ purposePData: purposePData, purposePList: purposePList, purposeRPLData: purposeRPLData, purposeRPLList: purposeRPLList });
            sessionStorage.setItem("purposePData", JSON.stringify(purposePData));
            sessionStorage.setItem("purposePList", JSON.stringify(purposePList));
            sessionStorage.setItem("purposeRPLData", JSON.stringify(purposeRPLData));
            sessionStorage.setItem("purposeRPLList", JSON.stringify(purposeRPLList));
            this.setState({ formLoading: false, purposePData: JSON.parse(sessionStorage.getItem("purposePData")), purposePList: JSON.parse(sessionStorage.getItem("purposePList")), purposeRPLData: JSON.parse(sessionStorage.getItem("purposeRPLData")), purposeRPLList: JSON.parse(sessionStorage.getItem("purposeRPLList")) });

          }
        },
        error: (xhr, status, err) => {
          if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
          this.setState({ formLoading: true });
        }
      });
    }
  }

  resetWordCount = () => {
    if (document.getElementById("cancellationReason") !== null) {
      document.getElementById("cancellationReason").classList.remove("border-danger");
      document.getElementById("wordCount").innerText = "Characters Left 250";
      document.getElementById("wordCount").classList.remove("text-danger");
    }

    if (this.state.formState === "Approve") {
      document.getElementById("RadioTrue").checked = false;
      document.getElementById("RadioFalse").checked = false;
    }
  }

  wordCount = event => {
    let newLength = 250 - event.target.value.length - (event.target.value.match(/\n/g) || []).length;
    this.setState({
      cancellationReason: event.target.value, length: newLength
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

  clearFormInputs = async () => {
    await this.setState({ purposeId: "", routeId: "", numPassenger: "", vehicles: "", departureTime: "", departureDate: "" })
    if (document.getElementById("departureDate")) {
      document.getElementById("departureDate").value = "";
      document.getElementById("departureDate").classList.remove("border-danger");
    }
    if (document.getElementById("departureTime") !== null) {
      document.getElementById("departureTime").value = "";
      document.getElementById("departureTime").classList.remove("border-danger");
    }
    if (document.getElementById("purposeP") !== null) {
      document.getElementById("purposeP").value = "";
      document.getElementById("purposeP").classList.remove("border-danger");
    }
    if (document.getElementById("routeP") !== null) {
      document.getElementById("routeP").value = "";
      document.getElementById("routeP").classList.remove("border-danger");
    }
    if (document.getElementById("purposeRPL") !== null) {
      document.getElementById("purposeRPL").value = "";
      document.getElementById("purposeRPL").classList.remove("border-danger");
    }
    if (document.getElementById("routeRPL") !== null) {
      document.getElementById("routeRPL").value = "";
      document.getElementById("routeRPL").classList.remove("border-danger");
    }
    if (document.getElementById("vehicleList") !== null)
      document.getElementById('vehicleList').innerHTML = '<p>No Vehicles Added</p>'
    if (document.getElementById("vehicleName") !== null) {
      document.getElementById("vehicleName").value = "";
      document.getElementById("vehicleName").classList.remove("border-danger");
    }
    if (document.getElementById("vehicleQuantity") !== null) {
      document.getElementById("vehicleQuantity").value = "";
      document.getElementById("vehicleQuantity").classList.remove("border-danger");
    }
    if (document.getElementById("numPassenger") !== null)
      document.getElementById("numPassenger").value = "";
    if (document.getElementById("bookingUnit") !== null)
      document.getElementById("bookingUnit").value = "";
    if (document.getElementById("vehicleLoad") !== null)
      document.getElementById("vehicleLoad").value = "";
    if (document.getElementById("totalVehicleLoad") !== null)
      document.getElementById("totalVehicleLoad").innerText = "0";
    if (document.getElementById("form-success") !== null)
      document.getElementById("form-success").innerText = "";
    if (document.getElementById("form-error") !== null)
      document.getElementById("form-error").innerHTML = "";

  }

  editBooking = async (event) => {

    await this.setState({ formState: "Edit", bookingCode: event.currentTarget.dataset.bookingcode, repeatedBookings: false })
    this.clearFormInputs();
    this.clearErrorState();
    document.getElementById("form-error").innerHTML = "";
    //document.getElementById("FormModal").style.display = "block";
    document.getElementById("clearBtn").style.display = "block";
    let chosenBookingCode = this.state.bookingCode;
    var bookingArray = this.state.data;
    for (var z = 0; z < bookingArray.length; z++) {
      if (chosenBookingCode === bookingArray[z].bookingCode) {
        var chosenBooking = this.state.data[z];
      }
    }


    this.state.bookingGroup = chosenBooking.bookingGroup;
    document.getElementById("FormModal").style.display = "block";

    var select = document.getElementById("purposeEditing");
    var length = select.options.length;
    for (var i = length - 1; i >= 0; i--) {
      select.options[i] = null;
    }

    if (chosenBooking.serviceProviderType === "P") {

      for (var check3 = 0; check3 < this.state.purposePData.length; check3++) {
        if (chosenBooking.purposeId === this.state.purposePData[check3].purposeId) {
          // document.getElementById("purposeEditing").value = this.state.purposePData[check3].purposeDesc;
          this.state.defaultOption = this.state.purposePData[check3].purposeDesc;
        }
      }

      for (var x = 0; x < this.state.purposePList.length; x++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(this.state.purposePList[x]));
        opt.value = this.state.purposePList[x];
        select.appendChild(opt);
      }
    }

    else if (chosenBooking.serviceProviderType === "RPL") {

      for (var check4 = 0; check4 < this.state.purposeRPLData.length; check4++) {
        if (chosenBooking.purposeId === this.state.purposeRPLData[check4].purposeId) {
          // document.getElementById("purposeEditing").value = this.state.purposeRPLData[check4].purposeDesc;
          this.state.defaultOption = this.state.purposeRPLData[check4].purposeDesc;
        }
      }

      for (var x1 = 0; x1 < this.state.purposeRPLList.length; x1++) {
        var opt1 = document.createElement('option');
        opt1.appendChild(document.createTextNode(this.state.purposeRPLList[x1]));
        opt1.value = this.state.purposeRPLList[x1];
        select.appendChild(opt1);
      }

      var vehicleDropdown = document.getElementById("vehicleRPL");
      var vehicleLength = vehicleDropdown.options.length;
      for (var r = vehicleLength - 1; r >= 0; r--) {
        vehicleDropdown.options[r] = null;
      }

      for (var p = 0; p < this.state.vehicleRPLList.length; p++) {
        var option1 = document.createElement('option');
        option1.appendChild(document.createTextNode(this.state.vehicleRPLList[p]));
        option1.value = this.state.vehicleRPLList[p];
        vehicleDropdown.appendChild(option1);
      }

      let vehicleEditArray = "";
      for (var xyz = 0; xyz < this.state.data.length; xyz++) {
        if (this.state.data[xyz].bookingCode === chosenBooking.bookingCode) {
          vehicleEditArray = this.state.data[xyz].Vehicle;
        }
      }

      if (vehicleEditArray !== undefined) {

        for (var xyz1 = 0; xyz1 < vehicleEditArray.length; xyz1++) {
          document.getElementById("vehicleRPL").value = vehicleEditArray[xyz1].name;
          document.getElementById("vehicleQuantity").value = vehicleEditArray[xyz1].quantity;
          document.getElementById("addVehicleBtn").click();
        }
      }

    }

    document.getElementById("EditnumPassenger").value = chosenBooking.numPassenger
    document.getElementById("vehiclePlateNumbers").value = entities.decode(chosenBooking.remarks)
    // document.getElementById("FormModal").style.display = "block";


    this.state.bookingType = chosenBooking.bookingType;
    this.state.routeId = chosenBooking.routeId;
    this.state.status = chosenBooking.status;
    if (chosenBooking.advancedNotice !== undefined) {
      this.state.advancedNotice = chosenBooking.advancedNotice;
    }
    this.state.bookingUnit = chosenBooking.bookingUnit;
    this.state.departureTime = chosenBooking.departureTime;
    this.state.displayUserName = chosenBooking.displayUserName;
    this.state.scheduleId = chosenBooking.scheduleId;
    this.state.bookingGroup = chosenBooking.bookingGroup;

    if (chosenBooking.serviceProviderType === "RPL") {

      this.state.service = "RPL";
      document.getElementById("EditRPLDiv").style.display = "block";
      document.getElementById("EditNumPassengerDiv").style.display = "none";
      // Autocomplete(document.getElementById("purposeEditing"), this.state["purposeRPLList"]);

    }

    else if (chosenBooking.serviceProviderType === "P") {

      this.state.service = "P";
      document.getElementById("EditRPLDiv").style.display = "none";
      document.getElementById("EditNumPassengerDiv").style.display = "block";

      // Autocomplete(document.getElementById("purposeEditing"), this.state["purposePList"]);

      await this.setState({ bookingCode: chosenBooking.bookingCode, departureTime: chosenBooking.departureTime, departureDate: chosenBooking.departureDate, bookingUnit: chosenBooking.bookingUnit, displayUserName: chosenBooking.displayUserName, bookingGroup: chosenBooking.bookingGroup, routeId: chosenBooking.routeId, advancedNotice: chosenBooking.advancedNotice, serviceProviderType: chosenBooking.serviceProviderType, bookingType: chosenBooking.bookingType, updatedBy: chosenBooking.updatedBy })

    }

    // Autocomplete(document.getElementById("vehicleRPL"), this.state["vehicleRPLList"]);

    document.getElementById("displaybookingCode").innerText = chosenBooking.bookingCode;
    document.getElementById("displaydepartureDate").innerText = chosenBooking.departureDate;
    document.getElementById("displaydepartureTime").innerText = moment(chosenBooking.departureTime, "HHmm").format(config.format.time);
    document.getElementById("displayserviceProviderName").innerText = chosenBooking.serviceProviderName;
    document.getElementById("displayserviceProviderType").innerText = chosenBooking.serviceProviderType;
    document.getElementById("displayrouteName").innerText = chosenBooking.routeName;
    document.getElementById("displaybookingType").innerText = chosenBooking.bookingType;
    document.getElementById("displayStatus").innerText = chosenBooking.status;
    if (document.getElementById("bookingGroupRadio")) {
      document.getElementById("RadioFalse").checked = true;
    }
  }

  createBooking = async () => {
    await this.setState({ formState: "Create", service: "P", repeatedBookings: false, switchForm: 1 })
    this.clearFormInputs();
    var parentElement = document.getElementById("OneTimeDepartureDate");
    parentElement.children[1].type = "date";
    var parentElement1 = document.getElementById("OneTimeDepartureTime");
    parentElement1.children[1].type = "time";
    document.getElementById("RadioPassenger").checked = true;
    // Autocomplete(document.getElementById("purposeP"), this.state["purposePList"]);
    // Autocomplete(document.getElementById("routeP"), this.state["routePList"]);
    Autocomplete(document.getElementById("bookingUnit"), this.state.bookingUnitList);
    document.getElementById("FormModal").style.display = "block";
    // document.getElementById("OneTime").click();
    this.clearErrorState();
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].classList.remove("border-danger");
      inputs[i].value = "";
    }
    if (document.getElementById("mon")) {
      document.getElementById("mon").checked = false;
      document.getElementById("tues").checked = false;
      document.getElementById("wed").checked = false;
      document.getElementById("thurs").checked = false;
      document.getElementById("fri").checked = false;
      document.getElementById("sat").checked = false;
      document.getElementById("sun").checked = false;
    }

    var select = document.getElementById("routePassenger");
    var length = select.options.length;
    for (var ix = length - 1; ix >= 0; ix--) {
      select.options[ix] = null;
    }
    var sel = document.getElementById("routePassenger");
    for (var x = 0; x < this.state.routePList.length; x++) {
      var opt = document.createElement('option');
      opt.appendChild(document.createTextNode(this.state.routePList[x]));
      opt.value = this.state.routePList[x];
      sel.appendChild(opt);
    }

    var purposeDropdown = document.getElementById("purposeDD");
    var purposeLength = purposeDropdown.options.length;
    for (var m = purposeLength - 1; m >= 0; m--) {
      purposeDropdown.options[m] = null;
    }

    for (var s = 0; s < this.state.purposePList.length; s++) {
      var option = document.createElement('option');
      option.appendChild(document.createTextNode(this.state.purposePList[s]));
      option.value = this.state.purposePList[s];
      purposeDropdown.appendChild(option);
    }


  }

  rejectBooking = async (event) => {
    var selectedBookingCode2 = "";
    selectedBookingCode2 = event.target.dataset.bookingcode;
    var selectedBookingGroup2 = "";
    var depDate2 = "";
    var depTime2 = "";
    var bookingUnit2 = "";

    for (var check7 = 0; check7 < this.state.data.length; check7++) {
      if (this.state.data[check7].bookingCode !== null) {
        if (selectedBookingCode2 === this.state.data[check7].bookingCode) {
          selectedBookingGroup2 = this.state.data[check7].bookingGroup;
          depTime2 = this.state.data[check7].departureTime;
          depDate2 = this.state.data[check7].departureDate;
          bookingUnit2 = this.state.data[check7].bookingUnit;
        }
      }
    }
    await this.setState({ bookingUnit: bookingUnit2, bookingCode: selectedBookingCode2, bookingGroup: selectedBookingGroup2, departureDate: depDate2, departureTime: depTime2, rbookingGroup: "false", formState: "Reject" })
    this.resetWordCount();
    document.getElementById("cancellationReason").value = "";
    document.getElementById("FormModal").style.display = "block";
    document.getElementById("clearBtn").style.display = "block";

  }

  genReportClick = event => {

    event.preventDefault();
    let cardCollector = document.getElementsByClassName("card-header");
    var cardCollectorParentDiv = [];
    var visibleCardCollectorParent = []
    var shownBookings = [];
    var bookingObjects = [];
    
    //console.log(this.state.data.length);
    if (document.getElementById("bookings-div").firstChild.innerText === "No bookings available") {
      alert("There are no bookings for report generation");
    }
    else {
      for (var i = 0; i < cardCollector.length; i++) {
        cardCollectorParentDiv.push(cardCollector[i].parentNode);
      }
      for (var q = 0; q < cardCollectorParentDiv.length; q++) {
        if (cardCollectorParentDiv[q].style.display.toLowerCase() !== "none") {
          visibleCardCollectorParent.push(cardCollectorParentDiv[q]);
        }
      }
      for (var a = 0; a < visibleCardCollectorParent.length; a++) {
        shownBookings.push(visibleCardCollectorParent[a].firstChild.firstChild.innerText.substring(0, 6));
      }

      for (var n = 0; n < shownBookings.length; n++) {
        for (var b = 0; b < this.state.data.length; b++) {
          var val1 = shownBookings[n].toString();
          var val2 = this.state.data[b].bookingCode.toString();
          //console.log("checking if " + shownBookings[n] + " is the same as " + this.state.data[b].bookingCode); 
          if (val1 === val2) {
            bookingObjects.push(this.state.data[b]);
          }
        }
      }

      var tableHeaders = [];
      tableHeaders = ['Booking Code', 'Unit Name', 'Capacity', 'Purpose', 'Advanced Notice', 'Departure Date', 'Boarding Time', 'Direction', 'Booking Type', 'Service Provider Type', 'Status', 'SAF Feedback Type', 'SAF Feedback', 'SP Feedback Type', 'SP Feedback Comments'];
      var bookingTable = document.createElement('table');
      bookingTable.style.visibility = "hidden";
      document.body.appendChild(bookingTable);
      bookingTable.setAttribute("id", "bookingTable1");
      // bookingTable.display = "none";
      var tr1 = bookingTable.insertRow(0);
      for (var h = 0; h < tableHeaders.length; h++) {
        var th = document.createElement('th'); // the header object.
        th.innerHTML = tableHeaders[h];
        tr1.appendChild(th);
      }

      var bookingItem = [];
      for (var item = 0; item < bookingObjects.length; item++) {

        var rowCnt = bookingTable.rows.length;
        var tr = bookingTable.insertRow(rowCnt);
        var serviceType = bookingObjects[item].serviceProviderType.toString();
        bookingItem.push(bookingObjects[item].bookingCode);
        bookingItem.push(bookingObjects[item].bookingUnit);
        if (serviceType === "P") {
          bookingItem.push(bookingObjects[item].numPassenger);
        }
        else {
          bookingItem.push(bookingObjects[item].totalLoad);
        }
        bookingItem.push(bookingObjects[item].purposeShort);
        bookingItem.push(bookingObjects[item].advancedNotice);
        bookingItem.push(bookingObjects[item].departureDate);
        bookingItem.push(bookingObjects[item].departureTime);
        bookingItem.push(bookingObjects[item].routeName);
        bookingItem.push(bookingObjects[item].bookingType);
        bookingItem.push(serviceType);
        bookingItem.push(bookingObjects[item].status);
        if(bookingObjects[item].SAFFeedback !== undefined){
          bookingItem.push(bookingObjects[item].SAFFeedback.feedbackType);
          bookingItem.push(bookingObjects[item].SAFFeedback.comments);
        }
        else{
          bookingItem.push("");
          bookingItem.push("");
        }
        if(bookingObjects[item].SPFeedback !== undefined){
          bookingItem.push(bookingObjects[item].SPFeedback.feedbackType);
          bookingItem.push(bookingObjects[item].SPFeedback.comments);
        }else{
          bookingItem.push("");
          bookingItem.push("");
        }
        for (var item1 = 0; item1 < bookingItem.length; item1++) {

          var newRow = document.createElement('td');
          newRow.innerHTML = bookingItem[item1];
          tr.appendChild(newRow);

        }
        bookingItem.length = 0;
      }

      //var wb = XLSX.utils.table_to_book(document.getElementById("bookingTable1"), { sheet: "Sheet 1" });
      var ws = XLSX.utils.table_to_sheet(document.getElementById("bookingTable1"));
      var wscols = [
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 120 },
        { wpx: 360 },
        { wpx: 120 },
        { wpx: 360 }, // "pixels"
      ];
      ws['!cols'] = wscols;
      var wb1 = XLSX.utils.book_new();
      wb1.SheetNames.push("Sheet 1");
      wb1.Sheets["Sheet 1"] = ws
      var wbout = XLSX.write(wb1, { bookType: 'xlsx', bookSST: true, type: 'binary' });
      FileSaver.saveAs(new Blob([this.componentDidMount1(wbout)], { type: "application/octet-stream" }), 'BookingReport_' + selDate + '.xlsx');


    }
  }

  componentDidMount1(s) {

    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;

  }


  cancelBooking = async (event) => {
    var selectedBookingCode1 = event.target.dataset.bookingcode;
    await this.setState({ bookingUnit: event.target.dataset.bookingunit, bookingCode: event.target.dataset.bookingcode, bookingGroup: event.target.dataset.bookinggroup, departureDate: event.target.dataset.departuredate, rbookingGroup: "false", formState: "Cancel" })
    for (var check4 = 0; check4 < this.state.data.length; check4++) {
      if (selectedBookingCode1.toLowerCase().trim() === this.state.data[check4].bookingCode.toLowerCase().trim()) {
        this.state.departureTime = this.state.data[check4].departureTime
        this.state.departureDate = this.state.data[check4].departureDate
      }
    }
    this.resetWordCount();

    if (this.state.bookingGroup !== "" && this.state.bookingGroup !== undefined)
      document.getElementById("RadioFalse").checked = true;
    document.getElementById("cancellationReason").value = "";
    document.getElementById("FormModal").style.display = "block";
    document.getElementById("clearBtn").style.display = "block";

  }

  toggleForm = () => {
    document.getElementById("FormModal").style.display = "none";
  }

  closeForm = (event) => {
    if (event.target.id === "FormModal") {
      if (document.getElementById("OneTime")) {
        document.getElementById("OneTime").click();
      }
      document.getElementById("FormModal").style.display = "none";
    }

  }

  getSelectedBooking = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    await this.getBooking(event.target.dataset.startdate, event.target.dataset.enddate);
    let button = document.getElementById("bookingFilters").getElementsByClassName("btn");
    if (this.state.data !== "[]"){
      document.getElementById("searchUsername").value = "";
      document.getElementById("genButton").style.display = "block";
    }
    else{
      document.getElementById("genButton").style.display = "none";
    }
    for (let j = 0; j < button.length; j++) {
      if (button[j].classList.value.includes("btn-primary")) {
        button[j].classList.remove("btn-primary");
        button[j].classList.add("btn-outline-primary");
      }
      this.filter();
    }
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
    document.getElementById("form-error").innerHTML = "";
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
      console.log(error);
    }
    else {

      if (this.state.formState === "Approve") {

        if ((document.getElementById("RadioFalse").checked === false) && (document.getElementById("RadioTrue").checked === false)) {
          document.getElementById("form-error").innerText = "Please select an option";
        }

        else {

          let data = ""

          if (this.state.rbookingGroup === "true") {
            // data = { "body": `{"bookingCode": "${this.state.bookingCode}", "bookingGroup": "${this.state.bookingGroup}", "departureDate": ${this.state.departureDate}", "departureTime": ${this.state.departureTime.replace(":", "")}", "status": "Approved", "remarks":"", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "Approved", "", "", "", "", this.state.bookingGroup,
              "", this.props.auth.user.preferred_username, "", "", "", "", "");
          }

          else if (this.state.rbookingGroup === "false") {
            // data = { "body": `{"bookingCode": "${this.state.bookingCode}", "status": "Approved", "remarks":"", "departureDate": ${this.state.departureDate}", "departureTime": ${this.state.departureTime.toString()}", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "Approved", "", "", "", "", "",
              "", this.props.auth.user.preferred_username, "", "", "", "", "");
          }

          let url = config.api.invokeUrl + "/booking/update";
          await $.ajax({
            type: 'PATCH',
            url: url,
            data: data.convertObjToJSON(),
            contentType: "application/json",
            headers: {
              Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
            },
            success: (response) => {
              if (response["statusCode"] === 200)
                window.location.reload();
            },
            error: (xhr, status, err) => {
              if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                this.props.history.push("/logout");
            }
          });

        }
      }

      if (this.state.formState === "Cancel") {

        let data = ""

        if (this.state.length < 0) {
          document.getElementById("form-error").innerText = "Reason has a character limit of 250";
          document.getElementById("cancellationReason").classList.add("border-danger");
        }

        else {
          document.getElementById("FormModal").querySelector(".btn-success").disabled = true;

          if (this.state.rbookingGroup === "true") {
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "", "", "", "", "", this.state.bookingGroup,
              "", this.props.auth.user.preferred_username, "", "", "", entities.encode(this.state.cancellationReason), "");
          }
          else {
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "", "", "", "", "", "",
              "", this.props.auth.user.preferred_username, "", "", "", entities.encode(this.state.cancellationReason), "");
          }

          let url = config.api.invokeUrl + "/booking/cancel";
          await $.ajax({
            type: 'PATCH',
            url: url,
            data: data.convertObjToJSON(),
            contentType: "application/json",
            headers: {
              Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
            },
            success: (response) => {
              if (response["statusCode"] === 200)
                window.location.reload();
            },
            error: (xhr, status, err) => {
              if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                this.props.history.push("/logout");
              document.getElementById("FormModal").querySelector(".btn-success").disabled = false;
            }
          });
        }
      }
      if (this.state.formState === "Reject") {
        if (this.state.length < 0) {
          document.getElementById("form-error").innerText = "Reason has a character limit of 250";
          document.getElementById("cancellationReason").classList.add("border-danger");
        }
        else {
          document.getElementById("FormModal").querySelector(".btn-success").disabled = true;

          let data = ""
          if (this.state.rbookingGroup === "true") {
            //data = { "body": `{"bookingCode": "${this.state.bookingCode}", "bookingGroup":"${this.state.bookingGroup}", "status": "Rejected", "rejectedReason":"${this.state.cancellationReason}", "departureDate": "${this.state.departureDate}", "departureTime": "${this.state.departureTime}", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "Rejected", "", "", "", "", this.state.bookingGroup,
              "", this.props.auth.user.preferred_username, "", "", "", "", entities.encode(this.state.cancellationReason));
          }
          else if (this.state.rbookingGroup === "false") {
            // data = { "body": `{"bookingCode": "${this.state.bookingCode}", "status": "Rejected", "rejectedReason":"${this.state.cancellationReason}", "departureDate": "${this.state.departureDate}", "departureTime": "${this.state.departureTime}", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
            data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "", "", "",
              "", "", "", "", "Rejected", "", "", "", "", "",
              "", this.props.auth.user.preferred_username, "", "", "", "", entities.encode(this.state.cancellationReason));
          }

          let url = config.api.invokeUrl + "/booking/update";
          await $.ajax({
            type: 'PATCH',
            url: url,
            data: data.convertObjToJSON(),
            contentType: "application/json",
            headers: {
              Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
            },
            success: (response) => {
              console.log(response);
              if (response["statusCode"] === 200)
                window.location.reload();
            },
            error: (xhr, status, err) => {
              if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                this.props.history.push("/logout");
              document.getElementById("FormModal").querySelector(".btn-success").disabled = false;
            }
          });
        }
      }

      if (this.state.formState === "Edit") {


        let checkP = false;
        let checkRPL = false;

        if (this.state.service === "P") {

          let data1 = ""

          for (var purposeCheck = 0; purposeCheck < this.state["purposePList"].length; purposeCheck++) {

            if (document.getElementById("purposeEditing").value === this.state["purposePList"][purposeCheck]) {
              checkP = true;
            }
          }

          if (document.getElementById("purposeEditing").value === "" || checkP === false) {
            document.getElementById("form-error").innerHTML += "Enter a valid purpose<br/>";
            document.getElementById("purposeEditing").classList.add("border-danger");

          }

          else if (document.getElementById("EditnumPassenger").value === "") {

            document.getElementById("form-error").innerHTML += "Enter the number of passengers<br/>";
            document.getElementById("EditnumPassenger").classList.add("border-danger");

          }

          else if (document.getElementById("EditnumPassenger").value > 200) {

            document.getElementById("form-error").innerHTML += "Number of passengers cannot exceed 200 <br/>";
            document.getElementById("EditnumPassenger").classList.add("border-danger");
          }

          else if (document.getElementById("EditnumPassenger").value < 1) {

            document.getElementById("form-error").innerHTML += "Number of passengers cannot be below 1 <br/>";
            document.getElementById("EditnumPassenger").classList.add("border-danger");
          }

          // else if (document.getElementById("EditnumPassenger").value < 1) {

          //   document.getElementById("form-error").innerHTML += "Number of passengers is invalid <br/>";
          //   document.getElementById("EditnumPassenger").classList.add("border-danger");
          // }

          else {

            document.getElementById("FormModal").querySelector("#btnSubmit").disabled = true;
            document.getElementById("LoadingDiv").firstChild.innerText = "Updating Booking";
            document.getElementById("LoadingDiv").style.display = "block"

            let purposeNum = null;

            for (var PCheck = 0; PCheck < this.state.purposePData.length; PCheck++) {

              if (document.getElementById("purposeEditing").value.toLowerCase().trim() === this.state.purposePData[PCheck].purposeDesc.toLowerCase().trim()) {
                purposeNum = this.state.purposePData[PCheck].purposeId
              }
            }

            if (this.state.rbookingGroup === "true") {

              data1 = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
                this.state.bookingUnit, this.state.displayUserName, "", purposeNum,
                this.state.routeId, this.state.advancedNotice, this.state.service, this.state.bookingType, "Approved", "", "", "", document.getElementById("EditnumPassenger").value, this.state.bookingGroup,
                "", this.state.updatedBy, "", "", "", "", "");
            }

            else if (this.state.rbookingGroup === "false") {

              data1 = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
                this.state.bookingUnit, this.state.displayUserName, this.state.scheduleId, purposeNum,
                this.state.routeId, this.state.advancedNotice, this.state.service, this.state.bookingType, "Approved", "", "", "", document.getElementById("EditnumPassenger").value, "",
                "", this.state.updatedBy, "", "", "", "", "");
            }

            let url = config.api.invokeUrl + "/booking/edit";
            await $.ajax({
              type: 'PATCH',
              url: url,
              data: data1.convertObjToJSON(),
              contentType: "application/json",
              headers: {
                Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
              },
              success: (response) => {
                if (response["statusCode"] === 200) {
                  this.clearFormInputs();
                  document.getElementById("form-success").innerText = "Successfully created booking on " + moment(this.state.departureDate).format(config.format.date) + ", " + moment(this.state.departureTime.replace(":", "")).format(config.format.time) + "";
                  document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
                  window.location.reload();
                }
                else if (response["statusCode"] === 400) {
                  response = JSON.parse(response["body"]).body;
                  console.log(response.message);
                  console.log(response.capacity);
                  //response = JSON.stringify(response["body"]);
                  //console.log(response);
                  document.getElementById("form-error").innerText = "You have exeeded the capacity limit. The available capacity is " + response.capacity;
                  document.getElementById("LoadingDiv").style.display = "none";
                  document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
                }
              },
              error: (xhr, status, err) => {
                if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                  this.props.history.push("/logout");
              }
            });

          }
        }

        else if (this.state.service === "RPL") {

          this.state.numPassenger = null;

          for (var purposeCheck1 = 0; purposeCheck1 < this.state["purposeRPLList"].length; purposeCheck1++) {
            if (document.getElementById("purposeEditing").value === this.state["purposeRPLList"][purposeCheck1]) {
              checkRPL = true;
            }
          }

          if (document.getElementById("purposeEditing").value === "" || checkRPL === false) {
            document.getElementById("form-error").innerHTML += "Enter a valid purpose<br/>";
            document.getElementById("purposeEditing").classList.add("border-danger");

          }

          else if (document.getElementById("vehiclePlateNumbers").value === "" || document.getElementById("vehiclePlateNumbers").value.length < 5) {
            document.getElementById("form-error").innerHTML += "Enter a valid vehicle plate number<br/>";
            document.getElementById("vehiclePlateNumbers").classList.add("border-danger");
          }

          else {

            document.getElementById("FormModal").querySelector("#btnSubmit").disabled = true;
            document.getElementById("LoadingDiv").firstChild.innerText = "Updating Booking";
            document.getElementById("LoadingDiv").style.display = "block";

            let purposeNum1 = null;

            for (var PCheck1 = 0; PCheck1 < this.state.purposeRPLData.length; PCheck1++) {

              if (document.getElementById("purposeEditing").value.toLowerCase().trim() === this.state.purposeRPLData[PCheck1].purposeDesc.toLowerCase().trim()) {
                purposeNum1 = this.state.purposeRPLData[PCheck1].purposeId
              }
            }

            let totalVehicleLoad1 = ""
            let vehiclePlateNumber1 = ""
            let data = ""
            totalVehicleLoad1 = parseFloat(document.getElementById("totalVehicleLoad").innerText);
            vehiclePlateNumber1 = document.getElementById("vehiclePlateNumbers").value.trim();

            if (this.state.rbookingGroup === "true") {
              data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
                this.state.bookingUnit, this.state.displayUserName, "", purposeNum1,
                this.state.routeId, this.state.advancedNotice, this.state.service, this.state.bookingType, "Approved", entities.encode(vehiclePlateNumber1), totalVehicleLoad1, this.state.vehicles, "", this.state.bookingGroup,
                "", this.state.updatedBy, "", "", "", "", "");
            }

            else if (this.state.rbookingGroup === "false") {
              data = new BookingModel("", this.state.bookingCode, this.state.departureDate, this.state.departureTime.replace(":", ""),
                this.state.bookingUnit, this.state.displayUserName, "", purposeNum1,
                this.state.routeId, this.state.advancedNotice, this.state.service, this.state.bookingType, "Approved", entities.encode(vehiclePlateNumber1), totalVehicleLoad1, this.state.vehicles, "", "",
                "", this.state.updatedBy, "", "", "", "", "");
            }

            let url = config.api.invokeUrl + "/booking/edit";
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
                  this.clearFormInputs();
                  document.getElementById("form-success").innerText = "Successfully created booking on " + moment(this.state.departureDate).format(config.format.date) + ", " + moment(this.state.departureTime.replace(":", "")).format(config.format.time) + "";
                  document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
                  window.location.reload();
                }
              },
              error: (xhr, status, err) => {
                if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                  this.props.history.push("/logout");
              }
            });

          }

        }

      }

      if (this.state.formState === "Create") {

        if (this.state.service === "RPL") {
          if (this.state.vehicles === "") {
            document.getElementById("form-error").innerHTML += "Please add a vehicle<br/>";
            document.getElementById("vehicleList").classList.add("border-danger");
          }
        }
        else {
          if (Number.isInteger(this.state.numPassenger === false)) {
            document.getElementById("numPassenger").classList.add("border-danger");
            document.getElementById("form-error").innerHTML += "Enter integers for passengers<br/>";
          }

          if (this.state.numPassenger > 200) {
            document.getElementById("numPassenger").classList.add("border-danger");
            document.getElementById("form-error").innerHTML += "The number of passengers cannot exceed 200<br/>";
          }

          if (this.state.numPassenger < 1) {
            document.getElementById("numPassenger").classList.add("border-danger");
            document.getElementById("form-error").innerHTML += "The number of passengers cannot be less than 1 <br/>";
          }

          if (document.getElementById("bookingUnit").value === "") {
            document.getElementById("bookingUnit").classList.add("border-danger");
            document.getElementById("form-error").innerHTML += "Booking Unit cannot be blank <br/>";
          }

        }

        // if (document.getElementById("routePassnger").value === "") {
        //   document.getElementById("routePassenger").classList.add("border-danger");
        //   document.getElementById("form-error").innerHTML += "Enter a route<br/>";
        // }
        // else if (this.state["route" + this.state.service + "List"].indexOf(document.getElementById("route" + this.state.service).value) < 0) {
        //   document.getElementById("route" + this.state.service).classList.add("border-danger");
        //   document.getElementById("form-error").innerHTML += "Please enter a valid route<br/>";
        // }
        // if (document.getElementById("purposeDD").value === "") {
        //   document.getElementById("purposeDD").classList.add("border-danger");
        //   document.getElementById("form-error").innerHTML += "Enter a purpose<br/>";
        // }
        // else if (this.state["purpose" + this.state.service + "List"].indexOf(document.getElementById("purpose" + this.state.service).value) < 0) {
        //   document.getElementById("purpose" + this.state.service).classList.add("border-danger");
        //   document.getElementById("form-error").innerHTML += "Please enter a valid purpose<br/>";
        // }


        if (document.getElementById("vehiclePlateNumbers") && document.getElementById("vehiclePlateNumbers").value.length < 5) {
          document.getElementById("vehiclePlateNumbers").classList.add("border-danger");
          document.getElementById("form-error").innerHTML += "Please enter a valid vehicle plate number<br/>"
        }

        if (this.state.departureDate != null) {
          let inputDate = new Date(this.state.departureDate).setHours(0, 0, 0, 0);
          if (inputDate < twoDayslater) {
            document.getElementById("departureDate").classList.add("border-danger");
            document.getElementById("form-error").innerHTML += "Please enter a date two days after today<br/>";
          }
        }
        if (document.getElementById("form-error").innerHTML === "") {
          document.getElementById("FormModal").querySelector("#btnSubmit").disabled = true;
          let totalVehicleLoad = "";
          let VehicleNumPlates = "";
          if (this.state.service === "RPL") {
            totalVehicleLoad = parseFloat(document.getElementById("totalVehicleLoad").innerText);
            VehicleNumPlates = document.getElementById("vehiclePlateNumbers").value;
          }

          if (this.state.switchForm === 1) {

            if (this.state.service === "P") {
              for (var x = 0; x < this.state.routePData.length; x++) {
                if (document.getElementById("routePassenger").value === this.state.routePData[x].routeName) {
                  this.state.routeId = this.state.routePData[x].routeId;
                }
              }

              for (var n = 0; n < this.state.purposePData.length; n++) {
                if (document.getElementById("purposeDD").value === this.state.purposePData[n].purposeDesc) {
                  this.state.purposeId = this.state.purposePData[n].purposeId;
                }
              }
            }

            else if (this.state.service === "RPL") {
              for (var x1 = 0; x1 < this.state.routeRPLData.length; x1++) {
                if (document.getElementById("routePassenger").value === this.state.routeRPLData[x1].routeName) {
                  this.state.routeId = this.state.routeRPLData[x1].routeId;
                }
              }

              for (var e = 0; e < this.state.purposeRPLData.length; e++) {
                if (document.getElementById("purposeDD").value === this.state.purposeRPLData[e].purposeDesc) {
                  this.state.purposeId = this.state.purposeRPLData[e].purposeId;
                }
              }
            }

            document.getElementById("LoadingDiv").style.display = "block";


            let data = new BookingModel(this.props.auth.user["custom:role"], "", this.state.departureDate, this.state.departureTime.replace(":", ""),
              this.state.bookingUnit, "ADMIN - " + this.state.bookingUnit, "", this.state.purposeId,
              this.state.routeId, "", this.state.service, "", "", entities.encode(VehicleNumPlates), totalVehicleLoad, this.state.vehicles, this.state.numPassenger, "",
              this.props.auth.user.preferred_username, "", this.props.auth.user["custom:performanceRating"], "", "", "", "");
            let url = config.api.invokeUrl + "/booking/confirmbooking";
            await $.ajax({
              type: 'PUT',
              url: url,
              data: data.convertObjToJSON(),
              contentType: "application/json",
              headers: {
                Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
              },
              success: (response) => {
                if (response["statusCode"] === 200) {
                  this.clearFormInputs();
                  document.getElementById("form-success").innerText = "Successfully created booking on " + moment(this.state.departureDate).format(config.format.date) + ", " + moment(this.state.departureTime.replace(":", "")).format(config.format.time) + "";
                  document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
                  window.location.reload();
                }
              },
              error: (xhr, status, err) => {
                if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                  this.props.history.push("/logout");
              }
            });
          }

          else if (this.state.switchForm === 2) {

            let daysArray = [];
            let checkedDays = [];
            let emptyCheck = 0;
            let dataCheckedDays = "";
            daysArray.push(document.getElementById("mon"));
            daysArray.push(document.getElementById("tues"));
            daysArray.push(document.getElementById("wed"));
            daysArray.push(document.getElementById("thurs"));
            daysArray.push(document.getElementById("fri"));
            daysArray.push(document.getElementById("sat"));
            daysArray.push(document.getElementById("sun"));


            for (let q = 0; q < daysArray.length; q++) {

              if (daysArray[q].checked === false) {

                emptyCheck = emptyCheck + 1;

              }

              if (daysArray[q].checked === true) {

                checkedDays.push((q + 1));
              }

            }

            if (emptyCheck === 7) {

              document.getElementById("form-error").innerHTML += "Please select the days that the bookings are to be repeated<br/>";
              document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
            }

            else if (document.getElementById("startRepeatDate").value == null || document.getElementById("startRepeatDate").value === "") {

              document.getElementById("form-error").innerHTML += "Please select the start date<br/>";
              document.getElementById("startRepeatDate").classList.add("border-danger");
              document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;

            }

            else if (document.getElementById("endRepeatDate").value == null || document.getElementById("endRepeatDate").value === "") {

              document.getElementById("form-error").innerHTML += "Please select the end date<br/>";
              document.getElementById("endRepeatDate").classList.add("border-danger");
              document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
            }

            else if (document.getElementById("repeatDepartureTime").value == null || document.getElementById("repeatDepartureTime").value === "") {

              document.getElementById("form-error").innerHTML += "Please select the departure time<br/>";
              document.getElementById("repeatDepartureTime").classList.add("border-danger");
              document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
            }


            else {

              let dataDepartureDate = document.getElementById("startRepeatDate").value;
              let dataDepartureTime = document.getElementById("repeatDepartureTime").value.replace(":", "");
              let dataEndRepeatDate = document.getElementById("endRepeatDate").value;
              var startMonth = document.getElementById("startRepeatDate").value.charAt(5) + document.getElementById("startRepeatDate").value.charAt(6);
              var endMonth = document.getElementById("endRepeatDate").value.charAt(5) + document.getElementById("endRepeatDate").value.charAt(6);
              var monthDiff = parseInt(endMonth) - parseInt(startMonth);

              if (monthDiff > 3) {

                document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
                document.getElementById("form-error").innerHTML += "End Date cannot be more than 3 months after Start Date<br/>";

              }

              else {

                document.getElementById("LoadingDiv").style.display = "block";

                for (let m = 0; m < checkedDays.length; m++) {

                  dataCheckedDays = dataCheckedDays + ";" + checkedDays[m];
                }
                let finaldataCheckedDays = dataCheckedDays.substr(1);

                if (this.state.service === "P") {
                  for (var x2 = 0; x2 < this.state.routePData.length; x2++) {
                    if (document.getElementById("routePassenger").value === this.state.routePData[x2].routeName) {
                      this.state.routeId = this.state.routePData[x2].routeId;
                    }
                  }

                  for (var n1 = 0; n1 < this.state.purposePData.length; n1++) {
                    if (document.getElementById("purposeDD").value === this.state.purposePData[n1].purposeDesc) {
                      this.state.purposeId = this.state.purposePData[n1].purposeId;
                    }
                  }
                }

                else if (this.state.service === "RPL") {
                  for (var x3 = 0; x3 < this.state.routeRPLData.length; x3++) {
                    if (document.getElementById("routePassenger").value === this.state.routeRPLData[x3].routeName) {
                      this.state.routeId = this.state.routeRPLData[x3].routeId;
                    }
                  }

                  for (var e1 = 0; e1 < this.state.purposeRPLData.length; e1++) {
                    if (document.getElementById("purposeDD").value === this.state.purposeRPLData[e1].purposeDesc) {
                      this.state.purposeId = this.state.purposeRPLData[e1].purposeId;
                    }
                  }
                }

                let data = new BookingModel(this.props.auth.user["custom:role"], "", dataDepartureDate, dataDepartureTime.replace(":", ""),
                  this.state.bookingUnit, "ADMIN - " + this.state.bookingUnit, "", this.state.purposeId,
                  this.state.routeId, "", this.state.service, "", "", entities.encode(VehicleNumPlates), totalVehicleLoad, this.state.vehicles, this.state.numPassenger, "",
                  this.props.auth.user.preferred_username, "", this.props.auth.user["custom:performanceRating"], finaldataCheckedDays, dataEndRepeatDate, "", "");

                let url = config.api.invokeUrl + "/booking/confirmrecurringbooking";
                await $.ajax({
                  type: 'PUT',
                  url: url,
                  data: data.convertObjToJSON(),
                  contentType: "application/json",
                  headers: {
                    Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
                  },
                  success: (response) => {
                    console.log(response);
                    if (response["statusCode"] === 200) {
                      this.clearFormInputs();
                      document.getElementById("form-success").innerText = "Successfully created booking on " + moment(this.state.departureDate).format(config.format.date) + ", " + moment(this.state.departureTime.replace(":", "")).format(config.format.time) + "";
                      document.getElementById("FormModal").querySelector("#btnSubmit").disabled = false;
                      window.location.reload();
                    }
                  },
                  error: (xhr, status, err) => {
                    if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
                      this.props.history.push("/logout");
                  }
                });
              }
            }

          }
        }
      }
    }
  }



  approveBooking = async (event) => {

    this.state.bookingCode = event.target.dataset.bookingcode;
    document.getElementById("clearBtn").style.display = "none";

    if (event != null)
      event.preventDefault();

    var selectedBookingGroup1 = "";
    var depDate1 = "";
    var depTime1 = "";
    var bookingUnit1 = "";
    for (var check6 = 0; check6 < this.state.data.length; check6++) {
      if (this.state.data[check6].bookingCode !== null) {
        if (this.state.bookingCode === this.state.data[check6].bookingCode) {
          selectedBookingGroup1 = this.state.data[check6].bookingGroup;
          depTime1 = this.state.data[check6].departureTime;
          depDate1 = this.state.data[check6].departureDate;
          bookingUnit1 = this.state.data[check6].bookingUnit;
        }
      }
    }


    if (selectedBookingGroup1 !== "" && selectedBookingGroup1 !== null) {

      await this.setState({ bookingGroup: selectedBookingGroup1, formState: "Approve", bookingUnit: bookingUnit1, departureDate: depDate1, departureTime: depTime1 })
      document.getElementById("FormModal").style.display = "block";

    }

    else {

      // let data = { "body": `{"bookingCode": "${event.target.dataset.bookingcode}", "departureDate": "${depDate1}", "departureTime": "${depTime1}", "bookingUnit": "${bookingUnit1}", "status": "Approved", "remarks":"", "updatedBy":"${this.props.auth.user.preferred_username}" }` };
      let data = new BookingModel("", this.state.bookingCode, depDate1, depTime1.replace(":", ""),
        this.state.bookingUnit, "", "", "",
        "", "", "", "", "Approved", "", "", "", "", "",
        "", this.props.auth.user.preferred_username, "", "", "", "", "");

      let url = config.api.invokeUrl + "/booking/update";
      await $.ajax({
        type: 'PATCH',
        url: url,
        data: data.convertObjToJSON(),
        contentType: "application/json",
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("userKeys"))["IdToken"],
        },
        success: (response) => {
          console.log(response);
          if (response["statusCode"] === 200)
            window.location.reload();
        },
        error: (xhr, status, err) => {
          if (err === "Unauthorized" || xhr["status"] === 401 || xhr["status"] === 403)
            this.props.history.push("/logout");
        }
      });
    }
  }

  setBookings = () => {
    let obj = [];
    let dates = [];
    let service = "";
    let vehicles = [];
    let departureDate = new Date();
    let departureTime = "";
    let currentHour = new Date().getHours();
    let currentMin = new Date().getMinutes();
    let currentTime = parseInt(currentHour)*100 + parseInt(currentMin);
    //console.log(">>>>>>>>");
    //console.log(this.state.data);
    if (this.state.data !== "[]") {
      for (let i = 0; i < this.state.data.length; i++) {
        departureDate = new Date(this.state.data[i]["departureDate"]);
        departureTime = this.state.data[i]["departureTime"];
        departureDate.setHours(0, 0, 0, 0);
        vehicles = [];
        service = this.state.data[i]["serviceProviderType"];
        if (service === "RPL") {
          if (this.state.data[i]["Vehicle"] === undefined || this.state.data[i]["Vehicle"] === null)
            vehicles.push(<p key="noVeh"><b>Vehicle: </b>No Vehicles On Board</p>);
          else {
            let vehiclesBody = [];
            for (let j = 0; j < this.state.data[i]["Vehicle"].length; j++) {
              vehiclesBody.push(
                <p key={this.state.data[i]["Vehicle"][j]["vehicleId"] + this.state.data[i]["Vehicle"][j]["name"]} className="mb-1 ml-5">
                  - {this.state.data[i]["Vehicle"][j]["quantity"]} x {this.state.data[i]["Vehicle"][j]["name"]}
                </p>
              )
            }
            vehicles.push(
              <div key="vehicle" className="mb-3">
                <b>Vehicle(s): </b>
                {vehiclesBody}
              </div>
            )
          }
        }

        if (!(this.state.data[i]["SAFFeedback"] === undefined || this.state.data[i]["SAFFeedback"] === null)) {
        }
        if (!dates.includes(this.state.data[i]["departureDate"])) {
          dates.push(this.state.data[i]["departureDate"]);
          obj.push(<h3 className="m-3" key={this.state.data[i]["departureDate"]}>{moment(this.state.data[i]["departureDate"]).format(config.format.date)}</h3>)
        }
        obj.push(
          <div key={this.state.data[i]["bookingCode"]} className="card mb-2 mx-auto border-dark" style={{ width: "97%", boxShadow: "0 .25rem 0.5rem black" }}>
            <div className="card-header" style={(service === "RPL") ? { backgroundColor: "#1D2681" } : { backgroundColor: "#2082dd" }}>
              <h5 className="text-white d-inline-block" style={{ width: "85%" }}>{this.state.data[i]["bookingCode"]} - {moment(this.state.data[i]["departureDate"]).format(config.format.date)}, {moment(this.state.data[i]["departureTime"], "HHmm").format(config.format.time)}</h5>
              <div className="booking-pic-div">
                {(service === "RPL")
                  ? <img src="bttn_rpl.png" alt="" width="40" height="40" />
                  : <img src="bttn_passenger.png" alt="" width="40" height="40" />
                }
              </div>
            </div>
            <div className="card-body pb-0 overflow">
              <div className="row booking-data-row">
                <div className="col-sm-6 col-md-6 col-lg-3">
                  <p className="font-weight-bold mb-1 booking-header">Booked By</p>
                  <p className="text-data">{this.state.data[i]["displayUserName"]}</p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-3">
                  <p className="font-weight-bold mb-1 booking-header">Booking Type</p>
                  <p className="text-data">{this.state.data[i]["bookingType"]}</p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-2">
                  <p className="font-weight-bold mb-1 booking-header">Route</p>
                  <p className="text-data">{this.state.data[i]["routeName"]}</p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-2">
                  <p className="font-weight-bold mb-1 booking-header">Status</p>
                  <p className="text-data">{this.state.data[i]["status"]}</p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-2">
                  <p className="font-weight-bold mb-1 booking-header">Purpose</p>
                  <p className="text-data">{this.state.data[i]["purposeShort"]}</p>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="accordion" id="storyAccordion">
                    <div className="d-flex align-items-center p-2" id={"heading" + this.state.data[i]["bookingCode"]}>
                      <button className="btn btn-link text-center w-50" style={{ backgroundColor: "rgba(204, 255, 248, 0.5)" }} type="button">
                        More Details <i className="fas fa-chevron-down"></i>
                      </button>
                      {((departureDate >= today) && (departureTime > currentTime)) && (
                        <div className="w-50 text-right d-inline-block">
                          {((this.state.data[i]["status"] === "Approved")) && (
                            <button title='Edit' className="btn btn-primary btn-circle ml-3" onClick={this.editBooking} data-bookingcode={this.state.data[i]["bookingCode"]} data-departuredate={this.state.data[i]["departureDate"]} data-departuretime={this.state.data[i]["departureTime"]} >
                              <span><i className="fas fa-pen"></i></span>
                            </button>
                          )}
                          {(this.state.data[i]["status"] === "Approved") && (
                            <button title='Cancel' className="btn btn-danger btn-circle ml-3" data-bookingunit={this.state.data[i]["bookingUnit"]} data-bookingcode={this.state.data[i]["bookingCode"]} data-bookinggroup={this.state.data[i]["bookingGroup"]} onClick={this.cancelBooking}>
                              <span><i className="fas fa-times" data-bookingunit={this.state.data[i]["bookingUnit"]} data-bookinggroup={this.state.data[i]["bookingGroup"]} data-departuredate={this.state.data[i]["departureDate"]} data-bookingcode={this.state.data[i]["bookingCode"]} ></i></span>
                            </button>
                          )}
                          {(this.state.data[i]["status"] === "Pending") && (
                            <button title='Reject' className="btn btn-danger btn-circle ml-3" data-bookingunit={this.state.data[i]["bookingUnit"]} data-bookingcode={this.state.data[i]["bookingCode"]} data-bookinggroup={this.state.data[i]["bookingGroup"]} onClick={this.rejectBooking}>
                              <span><i className="fas fa-times" data-bookingunit={this.state.data[i]["bookingUnit"]} data-bookinggroup={this.state.data[i]["bookingGroup"]} data-departuredate={this.state.data[i]["departureDate"]} data-bookingcode={this.state.data[i]["bookingCode"]} ></i></span>
                            </button>
                          )}
                          {(this.state.data[i]["status"] === "Pending") && (
                            <button title='Approve' className="btn btn-success btn-circle ml-3" data-bookingcode={this.state.data[i]["bookingCode"]} onClick={this.approveBooking}>
                              <span><i className="fas fa-check" data-bookingcode={this.state.data[i]["bookingCode"]}></i></span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div id={"collapse" + this.state.data[i]["bookingCode"]} className="collapse">
                      <div className="card-body mt-3" style={{ backgroundColor: "rgba(204, 255, 248, 0.5)" }}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                          <li className="nav-item">
                            <a className="nav-link active" id={"details-tab" + this.state.data[i]["bookingCode"]} data-toggle="tab" href={"#details" + this.state.data[i]["bookingCode"]} role="tab" aria-controls={"details" + this.state.data[i]["bookingCode"]} aria-selected="true">Booking Details</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" id={"feedback-tab" + this.state.data[i]["bookingCode"]} data-toggle="tab" href={"#feedback" + this.state.data[i]["bookingCode"]} role="tab" aria-controls={"feedback" + this.state.data[i]["bookingCode"]} aria-selected="false">Feedback</a>
                          </li>

                          {!(this.state.data[i]["BookingIssue"] === undefined || this.state.data[i]["BookingIssue"] === null) && (
                            <li className="nav-item">
                              <a className="nav-link" id={"issue-tab" + this.state.data[i]["bookingCode"]} data-toggle="tab" href={"#issue" + this.state.data[i]["bookingCode"]} role="tab" aria-controls={"issue" + this.state.data[i]["bookingCode"]} aria-selected="false">Booking Issue</a>
                            </li>
                          )}
                          {!(this.state.data[i]["bookingGroup"] === undefined || this.state.data[i]["bookingGroup"] === null || this.state.data[i]["bookingGroup"] === "") && (
                            <li className="nav-item">
                              <a className="nav-link" id={"bookingGroup-tab" + this.state.data[i]["bookingCode"]} data-toggle="tab" href={"#bookingGroup" + this.state.data[i]["bookingCode"]} role="tab" aria-controls={"bookingGroup" + this.state.data[i]["bookingCode"]} aria-selected="false">Booking Group</a>
                            </li>
                          )}
                          {!(this.state.data[i]["cancellationReason"] === undefined || this.state.data[i]["cancellationReason"] === null || this.state.data[i]["cancellationReason"] === "") && (
                            <li className="nav-item">
                              <a className="nav-link" id={"cancel-tab" + this.state.data[i]["bookingCode"]} data-toggle="tab" href={"#cancel" + this.state.data[i]["bookingCode"]} role="tab" aria-controls={"cancel" + this.state.data[i]["bookingCode"]} aria-selected="false">Cancellation Reason</a>
                            </li>
                          )}

                          {!(this.state.data[i]["rejectedReason"] === undefined || this.state.data[i]["rejectedReason"] === null || this.state.data[i]["rejectedReason"] === "") && (
                            <li className="nav-item">
                              <a className="nav-link" id={"cancel-tab" + this.state.data[i]["bookingCode"]} data-toggle="tab" href={"#reject" + this.state.data[i]["bookingCode"]} role="tab" aria-controls={"cancel" + this.state.data[i]["bookingCode"]} aria-selected="false">Rejected Reason</a>
                            </li>
                          )}


                        </ul>
                        <div className="tab-content pb-3" id="myTabContent">
                          <div className="tab-pane fade show active" id={"details" + this.state.data[i]["bookingCode"]} role="tabpanel" aria-labelledby={"details-tab" + this.state.data[i]["bookingCode"]}>
                            <p><b>Booking Unit: </b>{this.state.data[i]["bookingUnit"]}</p>
                            <p><b>Advanced Notice: </b>{this.state.data[i]["advancedNotice"] === null ? "No Notice Available" : this.state.data[i]["advancedNotice"]}</p>
                            {(service === "RPL") && (
                              <p><b>Total Load: </b>{this.state.data[i]["totalLoad"] === null ? "0" : this.state.data[i]["totalLoad"]}</p>
                            )}
                            {(service === "RPL")
                              ? vehicles
                              : <p><b>Number of Passengers: </b>{this.state.data[i]["numPassenger"] === null ? "0" : this.state.data[i]["numPassenger"]}</p>
                            }

                            {(service === "RPL") && (
                              <p><b>Vehicle Car Plate Number(s): </b>{this.state.data[i]["remarks"] === null ? "none" : entities.decode(this.state.data[i]["remarks"])}</p>
                            )}

                            <p className="mb-0"><b>Updated By </b>{this.state.data[i]["updatedBy"]}<b> On </b>{moment(this.state.data[i]["updatedDate"]).format(config.format.datetime)}</p>

                          </div>
                          <div className="tab-pane fade" id={"feedback" + this.state.data[i]["bookingCode"]} role="tabpanel" aria-labelledby={"spFeedback-tab" + this.state.data[i]["bookingCode"]}>
                            {!(this.state.data[i]["SPFeedback"] === undefined || this.state.data[i]["SPFeedback"] === null)
                              ? <div className="mb-3">
                                <h5 className="mb-1">SP Feedback</h5>
                                <p className="mb-1 ml-5"><b>Feedback Type: </b>{this.state.data[i]["SPFeedback"]["feedbackType"] === null ? "NIL" : this.state.data[i]["SPFeedback"]["feedbackType"]}</p>
                                <p className="ml-5"><b>Comment: </b>{this.state.data[i]["SPFeedback"]["comments"] === null ? "No Comments Available" : this.state.data[i]["SPFeedback"]["comments"]}</p>
                              </div>
                              : <div className="mb-3">
                                <h5 className="mb-1">SP Feedback</h5>
                                <p className="ml-5">No Feedback Available</p>
                              </div>
                            }
                            {!(this.state.data[i]["SAFFeedback"] === undefined || this.state.data[i]["SAFFeedback"] === null)
                              ? <div>
                                <h5 className="mb-1">SAF Feedback</h5>
                                <p className="mb-1 ml-5"><b>Rating: </b>{this.state.data[i]["SAFFeedback"]["rating"] === null ? "NIL" : this.state.data[i]["SAFFeedback"]["rating"]}</p>
                                <p className="mb-0 ml-5"><b>Comment: </b>{this.state.data[i]["SAFFeedback"]["comments"] === null ? "No Comments Available" : this.state.data[i]["SAFFeedback"]["comments"]}</p>
                              </div>
                              : <div>
                                <h5 className="mb-1">SAF Feedback</h5>
                                <p className="mb-0 ml-5">No Feedback Available</p>
                              </div>
                            }
                          </div>
                          {!(this.state.data[i]["BookingIssue"] === undefined || this.state.data[i]["BookingIssue"] === null) && (
                            <div className="tab-pane fade" id={"issue" + this.state.data[i]["bookingCode"]} role="tabpanel" aria-labelledby={"issue-tab" + this.state.data[i]["bookingCode"]}>
                              <p><b>Report Issue: </b>{this.state.data[i]["BookingIssue"]["reportIssue"] === null ? "No Report Available" : this.state.data[i]["BookingIssue"]["reportIssue"]}</p>
                              <p><b>Status: </b>{this.state.data[i]["BookingIssue"]["status"] === null ? "No Status Available" : this.state.data[i]["BookingIssue"]["status"]}</p>
                              <p><b>Findings: </b>{this.state.data[i]["BookingIssue"]["findings"] === null ? "No Findings Available" : this.state.data[i]["BookingIssue"]["findings"]}</p>
                              <p><b>Updated By </b>{this.state.data[i]["BookingIssue"]["reportedBy"]}<b> On </b>{moment(this.state.data[i]["BookingIssue"]["reportedDate"]).format(config.format.datetime)}</p>
                            </div>
                          )}
                          {!(this.state.data[i]["bookingGroup"] === undefined || this.state.data[i]["bookingGroup"] === null) && (
                            <div className="tab-pane fade" id={"bookingGroup" + this.state.data[i]["bookingCode"]} role="tabpanel" aria-labelledby={"bookingGroup-tab" + this.state.data[i]["bookingCode"]}>
                              <b>Booking Group: </b>{this.state.data[i]["bookingGroup"]}
                            </div>
                          )}
                          {!(this.state.data[i]["cancellationReason"] === undefined || this.state.data[i]["cancellationReason"] === null) && (
                            <div className="tab-pane fade" id={"cancel" + this.state.data[i]["bookingCode"]} role="tabpanel" aria-labelledby={"cancel-tab" + this.state.data[i]["bookingCode"]}>
                              <b>Reason: </b>{entities.decode(this.state.data[i]["cancellationReason"])}
                            </div>
                          )}

                          {!(this.state.data[i]["rejectedReason"] === undefined || this.state.data[i]["rejectedReason"] === null) && (
                            <div className="tab-pane fade" id={"reject" + this.state.data[i]["bookingCode"]} role="tabpanel" aria-labelledby={"cancel-tab" + this.state.data[i]["bookingCode"]}>
                              <b>Reason: </b>{entities.decode(this.state.data[i]["rejectedReason"])}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
        );
      }
    }
    if (obj.length === 0) {
      obj.push(<div key="empty" className="text-center font-weight-bold">No bookings available</div>)
      
    }
    return obj;
  }

  setAccordions = () => {
    let accordions = document.querySelectorAll('.accordion div .btn-link');
    for (let i = 0; i < accordions.length; i++) {
      accordions[i].onclick = function () {
        if (this.parentElement.nextElementSibling.className === "collapse") {
          this.parentElement.nextElementSibling.className = "";
        }
        else {
          this.parentElement.nextElementSibling.className = "collapse"
        }
      };
    }
  }

  setFilters = () => {

    let obj = [], i;
    let filters = {
      "Service Provider Type": [],
      "Booking Type": [],
      "Routes": [],
      "Status": [],
      "Purpose": [],
    }
    for (i = 0; i < this.state.data.length; i++) {
      if (!filters["Service Provider Type"].includes(this.state.data[i]["serviceProviderType"]) && this.state.data[i]["serviceProviderType"] !== "")
        filters["Service Provider Type"].push(this.state.data[i]["serviceProviderType"]);
      if (!filters["Booking Type"].includes(this.state.data[i]["bookingType"]) && this.state.data[i]["bookingType"] !== "")
        filters["Booking Type"].push(this.state.data[i]["bookingType"]);
      if (!filters["Routes"].includes(this.state.data[i]["routeName"]) && this.state.data[i]["routeName"] !== "")
        filters["Routes"].push(this.state.data[i]["routeName"]);
      if (!filters["Status"].includes(this.state.data[i]["status"]) && this.state.data[i]["status"] !== "")
        filters["Status"].push(this.state.data[i]["status"]);
      if (!filters["Purpose"].includes(this.state.data[i]["purposeShort"]) && this.state.data[i]["purposeShort"] !== "")
        filters["Purpose"].push(this.state.data[i]["purposeShort"]);
    }

    if (filters["Service Provider Type"].includes("P"))
      filters["Service Provider Type"][filters["Service Provider Type"].indexOf("P")] = "Passenger";

    if (this.state.data.length === 0 || this.state.data === "[]") {
      obj.push(<div key="emptyFilter" className="text-center font-weight-bold">No filter available</div>)
      try {
        document.getElementById("booking-filter-button").style.display = "none";
        document.getElementById("booking-filter-button").innerText = "Show Advanced Filters"
        document.getElementById("bookingFilters").style.display = "none";
        document.getElementById("genButton").style.display = "none";
      }
      catch{
      }
    }
    else {
      try {
        document.getElementById("booking-filter-button").innerText = "Hide Advanced Filters"
        document.getElementById("booking-filter-button").style.display = "block";
        document.getElementById("bookingFilters").style.display = "block";
        document.getElementById("genButton").style.display = "block";
      }
      catch{
      }
      obj.push(
        <div key="filterUsername" className="row mr-0 ml-0 mb-2">
          <h6 className="col-12">Booking Code</h6>
          <div className="col-12 mb-2">
            <input className="form-control" type="text" onChange={this.filter} placeholder="Booking Code" id="searchBookingCode" />
          </div>
          <h6 className="col-12">Booked by:</h6>
          <div className="col-12">
            <input className="form-control" type="text" onChange={this.filter} placeholder="Username" id="searchUsername" />
          </div>
        </div>
      )
      for (let key of Object.keys(filters)) {
        let btnClass = "col-6";
        if (filters[key].length === 1)
          btnClass = "col-12"
        let objChild = [];
        for (let j = 0; j < filters[key].length; j++) {
          if (j === 0)
            objChild.push(<h6 className="col-12" key={"header" + key}>{key}:</h6>)
          objChild.push(
            <div key={filters[key][j]} className={btnClass}>
              <button className="btn btn-block btn-outline-primary mb-1" data-position={key} onClick={this.changeFilterBtn}>{filters[key][j]}</button>
            </div>
          )
        }
        obj.push(<div key={"filter" + key} className="row mr-0 ml-0 mb-2">{objChild}</div>)
      }
    }
    return obj;
  }

  changeFilterBtn = (event) => {
    if (event.target.classList.value.includes("btn-outline-primary")) {
      event.target.classList.remove("btn-outline-primary");
      event.target.classList.add("btn-primary");
    }
    else {
      event.target.classList.remove("btn-primary");
      event.target.classList.add("btn-outline-primary");
    }
    this.filter();
  }

  filter = () => {
    let cards, cardContainer, i, j, button, text, showCard, dateHeaders;
    let filter = {
      "Service Provider Type": [],
      "Booking Type": [],
      "Routes": [],
      "Status": [],
      "Purpose": [],
      "Username": "",
      "BookingCode": ""
    }
    button = document.getElementById("bookingFilters").getElementsByClassName("btn");
    for (j = 0; j < button.length; j++) {
      if (button[j].classList.value.includes("btn-primary")) {
        let filterName = button[j].getAttribute("data-position");
        filter[filterName].push(button[j].innerHTML);
      }
    }
    filter["Username"] = document.getElementById("searchUsername").value.toUpperCase();
    filter["BookingCode"] = document.getElementById("searchBookingCode").value.toUpperCase();
    cardContainer = document.querySelector(".bookings-div");
    cards = cardContainer.getElementsByClassName("card");
    for (i = 0; i < cards.length; i++) {
      showCard = [false, false, false, false, false, false, false];
      text = cards[i].querySelectorAll(".card-body .row .text-data");
      if (text[0].innerText.toUpperCase().indexOf(filter["Username"]) > -1)
        showCard[0] = true;
      else
        showCard[0] = false;
      if (filter["Booking Type"].includes(text[1].innerText) || filter["Booking Type"].length === 0)
        showCard[1] = true;
      else
        showCard[1] = false;
      if (filter["Routes"].includes(text[2].innerText) || filter["Routes"].length === 0)
        showCard[2] = true;
      else
        showCard[2] = false;
      if (filter["Status"].includes(text[3].innerText) || filter["Status"].length === 0)
        showCard[3] = true;
      else
        showCard[3] = false;
      if (filter["Purpose"].includes(text[4].innerText) || filter["Purpose"].length === 0)
        showCard[4] = true;
      else
        showCard[4] = false;
      if (filter["Service Provider Type"].length === 0 || filter["Service Provider Type"].length === 2)
        showCard[5] = true;
      else {
        if (cards[i].querySelector("img").src.includes(filter["Service Provider Type"][0].toLowerCase()))
          showCard[5] = true;
        else
          showCard[5] = false;
      }
      if (cards[i].querySelector("h5").innerText.substring(0, 6).toUpperCase().indexOf(filter["BookingCode"]) > -1)
        showCard[6] = true;
      else
        showCard[6] = false;
      if (!showCard.includes(false))
        cards[i].style.display = "";
      else
        cards[i].style.display = "none";
    }
    dateHeaders = document.querySelector(".bookings-div").querySelectorAll("h3");
    for (i = 0; i < dateHeaders.length; i++) {
      let cardDivSibling = dateHeaders[i].nextElementSibling;
      while (cardDivSibling.style.display === "none") {
        cardDivSibling = cardDivSibling.nextElementSibling;
        if (cardDivSibling === null)
          break;
      }
      if (cardDivSibling === null || cardDivSibling === undefined)
        dateHeaders[i].style.display = "none";
      else {
        if (cardDivSibling.innerText.includes(dateHeaders[i].innerText))
          dateHeaders[i].style.display = "";
        else
          dateHeaders[i].style.display = "none";
      }
    }
    var s = 0;
    for (var h = 0; h < cards.length; h++) {
      if (cards[h].style.display !== "none") {
        document.getElementById("noBookings").style.display = "none";
        s = 1;
      }
    }
    if (s === 0) {
      document.getElementById("noBookings").style.display = "block";
    }

    this.setState({ isLoading: false })
  }

  toggleFilter = (event) => {
    if (document.getElementById("bookingFilters").style.display === "none") {
      document.getElementById("booking-filter-button").innerText = "Hide Advanced Filters"
      document.getElementById("booking-filter-button").classList.remove("btn-outline-primary");
      document.getElementById("booking-filter-button").classList.add("btn-primary");
      document.getElementById("bookingFilters").style.display = "block";
    }
    else {
      document.getElementById("booking-filter-button").innerText = "Show Advanced Filters"
      document.getElementById("booking-filter-button").classList.remove("btn-primary");
      document.getElementById("booking-filter-button").classList.add("btn-outline-primary");
      document.getElementById("bookingFilters").style.display = "none";
    }
  }

  onRadioClick = async event => {

    var eventValue = "";
    if (event.target.id === "RadioRPL") {
      eventValue = "RPL";
    }
    else if (event.target.id === "RadioPassenger") {
      eventValue = "P";
    }
    let service = eventValue;

    if (service !== this.state.service) {
      await this.setState({
        service: service
      });
      // await this.clearFormInputs();
      // Autocomplete(document.getElementById("purpose" + service), this.state["purpose" + service + "List"]);
      //Autocomplete(document.getElementById("route" + service), this.state["route" + service + "List"]);
      // document.getElementById("purpose" + service).value = "";
      // document.getElementById("route" + service).value = "";
      if (service === "RPL") {
        if (this.state.switchForm === 2) {
          this.state.departureDate = null;
          this.state.departureTime = null;
        }
        // Autocomplete(document.getElementById("vehicleRPL"), this.state.vehicleRPLList);
        var vehicleDropdown = document.getElementById("vehicleRPL");
        var vehicleLength = vehicleDropdown.options.length;
        for (var r = vehicleLength - 1; r >= 0; r--) {
          vehicleDropdown.options[r] = null;
        }

        for (var p = 0; p < this.state.vehicleRPLList.length; p++) {
          var option1 = document.createElement('option');
          option1.appendChild(document.createTextNode(this.state.vehicleRPLList[p]));
          option1.value = this.state.vehicleRPLList[p];
          vehicleDropdown.appendChild(option1);
        }
      }
    }

    if (document.getElementById("routePassenger")) {
      var select = document.getElementById("routePassenger");
      var length = select.options.length;
      for (var i = length - 1; i >= 0; i--) {
        select.options[i] = null;
      }
      if (this.state.service === "P") {
        var sel = document.getElementById("routePassenger");
        for (var x = 0; x < this.state.routePList.length; x++) {
          var opt = document.createElement('option');
          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(this.state.routePList[x]));
          // set value property of opt
          opt.value = this.state.routePList[x];
          // add opt to end of select box (sel)
          sel.appendChild(opt);
        }
      }

      else if (this.state.service === "RPL") {
        var sel1 = document.getElementById("routePassenger");
        for (var x12 = 0; x12 < this.state.routeRPLList.length; x12++) {
          var opt1 = document.createElement('option');
          // create text node to add to option element (opt)
          opt1.appendChild(document.createTextNode(this.state.routeRPLList[x12]));
          // set value property of opt
          opt1.value = this.state.routeRPLList[x12];
          // add opt to end of select box (sel)
          sel1.appendChild(opt1);
        }
      }

    }

    if (document.getElementById("purposeDD")) {
      var dropdown = document.getElementById("purposeDD");
      var ddlength = dropdown.options.length;
      for (var c = ddlength - 1; c >= 0; c--) {
        dropdown.options[c] = null;
      }
      if (this.state.service === "P") {

        for (var k = 0; k < this.state.purposePList.length; k++) {
          var option = document.createElement('option');
          // create text node to add to option element (opt)
          option.appendChild(document.createTextNode(this.state.purposePList[k]));
          // set value property of opt
          option.value = this.state.purposePList[x];
          // add opt to end of select box (sel)
          dropdown.appendChild(option);
        }
      }

      else if (this.state.service === "RPL") {
        var dropdown1 = document.getElementById("purposeDD");
        for (var c1 = 0; c1 < this.state.purposeRPLList.length; c1++) {
          var options1 = document.createElement('option');
          // create text node to add to option element (opt)
          options1.appendChild(document.createTextNode(this.state.purposeRPLList[c1]));
          // set value property of opt
          options1.value = this.state.purposeRPLList[c1];
          // add opt to end of select box (sel)
          dropdown1.appendChild(options1);
        }
      }
    }
  }

  onRadioClickBooking = async event => {
    await this.setState({
      rbookingGroup: event.target.value
    });
  }

  changeRepeat1 = async event => {

    event.preventDefault();
    this.state.switchForm = 2;
    var RecurringButton = document.getElementById("Recurring");
    var OneTimeButton = document.getElementById("OneTime");
    OneTimeButton.style.background = "rgba(184, 234, 241, 0.5)";
    RecurringButton.style.background = "grey";
    this.state.departureDate = null;
    this.state.departureTime = null;
    document.getElementById("OneTimeDepartureTime").style.display = "none";
    document.getElementById("departureTime").disabled = true;
    document.getElementById("OneTimeDepartureDate").style.display = "none";
    document.getElementById("departureDate").disabled = true;
    document.getElementById("startRepeatDate").disabled = false;
    document.getElementById("endRepeatDate").disabled = false;
    document.getElementById("repeatDepartureTime").disabled = false;
    document.getElementById("RecurringStartDate").style.display = "block";
    document.getElementById("RecurringEndDate").style.display = "block";
    document.getElementById("RecurringDepartureTime").style.display = "block";
    document.getElementById("RecurringRepeatCheckbox").style.display = "block";

  }

  changeRepeat = async event => {

    event.preventDefault();
    this.state.switchForm = 1;
    var RecurringButton = document.getElementById("Recurring");
    var OneTimeButton = document.getElementById("OneTime");
    OneTimeButton.style.background = "grey";
    RecurringButton.style.background = "rgba(184, 234, 241, 0.5)";
    document.getElementById("departureTime").disabled = false;
    document.getElementById("departureDate").disabled = false;
    document.getElementById("OneTimeDepartureTime").style.display = "block";
    document.getElementById("OneTimeDepartureDate").style.display = "block";
    document.getElementById("RecurringStartDate").style.display = "none";
    document.getElementById("startRepeatDate").disabled = true;
    document.getElementById("RecurringEndDate").style.display = "none";
    document.getElementById("endRepeatDate").disabled = true;
    document.getElementById("RecurringDepartureTime").style.display = "none";
    document.getElementById("repeatDepartureTime").disabled = true;
    document.getElementById("RecurringRepeatCheckbox").style.display = "none";
  }

  checkValidSelect = event => {
    let eventId = event.target.id;
    let eventName = eventId.replace(this.state.service, "")
    let eventTimeout = eventName + "Timeout";
    let eventList = eventId + "List";

    document.getElementById(event.target.id).classList.remove("border-danger");
    if (this.state[eventTimeout]) {
      clearTimeout(this.state[eventTimeout]);
    }

    this.setState({
      [eventTimeout]: setTimeout(() => {
        if (document.getElementById(eventId) !== null) {
          if (!this.state[eventList].includes(document.getElementById(eventId).value)) {
            document.getElementById(eventId).classList.add("border-danger");
            if (eventId === "vehicleRPL")
              document.getElementById("vehicleLoad").value = "";
            // document.getElementById(eventDetails).innerHTML = "<span>No " + eventName[0].toUpperCase() + eventName.substr(1) + " Selected</span>"
          }
          else
            this.setInputDetails(eventName);
        }
        else {
          if (this.state[eventTimeout])
            clearTimeout(this.state[eventTimeout]);
        }
      }, 3000)
    });
  }

  setInputDetails = (para) => {
    let name = para;
    let value;
    let index;
    if (typeof para !== "string") {
      value = para.target.value;
      if (para.target.id === "bookingUnitHidden")
        name = para.target.id.replace("Hidden", "");
      else
        name = para.target.id.replace(this.state.service + "Hidden", "");
    }
    else {

      if (para === "bookingUnit")
        value = document.getElementById("bookingUnit").value;
      else
        value = document.getElementById(name + this.state.service).value;
    }
    // let innerHTML = "No " + name[0].toUpperCase() + name.substr(1) + " Selected";
    if (name === "bookingUnit") {
      index = this.state.bookingUnitList.indexOf(value);
    }
    else {
      index = this.state[name + this.state.service + "List"].indexOf(value);
    }
    if (index > -1) {
      if (name === "vehicle") {
        // innerHTML = "<p class='mb-0'>Load: " + this.state.vehicleRPLData[index]["load"] + " per vehicle</p>"
        document.getElementById("vehicleLoad").value = this.state.vehicleRPLData[index]["load"];
      }
      else if (name === "purpose") {
        this.setState({ purposeId: this.state[name + this.state.service + "Data"][index]["purposeId"] })
        // innerHTML = "<p class='mb-0'>Description: " + this.state[name + this.state.service + "Data"][index]["purposeDesc"] + "</p>"
      }
      else if (name === "route") {
        this.setState({ routeId: this.state[name + this.state.service + "Data"][index]["routeId"] })
        // innerHTML = "<p class='mb-0'>Route: " + this.state[name + this.state.service + "Data"][index]["from"] + " to " + this.state[name + this.state.service + "Data"][index]["destination"] + "</p>"
      }
      else if (name === "bookingUnit") {
        this.setState({ bookingUnit: this.state.bookingUnitList[index] })
        //this.setState({ bookingUnit: this.state[name + this.state.service + "Data"][index]["bookingUnit"] })
      }
    }

    //document.getElementById(name + "Details").innerHTML = innerHTML;
  }

  // toggleVehicle = () =>{
  //   if(document.getElementById("bookingVehForm").style.display === "none"){
  //     document.getElementById("bookingVehForm").style.display = "block";
  //     document.getElementById("vehToggleBtn").innerHTML = '<i class="far fa-window-close"></i> Close Vehicles</button>'
  //   }
  //   else{
  //     document.getElementById("bookingVehForm").style.display = "none";
  //     document.getElementById("vehToggleBtn").innerHTML = '<i class="far fa-plus-square"></i> Add Vehicles</button>'
  //   }
  // }

  addVehicle = async () => {
    document.getElementById("vehicle-form-error").innerText = "";
    document.getElementById("vehicleList").classList.remove("border-danger");
    document.getElementById("vehicleRPL").classList.remove("border-danger");
    document.getElementById("vehicleQuantity").classList.remove("border-danger");
    document.getElementById("totalVehicleLoad").classList.remove("text-danger");
    let vehicleName = document.getElementById("vehicleRPL").value;
    let vehicleQuantity = parseInt(document.getElementById("vehicleQuantity").value);
    let vehicleIndex = this.state["vehicleRPLList"].indexOf(vehicleName);
    let totalVehicleLoad = parseFloat(document.getElementById("totalVehicleLoad").innerText);
    let totalAddingLoad = 0;
    let noErrors = true;
    if (vehicleName === "") {
      document.getElementById("vehicleRPL").classList.add("border-danger");
      document.getElementById("vehicle-form-error").innerText = "Enter a vehicle's name";
      noErrors = false;
    }
    else if (isNaN(vehicleQuantity)) {
      document.getElementById("vehicleQuantity").classList.add("border-danger");
      document.getElementById("vehicle-form-error").innerText = "Enter quantity";
      noErrors = false;
    }
    else if (Number.isInteger(vehicleQuantity) === false) {
      document.getElementById("vehicleQuantity").classList.add("border-danger");
      document.getElementById("vehicle-form-error").innerText = "Enter integers only";
    }
    if (vehicleQuantity === 0)
      noErrors = false;
    let newVehicles = "";

    if (noErrors) {
      if (vehicleIndex > -1) {
        let vehicleId = this.state.vehicleRPLData[vehicleIndex]["vehicleId"];
        totalAddingLoad = this.state.vehicleRPLData[vehicleIndex]["load"] * vehicleQuantity;
        if (totalAddingLoad <= 15) {
          if (this.state.vehicles === "")
            newVehicles = vehicleId + "x" + vehicleQuantity;
          else {
            if (totalAddingLoad + totalVehicleLoad > 15) {
              document.getElementById("vehicleQuantity").classList.add("border-danger");
              document.getElementById("vehicle-form-error").innerText = "Total Vehicle Load cannot exceed 15";
              document.getElementById("totalVehicleLoad").classList.add("text-danger");
            }
            let vehicles = this.state.vehicles.split(";");
            let oldQuantity = "";
            let vehicleNotFound = true;
            for (let i = 0; i < vehicles.length; i++) {
              oldQuantity = parseInt(vehicles[i].split("x")[1]);
              if (parseInt(vehicles[i].split("x")[0]) === vehicleId) {
                vehicleNotFound = false;
                if (vehicleQuantity + oldQuantity > 0) {
                  let newQuantity = 0;
                  if (totalAddingLoad + totalVehicleLoad > 15) {
                    newQuantity = oldQuantity;
                  }
                  else
                    newQuantity = vehicleQuantity + oldQuantity;
                  if (newVehicles === "")
                    newVehicles = vehicleId + "x" + newQuantity;
                  else
                    newVehicles += ";" + vehicleId + "x" + newQuantity;
                }
              }
              else {
                if (newVehicles === "")
                  newVehicles = vehicles[i];
                else
                  newVehicles += ";" + vehicles[i];
              }
            }
            if (vehicleNotFound) {
              if (totalAddingLoad + totalVehicleLoad <= 15)
                newVehicles = this.state.vehicles + ";" + vehicleId + "x" + vehicleQuantity;
            }
          }
          if (this.state["vehicleTimeout"]) {
            clearTimeout(this.state["vehicleTimeout"]);
          }
          if (document.getElementById("vehicle-form-error").innerText === "") {
            await this.setState({ vehicles: newVehicles });
            document.getElementById("vehicleRPL").value = "";
            document.getElementById("vehicleQuantity").value = "";
            document.getElementById("vehicleLoad").value = "";
          }
          // document.getElementById("vehicleDetails").innerHTML = "<span>No Vehicle Selected</span>";
        }
        else {
          document.getElementById("vehicleQuantity").classList.add("border-danger");
          document.getElementById("vehicle-form-error").innerText = "Added Vehicle Load cannot exceed 15";
        }
      }
      this.setFormVehicles();
    }
  }

  closeDisplay = (event) => {
    if (event.target.id === "DisplaySchedule" || event.target.id === "cls-details") {
      document.getElementById("DisplaySchedule").style.display = "none";
    }
  }

  setFormVehicles = () => {
    let vehicleQuantity = "";
    let vehicleId = "";
    let vehicleName = "";
    let vehicleLoad = "";
    let totalVehicleLoad = 0;
    let vehicles = this.state.vehicles.split(";");
    document.getElementById('vehicleList').innerHTML = "";
    if (vehicles[0] !== "") {
      for (let i = 0; i < vehicles.length; i++) {
        vehicleName = "";
        vehicleLoad = "";
        vehicleId = parseInt(vehicles[i].split("x")[0]);
        vehicleQuantity = parseInt(vehicles[i].split("x")[1]);
        for (let j = 0; this.state.vehicleRPLData; j++) {
          if (this.state.vehicleRPLData[j]["vehicleId"] === vehicleId) {
            vehicleName = this.state.vehicleRPLData[j]["name"];
            vehicleLoad = this.state.vehicleRPLData[j]["load"];
            totalVehicleLoad += parseFloat(vehicleLoad) * vehicleQuantity;
            break;
          }
        }
        if (vehicleName !== "") {
          document.getElementById('vehicleList').innerHTML += '<div class="row mb-3 pl-0 pr-0"><div class="col-6 col-sm-5">' +
            vehicleName + '</div><div class="col-6 col-sm-3"><b>Load: </b>' +
            vehicleLoad + '</div><div class="col-6 col-sm-2"><b> X </b>' +
            vehicleQuantity + '</div><div class="col-6 col-sm-2"><span type="button" class="text-danger" onclick="document.getElementById(`removeVehicle`).value=' +
            vehicleId + ';document.getElementById(`removeVehicle`).click()"><i class="far fa-trash-alt"></i></span></div></div>'
        }
      }
      totalVehicleLoad = this.round(totalVehicleLoad, 1);
      document.getElementById('totalVehicleLoad').innerText = totalVehicleLoad;
    }
    else {
      document.getElementById('vehicleList').innerHTML = '<p>No Vehicles Added</p>';
      document.getElementById('totalVehicleLoad').innerText = 0;
    }
  }


  round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  // sanitizeInput = (value) => {

  //   console.log(value);

  //   if (value.contains("&")) {
  //     value.replace("&", "&amp;")
  //   }

  //   if (value.contains("\"")) {
  //     value.replace("\"", "&quot")
  //   }

  //   if (value.contains("'")) {
  //     value.replace("'", "&#039")
  //   }

  //   if (value.contains("<")) {
  //     value.replace("&lt")
  //   }

  //   if (value.contains(">")) {
  //     value.replace("&gt")
  //   }

  //   console.log(value);
  //   return value;


  // }

  removeVehicle = async (para) => {
    let vehicleId = para;
    if (typeof para !== "string")
      vehicleId = para.target.value
    let newVehicles = "";
    let vehicles = this.state.vehicles.split(";");
    for (let i = 0; i < vehicles.length; i++) {
      if (!vehicles[i].includes(vehicleId + "x")) {
        if (newVehicles === "")
          newVehicles = vehicles[i];
        else
          newVehicles += ';' + vehicles[i];
      }
    }
    await this.setState({ vehicles: newVehicles });
    this.setFormVehicles();
  }



  async componentDidMount() {
    this.props.auth.setNav("Booking");                    //set change this according to the value in Navbar.js If dk just ask me.
    Calendar();
    try {
      this.getRoute();
    }
    catch{
    }
    try {
      this.getPurpose();
    }
    catch{
    }
    try {
      await this.getBooking(todayString, todayString);
    }
    catch{
    }
    try {
      await this.getBookingUnit();
    }
    catch{
    }
    try {
      await this.getVehicle();
    }
    catch{
      this.setState({ formLoading: true })
    }
  }

  async componentWillUnmount() {
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
            <p className="table-title">MANAGE BOOKING</p>
            <input onClick={this.getSelectedBooking} type="hidden" data-startdate="" data-enddate="" id="bookingSelectedDates" />
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
                  <button className="btn btn-block btn-outline-primary" id="booking-filter-button" type="button" onClick={this.toggleFilter}>
                    Show Advanced Filters
                  </button>
                  <div id="bookingFilters" className="animate" style={{ display: "none" }}>
                    <div className="content">
                      {this.setFilters()}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                  <div className="p-2 text-right">
                    <button className="btn btn-outline-primary booking-filter-button" type="button" id="genButton" onClick={this.genReportClick} style={{ display: "none" }}>
                      Generate Report <i className="fas fa-external-link-alt"></i>
                    </button>
                    {(this.state.formLoading === true)
                      ? <Spinner animation="border" className="ml-3" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                      : <button className="btn btn-primary btn-circle ml-3" onClick={this.createBooking}>
                        <span><i className="fas fa-plus" title="Create Booking"></i></span>
                      </button>
                    }
                  </div>
                  <div className="bookings-div" id="bookings-div">
                    <h4 style={{ display: "none" }} id="noBookings">Your filters returned no bookings</h4>
                    {this.state.isLoading && (<div className="text-center m-3">
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>)}
                    {this.setBookings()}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-modal" onClick={this.closeForm} style={{ display: "none" }} id="FormModal">
              <form autoComplete="off" onSubmit={this.handleSubmit} className="form-content animate pl-3 pr-3">
                <span onClick={this.toggleForm} className="close-form" title="Close Modal">&times;</span>
                <div className="form-title-div mb-2">
                  <h5>{this.state.formState} Booking</h5>
                </div>
                <div id="form-success" className="text-center text-success"></div>
                <div id="form-error" className="form-errors text-center"></div>
                <FormErrors formerrors={this.state.errors} />
                {this.state.formState === "Cancel" && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="cancellationReason">Cancellation Reason:</label>
                        <textarea className="form-control" onChange={this.wordCount} rows="5" type="text" required id="cancellationReason"></textarea>
                        <p className="text-right" id="wordCount"> Characters Left: 250</p>
                      </div>
                    </div>

                    {(this.state.bookingGroup !== "" && this.state.bookingGroup !== undefined && this.state.bookingGroup !== null) && (
                      <div className="row" style={{ margin: "10px" }} id="bookingGroupRadio">
                        <div className="col-12 col-sm-6 mb-2">
                          <div className="custom-control custom-radio">
                            <input className="custom-control-input" onClick={this.onRadioClickBooking} type="radio" name="inlineRadioOptions" id="RadioFalse" value="false" />
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
                )}
                {this.state.formState === "Reject" && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="cancellationReason">Rejection Reason:</label>
                        <textarea className="form-control" onChange={this.wordCount} rows="5" type="text" required id="cancellationReason"></textarea>
                        <p className="text-right" id="wordCount"> Characters Left: 250</p>
                      </div>
                    </div>

                    {(this.state.bookingGroup !== "" && this.state.bookingGroup !== undefined && this.state.bookingGroup !== null) && (
                      <div className="row" style={{ margin: "10px" }} id="bookingGroupRadioReject">
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

                )}


                {this.state.formState === "Approve" && (
                  <div className="row">
                    {(this.state.bookingGroup !== "" && this.state.bookingGroup !== undefined && this.state.bookingGroup !== null) && (
                      <div className="row" style={{ margin: "10px" }} id="bookingGroupRadioReject">
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

                )}


                {this.state.formState === "Edit" && (


                  <div className="row" onClick={this.closeDisplay} id="DisplaySchedule">


                    <div style={{ border: "1px solid rgb(48, 110, 129)", width: "100%", margin: "10px" }}>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-sm-6 mb-2"><b>Booking Code :</b></div>
                          <div className="col-12 col-sm-6"><span id="displaybookingCode" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Departure Date :</b></div>
                          <div className="col-12 col-sm-6"><span id="displaydepartureDate" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Departure Time :</b></div>
                          <div className="col-12 col-sm-6 mb-2"><span id="displaydepartureTime" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Service Provider Type :</b></div>
                          <div className="col-12 col-sm-6 mb-2"><span id="displayserviceProviderType" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Service Provider Name :</b></div>
                          <div className="col-12 col-sm-6 mb-2"><span id="displayserviceProviderName" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Route :</b></div>
                          <div className="col-12 col-sm-6 mb-2"><span id="displayrouteName" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Booking Type :</b></div>
                          <div className="col-12 col-sm-6 mb-2"><span id="displaybookingType" /></div>
                          <div className="col-12 col-sm-6 mb-2"><b>Status :</b></div>
                          <div className="col-12 col-sm-6 mb-2"><span id="displayStatus" /></div>
                        </div>
                      </div>

                      {/* <div className="col-12 mb-3">
                        <label htmlFor={"purpose" + this.state.service}>Purpose:</label>
                        <input className="form-control mb-0" type="text" id="purposeEditing"></input>
                        <input type="hidden" onClick={this.setInputDetails} id="editPurpose" />
                      </div> */}

                      <div className="col-12 mb-3">
                        <label htmlFor={"purpose" + this.state.service}>Purpose:</label>
                        <select className="form-control mb-0" type="text" onChange={e => { this.setState({ defaultOption: e.value }) }} id="purposeEditing" value={this.state.defaultOption}></select>
                      </div>

                      <div className="col-12">
                        <div id="EditNumPassengerDiv">
                          <label htmlFor="numPassenger">Number of Passengers:</label>
                          <input className="form-control mb-3" type="number"
                            onChange={this.onInputChange} id="EditnumPassenger"></input>
                        </div>
                      </div>

                      <div id="EditRPLDiv" style={{ display: 'none' }}>
                        <div className="col-12">
                          <div className="w-50 mb-3 d-inline-block">Vehicle(s):</div>
                          <div className="w-50 mb-3 d-inline-block text-right">(Max Load = 15) Total Load = <span id="totalVehicleLoad">0</span></div>
                          <div className="mb-3" id="vehicleList">
                          </div>
                          <input type="hidden" id="removeVehicle" onClick={this.removeVehicle} />
                        </div>
                        <div className="col-12 mb-3" id="bookingVehForm">
                          <div id="vehicle-form-error" className="form-errors text-center"></div>
                          <div className="row">

                            <div className="col-6">
                              <label htmlFor="vehicleRPL">Vehicle Name:</label>
                              {/* <input className="form-control mb-0" type="text" onChange={this.checkValidSelect} id="vehicleRPL"></input>
                              <input type="hidden" onClick={this.setInputDetails} id="vehicleRPLHidden" /> */}
                              <select className="form-control mb-0" type="text" id="vehicleRPL" ></select>
                            </div>

                            <div className="col-8 col-sm-9 col-md-2">
                              <label htmlFor="vehicleLoad">Load:</label>
                              <input className="form-control mb-0" readOnly type="number" id="vehicleLoad"></input>
                            </div>
                            <div className="col-8 col-sm-9 col-md-2" id="editQuantityDiv">
                              <label htmlFor="vehicleQuantity">Quantity:</label>
                              <input className="form-control mb-0" type="number" id="vehicleQuantity"></input>
                            </div>
                            <div className="col-4 order-5 col-sm-3 col-md-2 text-center">
                              <button className="btn btn-success btn-circle" style={{ marginTop: "2em" }} type="button" onClick={this.addVehicle} id="addVehicleBtn">
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="vehicleQuantity">Vehicle Plate Numbers:</label>
                          <input className="form-control mb-0" type="text" id="vehiclePlateNumbers" placeholder="E.g SJB5234E, SGP2756Y"></input>
                        </div>

                      </div>

                      {(this.state.bookingGroup !== "" && this.state.bookingGroup !== undefined && this.state.bookingGroup !== null) && (
                        <div className="col-12 mb-3" id="bookingGroupRadio">
                          <p>Apply these changes to:</p>
                          <div className="custom-control custom-radio">
                            <input className="custom-control-input" onClick={this.onRadioClickBooking} type="radio" name="inlineRadioOptions" id="RadioFalse" value="false" defaultChecked="true" />
                            <label className="custom-control-label" htmlFor="RadioFalse">This booking Only</label>
                          </div>
                          <div className="custom-control custom-radio">
                            <input className="custom-control-input" onClick={this.onRadioClickBooking} type="radio" name="inlineRadioOptions" id="RadioTrue" value="true" />
                            <label className="custom-control-label" htmlFor="RadioTrue">This and future bookings</label>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                )}



                {(this.state.formState === "Create") && (
                  <div className="row">
                    <span style={{ width: "100%" }}>
                      <div className="col-12">
                        <div style={{ borderBottom: "3px solid rgb(48, 110, 129)", marginTop: "20px" }}>
                          <div style={{ marginTop: "20px" }}>
                            <button style={{ border: "1px solid rgb(48, 110, 129)", backgroundColor: "grey", padding: "16px 20px", cursor: "pointer" }} onClick={this.changeRepeat} id="OneTime" >One Time</button>
                            <button style={{ border: "1px solid rgb(48, 110, 129)", backgroundColor: "rgba(184, 234, 241, 0.5)", padding: "16px 20px", cursor: "pointer" }} onClick={this.changeRepeat1} id="Recurring" >Recurring</button>
                          </div>
                        </div>
                      </div>
                    </span>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <div className="col-12 mb-3" id="RecurringStartDate" style={{ display: 'none' }} >
                      <div className="form-group">
                        <label htmlFor="departureDate">Start Date:</label>
                        <input className="form-control" onChange={this.onInputChange} type="date" id="startRepeatDate" />
                      </div>
                    </div>

                    <div className="col-12 mb-3" id="RecurringEndDate" style={{ display: 'none' }}>
                      <div className="form-group">
                        <label htmlFor="endRepeatDate">End Date:</label>
                        <input className="form-control" type="date" id="endRepeatDate" />
                      </div>
                    </div>

                    <div className="col-12 mb-3" style={{ display: 'none' }} id="RecurringDepartureTime"  >
                      <label htmlFor="departureTime">Departure Time:</label>
                      <input className="form-control mb-3" type="time"
                        onChange={this.onInputChange} id="repeatDepartureTime"></input>
                    </div>



                    <div className="col-12 col-md-6" id="OneTimeDepartureDate">
                      <label htmlFor="departureDate">Departure Date:</label>
                      <input className="form-control mb-3" type="date" min={moment(twoDayslater).format("YYYY-MM-DD")}
                        onChange={this.onInputChange} id="departureDate"></input>
                    </div>
                    <div className="col-12 col-md-6" id="OneTimeDepartureTime">
                      <label htmlFor="departureTime">Departure Time:</label>
                      <input className="form-control mb-3" type="time"
                        onChange={this.onInputChange} id="departureTime"></input>
                    </div>

                    <div className="col-12 col-md-4">
                      <label> Service Provider:</label>
                    </div>

                    <div className="col-6 col-md-4 mb-3" id="OneTimeRadioClickPassenger">
                      <div className="custom-control custom-radio">
                        <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="RadioPassenger" value="P" />
                        <label className="custom-control-label" htmlFor="RadioPassenger">Passenger</label>
                      </div>
                    </div>



                    <div className="col-6 col-md-4 mb-3" id="OneTimeRadioClickRPL">
                      <div className="custom-control custom-radio">
                        <input className="custom-control-input" onClick={this.onRadioClick} type="radio" name="inlineRadioOptions" id="RadioRPL" value="RPL" />
                        <label className="custom-control-label" htmlFor="RadioRPL">RPL</label>
                      </div>
                    </div>



                    <div className="col-12 mb-3" id="OneTimeBookingUnit">
                      <label htmlFor={"route" + this.state.service}>BookingUnit:</label>
                      <input className="form-control mb-0" type="text" onChange={this.checkValidSelect} id="bookingUnit"></input>
                      <input type="hidden" onClick={this.setInputDetails} id="bookingUnitHidden" />
                    </div>



                    {/* <div className="col-12 mb-3" id="OneTimeRoute">
                      <label htmlFor={"route" + this.state.service}>Route:</label>
                      <input className="form-control mb-0" type="text" onChange={this.checkValidSelect} id={"route" + this.state.service}></input>
                      <input type="hidden" onClick={this.setInputDetails} id={"route" + this.state.service + "Hidden"} />
                    </div> */}

                    <div className="col-12 mb-3" id="OneTimeRoute">
                      <label htmlFor={"route" + this.state.service}>Route:</label>
                      <select className="form-control mb-0" type="text" id="routePassenger"></select>
                    </div>

                    {/* <div className="col-12 mb-3">
                      <label htmlFor={"purpose" + this.state.service}>Purpose:</label>
                      <input className="form-control mb-0" type="text" onChange={this.checkValidSelect} id={"purpose" + this.state.service}></input>
                      <input type="hidden" onClick={this.setInputDetails} id={"purpose" + this.state.service + "Hidden"} />
                    </div> */}


                    <div className="col-12 mb-3">
                      <label htmlFor={"purpose" + this.state.service}>Purpose:</label>
                      <select className="form-control mb-0" type="text" id="purposeDD"></select>
                    </div>



                    {this.state.service === "P" && (
                      <div className="col-12">
                        <div id="OneTimeNumPassengerDiv">
                          <label htmlFor="numPassenger">Number of Passengers:</label>
                          <input className="form-control mb-3" type="number"
                            onChange={this.onInputChange} id="numPassenger"></input>
                        </div>
                      </div>

                    )}

                    <div className="col-12" id="RecurringRepeatCheckbox" style={{ display: 'none' }}>
                      <div className="form-group">
                        <div>
                          <label htmlFor="repeat">Repeat:</label>
                        </div>
                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="mon" />
                          <label className="custom-control-label" htmlFor="mon">Mon</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="tues" />
                          <label className="custom-control-label" htmlFor="tues">Tues</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="wed" />
                          <label className="custom-control-label" htmlFor="wed">Wed</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="thurs" />
                          <label className="custom-control-label" htmlFor="thurs">Thurs</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="fri" />
                          <label className="custom-control-label" htmlFor="fri">Fri</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left", marginRight: "20px" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="sat" />
                          <label className="custom-control-label" htmlFor="sat">Sat</label>
                        </span>

                        <span className="custom-control custom-checkbox" style={{ float: "left" }}>
                          <input className="custom-control-input" defaultChecked={false} type="checkbox" name="repeatday" id="sun" />
                          <label className="custom-control-label" htmlFor="sun">Sun</label>
                        </span>
                        <br />
                      </div>
                    </div>

                    <div className="col-12">
                      {this.state.service === "RPL" && (
                        <div className="row">
                          <div id="OneTimeRPLDiv">
                            <div className="col-12">
                              <div className="w-50 mb-3 d-inline-block">Vehicle(s):</div>
                              <div className="w-50 mb-3 d-inline-block text-right">(Max Load = 15) Total Load = <span id="totalVehicleLoad">0</span></div>
                              <div className="mb-3" id="vehicleList">
                              </div>
                              <input type="hidden" id="removeVehicle" onClick={this.removeVehicle} />
                            </div>
                            <div className="col-12 mb-3 pt-3 pb-3" id="bookingVehForm">
                              <div id="vehicle-form-error" className="form-errors text-center"></div>
                              <div className="row">
                                <div className="col-6">

                                  <label htmlFor="vehicleRPL">Vehicle Name:</label>

                                  {/* <input className="form-control mb-0" type="text" onChange={this.checkValidSelect} id="vehicleRPL"></input>
                                  <input type="hidden" onClick={this.setInputDetails} id="vehicleRPLHidden" /> */}
                                  <select className="form-control mb-0" type="text" id="vehicleRPL" ></select>
                                </div>

                                <div className="col-8 col-sm-9 col-md-2">
                                  <label htmlFor="vehicleLoad">Load:</label>
                                  <input className="form-control mb-0" readOnly type="number" id="vehicleLoad"></input>
                                </div>
                                <div className="col-8 col-sm-9 col-md-2">
                                  <label htmlFor="vehicleQuantity">Quantity:</label>
                                  <input className="form-control mb-0" type="number" id="vehicleQuantity"></input>
                                </div>
                                {/* <div className="col-4 order-md-3 col-sm-3 col-md-2">
                                <button type="button" className="btn btn-link mytooltip">Vehicle Details</button>
                                <div id="vehicleDetails" className="tooltiptext">
                                  <span>No Vehicles Added</span>
                                </div>
                              </div> */}
                                <div className="col-4 order-5 col-sm-3 col-md-2 text-center">
                                  <button className="btn btn-success btn-circle" style={{ marginTop: "2em" }} type="button" onClick={this.addVehicle}>
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 mb-3">
                              <label htmlFor="vehicleQuantity">Vehicle Plate Numbers:</label>
                              <input className="form-control mb-0" type="text" id="vehiclePlateNumbers" placeholder="E.g SJB5234E, SGP2756Y"></input>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="row" style={{ backgroundColor: "#f1f1f1" }}>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 ml-auto mb-2 mt-2">
                    <button type="reset" id="clearBtn" onClick={this.resetWordCount} className="btn btn-block btn-outline-danger">Clear
                    <i className="far fa-window-close"></i>
                    </button>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2 mt-2">
                    <button type="submit" id="btnSubmit" className="btn btn-block btn-success">
                      {this.state.formState === "Reject" && ("Submit ")}{this.state.formState === "Approve" && ("Approve ")}{this.state.formState === "Cancel" && ("Submit ")}{this.state.formState === "Create" && ("Create ")}{this.state.formState === "Edit" && ("Update ")}
                      <i className="far fa-plus-square"></i>
                    </button>
                  </div>
                </div>
                {this.state.formState === "Create"}{this.state.formState === "Edit"}

                <div className="col-12 mb-3" id="LoadingDiv" style={{ display: "none", borderBottom: '2px', textAlign: "right" }}>
                  <label> Creating Booking {"     "}</label>
                  <Spinner animation="border" role="status"></Spinner>
                </div>

              </form>
            </div>

          </div>
        </div >
      );
    }
  }
}

export default Booking;