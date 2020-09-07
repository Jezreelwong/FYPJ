import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNavigator = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'md-home' : 'md-home';
      } else if (route.name === 'Details') {
        iconName = focused ? 'ios-clipboard' : 'md-clipboard';
      } else if (route.name === 'Account'){
        iconName = focused ? 'md-contact' : 'md-contact';
      }
      // You can return any component that you like here!
      return <Ionicons name={iconName} size={25} color={color} />
    },
    });


const tabBarOptions = {
    activeTintColor: '#b50202',
    inactiveTintColor: 'gray',
  };

  export {BottomNavigator, tabBarOptions};
