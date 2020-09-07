import React from "react";
import { Image, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Screens from './screens';
import UnitHomeScreen from './unit/unit-home-screen';
import UnitAccountScreen from './unit/unit-account-screen';
import BookingCode from './unit/unit-booking-code-screen';
import UnitBookFerryScreen from './unit/unit-book-ferry-screen';
import UnitFerryScheduledTimingsScreen from './unit/unit-ferry-scheduled-timings-screen';
import FeedBackGuidlines from './unit/unit-ferry-guidelines';
import GiveRatings from './unit/unit-rate-service-screen';
import UnitBookingListScreen from './unit/unit-booking-list-screen';
import VehicleSelectionScreen from './ferry/vehicle-selection-screen';
import ServiceProviderType from '../shared/enums/ServiceProviderType';
import ReviewBookingScreen from './admin/admin-review-booking-screen';
import UnitAnnouncementScreen from './unit/unit-announcement-screen';
import UnitRecurringScreen from "./unit/unit-recurring-screen";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { TouchableOpacity } from "react-native-gesture-handler";
import UnitNotificationScreen from './unit/unit-notification-screen';
import Images from '../images';
import Colors from '../colors';
import { Badge } from 'react-native-elements';

const UnitHomeStack = createStackNavigator();
function UnitHomeStackScreen() {
  return (
    <UnitHomeStack.Navigator screenOptions={UnitHeaderOptions} >
      <UnitHomeStack.Screen name={Screens.UnitHome} component={UnitHomeScreen} />
      <UnitHomeStack.Screen name={Screens.UnitBookingCode} component={BookingCode} />
      <UnitHomeStack.Screen
        name={Screens.UnitBookPassenger}
        component={UnitBookFerryScreen}
        initialParams={{
          serviceProviderType: ServiceProviderType.PASSENGER
        }}
        options={{
          headerBackImage: () => (
            <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 15, tintColor: 'white' }} />
          )
        }} />
      <UnitHomeStack.Screen
        name={Screens.UnitBookRPL}
        component={UnitBookFerryScreen}
        initialParams={{
          serviceProviderType: ServiceProviderType.RPL
        }}
        options={{
          headerBackImage: () => (
            <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 15, tintColor: 'white' }} />
          )
        }} />
      <UnitHomeStack.Screen name={Screens.UnitSelectVehicle} component={VehicleSelectionScreen} />
      <UnitHomeStack.Screen name={Screens.UnitRecurring} component={UnitRecurringScreen} />
      <UnitHomeStack.Screen name={Screens.UnitReviewBooking} component={ReviewBookingScreen} />
      <UnitHomeStack.Screen name={Screens.UnitFerryScheduledTimings} component={UnitFerryScheduledTimingsScreen} />
      <UnitHomeStack.Screen name={Screens.UnitFerryGuidelines} component={FeedBackGuidlines} />
      <UnitHomeStack.Screen name={Screens.UnitServiceRating} component={GiveRatings} />
      <UnitHomeStack.Screen name={Screens.UnitNotification} component={UnitNotificationScreen} />
    </UnitHomeStack.Navigator>
  );
}

const UnitBookingsTab = createMaterialTopTabNavigator();
function UnitBookingsTabScreen() {
  return (
    <UnitBookingsTab.Navigator tabBarOptions={{
      activeTintColor: 'black', inactiveTintColor: 'grey',
      indicatorStyle: { backgroundColor: Colors.unit_primary },
      labelStyle: { fontSize: 11 }
    }} >
      <UnitBookingsTab.Screen
        name="Upcoming"
        initialParams={{ Results: "Upcoming" }}
        component={UnitBookingListScreen}
      />
      <UnitBookingsTab.Screen
        name="Pending"
        initialParams={{ Results: "Pending" }}
        component={UnitBookingListScreen}
      />
      <UnitBookingsTab.Screen
        name="Rejected"
        initialParams={{ Results: "Rejected" }}
        component={UnitBookingListScreen}
      />
      <UnitBookingsTab.Screen
        name="Past"
        initialParams={{ Results: "Past" }}
        component={UnitBookingListScreen}
      />
    </UnitBookingsTab.Navigator>
  );
}

