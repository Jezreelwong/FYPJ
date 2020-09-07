import React, { useState, useEffect, useRef } from 'react';
import { Modal, Alert, Text, View, StyleSheet, SafeAreaView, Image, SectionList, ImageBackground, ScrollView, RefreshControl, AppState } from 'react-native';
import UnitSPTypeSectionList from '../../components/unit/sp-type-list-section';
import { BookingStatus } from '../../models/Booking';
import Images from '../../images';
import Colors from '../../colors';
import AwsData from "../../shared/AwsData";
import Spinner from 'react-native-loading-spinner-overlay';
import { pure } from 'recompose';

const awsData = new AwsData();

const UnitBookingListScreen = ({ route, navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);
  let count = 1;

  let status = BookingStatus.ALL;

  if (route.params && route.params.Results) {
    switch (route.params.Results) {
      default:
      case 'All':
        status = BookingStatus.ALL;
        break;
      case 'Upcoming':
        status = BookingStatus.APPROVED;
        break;
      case 'Pending':
        status = BookingStatus.PENDING;
        break;
      case 'Rejected':
        status = BookingStatus.REJECTED;
        break;
      case 'Past':
        status = BookingStatus.PAST;
        break;
    }
  }


  async function fetchData(status) {
    if (count == 1) {
      count = 0
      setLoading(true)
      let result = await awsData.getUnitBookings(status);
      if (result != undefined) {
        setBookings(result);
      }
      count = 1
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(status);
    refreshListener();

    if (AppState._eventHandlers.change.size != 2) {
      AppState.addEventListener("change", _handleAppStateChange);
    };
    
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    }

  }, []);

  function refreshListener() {
    navigation.addListener('focus', () => {
      fetchData(status);
    }
    )
  }

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      refresh();
    }
    appState.current = nextAppState;
  };

  function refresh() {
    console.log('Refresh');
    awsData.unitBookingsResultArray = null;
    fetchData(status);
  }

  return (
    <View>
      <Spinner
        visible={loading}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
      {
        bookings != undefined && bookings != null && bookings.length > 0 ?
          <>
            <ImageBackground source={Images.unit_background}
              style={styles.BackgroundImage}>
              <View style={{ backgroundColor: '#F4F4F4' }}>
                <SectionList
                testID="bookingList"
                  sections={bookings}
                  keyExtractor={item => item.serviceProviderType}
                  refreshing={refreshing}
                  onRefresh={refresh}
                  renderSectionHeader={
                    ({ section: { bookingDate } }) =>
                      <View style={{ backgroundColor: 'red', height: 25, paddingTop: 5 }}>
                        <Text style={styles.dateText}>{bookingDate} </Text>
                      </View>
                  }
                  renderItem={
                    ({ item }) => <UnitSPTypeSectionList section={item} navigation={navigation} />
                  }
                />
              </View>
            </ImageBackground>
          </>
          :
          <>
            <ImageBackground source={Images.unit_background}
              style={styles.BackgroundImage}>
              <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                }
              >
                <Text style={styles.noBookings}>No Bookings</Text>
              </ScrollView>
            </ImageBackground>
          </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
  , centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  SafeAreaView:
  {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  dateText: {
    color: 'white',
    paddingLeft: 10,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(244,244,244,0.7)",
  },
  noBookings: {
    fontSize: 17,
    color: Colors.text_secondary,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },

});

export default pure(UnitBookingListScreen);