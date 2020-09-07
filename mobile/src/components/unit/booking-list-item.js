import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import Screens from '../../screens/screens';
import Images from "../../images"

const UnitBookingListItem = ({ booking, navigation }) => {

  return (
    <TouchableOpacity onPress={() => {
      const today = moment(new Date()).format('YYYY-MM-DD');
      if (booking.departureDate < today) {
        navigation.navigate(Screens.UnitServiceRating, {
          route: booking.routeName,
          Purpose: booking.purposeShort,
          Id: booking.bookingCode,
          Time: booking.departureTime,
          Pax: booking.numPassenger,
          Date: booking.departureDate,
          By: booking.displayUserName,
          Feedback: booking.SAFFeedback,
          Issue: booking.BookingIssue,
          Status: booking.status,
          cancelReason: booking.cancellationReason,
          rejectReason: booking.rejectedReason,
          totalLoad: booking.totalLoad,
          serviceProviderType: booking.serviceProviderType,
          remarks: booking.remarks,
          bookingType: booking.bookingType,
          onBoardTime: booking.onBoardTime,
          bookingGroup: booking.bookingGroup
        })
      }
      else if (booking.departureDate == today && (booking.status === "Completed" || booking.status === "Late" || booking.status === "Cancelled" || booking.status === "Rejected")) {
        navigation.navigate(Screens.UnitServiceRating, {
          route: booking.routeName,
          Purpose: booking.purposeShort,
          Id: booking.bookingCode,
          Time: booking.departureTime,
          Pax: booking.numPassenger,
          Date: booking.departureDate,
          By: booking.displayUserName,
          Feedback: booking.SAFFeedback,
          Issue: booking.BookingIssue,
          Status: booking.status,
          cancelReason: booking.cancellationReason,
          rejectReason: booking.rejectedReason,
          totalLoad: booking.totalLoad,
          serviceProviderType: booking.serviceProviderType,
          remarks: booking.remarks,
          bookingType: booking.bookingType,
          onBoardTime: booking.onBoardTime,
          bookingGroup: booking.bookingGroup
        })
      } else {
        navigation.navigate(Screens.UnitBookingCode, { booking })
      }
    }}>
      <View style={styles.itemContainer}>
        <View style={styles.leftCol}>
          <View style={styles.row1}>
            <Text>From </Text>
            <Text style={styles.value}>{booking.routeName}</Text>
            {
              booking.bookingGroup != null && booking.bookingGroup != "" ?
                <Image source={Images.icon_recurring_booking} resizeMode="contain" style={styles.recurringIcon} />
                :
                <></>
            }
          </View>
          <Text style={styles.row}>
            <Text>Time </Text>
            <Text style={styles.value}>
              {booking.departureTime}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text>Purpose </Text>
            <Text style={styles.value}>{booking.purposeShort}</Text>
          </Text>
        </View>
        <View style={styles.rightCol}>
          <View style={[styles.codeContainer, styles.row]}>
            <Text style={styles.value}>{booking.bookingCode}</Text>
          </View>
          <Text style={styles.row}>
            <Text>Gate Open </Text>
            <Text style={styles.value}>
              {moment(booking.departureTime, "HHmm")
                .subtract({ 'minutes': 30 })
                .format("HHmm")}
            </Text>
          </Text>
          <View style={[styles.statusContainer, { backgroundColor: STATUS_BACKGROUND_COLOR[booking.status] }]}>
            <Text style={[styles.value, { color: STATUS_COLOR[booking.status] }]}>{booking.status}</Text>
          </View>

        </View>
      </View>

    </TouchableOpacity>
  )
}

const STATUS_BACKGROUND_COLOR = {
  "Pending": "#ffdbad",
  "Rejected": "#ffc5cc",
  "Approved": "#bbe3c4"
};

const STATUS_COLOR = {
  "Pending": "#f3582d",
  "Rejected": "#bf1d28",
  "Approved": "#116132"
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "95%",
    flexDirection: "row",
    marginBottom: 5,
    padding: 20,
    alignSelf: "center",
    backgroundColor: "white",
  },
  leftCol: {
    width: "50%"
  },
  rightCol: {
    width: "50%",
    alignItems: 'center',
    marginLeft: 27
  },
  row1: {
    flexDirection: "row",
    paddingVertical: 5
  },
  row: {
    paddingVertical: 5,
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto',
  },
  codeContainer: {
    paddingHorizontal: 30,
  },
  statusContainer: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 3,
  },
  recurringIcon: {
    width: 20,
    height: 17,
    marginLeft: 5
  },
})

export default UnitBookingListItem;