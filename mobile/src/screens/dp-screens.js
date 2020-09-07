import React from "react";
import { Image, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Screens from './screens';
import DutyPersonnelAccountScreen from './duty-personnel/dp-account-screen';
import DutyPersonnelBookingsScreen from './duty-personnel/dp-bookings-screen';
import DutyPersonnelBookRPLScreen from './duty-personnel/dp-book-rpl-screen';
import ReviewBookingScreen from './admin/admin-review-booking-screen';
import ServiceProviderType from '../shared/enums/ServiceProviderType';
import VehicleSelectionScreen from './ferry/vehicle-selection-screen';
import AdminBookingData from './admin/admin-booking-screen';
import Images from "../images";
import Colors from "../colors";

const DutyPersonnelHeaderOptions = ({ navigation }) => ({
  title: "SAF Ferry Booking App",
  headerStyle: {
    backgroundColor: Colors.dp_primary,
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
});

const DutyPersonnelBookingsScreenOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate(Screens.DutyPersonnelAccount)}>
      <Image source={Images.icon_account} style={{ width: 25, height: 25, marginLeft: 20, tintColor: 'white' }} />
    </TouchableOpacity>
  ),
  headerRight: () => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ flex: 1, justifyContent: "flex-end" }} onPress={() => navigation.push(Screens.DutyPersonnelBookRPL)}>
        <Image source={Images.icon_add} style={{ width: 25, height: 25, marginRight: 20, tintColor: 'white' }} />
      </TouchableOpacity>
    </View>
  ),
});

const DutyPersonnelAccountScreenOptions = ({
  title: 'Account',
  // headerBackTitleVisible: false,
  headerBackImage: () => (
    <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 15, tintColor: 'white' }} />
  ),
  // headerTitleAlign: 'center',
});

const DutyPersonnelBookRPLScreenOptions = ({
  // headerBackTitleVisible: false,
  headerBackImage: () => (
    <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 15, tintColor: 'white' }} />
  ),
  // headerTitleAlign: 'center',
});

const DutyPersonnelReviewBookingScreenOptions = ({
  headerTitleAlign: 'center',
});

const DutyPersonnelStack = createStackNavigator();
const DutyPersonnelStackScreen = ({ navigation }) => {
  return (
    <DutyPersonnelStack.Navigator screenOptions={DutyPersonnelHeaderOptions} >
      <DutyPersonnelStack.Screen name={Screens.DutyPersonnelBookings} component={DutyPersonnelBookingsScreen} options={DutyPersonnelBookingsScreenOptions} />
      <DutyPersonnelStack.Screen name={Screens.AdminBookingData} component={AdminBookingData} options={{
        title: "Booking Code: ",
        headerStyle:
        {
          backgroundColor: '#00acc1',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
          marginLeft: 20,
        },
        headerTitleAlign: 'center',
      }} />
      <DutyPersonnelStack.Screen name={Screens.DutyPersonnelAccount} component={DutyPersonnelAccountScreen} options={DutyPersonnelAccountScreenOptions} />
      <DutyPersonnelStack.Screen name={Screens.DutyPersonnelBookRPL} component={DutyPersonnelBookRPLScreen} options={DutyPersonnelBookRPLScreenOptions}
        initialParams={{
          serviceProviderType: ServiceProviderType.RPL
        }} />
      <DutyPersonnelStack.Screen name={Screens.AdminSelectVehicle} component={VehicleSelectionScreen} />
      <DutyPersonnelStack.Screen name={Screens.DutyPersonnelReviewBooking} component={ReviewBookingScreen} options={DutyPersonnelReviewBookingScreenOptions} />
    </DutyPersonnelStack.Navigator>
  );
}

export default DutyPersonnelStackScreen; 