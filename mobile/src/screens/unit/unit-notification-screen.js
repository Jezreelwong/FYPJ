import React, { useState, useEffect } from 'react';
import { Modal, Alert, Text, View, StyleSheet, SafeAreaView, Image, SectionList, ImageBackground, Dimensions, ScrollView, RefreshControl } from 'react-native';
import UnitNotificationItem from '../../components/unit/unit-notification-list-item';
import Images from '../../images';
import Colors from '../../colors';
import AwsData from "../../shared/AwsData";
import { UserRoles } from '../../models/User';
import { SwipeRow, SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from 'react-native-loading-spinner-overlay';
import FilterPicker from "../../components/FilterPicker";
import Screens from '../screens';

const awsData = new AwsData();

const UnitNotificationScreen = ({ route, navigation }) => {
  const [notifications, setNotifications] = useState(undefined);
  const [fullNotifications, setFullNotifications] = useState(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [background, setBackground] = useState(Images.unit_background);
  const unitFilterData = [
    { value: 0, label: 'All Categories' },
    { value: "Approved", label: 'Approved Bookings' },
    { value: "Rejected", label: 'Rejected Bookings' },
    { value: "Cancellation", label: 'Cancelled Bookings' },
  ]
  const adminFilterData = [
    { value: 0, label: 'All Categories' },
    { value: "Pending", label: 'Pending Bookings' },
  ]

  navigation.setOptions({
    title: "Notifications",
    headerLeft: () => (
      <TouchableOpacity
        style={styles.headerLeftTouchable}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="ios-close" color="white" size={45} style={{ width: 45, height: 45 }} />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={{ marginRight: -10 }}>
        <FilterPicker
          placeholder="Filter"
          items={AwsData.user.role === "A" ? adminFilterData : unitFilterData}
          onItemSelected={filter => filterSelected(filter)}
        />
      </View>
    )
  });

  useEffect(() => {
    // Change background depending on user role
    if (AwsData.user.role === UserRoles.Admin) {
      setBackground(Images.admin_background);
    } else {
      setBackground(Images.unit_background);
    }
    setNotifications(undefined)
    navigation.addListener('focus', () => {
      fetchData();
    }
    )
  }, []);

  async function fetchData() {
    setLoading(true)
    let result = await awsData.getNotifications();
    if (result === "InvalidToken") {
      // If AwsData function returns this string, it will redirect user to Login Screen
      // String is received to signify that token is invalid/unauthorised
      setLoading(false)
      navigation.reset({
        index: 0,
        routes: [{ name: Screens.Login }]
      })
    } else {
      if (result != undefined) {
        let idArray = await checkDeleted();
        if (idArray != null || idArray != undefined) {
          for (let i = 0; i < idArray.length; i++) {
            result[0]['data'] = result[0]['data'].filter(item => item.notificationId !== idArray[i])
          }
          if (result[0]['data'][0] === undefined) {
            setNotifications(undefined);
            setFullNotifications(result)
            setLoading(false)
            return;
          }
        }
        setNotifications(result);
        setFullNotifications(result)
        try {
        } catch (error) {
          console.log(error)
        }
      } else {
        setNotifications(undefined)
      }
      setLoading(false)
    }
  }

  async function refresh() {
    console.log('Refresh');
    fetchData();
  }

  async function deleteNotification(id) {
    var newNotifications = [];
    newNotifications.push({ "title": 'notifications', "data": notifications[0]['data'].filter(item => item.notificationId !== id) })
    var newFullNotifications = [];
    newFullNotifications.push({ "title": 'notifications', "data": fullNotifications[0]['data'].filter(item => item.notificationId !== id) })
    try {
      if (newFullNotifications[0]['data'][0] === undefined && newNotifications[0]['data'][0] === undefined) {
        setNotifications(undefined)
        setFullNotifications(undefined)
      } else if (newNotifications[0]['data'][0] === undefined) {
        setNotifications(undefined)
        setFullNotifications(newFullNotifications)
      } else {
        setNotifications(newNotifications)
        setFullNotifications(newFullNotifications)

      }

      addDeleted(id);

    } catch (error) {
      console.log(error)
    }
  }

  async function addDeleted(id) {
    let dataDelete = await (AsyncStorage.getItem("NDELETE" + AwsData.user.username))
    if (dataDelete == null || dataDelete == undefined) {
      let idArray = []
      idArray.push(id)
      await AsyncStorage.setItem("NDELETE" + AwsData.user.username, JSON.stringify(idArray))
    } else {
      dataDelete = JSON.parse(dataDelete)
      let idArray = dataDelete;
      idArray.push(id)
      await AsyncStorage.removeItem("NDELETE" + AwsData.user.username)
      await AsyncStorage.setItem("NDELETE" + AwsData.user.username, JSON.stringify(idArray))
    }
  }

  async function checkDeleted() {
    let dataDelete = await AsyncStorage.getItem("NDELETE" + AwsData.user.username)
    dataDelete = JSON.parse(dataDelete)
    return dataDelete
  }

  async function filterSelected(filter) {
    let filterType = filter.value
    await setNotifications(fullNotifications)
    var newNotifications = []
    if (filter.value === 0) {
      newNotifications.push({ "title": 'notifications', "data": fullNotifications[0]['data'] })
      setNotifications(fullNotifications)
    } else {
      newNotifications.push({ "title": 'notifications', "data": fullNotifications[0]['data'].filter(item => item.notificationType === filterType) })
      setNotifications(newNotifications)
    }

    if (newNotifications[0]['data'][0] === undefined) {
      setNotifications(undefined)
    }
  }

  return (
    <ImageBackground source={background}
      style={styles.BackgroundImage}>
      <Spinner
        visible={loading}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
      {
        notifications != undefined && notifications != null ?
          <>
            <View>
              <SwipeListView
                useSectionList
                sections={notifications}
                keyExtractor={item => item.notificationId}
                refreshing={refreshing}
                onRefresh={refresh}
                closeOnRowBeginSwipe={true}
                rightOpenValue={-75}
                disableRightSwipe={true}
                renderItem={
                  ({ item }) =>
                    <View style={styles.container}>
                      <UnitNotificationItem style={styles.standaloneRowFront} notification={item} navigation={navigation} />
                    </View>
                }
                renderHiddenItem={
                  ({ item }) =>
                    <View style={styles.standaloneRowBack}>
                      <TouchableOpacity
                        style={styles.deleteBtn} onPress={() => deleteNotification(item.notificationId)}>
                        <AntDesign style={styles.deleteIcon} name={"delete"} />
                      </TouchableOpacity>
                    </View>
                }
              />
            </View>
          </>
          :
          <>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refresh} />
              }
            >
              <Text style={styles.noBookings}>No Notifications</Text>
            </ScrollView>
          </>
      }
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  Title:
  {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  backTextWhite: {
    color: '#FFF',
  },
  deleteIcon: {
    fontSize: 25,
    color: 'white',
    padding: 12.5,
    alignSelf: 'center'
  },
  standaloneRowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: '2.5%',
    marginBottom: 5,
    marginTop: 10,
    height: '100%',
  },
  container: {
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    justifyContent: "center",
    width: 75,
    height: '100%',
  },
  smallText: {
    textAlign: 'center',
    paddingTop: 10,
    fontStyle: "italic",
    color: 'black'
  },
  headerLeftTouchable: {
    marginLeft: 15
  },
  spinnerTextStyle: {
    color: '#FFF'
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

});

export default UnitNotificationScreen;