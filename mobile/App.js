import 'react-native-gesture-handler';
//import * as React from 'react';
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");

import moment from "moment";
moment.locale("en-SG");

import Screens from './src/screens/screens';
import LoginScreen from './src/screens/login-screen';
import OTPScreen from './src/screens/forgot-password-otp-screen';
import ServiceProviderTabScreen from './src/screens/sp-screens';
import AdminTabScreen from './src/screens/admin-screens';
import UnitTabScreen from './src/screens/unit-screens';
import DutyPersonnelStackScreen from './src/screens/dp-screens';
import { UserDevice } from './src/models/User';

import AwsData from "./src/shared/AwsData";
const awsData = new AwsData();

const linking = {
	prefixes: ["https://master.d21p887xxadqi5.amplifyapp.com"],
	config: {
    OTP: {
      path: "forget"
    },
    Login: 'login'
}
};

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
    AwsData.userDevice = new UserDevice(token.os, token.token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
		console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

const AppMainStack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer linking={linking}>
			<AppMainStack.Navigator>
				<AppMainStack.Screen name={Screens.Login} component={LoginScreen} options={{ headerShown: false }} />
				<AppMainStack.Screen name={Screens.OTP} component={OTPScreen} />
				<AppMainStack.Screen name={Screens.Unit} component={UnitTabScreen} options={{ headerShown: false }} />
				<AppMainStack.Screen name={Screens.Admin} component={AdminTabScreen} options={{ headerShown: false }} />
				<AppMainStack.Screen name={Screens.ServiceProvider} component={ServiceProviderTabScreen} options={{ headerShown: false }} />
				<AppMainStack.Screen name={Screens.DutyPersonnel} component={DutyPersonnelStackScreen} options={{ headerShown: false }} />
			</AppMainStack.Navigator>
		</NavigationContainer>
	);
}
