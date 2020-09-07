import React, { Component, useState, useEffect } from 'react';
import { View, SafeAreaView, Text, Image, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import UnitBookingListScreen from './unit-booking-list-screen';
import Screens from '../screens';
import Images from '../../images';

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  SafeAreaView:
  {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  Title:
  {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 10,
    fontFamily: 'Roboto',
  },
  FlatListTiming:
  {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    width: '65%',
    fontSize: 13,
    borderRadius: 5,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    color: '#dcdcdc'
    //alignItems:'flex-start',
  },
  imageView:
  {
    width: 80,
    height: 50,
    // margin: 7,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListView:
  {
    justifyContent: 'center',
    //backgroundColor:'white',
    borderRadius: 4,
    margin: 2,
  },
  ButtonPassenger:
  {
    flex: 1,
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
  },
  ButtonPassengerPicture:
  {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },

  ButtonRPL:
  {
    flex: 1,
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
  },
  ButtonRPLPicture:
  {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  dateText: {
    color: 'white',
    paddingLeft: 10,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
})

const UnitHomeScreen = ({ route, navigation }) => {
  return (
    <SafeAreaView>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity 
          style={styles.ButtonPassenger} 
          onPress={() => {
            navigation.navigate(Screens.UnitBookPassenger);
            }}>
          <Image testID="bookPassenger" source={Images.unit_bttn_passenger} style={styles.ButtonPassengerPicture} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ButtonRPL} onPress={() => navigation.navigate(Screens.UnitBookRPL)}>
          <Image testID="bookRPL" source={Images.unit_bttn_rpl} style={styles.ButtonRPLPicture} />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 100 }}>
        <UnitBookingListScreen
          route={route}
          navigation={navigation} />
      </View>

    </SafeAreaView>
  );
}

export default UnitHomeScreen;