import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Screens from '../screens/screens';

const STATUS_COLOR = {
  "REQUESTED": "#f08e16",
  "ACCEPTED": "#24c945",
  "REJECTED": "#db2727",
  "APPROVED": "#24c945",
  "CANCELLED": "#db2727",
  "PENDING": "#f08e16"
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
    width: "60%"
  },
  rightCol: {
    width: "40%",
    alignItems: 'flex-start',
    marginLeft: 40
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto',
  },
  code: {
    color: "#fff",
    opacity: 1,
  },
  codeContainer: {
    paddingHorizontal: 12,
    borderRadius: 3,
    opacity: 0.2,
  }
})

const Homebookingitem = ({ booking, navigation }) => {

  return (

    <TouchableOpacity onPress={() => {

      navigation.navigate(Screens.UnitServiceRating, {
        route: booking.From, Purpose: booking.Purpose, Id: booking.BookingCode,
        Time: booking.OnBoardTime, Pax: booking.numPassenger, Date: booking.BookingDate, By: booking.BookedBy
      })
    }}>
      <View style={styles.itemContainer}>
        <View style={styles.leftCol}>
          <Text>
            <Text>From </Text>
            <Text>{booking.From}</Text>
          </Text>
          <Text>
            <Text>Time </Text>
            <Text>{moment(new Date(booking.BookingDate)).format("HHmm")}</Text>
          </Text>
          <Text>
            <Text>Purpose </Text>
            <Text>{booking.Purpose}</Text>
          </Text>
        </View>
        <View style={styles.rightCol}>
          <Text>{booking.BookingCode}</Text>
          <Text>
            <Text>Gate Open </Text>
            <Text>{moment(new Date(booking.OnBoardTime)).format("HHmm")}</Text>
          </Text>
          <View style={[styles.codeContainer, { backgroundColor: STATUS_COLOR[booking.Status] }]}>
            <Text style={[styles.value, styles.code, { color: STATUS_COLOR[booking.Status] }]}>{booking.Status}</Text>
          </View>

        </View>
      </View>

    </TouchableOpacity>
  )
}

export default Homebookingitem;