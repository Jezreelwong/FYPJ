import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Screens from '../../screens/screens.js';
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

const SPBookingItem = ({ booking, navigation, functionRefresh}) => {
  return (
    <TouchableHighlight
      underlayColor={"white"}
      activeOpacity={0.65}
      onPress={() => {
        console.log(booking);
        let feedback = true;
        if (booking.SPFFeedback != undefined) feedback = false;
        navigation.navigate(Screens.ServiceProviderBookingData, {
          booking: booking,
          feedback,
          functionRefresh,
        });
      }}
    >
      <View style={styles.item}>
        <View style={styles.leftCol}>
          <View style={styles.row1}>
            <Text>From </Text>
            <Text style={styles.value}>{booking.routeName}</Text>
            {booking.bookingGroup != null && booking.bookingGroup != "" ? (
              <Image
                source={Images.icon_recurring_booking}
                resizeMode="contain"
                style={styles.serviceProviderIcon}
              />
            ) : (
              <></>
            )}
          </View>
          <Text style={styles.row}>
            <Text>Booked By </Text>
            <Text style={styles.value}>{booking.bookingUnit}</Text>
          </Text>
          <Text style={styles.row}>
            <Text>Purpose </Text>
            <Text style={styles.value}>{booking.purposeShort}</Text>
          </Text>
        </View>
        <View style={styles.rightCol}>
          <View
            style={[
              styles.codeContainer,
              { backgroundColor: CODE_BACKGROUND_COLOR[booking.bookingType] },
            ]}
          >
            <Text
              style={[
                styles.value,
                styles.code,
                { color: CODE_COLOR[booking.bookingType] },
              ]}
            >
              {booking.bookingCode}
            </Text>
          </View>
          <Text style={styles.row}>
            <Text>Time </Text>
            <Text style={styles.value}>{booking.departureTime}</Text>
          </Text>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: STATUS_BACKGROUND_COLOR[booking.status] },
            ]}
          >
            <Text
              style={[styles.value, { color: STATUS_COLOR[booking.status] }]}
            >
              {booking.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default SPBookingItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 3,
    alignSelf: "center",
    backgroundColor: "white"
  },
  leftCol: {
    width: "60%"
  },
  rightCol: {
    width: "40%",
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
    fontFamily: 'Roboto',
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
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 3,
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto',
  },
  serviceProviderIcon: {
    width: 20,
    height: 17,
    marginLeft: 5
  }
});
