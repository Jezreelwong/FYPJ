import React from "react";
import { TouchableOpacity, Image } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Screens from './screens';
import AdminAccountScreen from './admin/admin-account-screen';
import AdminRequestAllScreen from "./admin/admin-pending-requests-screen";
import AdminCalenderScreen from "./admin/admin-calendar-screen";
import AdminBookTab from './admin/admin-book-ferry-screen';
import ReviewBookingScreen from './admin/admin-review-booking-screen';
import VehicleSelectionScreen from './ferry/vehicle-selection-screen';
import AdminFilterScreen from './admin/admin-filter-booking-screen';
import AdminFilteredResult from './admin/admin-filtered-booking-screen';
import AdminBookingData from './admin/admin-booking-screen';
import AdminSearchScreen from './admin/admin-search-screen';
import AdminRecurringScreen from "./admin/admin-recurring-screen";
import UnitAnnouncementScreen from './unit/unit-announcement-screen';
import UnitNotificationScreen from './unit/unit-notification-screen';
import Images from '../images';
import Colors from '../colors';
import {
  AdminTabOptions,
  adminTabBarOptions
} from "./options/AdminTabOptions";
import ServiceProviderType from '../shared/enums/ServiceProviderType';

const AdminHomeScreenOptions = {
  title: 'Pending Requests',
  headerLeft: () => (
    null
  ),
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleAlign: 'center',
};
const AdminMaterialTopTab = createMaterialTopTabNavigator();
function AdminTopTabsScreen() {
  // const defaultView = true;

  return (
    // defaultView ?
    <AdminMaterialTopTab.Navigator swipeEnabled={false}
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: Colors.admin_primary
        }
      }} >
      <AdminMaterialTopTab.Screen
        name="All"
        initialParams={{ bookingType: "Pending" }}
        component={AdminRequestAllScreen}
      />
      <AdminMaterialTopTab.Screen
        name="Fixed"
        initialParams={{ bookingType: "Fixed" }}
        component={AdminRequestAllScreen}
      />
      <AdminMaterialTopTab.Screen
        name="Ad-hoc"
        initialParams={{ bookingType: "Ad-Hoc" }}
        component={AdminRequestAllScreen}
      />
      <AdminMaterialTopTab.Screen
        name="OOS"
        initialParams={{ bookingType: "OOS" }}
        component={AdminRequestAllScreen}
      />
    </AdminMaterialTopTab.Navigator>
    // :
    // <AdminCalenderScreen />
  );
}

const AdminHomeStack = createStackNavigator();
function AdminHomeStackScreen() {
  return (
    <AdminHomeStack.Navigator screenOptions={AdminHeaderOptions}>
      <AdminHomeStack.Screen name={Screens.AdminHome} component={AdminTopTabsScreen}
        options={AdminHomeScreenOptions} />
      <AdminHomeStack.Screen name={Screens.AdminBookingData} component={AdminBookingData} options={({ navigation }) => ({
        title: "Booking Code",
        headerStyle: {
          backgroundColor: Colors.admin_primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
        headerTitleAlign: 'center',
      })} />
      <AdminHomeStack.Screen name={Screens.UnitNotification} component={UnitNotificationScreen} />
    </AdminHomeStack.Navigator>
  );
}


const AdminBookTopTab = createMaterialTopTabNavigator();
function AdminBookScreen() {
  return (
    <AdminBookTopTab.Navigator
      tabBarOptions={{
        style: {
          shadowColor: "transparent",
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 0,
          elevation: 0,
          backgroundColor: "#f0f0f0"
        },
        indicatorStyle: {
          height: "100%",
          backgroundColor: "#fff"
        },
        activeTintColor: Colors.admin_primary,
        inactiveTintColor: "gray",
        labelStyle: {
          fontSize: 12,
          fontWeight: "bold"
        }
      }}
    >
      <AdminBookTopTab.Screen
        name={Screens.AdminBookPassenger}
        component={AdminBookTab}
        initialParams={{
          serviceProviderType: ServiceProviderType.PASSENGER
        }}
        options={{ title: 'Passenger' }}
      />
      <AdminBookTopTab.Screen
        name={Screens.AdminBookRPL}
        component={AdminBookTab}
        initialParams={{
          serviceProviderType: ServiceProviderType.RPL
        }}
        options={{ title: 'RPL' }}
      />
    </AdminBookTopTab.Navigator>
  );
}

const AdminBookingsStack = createStackNavigator();
function AdminBookingsStackScreen() {
  return (
    <AdminBookingsStack.Navigator screenOptions={AdminHeaderOptions} >
      <AdminBookingsStack.Screen name={Screens.AdminCalendar} component={AdminCalenderScreen} />
      <AdminBookingsStack.Screen name={Screens.AdminBookFerry} component={AdminBookScreen} options={{
        title: 'Booking',
        headerBackImage: () => (
          <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 10, tintColor: 'white' }} />
        ),
      }} />
      <AdminBookingsStack.Screen name={Screens.AdminFilter} component={AdminFilterScreen} options={{
        title: "Filter",
        headerBackImage: () => (
          <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 10, tintColor: 'white' }} />
        ),
        // headerStyle: {
        //   backgroundColor: Colors.admin_primary,
        // },
        // headerTitleStyle: {
        //   fontWeight: 'bold',
        //   color: 'white',
        // },
        // headerTitleAlign: 'center',
      }}
      />
      <AdminBookingsStack.Screen name={Screens.AdminFilterResults} component={AdminFilteredResult} options={{
        title: "Filtered Bookings",
        headerStyle: {
          backgroundColor: Colors.admin_primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
        headerTitleAlign: 'center',
      }}
      />
      <AdminBookingsStack.Screen name={Screens.AdminSearch} component={AdminSearchScreen} options={{
        title: "Search",
        headerBackImage: () => (
          <Image source={Images.icon_close} style={{ width: 20, height: 20, marginLeft: 10, tintColor: 'white' }} />
        ),
      }} />
      <AdminHomeStack.Screen name={Screens.AdminBookingData} component={AdminBookingData} options={{
        title: "Booking Code: ",
        headerStyle: {
          backgroundColor: Colors.admin_primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
        headerTitleAlign: 'center',
      }}
      />

      <AdminBookingsStack.Screen name={Screens.AdminSelectVehicle} component={VehicleSelectionScreen} />
      <AdminBookingsStack.Screen name={Screens.AdminRecurring} component={AdminRecurringScreen} />

      <AdminBookingsStack.Screen name={Screens.AdminReviewBooking} component={ReviewBookingScreen} />
      <AdminHomeStack.Screen name={Screens.UnitNotification} component={UnitNotificationScreen} />
    </AdminBookingsStack.Navigator>
  );
}

