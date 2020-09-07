import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Images from "../../images"


const CODE_BACKGROUND_COLOR = {
  "OOS": "#262e83",
  "Ad-Hoc": "#e72014"
};

const CODE_COLOR = {
  "Fixed": "black",
  "OOS": "white",
  "Ad-Hoc": "white"
};
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

const icon = {
  "PASSENGER": Images.ferry_icon_passenger,
  "RPL": Images.ferry_icon_rpl
};

const BookingItem = ({ booking, image }) => {
  return (
    <View style={styles.item}>
      <View style={styles.leftCol}>
        <View style={styles.row1}>
          <Text>From </Text>
          <Text style={styles.value}>{booking.routeName}</Text>
          {
            image == "yes" ?
              booking.serviceProviderType == "P" ?
                <Image source={icon["PASSENGER"]} resizeMode="contain" style={styles.serviceProviderIcon} />
                :
                <Image source={icon["RPL"]} resizeMode="contain" style={styles.serviceProviderIcon} />
              :
              <></>
          }
          {
            booking.bookingGroup != null && booking.bookingGroup != "" ?
              <Image source={Images.icon_recurring_booking} resizeMode="contain" style={styles.serviceProviderIcon} />
              :
              <></>
          }
        </View>
        <Text style={styles.row}>
          <Text>Booked By </Text>
          <Text style={styles.value}>{booking.displayUserName}</Text>
        </Text>
        <Text style={styles.row}>
          <Text>Purpose </Text>
          <Text style={styles.value}>{booking.purposeShort}</Text>
        </Text>
      </View>
      <View style={styles.rightCol}>
        <View style={[styles.codeContainer, { backgroundColor: CODE_BACKGROUND_COLOR[booking.bookingType] }]}>
          <Text style={[styles.value, styles.code, { color: CODE_COLOR[booking.bookingType] }]}>{booking.bookingCode}</Text>
        </View>
        <Text style={styles.row}>
          <Text>Time </Text>
          <Text style={styles.value}>{booking.departureTime}</Text>
        </Text>
        <View style={[styles.statusContainer, { backgroundColor: STATUS_BACKGROUND_COLOR[booking.status] }]}>
          <Text style={[styles.value, { color: STATUS_COLOR[booking.status] }]}>{booking.status}</Text>
        </View>
      </View>
    </View>
  );
};

export default BookingItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 3,
    alignSelf: "center",
    backgroundColor: "white"

  },
  serviceProviderIcon: {
    width: 20,
    height: 17,
    marginLeft: 5
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 7,
    paddingVertical: 5
  },
  leftCol: {
    width: "64%"
  },
  rightCol: {
    width: "37%",
    alignItems: "center"
  },
  row1: {
    marginTop: 5,
    flexDirection: "row",
    width: 60,
    height: 23
  },
  row: {
    paddingVertical: 5,
  },
  value: {
    fontWeight: "bold",
    paddingRight: 10
  },
  code: {
    color: "#fff"
  },
  codeContainer: {
    paddingHorizontal: 20,
    borderRadius: 3,
    paddingVertical: 2,
    marginVertical: 3,
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 3,
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto',
  },
});
