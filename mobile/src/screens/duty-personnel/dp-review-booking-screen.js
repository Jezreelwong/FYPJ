import React from 'react';
import { ScrollView, View, Text, TouchableHighlight, Alert, StyleSheet, TextInput, Modal, Image } from "react-native";
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import ModalPicker from "../../components/ModalPicker";
import NavigationInput from "../../components/NavigationInput";
import Input from "../../components/Input";
import SelectedVehicleItem from "../../components/vehicles/SelectedVehicleItem";
import ServiceProviderType from "../../shared/enums/ServiceProviderType";
import Booking, { BookingStatus } from '../../models/Booking';
import AwsData from "../../shared/AwsData";
import moment from "moment";
import Images from '../../images';
import Screens from "../screens";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

const DutyPersonnelReviewBookingScreen = ({ navigation, route }) => {
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
  const [rejectedMsgModal, setRejectedMsgModal] = React.useState(false)
  const [approvedMsgModal, setApprovedMsgModal] = React.useState(false)
  const [errorDisplay, setErrorDisplay] = React.useState("");
  const [loading, setLoading] = React.useState(false);


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
      errorMsg = "Missing vehicle plates in remarks (" + totalVehicleQuantity + " needed)";
      error = true;
    } else if (remarksArray.length > totalVehicleQuantity && totalVehicleQuantity != 0) {
      errorMsg = "Too many vehicle plates (" + totalVehicleQuantity + " needed)";
      error = true;
    }

    return [error, errorMsg]
  }

  async function book() {
    const [error, errorMsg] = validateRemarks();

    if (error) {
      Alert.alert(
        "Alert",
        errorMsg,
        [
          { text: "OK" }
        ]
      )
      return;
    }

    setLoading(true);
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
    booking.bookingUnit = bookingUnitText;

    const today = moment(new Date()).format('YYYY-MM-DD');
    const tomorrow = moment(new Date()).add(1, 'day').format('YYYY-MM-DD');

    const date = moment(dateText).format('YYYY-MM-DD');
    if (date == today || date == tomorrow) {
      booking.bookingType = "Ad-Hoc";
    }

    let status;
    status = await awsData.confirmBooking(booking);

    if (status == BookingStatus.APPROVED) {
      setLoading(false);
      setApprovedMsgModal(true)
    } else {
      setLoading(false);
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
      <ScrollView style={styles.screen}>
        <DatePicker
          value={dateText}
          disabled={true}
        />
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
            <Input
              leftIcon={{ type: "material-community", name: "human-male-male" }}
              value={passengerCountText}
              editable={false}
              disabled={true}
            />
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
              <TextInput style={styles.comment}
                value={remarksText}
                onChangeText={text => {
                  onChangeText(text);
                  setErrorDisplay("")
                }}
                placeholder="Enter vehicle plates"
                multiline
              />
            </>
        }
        {
          recurringBooking === "Recurring" ?
            <>
              <DatePicker
                value={endDateText}
                disabled={true}
              />
              <ModalPicker
                leftIcon={{ type: "feather", name: "edit" }}
                value={weekday}
                disabled={true}
              />
            </>
            :
            <>
            </>
        }
      </ScrollView>
      <View style={styles.confirmTouchableContainer}>
        <TouchableHighlight
          style={styles.confirmTouchable}
          underlayColor="#e1a706"
          onPress={book}
        >
          <>
            <Text style={styles.confirmText}>Confirm Booking</Text>
          </>
        </TouchableHighlight>
      </View>

      {/* Rejected Booking Modal */}
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={rejectedMsgModal}>
          <View style={styles.centeredView2}>
            <View style={styles.modalView2}>
              <Ionicons style={styles.iconRejected} name={"ios-close-circle-outline"} />
              <Text style={styles.modalMessage} >Unable to make booking</Text>
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setRejectedMsgModal(false);
                  navigation.push(Screens.DutyPersonnelBookings)
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
              <Image
                source={Images.unit_booking_approved}
                style={styles.BookingModalPicture}
              />
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setApprovedMsgModal(false);
                  navigation.push(Screens.DutyPersonnelBookings);

                }}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default DutyPersonnelReviewBookingScreen;

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
    marginTop: 5,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: 'Roboto',
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
  iconRejected: {
    color: "red",
    textAlign: "center",
    fontSize: 100,
    padding: 10,
    margin: 20
  },
  modalMessage: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20
  },
  BookingModalPicture:
  {
    width: 400,
    height: 225,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    width: 280,
    color: "gray"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  iconPending: {
    color: "orange",
    textAlign: "center",
    fontSize: 100,
    padding: 10
  },
  iconApproved: {
    color: "green",
    textAlign: "center",
    fontSize: 100,
    padding: 10
  },
  errorText: {
    color: "red",
    alignSelf: 'flex-start',
    paddingLeft: 25,
    marginBottom: -10
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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.55,
    shadowRadius: 10.84,
    elevation: 10
  },
  centeredView2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  modalView2: {
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
});
