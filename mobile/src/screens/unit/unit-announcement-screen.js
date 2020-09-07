import React, { useState, useEffect } from 'react';
import { Modal, Alert, Text, View, StyleSheet, SafeAreaView, Image, SectionList, ImageBackground, Dimensions, ScrollView, RefreshControl } from 'react-native';
import UnitSPTypeSectionList from '../../components/unit/sp-type-list-section';
import UnitAnnouncementItem from '../../components/unit/unit-announcement-list-item';
import { BookingStatus } from '../../models/Booking';
import Images from '../../images';
import Colors from '../../colors';
import AwsData from "../../shared/AwsData";
import { SwipeRow, SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

const UnitAnnouncementScreen = ({ route, navigation }) => {
  const [announcements, setAnnouncements] = useState(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [background, setBackground] = useState(Images.unit_background);

  navigation.setOptions({
    title: "Announcements",
    headerRight: () => (
      <TouchableOpacity
        onPress={() => clearAll()}
        style={{ marginRight: 15 }}>
        <Text style={{ color: 'white', fontSize: 15 }}>Clear All</Text>
      </TouchableOpacity>
    ),
  })

  async function fetchData() {
    setLoading(true)
    let result = await awsData.getAnnouncements();
    if (result != undefined) {
      let idArray = await checkDeleted();
      if (idArray != null || idArray != undefined) {
        for (let i = 0; i < idArray.length; i++) {
          result[0]['data'] = result[0]['data'].filter(item => item.announcementId !== idArray[i])
        }
      }
      if (result[0]['data'][0] === undefined) {
        setAnnouncements(undefined);
        setLoading(false)
        return;
      }
      setAnnouncements(result);
    } else {
      setAnnouncements(undefined)
    }
    setLoading(false)
  }

  useEffect(() => {
    // Change background depending on user role
    if (AwsData.user.role === "U" || AwsData.user.role === "PU") {
      setBackground(Images.unit_background)
    } else if (AwsData.user.role === "SP") {
      setBackground(Images.sp_background)
    } else if (AwsData.user.role === "A") {
      setBackground(Images.admin_background)
    }
    setAnnouncements(undefined)
    navigation.addListener('focus', () => {
      fetchData();
    }
    )
  }, []);

  async function refresh() {
    console.log('Refresh');
    fetchData();
  }

  async function deleteAnnouncement(id) {
    var newAnnouncements = [];
    newAnnouncements.push({ "title": 'announcements', "data": announcements[0]['data'].filter(item => item.announcementId !== id) })
    try {
      if (newAnnouncements[0]['data'][0] === undefined) {
        setAnnouncements(undefined)
      } else {
        setAnnouncements(newAnnouncements)
      }

      addDeleted(id);

    } catch (error) {
      console.log(error)
    }
  }

  async function addDeleted(id) {
    let dataDelete = await (AsyncStorage.getItem("ADELETE" + AwsData.user.username))
    if (dataDelete == null || dataDelete == undefined) {
      let idArray = []
      idArray.push(id)
      await AsyncStorage.setItem("ADELETE" + AwsData.user.username, JSON.stringify(idArray))
    } else {
      dataDelete = JSON.parse(dataDelete)
      let idArray = dataDelete;
      idArray.push(id)
      await AsyncStorage.removeItem("ADELETE" + AwsData.user.username)
      await AsyncStorage.setItem("ADELETE" + AwsData.user.username, JSON.stringify(idArray))
    }
  }

  async function checkDeleted() {
    let dataDelete = await AsyncStorage.getItem("ADELETE" + AwsData.user.username)
    dataDelete = JSON.parse(dataDelete)
    return dataDelete
  }

  async function clearAll() {
    try {
      for (let i = 0; i < announcements[0]['data'].length; i++) {
        await addDeleted(announcements[0]['data'][i]['announcementId']);
      }

      var newAnnouncements = [];
      newAnnouncements.push({ "title": 'announcements', "data": announcements[0]['data'].filter(item => item.announcementId === "clear") })
      setAnnouncements(undefined)

    } catch (error) {
      console.log(error)
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
        announcements != undefined ?
          <>
            <View>
              <SwipeListView
                useSectionList
                sections={announcements}
                keyExtractor={item => item.announcementId}
                refreshing={refreshing}
                onRefresh={refresh}
                closeOnRowBeginSwipe={true}
                rightOpenValue={-75}
                disableRightSwipe={true}
                renderItem={
                  ({ item }) =>
                    <View style={styles.container}>
                      <UnitAnnouncementItem style={styles.standaloneRowFront} announcement={item} navigation={navigation} />
                    </View>
                }
                renderHiddenItem={
                  ({ item }) =>
                    <View style={styles.standaloneRowBack}>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteAnnouncement(item.announcementId)}>
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
              <Text style={styles.noBookings}>No Announcements</Text>
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
    textAlign: 'center'
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

export default UnitAnnouncementScreen;