import * as React from 'react';
import { Image } from 'react-native';
import Images from "../../images"
//import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AdminTabOptions = ({ route }) => ({
	tabBarIcon: ({ focused, color, size }) => {
		//let iconName;
		let imageSrc;

		switch (route.name) {
			case "Home":
				//iconName = focused ? "home" : "home-outline";
				imageSrc = focused ? Images.admin_home_select : Images.admin_home_tab
				break;
			case "Booking":
				//iconName = focused ? "clipboard-text" : "clipboard-text-outline";
				imageSrc = focused ? Images.admin_booking_select : Images.admin_booking_tab;
				break;
			case "Announcement":
				imageSrc = focused ? Images.admin_announcement_select : Images.admin_announcement_tab;
				break;
			default:
				//iconName = focused ? "account-circle" : "account-circle-outline";
				imageSrc = focused ? Images.admin_account_select : Images.admin_account_tab;
				break;
		}

		//return <MaterialCommunityIcons name={iconName} size={size} color={color}/>;
		return <Image source={imageSrc} style={{ width: size, height: size, resizeMode: 'stretch', tintColor: color }} />
	}
});

const adminTabBarOptions = {
	activeTintColor: 'tomato',
	inactiveTintColor: 'gray',
};

const adminBookingTopTabBarOptions = {
	labelStyle: {
		fontSize: 12,
		fontWeight: "bold"
	},
	style: {
		elevation: 0,
		backgroundColor: "#ebebeb"
	},
	indicatorStyle: {
		height: 50,
		backgroundColor: "#fff"
	},
	activeTintColor: "tomato",
	inactiveTintColor: "gray"
};

export { AdminTabOptions, adminTabBarOptions, adminBookingTopTabBarOptions };