const UnitBookingsStack = createStackNavigator();
function UnitBookingsStackScreen() {
  return (
    <UnitBookingsStack.Navigator screenOptions={UnitHeaderOptions}>
      <UnitBookingsStack.Screen name={Screens.UnitBookings} component={UnitBookingsTabScreen} options={{ title: 'Bookings' }} />
      <UnitBookingsStack.Screen name={Screens.UnitBookingCode} component={BookingCode} />
      <UnitBookingsStack.Screen name={Screens.UnitServiceRating} component={GiveRatings} />
      <UnitBookingsStack.Screen name={Screens.UnitNotification} component={UnitNotificationScreen} />
    </UnitBookingsStack.Navigator>
  );
}

const UnitAccountStack = createStackNavigator();

function UnitAccountStackScreen() {
  return (
    <UnitAccountStack.Navigator screenOptions={UnitHeaderOptions}>
      <UnitAccountStack.Screen name={Screens.UnitAccount} component={UnitAccountScreen} options={{ title: 'Account' }} />
      <UnitBookingsStack.Screen name={Screens.UnitBookingCode} component={BookingCode} />
      <UnitAccountStack.Screen name={Screens.UnitNotification} component={UnitNotificationScreen} />
    </UnitAccountStack.Navigator>
  );
}

const UnitAnnouncementStack = createStackNavigator();

function UnitAnnouncementStackScreen() {
  return (
    <UnitAnnouncementStack.Navigator screenOptions={UnitHeaderOptions}>
      <UnitAnnouncementStack.Screen name={Screens.UnitAnnouncements} component={UnitAnnouncementScreen} />
    </UnitAnnouncementStack.Navigator>
  );
}

const UnitTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let imageSrc;

    switch (route.name) {
      case "Home":
        imageSrc = focused ? Images.unit_tab_home_select : Images.unit_tab_home;
        break;
      case "Booking":
        imageSrc = focused ? Images.unit_tab_booking_select : Images.unit_tab_booking_select;
        break;
      case "Announcement":
        imageSrc = focused ? Images.unit_tab_announcement_select : Images.unit_tab_announcement;
        break;
      default:
        imageSrc = focused ? Images.unit_tab_account_select : Images.unit_tab_account;
        break;
    }

    return <Image source={imageSrc} style={{ width: size, height: size, resizeMode: 'stretch', tintColor: color }} />
  }
});

const UnitTabBarOptions = {
  activeTintColor: '#bb121e',
  inactiveTintColor: 'gray',
};

const UnitHeaderOptions = ({ navigation }) => ({
  title: 'SAF Ferry Booking App',
  headerStyle: {
    backgroundColor: '#bb121e',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleAlign: 'center',
  headerRight: () => (
    <View>
      <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={() => navigation.navigate(Screens.UnitNotification)}>
        {/* <MaterialCommunityIcons name='bell-outline' color='white' size={30} /> */}
        <Image source={Images.icon_notification} style={{ width: 25, height: 25, resizeMode: 'stretch', tintColor: 'white' }} />
      </TouchableOpacity>
      {/* <View style={{ position: 'absolute', top: -8, left: 12 }}>
          <Badge value="12" status="error" />
      </View> */}
    </View>
  ),
  headerBackTitleVisible: false
});

const UnitTab = createBottomTabNavigator();
function UnitTabScreen() {
  return (
    <UnitTab.Navigator screenOptions={UnitTabOptions} tabBarOptions={UnitTabBarOptions}>
      <UnitTab.Screen name="Home" component={UnitHomeStackScreen} />
      <UnitTab.Screen name="Booking" component={UnitBookingsStackScreen} />
      <UnitTab.Screen name="Announcement" component={UnitAnnouncementStackScreen} />
      <UnitTab.Screen name="Account" component={UnitAccountStackScreen} />
    </UnitTab.Navigator>
  );
}

export default UnitTabScreen;