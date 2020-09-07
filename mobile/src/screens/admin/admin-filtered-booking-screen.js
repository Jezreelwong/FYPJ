import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import Screens from "../screens";
import BookingItem from "../../components/bookings/BookingItem";

export default class AdminFilteredResult extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.route.params.results.length != 0 ?
        <SafeAreaView>
          <View>
            <View style={{ paddingTop: 5 }}></View>
            <FlatList
              data={this.props.route.params.results}
              renderItem={({ item }) =>
                <TouchableHighlight underlayColor={'white'} onPress={() => {
                  this.props.navigation.navigate(Screens.AdminBookingData, { booking: item });
                }}>
                  <View style={{ marginBottom: 5 }}>
                    <BookingItem booking={item} image={"yes"} />
                  </View>
                </TouchableHighlight>
              }
              keyExtractor={item => item.bookingCode}
            />
          </View>
        </SafeAreaView>
        :
        <View style={styles.screen}>
          <Text style={styles.noBookings}>No bookings</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noBookings: {
    fontSize: 20,
    color: "rgba(0, 0, 0, .4)"
  },
})
