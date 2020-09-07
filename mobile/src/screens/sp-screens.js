import React from "react";
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Screens from './screens';
import SPCalenderScreen from "./service-provider/sp-calendar-screen";
import SPSearchScreen from "./service-provider/sp-search-screen";
import SPFilterScreen from './service-provider/sp-filter-booking-screen';
import SPFilteredResult from './service-provider/sp-filtered-booking-result-screen';
import SPGetBookingsScreen from './service-provider/sp-get-bookings-screen';
import scanQRCodeScreen from './service-provider/sp-scan-qr-screen';
import scanQRCodeResult from './service-provider/sp-scan-qr-result-screen';
import ServiceProviderAccountScreen from './service-provider/sp-accounts-screen';
import SPBookingData from '../components/bookings/SPBookingData';
import UnitAnnouncementScreen from './unit/unit-announcement-screen';
import { screensEnabled } from "react-native-screens";

const ServiceProviderTopTab = createMaterialTopTabNavigator();
function ServiceProviderTopTabScreen() {
	return (
		<ServiceProviderTopTab.Navigator swipeEnabled={false}
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
				activeTintColor: "#1876d2",
				inactiveTintColor: "gray",
				labelStyle: {
					fontSize: 12,
					fontWeight: "bold",
					fontFamily: 'Roboto',
				}
			}}>
			<ServiceProviderTopTab.Screen
				name="All"
				initialParams={{ bookingType: "All" }}
				bookingType={"All"}
				component={SPGetBookingsScreen}
			/>
			<ServiceProviderTopTab.Screen
				name="Fixed"
				initialParams={{ bookingType: "Fixed" }}
				component={SPGetBookingsScreen}
			/>
			<ServiceProviderTopTab.Screen
				name="Ad-hoc"
				initialParams={{ bookingType: "Ad-Hoc" }}
				component={SPGetBookingsScreen}
			/>
			<ServiceProviderTopTab.Screen
				name="OOS"
				initialParams={{ bookingType: "OOS" }}
				component={SPGetBookingsScreen}
			/>
		</ServiceProviderTopTab.Navigator>
	);
}

const ServiceProviderHomeStack = createStackNavigator();
function ServiceProviderHomeStackScreen() {
	return (
		<ServiceProviderHomeStack.Navigator screenOptions={ServiceProviderHeaderOptions}>
			<ServiceProviderHomeStack.Screen name={Screens.ServiceProviderHome} component={ServiceProviderTopTabScreen}
        /*options={{title: 'Service Provider Home'}} */ />
			<ServiceProviderHomeStack.Screen name={Screens.ServiceProviderBookingData} component={SPBookingData} options={({ navigation }) => ({
				title: "Booking Code",
				headerStyle:
				{
					backgroundColor: '#1876d2',
				},
				headerTitleStyle: {
					fontWeight: 'bold',
					color: 'white',
					marginLeft: 40,
				},
			})} />
		</ServiceProviderHomeStack.Navigator>
	);
}

const ServiceProviderBookingStack = createStackNavigator();
function ServiceProviderBookingStackScreen() {
	return (
		<ServiceProviderBookingStack.Navigator screenOptions={ServiceProviderHeaderOptions} >
			<ServiceProviderBookingStack.Screen name={Screens.ServiceProviderCalendar} component={SPCalenderScreen} />
			<ServiceProviderBookingStack.Screen
				name={Screens.ServiceProviderSearch}
				component={SPSearchScreen}
				options={{ title: "Search" }} />
			<ServiceProviderBookingStack.Screen name={Screens.ServiceProviderFilter} component={SPFilterScreen} />
			<ServiceProviderBookingStack.Screen name={Screens.ServiceProviderFilteredResult} component={SPFilteredResult} options={{
				title: "Booking",
				headerStyle: {
					backgroundColor: '#1876d2',
				},
				headerTitleStyle: {
					fontWeight: 'bold',
					color: 'white',
					marginLeft: 90,
				},
			}}
			/>
			<ServiceProviderBookingStack.Screen name={Screens.ServiceProviderBookingData} component={SPBookingData} options={({ navigation }) => ({
				title: "Booking Code",
				headerStyle: {
					backgroundColor: '#1876d2',
				},
				headerTitleStyle: {
					fontWeight: 'bold',
					color: 'white',
					marginLeft: 40,
				},
			})} />
		</ServiceProviderBookingStack.Navigator>
	);
}

