import React, { Component } from 'react';
import { View, SafeAreaView, Text, ImageBackground, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Booking, { BookingTypes, BookingStatus } from '../../models/Booking';
import Screens from '../screens';
import Images from '../../images';
import AwsData from "../../shared/AwsData";

const awsData = new AwsData();

class UnitFerryScheduledTimingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedItem: null,
      dateText: "",
      timeText: "",
      routeId: null,
      routeText: "",
      purposeId: null,
      purposeText: "",
      serviceProviderType: null,
      passengerCountText: null,
      selectedVehicles: [],
      totalLoad: "",
      bookingType: BookingTypes.FIXED,
      scheduleId: "",
      schedules: [],
      isTimeModalVisble: false,
      bookingUnitText: "",

      errorText: false,
    }
  }

  async componentDidMount() {

    const {
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      serviceProviderType,
      passengerCountText,
      selectedVehicles,
      totalLoad,
      recurringBooking,
      endDateText,
      weekday,
      bookingUnitText
    } = this.props.route.params;

    this.setState({
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      serviceProviderType,
      passengerCountText,
      selectedVehicles,
      totalLoad,
      recurringBooking,
      endDateText,
      weekday,
      bookingUnitText
    });

    const booking = new Booking(
      dateText,
      timeText,
      routeId,
      purposeId,
      bookingUnitText,
      serviceProviderType,
      passengerCountText,
      selectedVehicles,
    );
    booking.totalLoad = totalLoad;

    const schedules = await awsData.checkSchedule(booking);
    this.setState({
      schedules: schedules
    });

  }

  selectTime(item) {
    this.setState({
      scheduleId: item.scheduleId,
      timeText: item.departureTime,
      selectedItem: item.departureTime,
    });
  }

  showTimeModal = () => {
    this.setState({
      isTimeModalVisble: true,
    });
  }

  hideTimeModal = () => {
    this.setState({
      isTimeModalVisble: false,
    });
  }

  onConfirmTime = (date) => {
    const time = moment(date).format('HHmm');
    this.setState({
      // timeText: time,
      isTimeModalVisble: false,
      // bookingType: BookingTypes.ADHOC,
    });
    this.state.timeText = time;
    this.state.bookingType = BookingTypes.ADHOC;
    this.navigateToReviewScreen();
  };

  navigateToReviewScreen = () => {
    if (this.state.timeText === "") {
      this.setState({ errorText: true })
      return;
    }

    const {
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      serviceProviderType,
      passengerCountText,
      selectedVehicles,
      totalLoad,
      bookingType,
      scheduleId,
      recurringBooking,
      endDateText,
      weekday,
      bookingUnitText
    } = this.state;

    this.props.navigation.navigate(Screens.UnitReviewBooking, {
      serviceProviderType,
      dateText,
      timeText,
      routeId,
      routeText,
      purposeId,
      purposeText,
      passengerCountText,
      selectedVehicles,
      totalLoad,
      bookingType,
      scheduleId,
      recurringBooking,
      endDateText,
      weekday,
      bookingUnitText
    });

    // this.hideAdHocWarning();
  };

  render() {
    return (
      <ImageBackground source={Images.unit_background_scheduled_timings} style={styles.BackgroundImage}>
        <SafeAreaView style={styles.SafeAreaView}>
          {/* <Text style={styles.Title}>{this.props.route.params.route}</Text> */}

          <Text style={styles.scheduledTimingText}>Pick a Scheduled Timing</Text>
          <Text style={styles.routeText}>From {this.state.routeText} </Text>
          <View style={styles.timingsContainer}>
            {
              this.state.errorText && this.state.timeText === "" &&
              <>
                <Text style={styles.errorText}>Please select a time</Text>
              </>
            }
            <FlatList style={styles.timingsFlatList}
              extraData={this.state.selectedItem}
              data={this.state.schedules}
              renderItem={({ item }) => (
                <TouchableHighlight
                  disabled={item.available.toString() == "false"}
                  underlayColor="#dc143c"
                  style=
                  {
                    item.available.toString() == "false" ? styles.unavilableTime :
                      this.state.selectedItem == item.departureTime ?
                        styles.selectedTime :
                        styles.availableTime
                  }
                  onPress={() => this.selectTime(item)}>
                  <Text style=
                    {
                      item.available.toString() == "false" ? styles.unavailableTimeText :
                        this.state.selectedItem == item.departureTime ?
                          styles.selectedTimeText :
                          styles.availableTimeText
                    }>
                    {item.departureTime}
                  </Text>
                </TouchableHighlight>
              )}
              numColumns={3}
              keyExtractor={({ item }, index) => index.toString()}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.showTimeModal()}
            style={styles.ButtonRequest}>
            <Text style={styles.ButtonRequestText}>Request for Other Timeslots</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.navigateToReviewScreen()}
            style={styles.ButtonConfirm}>
            <Text style={styles.buttonConfirmText}>Confirm Booking</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            headerTextIOS="Pick a time"
            isVisible={this.state.isTimeModalVisble}
            mode="time"
            date={new Date()}
            display="spinner"
            onConfirm={this.onConfirmTime}
            onCancel={this.hideTimeModal}
          />
        </SafeAreaView>
      </ImageBackground>
    )

  }
}

