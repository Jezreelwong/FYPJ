"use strict";

import React, { Component } from "react";
import { View, ScrollView, Text, TouchableHighlight, StyleSheet, ImageBackground } from "react-native";
import moment from "moment";
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import ModalPicker from "../../components/ModalPicker";
import Images from '../../images';
import NavigationInput from "../../components/NavigationInput";
import SelectedVehicleItem from "../../components/vehicles/SelectedVehicleItem";
import ModalAdHocWarning from "../../components/bookings/ModalAdHocWarning";
import ServiceProviderType from "../../shared/enums/ServiceProviderType";
import AdHocRange from "../../shared/enums/AdHocRange";
import AwsData from "../../shared/AwsData";
import Screens from '../screens';

const awsData = new AwsData();

export default class DutyPersonnelBookRPLScreen extends Component {
  constructor(props) {
    super(props);
    this.serviceProviderType = this.props.route.params.serviceProviderType;
    this.routes = this.mapRoutes(awsData.routes);
    this.purposes = this.mapPurposes(awsData.purposes);
    this.bookingUnits = this.mapBookingUnits(awsData.bookingUnits);
    this.state = {
      dateText: "",
      timeText: "",
      routeText: "",
      purposeText: "",
      bookingUnitText: "",
      passengerCountText: "",
      date: null,
      time: null,
      routeId: null,
      purposeId: null,
      selectedVehicleIds: [],
      selectedVehicles: [],
      totalLoad: "",
      dateErrorMsg: "",
      timeErrorMsg: "",
      routeErrorMsg: "",
      purposeErrorMsg: "",
      bookingUnitErrorMsg: "",
      passengerErrorMsg: "",
      vehicleErrorMsg: "",
      adHocWarningVisible: false
    };

    // if (awsData.vehicles == undefined || awsData.vehicles.length == 0) {
    // 	awsData.__fetchData();
    // }
  }