const ServiceProviderScanStack = createStackNavigator();
const ServiceProviderScanStackScreen = ({ navigation }) => {
	return (
		<ServiceProviderScanStack.Navigator screenOptions={ServiceProviderHeaderOptions}>
			<ServiceProviderScanStack.Screen
				name={Screens.ServiceProviderScanQR}
				component={scanQRCodeScreen}
				options={{ title: 'Scan QR Code' }} />
			<ServiceProviderScanStack.Screen name={Screens.ServiceProviderScanResult} component={scanQRCodeResult} options={{ headerShown: false }}
			/>
		</ServiceProviderScanStack.Navigator>
	);
}

const ServiceProviderAnnouncementStack = createStackNavigator();
function ServiceProviderAnnouncementStackScreen() {
	return (
		<ServiceProviderAnnouncementStack.Navigator screenOptions={ServiceProviderHeaderOptions}>
			<ServiceProviderAnnouncementStack.Screen name={Screens.ServiceProviderAnnouncement} component={UnitAnnouncementScreen} />
		</ServiceProviderAnnouncementStack.Navigator>
	);
}

const ServiceProviderAccountStack = createStackNavigator();
function ServiceProviderAccountStackScreen() {
	return (
		<ServiceProviderAccountStack.Navigator screenOptions={ServiceProviderHeaderOptions}>
			<ServiceProviderAccountStack.Screen
				name={Screens.ServiceProviderAccount}
				component={ServiceProviderAccountScreen}
				options={{ title: 'Account' }} />
		</ServiceProviderAccountStack.Navigator>
	);
}

const ServiceProviderTabOptions = ({ route }) => ({
	tabBarIcon: ({ focused, color, size }) => {
		let imageSrc;

		switch (route.name) {
			case "Home":
				imageSrc = focused ? require('../images/service-provider/tab/home-select.png') : require('../images/service-provider/tab/home.png');
				break;
			case "Booking":
				imageSrc = focused ? require('../images/service-provider/tab/booking-select.png') : require('../images/service-provider/tab/booking.png');
				break;
			case "Scan QR Code":
				imageSrc = focused ? require('../images/service-provider/tab/qrscan-select.png') : require('../images/service-provider/tab/qrscan.png');
				break;
			case "Announcement":
				imageSrc = focused ? require('../images/service-provider/tab/announcement-select.png') : require('../images/service-provider/tab/announcement.png');
				break;
			default:
				imageSrc = focused ? require('../images/service-provider/tab/account-select.png') : require('../images/service-provider/tab/account.png');
				break;
		}

		return <Image source={imageSrc} style={{ width: size, height: size, resizeMode: 'stretch', tintColor: color }} />
	}
});

const ServiceProviderHeaderOptions = {
	title: 'SAF Ferry Booking App',
	headerStyle: {
		backgroundColor: '#1876d2',
	},
	headerTintColor: '#fff',
	headerTitleStyle: {
		fontWeight: 'bold',
		color: 'white',
	},
	headerBackTitleVisible: false,
	headerTitleAlign: 'center',
};

const ServiceProviderTab = createBottomTabNavigator();
const ServiceProviderTabScreen = ({ navigation }) => {
	return (
		<ServiceProviderTab.Navigator initialRouteName="Home" screenOptions={ServiceProviderTabOptions} >
			<ServiceProviderTab.Screen name="Home" component={ServiceProviderHomeStackScreen} />
			<ServiceProviderTab.Screen name="Booking" component={ServiceProviderBookingStackScreen} />
			<ServiceProviderTab.Screen name="Scan QR Code" component={ServiceProviderScanStackScreen} />
			<ServiceProviderTab.Screen name="Announcement" component={ServiceProviderAnnouncementStackScreen} />
			<ServiceProviderTab.Screen name="Account" component={ServiceProviderAccountStackScreen} />
		</ServiceProviderTab.Navigator>
	);
}

export default ServiceProviderTabScreen; 