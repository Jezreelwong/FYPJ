import React, { Component, useState } from 'react';
import {
  Alert,
  Platform,
  Text,
  View,
  TextInput,
  StyleSheet,
  Picker,
  FlatList,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import moment from "moment";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import ModalPicker from "../../components/ModalPicker";
import Input from "../../components/Input";
import NavigationInput from "../../components/NavigationInput";
import SelectedVehicleItem from "../../components/vehicles/SelectedVehicleItem";
import ServiceProviderType from "../../shared/enums/ServiceProviderType";
import Screens from '../screens';
import Images from '../../images';
import Booking, { BookingTypes } from '../../models/Booking';
import AwsData from "../../shared/AwsData";

const awsData = new AwsData();

class UnitBookFerryScreen extends Component {
  constructor(props) {
    super(props);
    this.serviceProviderType = this.props.route.params.serviceProviderType;
    this.routes = this.mapRoutes(awsData.routes);
    this.purposes = this.mapPurposes(awsData.purposes);
    this.recurringItems = [
      { value: "One-Time", label: "One-Time" },
      { value: "Recurring", label: "Recurring" }, 
    ]
    this.state = {
      dateText: "",
      timeText: "",
      routeText: "",
      purposeText: "",
      passengerCountText: "",
      date: null,
      time: null,
      routeId: null,
      purposeId: null,
      selectedVehicleIds: [],
      selectedVehicles: [],
      totalLoad: '',
      bookingType: BookingTypes.FIXED,
      scheduleId: null,
      dateErrorMsg: "",
      timeErrorMsg: "",
      routeErrorMsg: "",
      purposeErrorMsg: "",
      passengerErrorMsg: "",
      vehicleErrorMsg: "",
      adHocWarningVisible: false,

      recurringBooking: "One-Time",
      recurringErrorMsg: "",
      weekday: "",
      weekdayErrorMsg: "",
      endDateText: "",
      endDate: null,
      endDateErrorMsg: "",
      bookingUnitText: AwsData.user.username,
      recurringSettingsErrorMsg: "",
    };

  }

  componentDidMount() {
    this.removeFocusListener = this.props.navigation.addListener("focus", () => {
      const { params } = this.props.route;
      if (params.endDateText) {
        this.setState({
          endDateText: params.endDateText
        })
      }

      if (params.weekday) {
        this.setState({
          weekday: params.weekday
        })
      }

      if (params.endDateText !== "" && params.weekday !== "") {
        this.setState({
          recurringSettingsErrorMsg: ""
        })
      }

      if (this.serviceProviderType === ServiceProviderType.RPL) {
        if (params.selectedVehicleIds === undefined) {
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

        if (awsData.vehicles == undefined || awsData.vehicles.length == 0) {
          awsData.fetchVehicles();
        }
      }



    });

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

  setPassengerCount = count => {
    this.setState({
      passengerCountText: count,
      passengerErrorMsg: ""
    });
  };

  setRecurringBooking = recurringBooking => {
    this.setState({
      recurringBooking: recurringBooking.label,
      recurringErrorMsg: ""
    });
  };


  navigateToVehicleSelection = () => {
    const { selectedVehicleIds, selectedVehicles } = this.state;

    this.props.navigation.navigate(Screens.UnitSelectVehicle, {
      selectedVehicleIds,
      selectedVehicles,
      screen: Screens.UnitBookRPL
    });
  };

  searchTimings = () => {
    const [error, errorMessageMap] = this.validateFields();

    if (error) {
      this.setState(errorMessageMap);
      return;
    }

    const {
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      passengerCountText,
      selectedVehicles,
      totalLoad,
      recurringBooking,
      endDateText,
      weekday,
      bookingUnitText
    } = this.state;

    if (recurringBooking === "Recurring") {
      this.props.navigation.navigate(Screens.UnitReviewBooking, {
        serviceProviderType: this.serviceProviderType,
        dateText,
        timeText,
        routeId,
        routeText,
        purposeId,
        purposeText,
        passengerCountText,
        selectedVehicles,
        totalLoad,
        recurringBooking,
        endDateText,
        weekday,
        bookingUnitText
      });
    } else {
      this.props.navigation.navigate(Screens.UnitFerryScheduledTimings, {
        serviceProviderType: this.serviceProviderType,
        dateText,
        timeText,
        routeId,
        routeText,
        purposeId,
        purposeText,
        passengerCountText,
        selectedVehicles,
        totalLoad,
        recurringBooking,
        endDateText,
        weekday,
        bookingUnitText
      });
    }

  };

  validateFields = () => {
    const {
      dateText,
      timeText,
      routeText,
      purposeText,
      passengerCountText,
      selectedVehicleIds,
      recurringBooking,
      weekday,
      endDateText
    } = this.state;

    const errorMessageMap = {};

    const fields = [
      {
        condition: dateText === "",
        key: "dateErrorMsg",
        errorMsg: "Please select a date",
      },
      {
        condition: routeText === "",
        key: "routeErrorMsg",
        errorMsg: "Please select a route",
      },
      AwsData.user.role === "PU" ?
        {
          condition: recurringBooking === "",
          key: "recurringErrorMsg",
          errorMsg: "Please select Recurring or One-Time"
        }
        :
        {},
      {
        condition: purposeText === "",
        key: "purposeErrorMsg",
        errorMsg: "Please select a purpose",
      },
      recurringBooking === "Recurring" ?
        {
          condition: endDateText === "" || weekday === "" || weekday[0] === "",
          key: "recurringSettingsErrorMsg",
          errorMsg: "Please select recurrence"
        }
        :
        {},
      recurringBooking === "Recurring" ?
        {
          condition: timeText === "",
          key: "timeErrorMsg",
          errorMsg: "Please select time"
        }
        :
        {},
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
        },
      this.serviceProviderType === ServiceProviderType.PASSENGER ?
        {
          condition: passengerCountText > 200,
          key: "passengerErrorMsg",
          errorMsg: "Please enter number of passengers not more than 200",
        }
        :
        {},
      recurringBooking === "Recurring" ?
        {
          condition: moment(dateText) >= moment(endDateText),
          key: "recurringSettingsErrorMsg",
          errorMsg: "Please select a valid end date"
        }
        :
        {}
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

  render() {
    const { serviceProviderType } = this.props.route.params;
    const {
      dateText,
      timeText,
      routeText,
      purposeText,
      passengerCountText,
      selectedVehicles,
      bookingType,
      dateErrorMsg,
      timeErrorMsg,
      routeErrorMsg,
      purposeErrorMsg,
      passengerErrorMsg,
      vehicleErrorMsg,
      adHocWarningVisible,
      recurringBooking,
      recurringErrorMsg,
      weekday,
      weekdayErrorMsg,
      endDateText,
      endDateErrorMsg,
      recurringSettingsErrorMsg
    } = this.state;

    return (
      <ImageBackground source={Images.unit_background}
        style={styles.BackgroundImage}>
        {/* <AdminBookTabHOC serviceProviderType={serviceProviderType} > */}

        <Text style={styles.Title}>Bookings</Text>
        <ScrollView style={styles.screen}>
          {
            AwsData.user.role === "PU" ?
              <>
                <DatePicker
                  testID="datePicker"
                  value={dateText}
                  errorMessage={dateErrorMsg}
                  onConfirm={date => this.setDate(date)}
                  maxDate={moment().add(2, 'months').toDate()}
                />
              </>
              :
              <>
                <DatePicker
                  testID="datePicker"
                  value={dateText}
                  errorMessage={dateErrorMsg}
                  onConfirm={date => this.setDate(date)}
                  maxDate={moment().add(1, 'months').toDate()}
                />
              </>
          }
          <ModalPicker
            testID="routePicker"
            leftIcon={{ type: "entypo", name: "location" }}
            placeholder="Select Route"
            value={routeText}
            errorMessage={routeErrorMsg}
            items={this.routes}
            onItemSelected={route => this.setRoute(route)}
          />
          <ModalPicker
            testID="purposePicker"
            screen={"booking"}
            leftIcon={{ type: "feather", name: "edit" }}
            placeholder="Select Purpose"
            value={purposeText}
            errorMessage={purposeErrorMsg}
            items={this.purposes}
            onItemSelected={purpose => this.setPurpose(purpose)}
          />
          {
            serviceProviderType === ServiceProviderType.PASSENGER ?
              <Input
                testID="passengerInput"
                keyboardType="numeric"
                leftIcon={{ type: "material-community", name: "human-male-male" }}
                placeholder="Enter Number of Passengers"
                value={passengerCountText}
                errorMessage={passengerErrorMsg}
                onChangeText={text => this.setPassengerCount(text)}
              />
              :
              <>
                <NavigationInput
                  testID="vehiclesInput"
                  leftIcon={{ type: "ionicon", name: "ios-car" }}
                  placeholder="Select Vehicles"
                  errorMessage={vehicleErrorMsg}
                  onPress={this.navigateToVehicleSelection}
                />
                {
                  selectedVehicles.map(function (object, i) {
                    return <SelectedVehicleItem vehicle={object} />;
                  })
                }
              </>
          }
          {
            AwsData.user.role === "PU" ?
              <>
                <ModalPicker
                  leftIcon={{ type: "feather", name: "repeat" }}
                  placeholder="One-Time/Recurring"
                  value={recurringBooking}
                  errorMessage={recurringErrorMsg}
                  items={this.recurringItems}
                  onItemSelected={recurringBooking => this.setRecurringBooking(recurringBooking)}
                />
              </>
              :
              <>
              </>
          }
          {
            recurringBooking === "Recurring" ?
              <>
                <TimePicker
                  value={timeText}
                  errorMessage={timeErrorMsg}
                  onConfirm={date => this.setTime(date)}
                />
                <NavigationInput
                  leftIcon={{ type: "feather", name: "repeat" }}
                  placeholder="Select Recurrence"
                  errorMessage={recurringSettingsErrorMsg}
                  onPress={() => this.props.navigation.navigate(Screens.UnitRecurring, {
                    serviceProviderType: this.serviceProviderType,
                    endDateText: endDateText,
                    weekday: weekday,
                    dateText: dateText
                  })}
                />
              </>
              :
              <>
              </>
          }
          {
            (endDateText !== "" || weekday !== "") && recurringBooking === "Recurring" ?
              <>
                <View style={styles.row}>
                  <View style={styles.item}>
                    <Text style={styles.name}>End Date: {endDateText}</Text>
                  </View>
                </View>
                {
                  weekday.map(function (object, i) {
                    return (
                      <View style={styles.row}>
                        <View style={styles.item}>
                          <Text style={styles.name}>{object}</Text>
                        </View>
                      </View>
                    );
                  })
                }
              </>
              :
              <>
              </>
          }
        </ScrollView>

        <View style={styles.confirmTouchableContainer}>
          <TouchableHighlight
            style={styles.searchButton}
            underlayColor="red"
            onPress={() => {
              Keyboard.dismiss()
              this.searchTimings();
            }}
          >
            <Text style={styles.searchButtonText}>Continue</Text>
          </TouchableHighlight>
        </View>

        {/* </AdminBookTabHOC> */}


      </ImageBackground>
    );
  }
};

const AdminBookTabHOC = ({ serviceProviderType, children }) => {
  return (
    serviceProviderType === ServiceProviderType.PASSENGER ?
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {children}
        </View>
      </TouchableWithoutFeedback>
      :
      <>
        {children}
      </>
  );
};

const styles = StyleSheet.create({
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

  container: {
    //flex: 1,
  },
  screen: {
    //flex: 1,
    backgroundColor: "#fff",
    //height: 50,
    //height: '50%',
    marginTop: 16,
    marginBottom: 10
  },

  searchButton: {
    padding: 12,
    marginTop: 10,
    marginHorizontal: 30,
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#eb394b",
    color: "#fff",
  },
  // searchButtonInvisble: {
  //   width: 0,
  //   height: 0,
  // },
  searchButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'Roboto',
    color: "#fff"
  },

  nextTouchableContainer: {
    paddingHorizontal: 30,
    //paddingBottom: 10,
    //backgroundColor: "#fff"
    marginTop: 10,
    marginBottom: 10,
  },
  nextTouchable: {
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  nextText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'Roboto',
    color: '#860544'
  },
  confirmTouchableContainer: {
    paddingBottom: 10,
  },
  row: {
    paddingHorizontal: 30,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ebebeb"
  },
  name: {
    fontSize: 17
  },
});

export default UnitBookFerryScreen;