const AdminAnnouncementStack = createStackNavigator();
function AdminAnnouncementStackScreen() {
  return (
    <AdminAnnouncementStack.Navigator screenOptions={AdminHeaderOptions}>
      <AdminAccountStack.Screen name={Screens.AdminAnnouncement} component={UnitAnnouncementScreen}
        options={AdminAnnouncementScreenOptions} />
    </AdminAnnouncementStack.Navigator>
  );
}

const AdminAccountStack = createStackNavigator();
function AdminAccountStackScreen() {
  return (
    <AdminAccountStack.Navigator screenOptions={AdminHeaderOptions}>
      <AdminAccountStack.Screen name={Screens.AdminAccount} component={AdminAccountScreen}
        options={AdminAccountScreenOptions} />
      <AdminHomeStack.Screen name={Screens.AdminBookingData} component={AdminBookingData} options={({ navigation }) => ({
        title: "Booking Code",
        headerStyle: {
          backgroundColor: Colors.admin_primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
        headerTitleAlign: 'center',
      })} />
      <AdminHomeStack.Screen name={Screens.UnitNotification} component={UnitNotificationScreen} />
    </AdminAccountStack.Navigator>
  );
}

const AdminHeaderOptions = ({ navigation }) => ({
  title: 'SAF Ferry Booking App',
  headerStyle: {
    backgroundColor: Colors.admin_primary,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerRight: () => (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate(Screens.UnitNotification)}>
      <Image source={Images.icon_notification} style={{ width: 25, height: 25, resizeMode: 'stretch', tintColor: 'white' }} />
    </TouchableOpacity>
  ),
});
const AdminAnnouncementScreenOptions = {
  title: 'Announcements',
  headerLeft: () => (
    null
  ),
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleAlign: 'center',
};
const AdminAccountScreenOptions = {
  title: 'Account',
  headerLeft: () => (
    null
  ),
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleAlign: 'center',
};

const AdminTab = createBottomTabNavigator();
const AdminTabScreen = ({ }) => {
  return (
    <AdminTab.Navigator screenOptions={AdminTabOptions} tabBarOptions={adminTabBarOptions}>
      <AdminTab.Screen name="Home" component={AdminHomeStackScreen} />
      <AdminTab.Screen name="Booking" component={AdminBookingsStackScreen} />
      <AdminTab.Screen name="Announcement" component={AdminAnnouncementStackScreen} />
      <AdminTab.Screen name="Account" component={AdminAccountStackScreen} />
    </AdminTab.Navigator>
  );
}

export default AdminTabScreen;