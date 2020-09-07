import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { SwipeListView } from "react-native-swipe-list-view";
import SPBookingItem from "../../components/bookings/SPBookingItem";
import Screens from "../screens";
import AwsData from "../../shared/AwsData";
import Spinner from 'react-native-loading-spinner-overlay';
import Images from '../../images';

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

const SPCalenderScreen = ({ navigation }) => {
  const today = moment(new Date()).format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [dateString, setDateString] = useState(moment(today).format("YYYY-MM-DD"));
  const [bookings, setBookings] = useState([]);
  const [bookingsByDay, setBookingsByDay] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [day, _setDay] = useState(today);
  const [loading, setloading] = useState(true);

  async function fetchData() {
    let result = await awsData.getSPBookings('CALENDAR');
    //console.log(result);
    if (result != undefined) {
      setBookings(result);
      setMarkedDates(getMarkedDates(result));
      setBookingsByDay(getBookingsBySelectedDay(result, today));
    }
    setloading(false);
  }

  const dayref = useRef(day);
  const setDay = newDay => {
    dayref.current = newDay;
    _setDay(newDay);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      localRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  //refresh was calling the fetchData function but fetchData gets the bookings today so if you refresh other dates that is not today, it will return the today's bookings
  async function refresh() {
    setloading(true);
    console.log('Refresh');
    awsData.spBookingsCalendar = null;
    let result = await awsData.getSPBookings('CALENDAR');
    //console.log(result);
    if (result != undefined) {
      setBookings(result);
      setMarkedDates(getMarkedDates(result));
      // console.log(day);
      // console.log(dateString);
      setBookingsByDay(getBookingsBySelectedDay(result, dayref.current));
    }
    setloading(false);
  }

  async function localRefresh() {
    console.log('local refresh')
    let result = await awsData.getSPBookings('CALENDAR');
    //console.log(result);
    if (result != undefined) {
      setBookings(result);
      setMarkedDates(getMarkedDates(result));
      // console.log(dayref);
      // console.log(dayref.current);
      setBookingsByDay(getBookingsBySelectedDay(result, dayref.current));
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Bookings',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate(Screens.ServiceProviderFilter)}>
            <Text style={{ marginRight: 15, marginTop: 3, color: 'white', fontSize: 15 }}>Filter</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate(Screens.ServiceProviderSearch)}>
            <Image source={Images.icon_search} style={{ width: 25, height: 25, marginLeft: 15, marginTop: 3, tintColor: 'white' }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return loading ? (
    <Spinner
      visible={true}
      textContent={''}
      textStyle={styles.spinnerTextStyle}
    />
  ) : (
      <View style={styles.screen}>
        <Calendar
          theme={{
            selectedDayBackgroundColor: '#1876d2',
            todayTextColor: '#1876d2',
            dotColor: '#1876d2',
            arrowColor: '#1876d2',
          }}
          current={date}
          onDayPress={day => {
            setDay(day.dateString);
            setDate(new Date(day.dateString));
            setDateString(day.dateString);
            setBookingsByDay(
              getBookingsBySelectedDay(bookings, day.dateString),
            );
          }}
          markedDates={{
            ...markedDates,
            [dateString]: {
              selected: true,
              marked: markedDates[dateString]?.marked,
            },
          }}
        />
        {
          bookingsByDay.length > 0 ? (
            <>
              <SwipeListView
                onRefresh={refresh}
                refreshing={refreshing}
                closeOnRowBeginSwipe={true}
                closeOnRowOpen
                closeOnRowPress
                closeOnScroll
                data={bookingsByDay}
                keyExtractor={item => item.bookingCode}
                renderItem={({ item }) => {
                  return (
                    <View style={{ marginBottom: 5, marginTop: 10 }}>
                      <SPBookingItem booking={item} navigation={navigation} functionRefresh={localRefresh} />
                    </View>
                  );
                }}
              />
            </>
          ) : (
              <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                  />
                }>
                <Text style={styles.noBookings}>No bookings</Text>
              </ScrollView>
            )}
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
    fontSize: 20,
    color: "rgba(0, 0, 0, .4)"
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

export default SPCalenderScreen;