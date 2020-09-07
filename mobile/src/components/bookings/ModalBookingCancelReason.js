import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { CheckBox } from 'react-native-elements';
import { BookingStatus } from "../../models/Booking";
import Screens from '../../screens/screens'
import AwsData from '../../shared/AwsData';
import Images from "../../images";

const awsData = new AwsData();

const ModalBookingCancelReason = (props) => {
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [thisBooking, setThisBooking] = useState(true)
  const [thisFutureBooking, setThisFutureBooking] = useState(false)

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardIsVisible(true)
    );
    const keyboardHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardIsVisible(false)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardIsVisible]);

  function onBackdropPress() {
    if (keyboardIsVisible) {
      Keyboard.dismiss();
    } else {
      props.onBackdropPress();
    }
  }

  function onClosePress() {
    if (keyboardIsVisible) {
      Keyboard.dismiss();
    } else {
      props.onClosePress();
    }
  }

  async function submit() {
    if (reason.trim() == "" || reason.trim().length == 0) {
      setErrorMsg("Please enter a reason");
      return;
    } else {
      props.onClosePress();
      props.loading(true);
      let status;
      if (thisBooking == true) {
        console.log("Cancelling this booking only");
        status = await awsData.cancelAdminBooking(props.booking, reason);
      }
      else if (thisFutureBooking == true) {
        console.log("Cancelling this and future bookings");
        status = await awsData.cancelUnitRecurringBooking(props.booking, reason);
      }

      if (status === "Success") {
        if (thisBooking == true) {
          var index = awsData.adminBookingsAllArray.findIndex(booking => booking.bookingCode === props.booking.bookingCode);
          awsData.adminBookingsAllArray[index].status = BookingStatus.CANCELLED;
          awsData.adminBookingsAllArray[index].cancellationReason = reason;
        } else if (thisFutureBooking == true) {
          awsData.adminBookingsAllArray = null;
        }
        props.loading(false);
        props.onCancel();
      } else {
        props.loading(false);
        props.onFailCancel();
      }
    }
  }

  function setText(text) {
    setReason(text);
    if (errorMsg != "") {
      setErrorMsg("");
    }
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={true}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : null}>
        <TouchableWithoutFeedback touchSoundDisabled={true} onPress={onBackdropPress}>
          <View style={styles.screen}>
            <TouchableWithoutFeedback touchSoundDisabled={true} onPress={Keyboard.dismiss}>
              <View style={styles.modal}>
                <View style={styles.title}>
                  <FontAwesome
                    name="trash-o"
                    size={23}
                    color="tomato"
                    style={styles.titleIcon}
                  />
                  <Text style={styles.titleText}>Cancel</Text>
                </View>
                <View style={styles.closeContainer}>
                  <TouchableOpacity
                    onPress={onClosePress}
                    hitSlop={{
                      top: 15,
                      bottom: 10,
                      left: 15,
                      right: 10
                    }}
                  >
                    <Image
                      source={Images.icon_close}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.mainContainer}>
                  <View style={styles.textInputContainer}>
                    <Text style={styles.rejectOrderText}>Cancel the booking?</Text>
                    <TextInput
                      placeholder="Add reasons"
                      value={reason}
                      onChangeText={text => setText(text)}
                      multiline={true}
                      style={styles.textInput}
                    />
                    {
                      errorMsg != "" ?
                        <Text style={{ color: 'red', fontSize: 13, padding: 4 }}>{errorMsg}</Text>
                        :
                        <></>
                    }
                  </View>
                  {
                    props.booking.bookingGroup !== "" && props.booking.bookingGroup != null ?
                      <>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', marginBottom: 15, flexGrow: 0.30, marginTop: 5, }}>

                          <View style={{ flexDirection: "row" }}>
                            <CheckBox
                              containerStyle={styles.checkbox}
                              title='This booking only'
                              checked={thisBooking}
                              onPress={() => {
                                setThisBooking(!thisBooking);
                                if (thisFutureBooking == true) {
                                  setThisFutureBooking(!thisFutureBooking);
                                }
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
                                if (thisBooking == true) {
                                  setThisBooking(!thisBooking);
                                }
                                setThisFutureBooking(!thisFutureBooking);
                              }}
                              checkedColor="red"
                              textStyle={{ fontSize: 12 }}
                              size={20}
                            />
                          </View>
                        </View>
                      </>
                      :
                      <>
                      </>
                  }
                </View>

                <TouchableHighlight
                  style={styles.submitTouchable}
                  underlayColor="#00a1b9"
                  onPress={submit}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableHighlight>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .5)"
  },
  modal: {
    width: "100%",
    height: "70%",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 40,
    borderTopStartRadius: 7,
    borderTopEndRadius: 7,
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  titleIcon: {
    marginRight: 3
  },
  titleText: {
    fontWeight: "600",
    fontFamily: 'Roboto',
    color: "tomato"
  },
  closeContainer: {
    position: "absolute",
    padding: 15
  },
  closeIcon: {
    width: 19,
    height: 19,
    tintColor: "#000"
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  rejectOrderText: {
    marginLeft: 5,
    marginBottom: 10
  },
  textInputContainer: {
    flex: 1,
  },
  textInput: {
    height: 50,
    flexGrow: 0.9,
    paddingLeft: 15,
    paddingTop: Platform.OS ? 10 : 0,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    backgroundColor: "#fff",
  },
  submitTouchable: {
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    padding: 13,
    borderRadius: 4,
    backgroundColor: "#00bbd3",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Roboto',
  },
});

export default ModalBookingCancelReason;
