import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AwsData from "../../shared/AwsData";
import { BookingStatus, BookingTypes } from '../../models/Booking';

const awsData = new AwsData();

const BookingActions = ({
  booking,
  onReject,
  onApprove,
  onApproveSuccess,
  onApproveFailure,
  loading,
  closeAllOpenRows,
  style
}) => {

  async function approveBooking() {
    { onApprove(booking) }
  }

  return (
    <View style={[
      styles.actionsContainer,
      style
    ]}>
      <TouchableHighlight
        testID="approveButton"
        style={[styles.action, styles.accept]}
        underlayColor="#00c752"
        onPress={async () => {
          if (booking.bookingGroup != null && booking.bookingGroup != "") {
            { closeAllOpenRows() }
            { approveBooking() };
          } else {
            { loading(true) };
            console.log("Approving this booking only");
            const status = await awsData.approveBooking(booking);
            if (status) {
              var index = awsData.adminBookingsAllArray.findIndex(bookingData => bookingData.bookingCode === booking.bookingCode);
              awsData.adminBookingsAllArray[index].status = BookingStatus.APPROVED;

              var index = awsData.adminBookingsPendingAllArray.findIndex(bookingData => bookingData.bookingCode === booking.bookingCode);
              awsData.adminBookingsPendingAllArray.splice(index, 1);

              if (booking.bookingType === BookingTypes.ADHOC) {
                var index = awsData.adminBookingsPendingAdHocArray.findIndex(bookingData => bookingData.bookingCode === booking.bookingCode);
                awsData.adminBookingsPendingAdHocArray.splice(index, 1);
              } else if (booking.bookingType === BookingTypes.OOS) {
                var index = awsData.adminBookingsPendingOOSArray.findIndex(bookingData => bookingData.bookingCode === booking.bookingCode);
                awsData.adminBookingsPendingOOSArray.splice(index, 1);
              } else if (booking.bookingType === BookingTypes.FIXED) {
                var index = awsData.adminBookingsPendingFixedArray.findIndex(bookingData => bookingData.bookingCode === booking.bookingCode);
                awsData.adminBookingsPendingFixedArray.splice(index, 1);
              }
              { loading(false) };
              { onApproveSuccess() };
            } else {
              { loading(false) };
              { onApproveFailure() }
            }
          }
        }
        }
      >
        <FontAwesome name="check" size={30} color="#fff" />
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.action, styles.reject]}
        underlayColor="#f44336"
        onPress={() => {
          { closeAllOpenRows() }
          { onReject(booking) }
        }}>
        <FontAwesome name="close" size={30} color="#fff" />
      </TouchableHighlight>
    </View>
  );
};

export default BookingActions;

const styles = StyleSheet.create({
  actionsContainer: {
    height: "100%",
    flexDirection: "row",
    position: "absolute",
    right: 10,
    borderRadius: 3,
    overflow: "hidden"
  },
  action: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  accept: {
    backgroundColor: "#00c752"
  },
  reject: {
    backgroundColor: "#f44336"
  }
});
