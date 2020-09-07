import React, { Component, useState } from 'react';
import { KeyboardAvoidingView, Modal, Alert, Text, View, StyleSheet, SafeAreaView, Image, ImageBackground, TouchableOpacity, TextInput, TouchableHighlight, ScrollView, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Divider, CheckBox } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screens from '../screens';
import Images from '../../images'
import moment from 'moment';
import { BookingStatus, BookingTypes, ServiceProviderTypes } from '../../models/Booking';
import AwsData from '../../shared/AwsData';
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Spinner from 'react-native-loading-spinner-overlay';
import { set } from 'react-native-reanimated';

moment.locale("en-SG");
const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  SafeAreaView:
  {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  Title:
  {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  h2:
  {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '300',
    fontFamily: 'Roboto',
  },

  QRCodepic:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderColor: 'black',
    borderRadius: 2,
    height: 270,
    width: 270,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 20,
  },

  QRCode:
  {
    fontSize: 25,
    color: 'white',
    marginLeft: 15,
    marginTop: 10,
  },
  topContainer:
  {
    height: 310,
  },
  itemContainer:
  {
    width: "95%",
    flexDirection: "row",
    padding: 20,
    paddingBottom: 10,
    paddingTop: 10,
    alignSelf: "center",
  },
  itemContainer2:
  {
    width: "95%",
    padding: 20,
    paddingBottom: 10,
    paddingTop: 0,
    alignSelf: "center",
  },

  leftCol:
  {
    width: "50%"
  },

  rightCol:
  {
    width: "50%",
    alignItems: "flex-start",
  },
  singleCol: {
    width: "100%"
  },
  DividerTopstyle:
  {
    width: 350,
    marginLeft: 22,
    borderColor: 'red',
    borderWidth: 1
  },
  DividerBottomstyle:
  {
    width: 350,
    marginLeft: 22,
    borderColor: 'red',
    borderWidth: 1

  },
  DetailsColorBold:
  {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  DetailsColor:
  {
    color: 'white',
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    width: '100%',
    paddingBottom: 10
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: 300,
    marginBottom: 35
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    fontFamily: 'Roboto',
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    width: 280,
  },
  IconsLeft:
  {
    height: 60,
    width: 80,
    fontSize: 60,
    color: 'black',
    marginRight: 300,
  },
  comment:
  {
    height: 100,
    width: 350,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10
  },
  warning: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  warningIcon: {
    alignItems: "center",
    justifyContent: "center"
  },
  warningBigText: {
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: 'Roboto'
  },
  warningText: {
    fontSize: 15,
    alignSelf: "center"
  },
  checkbox: {
    backgroundColor: "#fff",
    marginTop: 15,
  },
  errorText: {
    color: "red",
    alignSelf: 'flex-start',
    paddingLeft: 40
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
    fontFamily: 'Roboto'
  },

});

const awsData = new AwsData();
let reasonHolder;

async function cancelBooking(bookings, cancellationReason, cancelGroup, navigation) {
  reasonHolder = cancellationReason;

  if (cancelGroup == true) {
    let response = await awsData.cancelUnitRecurringBooking(bookings, cancellationReason)
    return response
  } else {
    let response = await awsData.cancelUnitBooking(bookings, cancellationReason);
    return response
  }
}


