import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableHighlight, SafeAreaView, RefreshControl, ScrollView, Modal } from 'react-native';
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import BookingItem from "../../components/bookings/BookingItem";
import CancelAction from "../../components/bookings/CancelAction";
import BookingActions from "../../components/bookings/BookingActions";
import Screens from "../screens";
import Images from "../../images";
import Colors from "../../colors";
import AwsData from "../../shared/AwsData";
import ModalBookingCancelReason from "../../components/bookings/ModalBookingCancelReason";
import ModalBookingRejectReason from "../../components/bookings/ModalBookingRejectReason";
import ModalBookingApprove from "../../components/bookings/ModalBookingApprove"
import { BookingStatus } from '../../models/Booking';
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

function getBookingsBySelectedDay(bookings, dateString) {
  return bookings.filter(booking =>
    booking.departureDate === dateString
  );
}

function getMarkedDates(bookings) {
  const dates = {};

  bookings.forEach(booking => {
    const departureDate = booking.departureDate;
    if (!dates.departureDate) {
      dates[departureDate] = { marked: true };
    }
  });

  return dates;
}

const AdminCalenderScreen = ({ navigation }) => {
  const today = moment(new Date()).format("YYYY-MM-DD");
  const yesterday = moment(new Date()).subtract(1,"days").format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [dateString, setDateString] = useState(moment(today).format("YYYY-MM-DD"));
  const [bookings, setBookings] = useState([]);
  const [bookingsByDay, setBookingsByDay] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelSuccessModalVisible, setCancelSuccessModalVisible] = useState(false);
  const [cancelFailureModalVisible, setCancelFailureModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approveSuccessModalVisible, setApproveSuccessModalVisible] = useState(false);
  const [approveFailureModalVisible, setApproveFailureModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectSuccessModalVisible, setRejectSuccessModalVisible] = useState(false);
  const [rejectFailureModalVisible, setRejectFailureModalVisible] = useState(false);
  const [openRowRefs, setOpenRowRefs] = useState([]);

  const [day, _setDay] = useState(today);
  const [currentBooking, setCurrentBooking] = useState([]);
  const dayRef = useRef(day);
  const setDay = newDay => {
    dayRef.current = newDay;
    _setDay(newDay);
  }

  async function fetchData() {
    setLoading(true);
    let result = await awsData.getAdminBookings("All");
    if (result != undefined) {
      setBookings(result);
      setMarkedDates(getMarkedDates(result));
      setBookingsByDay(getBookingsBySelectedDay(result, today));
      setLoading(false);
    }
  }

  const onFocusScreen = useCallback(event => {
    if (bookings != null) {
      fetchUpdatedData();
    }
  }, []);

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', onFocusScreen);
    return unsubscribe;
  }, [onFocusScreen]);

  async function fetchUpdatedData() {
    setLoading(true);
    let result = await awsData.getAdminBookings("All");
    if (result != undefined) {
      setBookings(result);
      setBookingsByDay(getBookingsBySelectedDay(result, dayRef.current));
      setLoading(false);
    }
  }

  function refresh() {
    console.log('Refresh');
    awsData.adminBookingsAllArray = null;
    fetchUpdatedData();
  }

  function showCancelModal(booking) {
    setCurrentBooking(booking);
    setCancelModalVisible(true);
  };

  function hideCancelModal() {
    setCancelModalVisible(false);
  };

  function showRejectModal(booking) {
    setCurrentBooking(booking);
    setRejectModalVisible(true);
  };

  function hideRejectModal() {
    setRejectModalVisible(false);
  };

  function showApproveModal(booking) {
    setCurrentBooking(booking);
    setApproveModalVisible(true);
  };

  function hideApproveModal() {
    setApproveModalVisible(false);
  };

  function showCancelSuccessModal() {
    setCancelSuccessModalVisible(true);
  };
  function showCancelFailureModal() {
    setCancelFailureModalVisible(true);
  };

  function showApproveSuccessModal() {
    setApproveSuccessModalVisible(true);
  };
  function showApproveFailureModal() {
    setApproveFailureModalVisible(true);
  };

  function showRejectSuccessModal() {
    setRejectSuccessModalVisible(true);
  };
  function showRejectFailureModal() {
    setRejectFailureModalVisible(true);
  };

  function _setLoading(value) {
    setLoading(value);
  }

  function onRowDidOpen(rowKey, rowMap) {
    let array = openRowRefs;
    array.push(rowMap[rowKey]);
    setOpenRowRefs(array);
  }

  function closeAllOpenRows() {
    openRowRefs.forEach(ref => {
      ref.closeRow && ref.closeRow();
    });
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Bookings',
      headerLeft: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', marginLeft: 15 }} onPress={() => navigation.push(Screens.AdminFilter)}>
            <Text style={{ color: 'white', fontSize: 15 }}>Filter</Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { navigation.push(Screens.AdminSearch) }}>
            <Image source={Images.icon_search} style={{ width: 25, height: 25, marginRight: 15, marginTop: 3, tintColor: 'white' }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push(Screens.AdminBookFerry)}>
            <Image source={Images.icon_add} style={{ width: 30, height: 30, marginRight: 15, tintColor: 'white' }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Spinner
        visible={loading}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
      <Calendar
        theme={{
          selectedDayBackgroundColor: 'tomato',
          todayTextColor: 'tomato',
          dotColor: 'tomato',
          arrowColor: 'tomato',
        }}
        current={date}
        onDayPress={day => {
          setDay(day.dateString);
          setDate(new Date(day.dateString));
          setDateString(day.dateString);
          setBookingsByDay(getBookingsBySelectedDay(bookings, day.dateString));
        }}
        markedDates={{
          ...markedDates,
          [dateString]: { selected: true, marked: markedDates[dateString]?.marked }
        }}
      />
      {
        bookingsByDay.length > 0 ?
          <>
            <SwipeListView
              testID="bookingSwipeList"
              onRowDidOpen={(rowKey, rowMap) => onRowDidOpen(rowKey, rowMap)}
              onRefresh={refresh}
              refreshing={refreshing}
              // swipeGestureBegan={onSwipe}
              // swipeGestureEnded={onSwipeEnd}
              closeOnRowBeginSwipe={true}
              closeOnRowOpen
              closeOnRowPress={true}
              closeOnScroll
              data={bookingsByDay}
              keyExtractor={item => item.bookingCode}
              renderItem={
                ({ item }) => {
                  const rightOpenValue = -80;
                  const rightThreshold = -30;
                  return (
                    item.status == BookingStatus.PENDING || item.status == BookingStatus.APPROVED ?
                      item.status == BookingStatus.APPROVED && moment(item.departureDate).isAfter(yesterday) ?
                        <SwipeRow
                          tension={50}
                          recalculateHiddenLayout={true}
                          disableRightSwipe={true}
                          rightOpenValue={rightOpenValue}
                          style={{ marginBottom: 5 }}
                          swipeToOpenPercent={
                            (rightThreshold / rightOpenValue) * 100
                          }
                        >
                          <CancelAction
                            booking={item}
                            onCancel={showCancelModal}
                            closeAllOpenRows={closeAllOpenRows}
                            style={{ width: Math.abs(rightOpenValue) - 5 }}
                          />
                          <TouchableOpacity activeOpacity={1} onPress={() => {
                            navigation.navigate(Screens.AdminBookingData, { booking: item });
                          }}>
                            <BookingItem booking={item} image={"yes"} />
                          </TouchableOpacity>
                        </SwipeRow>
                        :
                        item.status == BookingStatus.PENDING ?
                          <SwipeRow
                            tension={50}
                            recalculateHiddenLayout={true}
                            disableRightSwipe={true}
                            rightOpenValue={rightOpenValue - 90}
                            style={{ marginBottom: 5 }}
                            swipeToOpenPercent={
                              (rightThreshold / rightOpenValue - 90) * 100
                            }
                          >
                            <BookingActions
                              booking={item}
                              onReject={showRejectModal}
                              onApprove={showApproveModal}
                              onApproveSuccess={showApproveSuccessModal}
                              onApproveFailure={showApproveFailureModal}
                              loading={_setLoading}
                              closeAllOpenRows={closeAllOpenRows}
                              style={{ width: Math.abs(rightOpenValue - 90) - 5 }}
                            />
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                              navigation.navigate(Screens.AdminBookingData, { booking: item });
                            }}>
                              <BookingItem booking={item} image={"yes"} />
                            </TouchableOpacity>
                          </SwipeRow>
                          :
                          <TouchableOpacity style={{ marginBottom: 5 }} activeOpacity={1} onPress={() => {
                            navigation.navigate(Screens.AdminBookingData, { booking: item });
                          }}>
                            <BookingItem booking={item} image={"yes"} />
                          </TouchableOpacity>
                      :
                      <TouchableOpacity style={{ marginBottom: 5 }} activeOpacity={1} onPress={() => {
                        navigation.navigate(Screens.AdminBookingData, { booking: item });
                      }}>
                        <BookingItem booking={item} image={"yes"} />
                      </TouchableOpacity>
                  );
                }
              }
            />
            {
              cancelModalVisible &&
              <ModalBookingCancelReason
                booking={currentBooking}
                navigation={navigation}
                onBackdropPress={hideCancelModal}
                onClosePress={hideCancelModal}
                onSubmit={hideCancelModal}
                onCancel={showCancelSuccessModal}
                onFailCancel={showCancelFailureModal}
                loading={_setLoading}
              />
            }
            {
              rejectModalVisible &&
              <ModalBookingRejectReason
                booking={currentBooking}
                navigation={navigation}
                screen={Screens.AdminCalendar}
                onBackdropPress={hideRejectModal}
                onClosePress={hideRejectModal}
                onSubmit={hideRejectModal}
                onReject={showRejectSuccessModal}
                onFailReject={showRejectFailureModal}
                loading={_setLoading}
              />
            }
            {
              approveModalVisible &&
              <ModalBookingApprove
                booking={currentBooking}
                navigation={navigation}
                screen={Screens.AdminCalendar}
                onBackdropPress={hideApproveModal}
                onClosePress={hideApproveModal}
                onApprove={showApproveSuccessModal}
                onFailApprove={showApproveFailureModal}
                loading={_setLoading}
              />
            }
            {/*Cancel Success Modal*/}
            <View>
              <Modal
                animationType='fade'
                transparent={true}
                visible={cancelSuccessModalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={Images.icon_approved} style={styles.iconApproved} />
                    <Text style={styles.modalMessage}>Booking is CANCELLED!</Text>
                    <TouchableHighlight
                      style={styles.confirmTouchable}
                      underlayColor="#e1a706"
                      onPress={() => {
                        setCancelModalVisible(false);
                        setCancelSuccessModalVisible(false)
                        if (AwsData.user.role === "A") {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: Screens.AdminCalendar }]
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
            {/*Cancel Failure Modal*/}
            <View>
              <Modal
                animationType='fade'
                transparent={true}
                visible={cancelFailureModalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                    <Text style={styles.modalMessage}>Unable to cancel booking</Text>
                    <TouchableHighlight
                      style={styles.confirmTouchable}
                      underlayColor="#e1a706"
                      onPress={() => {
                        setCancelModalVisible(false);
                        setCancelFailureModalVisible(false);
                        if (AwsData.user.role === "A") {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: Screens.AdminCalendar }]
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
            {/*Approve Success Modal*/}
            <View>
              <Modal
                animationType='fade'
                transparent={true}
                visible={approveSuccessModalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={Images.icon_approved} style={styles.iconApproved} />
                    <Text style={styles.modalMessage}>Booking is APPROVED!</Text>
                    <TouchableHighlight
                      style={styles.confirmTouchable}
                      underlayColor="#e1a706"
                      onPress={() => {
                        setApproveSuccessModalVisible(false);
                        setApproveModalVisible(false);
                        if (AwsData.user.role === "A") {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: Screens.AdminCalendar }]
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

            {/*Approve Failure Modal*/}
            <View>
              <Modal
                animationType='fade'
                transparent={true}
                visible={approveFailureModalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                    <Text style={styles.modalMessage}>Unable to approve booking</Text>
                    <TouchableHighlight
                      style={styles.confirmTouchable}
                      underlayColor="#e1a706"
                      onPress={() => {
                        setApproveFailureModalVisible(false);
                        setApproveModalVisible(false);
                        if (AwsData.user.role === "A") {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: Screens.AdminCalendar }]
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
            {/*Reject Success Modal*/}
            <View>
              <Modal
                animationType='fade'
                transparent={true}
                visible={rejectSuccessModalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={Images.icon_approved} style={styles.iconApproved} />
                    <Text style={styles.modalMessage}>Booking is REJECTED!</Text>
                    <TouchableHighlight
                      style={styles.confirmTouchable}
                      underlayColor="#e1a706"
                      onPress={() => {
                        setRejectModalVisible(false);
                        setRejectSuccessModalVisible(false);
                        if (AwsData.user.role === "A") {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: Screens.AdminCalendar }]
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
            {/*Reject Failure Modal*/}
            <View>
              <Modal
                animationType='fade'
                transparent={true}
                visible={rejectFailureModalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                    <Text style={styles.modalMessage}>Unable to reject booking</Text>
                    <TouchableHighlight
                      style={styles.confirmTouchable}
                      underlayColor="#e1a706"
                      onPress={() => {
                        setRejectModalVisible(false);
                        setRejectFailureModalVisible(false);
                        if (AwsData.user.role === "A") {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: Screens.AdminCalendar }]
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
          </>
          :
          <SafeAreaView style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
              }
            >
              <Text style={styles.noBookings}>No Bookings</Text>
            </ScrollView>
          </SafeAreaView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ebebeb"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noBookings: {
    fontSize: 17,
    color: Colors.text_secondary
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalMessage: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 40
  },
  spinnerTextStyle: {
    color: '#FFF'
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
});

export default AdminCalenderScreen;