  componentDidMount() {
    if (this.serviceProviderType === ServiceProviderType.RPL) {
      this.removeFocusListener = this.props.navigation.addListener("focus", () => {
        const { params } = this.props.route;

        if (params.selectedVehicleIds === undefined || params.totalLoad === undefined) {
          return;
        }

        if (params.selectedVehicleIds === this.state.selectedVehicleIds &&
          params.selectedVehicles === this.state.selectedVehicles) {
          return;
        }

        this.setState({
          selectedVehicleIds: params.selectedVehicleIds,
          selectedVehicles: params.selectedVehicles,
          totalLoad: params.totalLoad,
          vehicleErrorMsg: ""
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.removeFocusListener) {
      this.removeFocusListener();
    }
  }

  mapRoutes = (routes) => {
    return routes.reduce((accumulator, route) => {
      if (route.serviceProviderType === this.serviceProviderType) {
        accumulator.push({
          value: route.routeId,
          label: `${route.from}-${route.destination}`,
          short: route.routeName
        });
      }

      return accumulator;
    }, []);
  };

  mapPurposes = (purposes) => {
    return purposes.reduce((accumulator, purpose) => {
      if (purpose.serviceProviderType === this.serviceProviderType) {
        accumulator.push({
          value: purpose.purposeId,
          label: purpose.purposeDesc,
          short: purpose.purposeShort
        });
      }

      return accumulator;
    }, []);
  };
  mapBookingUnits = (bookingUnits) => {
    return bookingUnits.reduce((accumulator, bookingUnit) => {
      accumulator.push({
        value: bookingUnit,
        label: bookingUnit,
      });

      return accumulator;
    }, []);
  };

  setDate = date => {
    this.setState({
      date,
      dateText: moment(date).format("D MMM YYYY"),
      dateErrorMsg: ""
    });
  };

  setTime = date => {
    this.setState({
      time: date,
      timeText: moment(date).format("HHmm"),
      timeErrorMsg: ""
    });
  };

  setRoute = route => {
    this.setState({
      routeId: route.value,
      routeText: route.short,
      routeErrorMsg: ""
    });
  };

  setPurpose = purpose => {
    this.setState({
      purposeId: purpose.value,
      purposeText: purpose.short,
      purposeErrorMsg: ""
    });
  };
  setBookingUnit = bookingUnit => {
    this.setState({
      bookingUnitText: bookingUnit.value,
      bookingUnitErrorMsg: ""
    });
  };

  setPassengerCount = count => {
    this.setState({
      passengerCountText: count,
      passengerErrorMsg: ""
    });
  };

  navigateToVehicleSelection = () => {
    const { selectedVehicleIds, selectedVehicles } = this.state;

    this.props.navigation.push(Screens.AdminSelectVehicle, {
      selectedVehicleIds,
      selectedVehicles,
      screen: Screens.DutyPersonnelBookRPL,
    });
  };

  tryBook = () => {
    const [error, errorMessageMap] = this.validateFields();

    if (error) {
      this.setState(errorMessageMap);
      return;
    }

    // const isAdHoc = this.isAdHoc();
    // if (isAdHoc) {
    //   this.showAdHocWarning();
    //   return;
    // }

    this.navigateToReviewScreen();
  };

  validateFields = () => {
    const {
      dateText,
      timeText,
      routeText,
      purposeText,
      bookingUnitText,
      passengerCountText,
      selectedVehicleIds
    } = this.state;

    const errorMessageMap = {};

    const fields = [
      {
        condition: dateText === "",
        key: "dateErrorMsg",
        errorMsg: "Please select a date",
      },
      {
        condition: timeText === "",
        key: "timeErrorMsg",
        errorMsg: "Please select a time",
      },
      {
        condition: routeText === "",
        key: "routeErrorMsg",
        errorMsg: "Please select a route",
      },
      {
        condition: purposeText === "",
        key: "purposeErrorMsg",
        errorMsg: "Please select a purpose",
      },
      {
        condition: bookingUnitText === "",
        key: "bookingUnitErrorMsg",
        errorMsg: "Please select a Booking Unit",
      },
      this.serviceProviderType === ServiceProviderType.PASSENGER ?
        {
          condition: passengerCountText === "",
          key: "passengerErrorMsg",
          errorMsg: "Please select number of passengers",
        }
        :
        {
          condition: selectedVehicleIds.length <= 0,
          key: "vehicleErrorMsg",
          errorMsg: "Please select at least one vehicle",
        }
    ];

    let error = false;

    fields.forEach(field => {
      if (field.condition) {
        errorMessageMap[field.key] = field.errorMsg;
        error = true;
      }
    });

    return [error, errorMessageMap];
  };

  isAdHoc = () => {
    const { date, time } = this.state;

    let today = new Date();
    today.setSeconds(0);
    today.setMilliseconds(0);

    let bookingDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    today = moment(today);
    bookingDate = moment(bookingDate);

    const hours = bookingDate.diff(today, "hours");
    let isAdHoc = false;

    if (hours < 48) {
      isAdHoc = true;
      return isAdHoc;
    }

    const hour = time.getHours();
    const minute = time.getMinutes();
    const { START, END } = AdHocRange;

    if ((hour >= START.HOUR && minute >= START.MINUTE) || hour < END) {
      isAdHoc = true;
    }

    return isAdHoc;
  };

  showAdHocWarning = () => {
    this.setState({
      adHocWarningVisible: true
    });
  };

  hideAdHocWarning = () => {
    this.setState({
      adHocWarningVisible: false
    });
  };

  navigateToReviewScreen = () => {
    const {
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      bookingUnitText,
      passengerCountText,
      selectedVehicles,
      totalLoad,
    } = this.state;

    this.props.navigation.push(Screens.DutyPersonnelReviewBooking, {
      serviceProviderType: this.serviceProviderType,
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      bookingUnitText,
      passengerCountText,
      selectedVehicles,
      totalLoad,
    });

    this.hideAdHocWarning();
  };

  render() {
    const { serviceProviderType } = this.props.route.params;
    const {
      dateText,
      timeText,
      routeText,
      purposeText,
      bookingUnitText,
      passengerCountText,
      selectedVehicles,
      dateErrorMsg,
      timeErrorMsg,
      routeErrorMsg,
      purposeErrorMsg,
      bookingUnitErrorMsg,
      passengerErrorMsg,
      vehicleErrorMsg,
      adHocWarningVisible
    } = this.state;

    return (
      <ImageBackground source={Images.dp_background} style={styles.BackgroundImage}>
        <View style={{ height: 55, flexDirection: 'row' }}>
          <Text style={{ fontSize: 24, color: "#fff", alignSelf: "center", textAlign: "center", flex: 1 }}>Booking</Text>
        </View>
        {
          selectedVehicles.length != 0 ?
            <ScrollView style={styles.screen}>
              <DatePicker
                value={dateText}
                errorMessage={dateErrorMsg}
                onConfirm={date => this.setDate(date)}
                minDate={moment().toDate()}
                maxDate={moment().add(1, "days").toDate()}
              />
              <TimePicker
                value={timeText}
                errorMessage={timeErrorMsg}
                onConfirm={date => this.setTime(date)}
              />
              <ModalPicker
                leftIcon={{ type: "entypo", name: "location" }}
                placeholder="Select Route"
                value={routeText}
                errorMessage={routeErrorMsg}
                items={this.routes}
                onItemSelected={route => this.setRoute(route)}
              />
              <ModalPicker
                screen={"booking"}
                leftIcon={{ type: "feather", name: "edit" }}
                placeholder="Select Purpose"
                value={purposeText}
                errorMessage={purposeErrorMsg}
                items={this.purposes}
                onItemSelected={purpose => this.setPurpose(purpose)}
              />
              <ModalPicker
                leftIcon={{ type: "font-awesome", name: "user-circle-o" }}
                placeholder="Select Booking Unit"
                value={bookingUnitText}
                errorMessage={bookingUnitErrorMsg}
                items={this.bookingUnits}
                onItemSelected={bookingUnit => this.setBookingUnit(bookingUnit)}
              />
              <NavigationInput
                leftIcon={{ type: "ionicon", name: "ios-car" }}
                placeholder="Select Vehicles"
                errorMessage={vehicleErrorMsg}
                onPress={this.navigateToVehicleSelection}
              />
              {
                selectedVehicles != undefined || selectedVehicles.length != 0 ?
                  selectedVehicles.map(function (object, i) {
                    return <SelectedVehicleItem vehicle={object} />;
                  })
                  :
                  <></>
              }
            </ScrollView>
            :
            <View style={styles.screen}>
              <DatePicker
                value={dateText}
                errorMessage={dateErrorMsg}
                onConfirm={date => this.setDate(date)}
                minDate={moment().toDate()}
                maxDate={moment().add(1, "days").toDate()}
              />
              <TimePicker
                value={timeText}
                errorMessage={timeErrorMsg}
                onConfirm={date => this.setTime(date)}
              />
              <ModalPicker
                leftIcon={{ type: "entypo", name: "location" }}
                placeholder="Select Route"
                value={routeText}
                errorMessage={routeErrorMsg}
                items={this.routes}
                onItemSelected={route => this.setRoute(route)}
              />
              <ModalPicker
                leftIcon={{ type: "feather", name: "edit" }}
                placeholder="Select Purpose"
                value={purposeText}
                errorMessage={purposeErrorMsg}
                items={this.purposes}
                onItemSelected={purpose => this.setPurpose(purpose)}
              />
              <ModalPicker
                leftIcon={{ type: "font-awesome", name: "user-circle-o" }}
                placeholder="Select Booking Unit"
                value={bookingUnitText}
                errorMessage={bookingUnitErrorMsg}
                items={this.bookingUnits}
                onItemSelected={bookingUnit => this.setBookingUnit(bookingUnit)}
              />
              <NavigationInput
                leftIcon={{ type: "ionicon", name: "ios-car" }}
                placeholder="Select Vehicles"
                errorMessage={vehicleErrorMsg}
                onPress={this.navigateToVehicleSelection}
              />
              {
                selectedVehicles != undefined || selectedVehicles.length != 0 ?
                  selectedVehicles.map(function (object, i) {
                    return <SelectedVehicleItem vehicle={object} />;
                  })
                  :
                  <></>
              }
            </View>
        }
        <View style={styles.nextTouchableContainer}>
          <TouchableHighlight
            style={styles.nextTouchable}
            underlayColor="#e1a706"
            onPress={this.tryBook}
          >
            <Text style={styles.nextText}>Next</Text>
          </TouchableHighlight>
        </View>
        <ModalAdHocWarning
          visible={adHocWarningVisible}
          onBackdropPress={this.hideAdHocWarning}
          onContinuePress={this.navigateToReviewScreen}
        />
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screen: {
    backgroundColor: "#fff",
  },
  nextTouchableContainer: {
    paddingHorizontal: 30,
    marginBottom: 35
  },
  nextTouchable: {
    padding: 11,
    alignItems: "center",
    borderRadius: 4,
    marginTop: 15,
    backgroundColor: "#ffc106",
  },
  nextText: {
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  Title:
  {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});