const styles = StyleSheet.create({
  BackgroundImage: {
    width: '100%',
    height: '100%'
  },
  SafeAreaView: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  // Title: {
  //   color: 'white',
  //   fontSize: 20,
  //   textAlign: 'center',
  //   paddingTop: 25,
  //   fontWeight: 'bold',
  //   fontFamily: 'Roboto',
  // },
  // FlatListTiming: {
  //   backgroundColor: 'white',
  //   padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   flex: 1,
  //   fontWeight: 'bold',
  //   fontFamily: 'Roboto',
  //   width: '65%',
  //   fontSize: 13,
  //   borderRadius: 5,
  //   textAlign: 'center',
  //   borderWidth: 1,
  //   borderColor: '#dcdcdc',
  //   color: '#dcdcdc'
  //   //alignItems:'flex-start',
  // },
  // imageView: {
  //   width: 80,
  //   height: 50,
  //   // margin: 7,
  //   borderRadius: 7,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  timingsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  timingsFlatList: {
    flexDirection: 'column',
    alignSelf: 'center',
    flexGrow: 0
  },
  // FlatListView: {
  //   justifyContent: 'center',
  //   //backgroundColor:'white',
  //   borderRadius: 4,
  //   margin: 2,
  // },
  ButtonRequest: {
    width: 260,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginTop: 50,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ButtonRequestText: {
    color: '#8b008b',
    textAlign: 'center',
    padding: 7,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  ButtonConfirm: {
    width: 260,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#dc143c',
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonConfirmText: {
    color: '#ffffff',
    textAlign: 'center',
    padding: 7,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  scheduledTimingText: {
    marginTop: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: 'white',
  },
  routeText: {
    marginTop: 5,
    marginBottom: 20,
    alignSelf: 'center',
    flexBasis: '5%',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: 'white',
    fontSize: 20,
  },
  availableTime: {
    marginVertical: 8,
    marginHorizontal: 5,
    width: 110,
    //flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#880E4F',
    backgroundColor: '#FFFFFF',
  },
  unavilableTime: {
    marginVertical: 8,
    marginHorizontal: 5,
    width: 110,
    //flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
  },
  selectedTime: {
    marginVertical: 8,
    marginHorizontal: 5,
    //flex: 1,
    width: 110,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#880E4F',
    backgroundColor: "#880E4F"
  },
  availableTimeText: {
    textAlign: 'center',
    color: '#880E4F',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    padding: 12
  },
  unavailableTimeText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    padding: 12
  },
  selectedTimeText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    padding: 12
  },
  errorText: {
    color: "red",
    alignSelf: 'flex-start',
    paddingLeft: 25
  },

})

export default UnitFerryScheduledTimingsScreen;