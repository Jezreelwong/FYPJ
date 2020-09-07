import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Screens from '../../screens/screens';
import AwsData from '../../shared/AwsData';

const UnitNotificationItem = ({ notification, navigation }) => {

  const awsData = new AwsData();

  function retrieveBooking() {
    if (AwsData.user.role !== "A") {
      let booking = awsData.unitBookingsResultArray.find(item => item.bookingCode === notification.bookingCode)
      if (booking != null && booking != undefined && booking !== "") {
        navigation.navigate(Screens.UnitBookingCode, { booking })
      }
    } else {
      let booking = awsData.adminBookingsAllArray.find(item => item.bookingCode === notification.bookingCode)
      if (booking != null && booking != undefined && booking !== "") {
        navigation.navigate(Screens.AdminBookingData, { booking: booking })
      }
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.itemContainer}
      onPress={() => retrieveBooking()}
    >
      <View style={styles.leftCol}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.row}>
          <Text style={styles.value}>
            {notification.message}
          </Text>
        </Text>
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
          }}
        />
        <Text style={styles.row}>
          <Text style={styles.time}>
            On {moment(notification.createdDate).utc().format("LLL")}
          </Text>
        </Text>
      </View>

    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "95%",
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: "center",
    backgroundColor: "white",
  },
  leftCol: {
    width: "100%"
  },
  row: {
    paddingTop: 5
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
  },
  value: {
    fontSize: 15
  },
  time: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#646D6D'
  }
})

export default UnitNotificationItem;