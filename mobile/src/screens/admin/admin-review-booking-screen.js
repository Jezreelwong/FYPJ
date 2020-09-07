import React, { useEffect } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, TextInput, Modal, Image } from "react-native";
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import ModalPicker from "../../components/ModalPicker";
import NavigationInput from "../../components/NavigationInput";
import Input from "../../components/Input";
import SelectedVehicleItem from "../../components/vehicles/SelectedVehicleItem";
import ServiceProviderType from "../../shared/enums/ServiceProviderType";
import Booking, { BookingStatus } from '../../models/Booking';
import AwsData from "../../shared/AwsData";
import Screens from '../screens';
import moment from "moment";
import ModalAdHocWarning from "../../components/bookings/ModalAdHocWarning";
import Spinner from 'react-native-loading-spinner-overlay';
import Images from '../../images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const awsData = new AwsData();

const ReviewBookingScreen = ({ navigation, route }) => {
  const {
    serviceProviderType,
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
    bookingType,
    scheduleId,
    recurringBooking,
    endDateText,
    weekday
  } = route.params;

  const [remarksText, onChangeText] = React.useState('');
  const [pendingMsgModal, setPendingMsgModal] = React.useState(false)
  const [approvedMsgModal, setApprovedMsgModal] = React.useState(false)
  const [rejectedMsgModal, setRejectedMsgModal] = React.useState(false)
  const [adHocWarningModal, setAdHocWarningModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errorDisplay, setErrorDisplay] = React.useState("")
  const [bookingTypeLocal, setBookingTypeLocal] = React.useState("")

  // Function that calls API to check if its Ad-Hoc
  // (Could be changed if dont want to use API call, using moment time difference < 48 hours)
  async function isAdHoc() {
    setLoading(true)
    let checkBookingResult = await awsData.checkBooking(moment(dateText).format("YYYY-MM-DD"), timeText, serviceProviderType)
    setBookingTypeLocal(checkBookingResult)
    if (checkBookingResult === "Ad-Hoc") {
      setLoading(false)
      setAdHocWarningModal(true)
    } else {
      book();
    }
  };

  useEffect(() => {
    console.disableYellowBox = true;
  }, []);

  function validateRemarks() {
    let error = false;
    let errorMsg = "";
    let totalVehicleQuantity = 0;
    for (let i = 0; i < selectedVehicles.length; i++) {
      totalVehicleQuantity = totalVehicleQuantity + selectedVehicles[i].quantity
    }

    var remarksArray = remarksText.split(",")
    if (remarksText === '' && totalVehicleQuantity > 0) {
      errorMsg = "Please enter " + totalVehicleQuantity + " vehicle plate(s)";
      error = true;
    } else if (remarksArray.length < totalVehicleQuantity) {
      errorMsg = "Missing vehicle plates (" + totalVehicleQuantity + " needed)";
      error = true;
    } else if (remarksArray.length > totalVehicleQuantity && totalVehicleQuantity != 0) {
      errorMsg = "Too many vehicle plates (" + totalVehicleQuantity + " needed)";
      error = true;
    }

    return [error, errorMsg]
  }

  async function book() {
    setLoading(true)
    let booking = new Booking(
      dateText,
      timeText,
      routeId,
      purposeId,
      bookingUnitText,
      serviceProviderType,
      passengerCountText,
      selectedVehicles,
      bookingType,
      scheduleId,
    );
    booking.totalLoad = totalLoad;
    booking.remarks = remarksText;
    booking.purposeShort = purposeText;
    booking.routeName = routeText;

    if (scheduleId == undefined) {
      booking.scheduleId = "";
    }

    if (AwsData.user.role === "PU" || AwsData.user.role === "U") {
      booking.bookingType = bookingTypeLocal;
    } else {
      let checkBookingResult = await awsData.checkBooking(moment(dateText).format("YYYY-MM-DD"), timeText, serviceProviderType)
      booking.bookingType = checkBookingResult;
    }

    let status;
    if (recurringBooking === "Recurring") {
      status = await awsData.confirmRecurringBooking(booking, endDateText, weekday);
    } else {
      status = await awsData.confirmBooking(booking);
    }

    // If approved, shows approved modal. If pending, shows pending modal
    // Add another use case for "Failed"??
    if (status == BookingStatus.APPROVED) {
      setLoading(false)
      setApprovedMsgModal(true)
    } else if (status == BookingStatus.PENDING) {
      setLoading(false)
      setPendingMsgModal(true)
    } else {
      setLoading(false)
      setRejectedMsgModal(true)
    }

  }

  return (
    <>
      <Spinner
        visible={loading}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
      <KeyboardAwareScrollView style={styles.screen} extraHeight={100} testID="scrollView">

          <Text style={styles.reviewText}>Please review your booking:</Text>
          {
            recurringBooking === "Recurring" ?
              <>
                <DatePicker
                  value={"Start: " + dateText}
                  disabled={true}
                />

                <DatePicker
                  value={"End: " + endDateText}
                  disabled={true}
                />
              </>
              :
              <>
                <DatePicker
                  value={dateText}
                  disabled={true}
                />
              </>
          }
          <TimePicker
            value={timeText}
            disabled={true}
          />
          <ModalPicker
            leftIcon={{ type: "entypo", name: "location" }}
            value={routeText}
            disabled={true}
          />
          <ModalPicker
            leftIcon={{ type: "feather", name: "edit" }}
            value={purposeText}
            disabled={true}
          />
          <ModalPicker
            leftIcon={{ type: "font-awesome", name: "user-circle-o" }}
            value={bookingUnitText}
            disabled={true}
          />
          {
            serviceProviderType === ServiceProviderType.PASSENGER ?
              [
                recurringBooking === "Recurring" ?
                  <>
                    <Input
                      leftIcon={{ type: "material-community", name: "human-male-male" }}
                      value={passengerCountText}
                      editable={false}
                      disabled={true}
                    />
                    <NavigationInput
                      leftIcon={{ type: "feather", name: "repeat" }}
                      value="Recurrence"
                    />
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
                    <Input
                      leftIcon={{ type: "material-community", name: "human-male-male" }}
                      value={passengerCountText}
                      editable={false}
                      disabled={true}
                    />
                  </>
              ]
              :
              [
                recurringBooking === "Recurring" ?
                  <>
                    <NavigationInput
                      leftIcon={{ type: "feather", name: "repeat" }}
                      value="Recurrence"
                    />
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
                    <NavigationInput
                      leftIcon={{ type: "ionicon", name: "ios-car" }}
                      value="Selected Vehicles"
                    />
                    {
                      selectedVehicles.map(vehicle => (
                        <SelectedVehicleItem
                          key={vehicle.id}
                          vehicle={vehicle}
                        />
                      ))
                    }
                    <Text style={styles.remarksBigText}>Remarks:</Text>
                    <Text style={styles.remarksSmallText}>
                      <Text>
                        Please enter vehicle plate numbers, separated by a comma (,)
              </Text>
                    </Text>
                    {
                      errorDisplay !== "" &&
                      <Text style={styles.errorText}>{errorDisplay}</Text>
                    }
                    <TextInput
                      testID="remarksInput"
                      style={styles.comment}
                      value={remarksText}
                      onChangeText={text => {
                        onChangeText(text);
                        setErrorDisplay("")
                      }}
                      placeholder="Enter vehicle plates"
                      multiline
                    />
                  </>
                  :
                  <>
                    <NavigationInput
                      leftIcon={{ type: "ionicon", name: "ios-car" }}
                      value="Selected Vehicles"
                    />
                    {
                      selectedVehicles.map(vehicle => (
                        <SelectedVehicleItem
                          key={vehicle.id}
                          vehicle={vehicle}
                        />
                      ))
                    }
                    <Text style={styles.remarksBigText}>Remarks:</Text>
                    <Text style={styles.remarksSmallText}>
                      <Text>
                        Please enter vehicle plate numbers, separated by a comma (,)
              </Text>
                    </Text>
                    {
                      errorDisplay !== "" &&
                      <Text style={styles.errorText}>{errorDisplay}</Text>
                    }
                    <TextInput
                      testID="remarksInput"
                      style={styles.comment}
                      value={remarksText}
                      onChangeText={text => {
                        onChangeText(text);
                        setErrorDisplay("")
                      }}
                      placeholder="Enter vehicle plates"
                      multiline
                    />
                  </>
              ]
          }
      </KeyboardAwareScrollView>
      <View style={styles.confirmTouchableContainer}>
        <TouchableHighlight
          style={styles.confirmTouchable}
          underlayColor="#e1a706"
          onPress={async () => {
            const [error, errorMsg] = validateRemarks();
            if (error) {
              setErrorDisplay(errorMsg)
              return;
            }

            if (AwsData.user.role === "PU" || AwsData.user.role === "U") {
              isAdHoc()
            } else {
              book()
            }
          }}
        >
          {
            recurringBooking === "Recurring" ?
              <>
                <Text testID="confirmButton" style={styles.confirmText}>Confirm Recurring Booking</Text>
              </>
              :
              <>
                <Text testID="confirmButton" style={styles.confirmText}>Confirm Booking</Text>
              </>
          }
        </TouchableHighlight>
      </View>

      {/* Pending Booking Modal */}
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={pendingMsgModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={Images.icon_pending} style={styles.iconPending} />
              <Text style={styles.modalMessage} >Booking is PENDING for approval</Text>
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setPendingMsgModal(false);
                  if (AwsData.user.role === "PU" || AwsData.user.role === "U") {
                    navigation.popToTop();
                  } else if (AwsData.user.role === "A") {
                    navigation.popToTop();
                  } else if (AwsData.user.role === "DP") {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: Screens.DutyPersonnelBookings }]
                    });
                  } else {
                    navigation.popToTop();
                  }
                }}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

      {/* Approved Booking Modal */}
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={approvedMsgModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={Images.icon_approved} style={styles.iconApproved} />
              <Text style={styles.modalMessage} >Booking is APPROVED!</Text>
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setApprovedMsgModal(false);
                  if (AwsData.user.role === "PU" || AwsData.user.role === "U") {
                    navigation.popToTop();
                  } else if (AwsData.user.role === "A") {
                    navigation.popToTop();
                  } else if (AwsData.user.role === "DP") {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: Screens.DutyPersonnelBookings }]
                    });
                  } else {
                    navigation.popToTop();
                  }
                }}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

      {/* Rejected Booking Modal */}
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={rejectedMsgModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={Images.icon_cancelled} style={styles.iconRejected} />
              <Text style={styles.modalMessage} >Unable to make booking</Text>
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setRejectedMsgModal(false);
                }}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

      <ModalAdHocWarning
        visible={adHocWarningModal}
        onPress={() => setAdHocWarningModal(false)}
        onContinue={() => {
          setAdHocWarningModal(false);
          book();
        }}
      />

    </>
  );
};

export default ReviewBookingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff"
  },
  confirmTouchableContainer: {
    paddingHorizontal: 30,
    paddingBottom: 10,
    backgroundColor: "#fff"
  },
  confirmTouchable: {
    padding: 11,
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#ffc106",
    marginTop: 10,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: 'Roboto',
  },
  comment:
  {
    height: 180,
    width: 350,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  modalView: {
    marginLeft: 80,
    marginRight: 80,
    backgroundColor: "white",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.55,
    shadowRadius: 10.84,
    elevation: 10,
    width: '90%'
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
  remarksSmallText: {
    marginHorizontal: 50,
    textAlign: "center",
    color: "gray"
  },
  remarksBigText: {
    fontSize: 18,
    marginLeft: 30,
    marginTop: 10
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  iconPending: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10,
    height: 60,
    width: 60,
  },
  iconApproved: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10,
    height: 60,
    width: 60,
  },
  iconRejected: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10,
    height: 60,
    width: 60,
  },
  modalMessage: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 40
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: 'Roboto',
  },
  reviewText: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  },
  errorText: {
    color: "red",
    paddingLeft: "8%",
    marginBottom: -10
  },
});