const BookingCode = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [cancelSuccessModal, setCancelSuccessModal] = useState(false)
  const [cancelFailModal, setCancelFailModal] = useState(false)
  const bookings = route.params.booking
  const [cancellationReason, onChangeText] = React.useState("");
  const [thisBooking, setThisBooking] = React.useState(true)
  const [thisFutureBooking, setThisFutureBooking] = React.useState(false)
  const [errorText, setErrorText] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  navigation.setOptions({
    headerRight: () => (
      <View />
    )
  })


  return (
    <ImageBackground source={Images.unit_background_scancode}
      style={styles.BackgroundImage}>
      <Spinner
        visible={loading}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
      <SafeAreaView style={styles.SafeAreaView}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {
            bookings.status === BookingStatus.APPROVED ?
              <>
                <Text style={styles.Title}>Present QR Code</Text>
                <Text style={styles.h2}>for Service Provider to scan</Text>
                <View style={styles.QRCodepic}>
                  <QRCode size={230}
                    level="Q"
                    value={bookings.bookingCode}
                  />
                </View>
              </>
              :
              <>
                <View style={styles.topContainer}>
                </View>
              </>
          }

          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            {
              bookings.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                <>
                  <Image source={Images.ferry_icon_passenger}
                    style={{ height: 25, width: 25, resizeMode: 'stretch', marginTop: 15, tintColor: 'white' }} />
                </>
                :
                <>
                  <Image source={Images.ferry_icon_rpl}
                    style={{ height: 25, width: 25, resizeMode: 'stretch', marginTop: 15, tintColor: 'white' }} />
                </>
            }
            <Text style={styles.QRCode}>{bookings.bookingCode}</Text>
          </View>
          <Text style={{ marginLeft: 250, marginBottom: 5, color: 'white' }} onPress={() => navigation.navigate(Screens.UnitFerryGuidelines, { ServiceProviderType: bookings.serviceProviderType })}> Ferry Guidelines</Text>
          <Divider style={styles.DividerTopstyle} />

          <View style={styles.itemContainer}>
            <View style={styles.leftCol}>
              <Text>
                <Text style={styles.DetailsColor}>Date</Text>{"  "}
                <Text style={styles.DetailsColorBold}>{moment(new Date(bookings.departureDate)).format("LL")}</Text>
              </Text>
              <Text>
                <Text style={styles.DetailsColor} >Time</Text>{"  "}
                <Text style={styles.DetailsColorBold}>{bookings.departureTime}</Text>
              </Text>
              <Text>
                <Text style={styles.DetailsColor} >Type</Text>{"  "}
                <Text style={styles.DetailsColorBold}>{bookings.bookingType}</Text>
              </Text>

              {
                bookings.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                  <>
                    <Text>
                      <Text style={styles.DetailsColor} >No. of Pax</Text>{"  "}
                      <Text style={styles.DetailsColorBold} >{bookings.numPassenger}</Text>
                    </Text>
                  </>
                  :
                  <>
                    <Text>
                      <Text style={styles.DetailsColor} >Total Load</Text>{"  "}
                      <Text style={styles.DetailsColorBold} >{bookings.totalLoad}</Text>
                    </Text>
                  </>
              }
            </View>
            <View style={styles.rightCol}>
              <Text>
                <Text style={styles.DetailsColor} >Status</Text>{"  "}
                <Text style={styles.DetailsColorBold} >{bookings.status}</Text>
              </Text>
              {
                bookings.status === "Completed" || bookings.status === "Late" ?
                  <Text>
                    <Text style={styles.DetailsColor} >Boarding Time</Text>{"  "}
                    <Text style={styles.DetailsColorBold}>{moment(bookings.onBoardTime).utc().format("HHmm")}</Text>
                  </Text>
                  :
                  <>
                  </>
              }
              {
                bookings.bookingGroup !== "" && bookings.bookingGroup != null ?
                  <>
                    <Text>
                      <Text style={styles.DetailsColor}>Booking Group</Text>{"  "}
                      <Text style={styles.DetailsColorBold}>{bookings.bookingGroup}</Text>
                    </Text>
                  </>
                  :
                  <>
                  </>
              }
              <Text>
                <Text style={styles.DetailsColor} >From</Text>{"  "}
                <Text style={styles.DetailsColorBold} >{bookings.routeName}</Text>
              </Text>
              <Text>
                <Text style={styles.DetailsColor}>Purpose</Text>{"  "}
                <Text style={styles.DetailsColorBold}>{bookings.purposeShort}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.itemContainer2}>
            <View style={styles.singleCol}>
              <Text>
                <Text style={styles.DetailsColor} >Booked By</Text>{"  "}
                <Text style={styles.DetailsColorBold} >{bookings.displayUserName}</Text>
              </Text>
              {
                bookings.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                  <>
                  </>
                  :
                  <>
                    <Text>
                      <Text style={styles.DetailsColor} >Remarks</Text>{"  "}
                      <Text style={styles.DetailsColorBold} >{bookings.remarks}</Text>
                    </Text>
                  </>
              }
              {
                bookings.status === BookingStatus.CANCELLED ?
                  <>
                    <Text>
                      <Text style={styles.DetailsColor} >Cancellation Reason</Text>{"  "}
                      <Text style={styles.DetailsColorBold} >{bookings.cancellationReason}</Text>
                    </Text>
                  </>
                  : bookings.status === BookingStatus.REJECTED ?
                    <>
                      <Text>
                        <Text style={styles.DetailsColor} >Rejected Reason</Text>{"  "}
                        <Text style={styles.DetailsColorBold} >{bookings.rejectedReason}</Text>
                      </Text>
                    </>
                    :
                    <>
                    </>
              }

            </View>
          </View>
          <Divider style={styles.DividerBottomstyle} />
          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
              <KeyboardAvoidingView style={styles.centeredView}
                behavior={Platform.OS === 'ios' ? "padding" : ""}
              >
                <View style={styles.modalView}>
                  <Ionicons style={styles.IconsLeft} name={"ios-close"} onPress={() => { setModalVisible(!modalVisible); }} />
                  {
                    moment(bookings.departureDate + " " + bookings.departureTime, "YYYY-MM-DD hmm").diff(moment(), "hours") < 48 ?
                      <>
                        <View style={styles.warning}>
                          <View style={styles.warningIcon}>
                            <Feather name="triangle" size={60} color="#fe2853" />
                            <FontAwesome name="exclamation" size={30} style={{ top: "33%", position: "absolute" }} />
                          </View>
                          <Text style={styles.warningBigText}>WARNING!</Text>
                        </View>
                        <Text style={styles.modalText}>
                          <Text>
                            Please note that last minute cancellation will incurred a <Text style={{ fontWeight: 'bold', color: 'red' }}>penalty of 20%</Text> of your performance rating.
                </Text>
                        </Text>
                      </>
                      :
                      <>
                        <Text style={styles.Title}>Cancel Booking: </Text>
                      </>
                  }
                  <TextInput style={styles.comment}
                    value={cancellationReason}
                    onChangeText={text => onChangeText(text)}
                    multiline
                    placeholder="Enter Cancellation Reason"
                  />
                  {
                    errorText && cancellationReason === "" &&
                    <>
                      <Text style={styles.errorText}>Please enter a reason</Text>
                    </>
                  }
                  {
                    bookings.bookingGroup !== "" && bookings.bookingGroup != null ?
                      <>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <CheckBox
                            containerStyle={styles.checkbox}
                            title='This booking only'
                            checked={thisBooking}
                            onPress={() => {
                              setThisBooking(!thisBooking);
                              setThisFutureBooking(!thisFutureBooking);
                            }}
                            checkedColor="red"
                            textStyle={{ fontSize: 12 }}
                            size={20}
                          />
                          <CheckBox
                            containerStyle={styles.checkbox}
                            title='This and future bookings'
                            checked={thisFutureBooking}
                            onPress={() => {
                              setThisBooking(!thisBooking);
                              setThisFutureBooking(!thisFutureBooking);
                            }}
                            checkedColor="red"
                            textStyle={{ fontSize: 12 }}
                            size={20}
                          />
                        </View>
                      </>
                      :
                      <>
                      </>
                  }
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "red" }}
                    onPress={async () => {
                      if (cancellationReason === "") {
                        setErrorText(true)
                        return
                      } else {
                      }

                      if (bookings.bookingGroup !== "" && bookings.bookingGroup != null) {
                        if (thisBooking == true) {
                          console.log("Cancel Recurring Booking (Single)")
                          setLoading(true)
                          let response = await cancelBooking(bookings, cancellationReason, false)
                          setLoading(false)
                          if (response === "Success") {
                            setCancelSuccessModal(true)
                            setModalVisible(!modalVisible)
                            navigation.push(Screens.Unit)
                          } else {
                            setCancelFailModal(true)
                          }
                        } else {
                          console.log("Cancel Recurring Booking (Group)")
                          let response = await cancelBooking(bookings, cancellationReason, true)
                          if (response === "Success") {
                            setCancelSuccessModal(true)
                            setModalVisible(!modalVisible)
                            navigation.push(Screens.Unit)
                          } else {
                            setCancelFailModal(true)
                          }
                        }
                      } else {
                        console.log("Cancel Booking")
                        let response = await cancelBooking(bookings, cancellationReason, false)
                        if (response === "Success") {
                          setCancelSuccessModal(true)
                          setModalVisible(!modalVisible)
                          navigation.push(Screens.Unit)
                        } else {
                          setCancelFailModal(true)
                        }
                      }
                    }}
                  >
                    <Text style={styles.textStyle}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
            {
              bookings.status === BookingStatus.APPROVED || bookings.status === BookingStatus.PENDING ?
                <>
                  <Text style={{ textAlign: 'center', marginTop: 10, color: '#dc143c', opacity: 1, fontWeight: 'bold' }} onPress={() => {
                    setModalVisible(true);
                  }} > Cancel booking</Text>
                </>
                :
                <>
                </>
            }
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Cancel Success Modal */}
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={cancelSuccessModal}>
          <View style={styles.centeredView2}>
            <View style={styles.modalView2}>
              {/* <Ionicons style={styles.iconApproved} name={"ios-checkmark-circle-outline"} /> */}
              <Image source={Images.icon_approved} style={styles.iconApproved} />
              <Text style={styles.modalMessage} >Booking is CANCELLED</Text>
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setCancelSuccessModal(false);
                }}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

      {/* Cancel Failed Modal */}
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={cancelFailModal}>
          <View style={styles.centeredView2}>
            <View style={styles.modalView2}>
              {/* <Ionicons style={styles.iconRejected} name={"ios-close-circle-outline"} /> */}
              <Image source={Images.icon_cancelled} style={styles.iconRejected} />
              <Text style={styles.modalMessage} >Unable to cancel booking</Text>
              <TouchableHighlight
                style={styles.confirmTouchable}
                underlayColor="#e1a706"
                onPress={() => {
                  setCancelFailModal(false);
                }}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

    </ImageBackground>


  );
};

export default BookingCode;