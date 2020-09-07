import React from 'react';
import Screens from '../../screens/screens.js';
import Images from "../../images"
import { StyleSheet, Text, View, TouchableOpacity, SectionList, Image } from 'react-native';

const SPListItem = ({
  section,
  functionRefresh,
  navigation
}) => {


  return (
    <SectionList
      sections={section}
      keyExtractor={item => item.bookingCode}
      renderItem={
        ({ item }) => {
          return (
              <TouchableOpacity onPress={()=> {
                console.log(item);
                let feedback = true
                if(item.SPFFeedback != undefined)
                feedback = false
      navigation.navigate(Screens.ServiceProviderBookingData, { booking:item , feedback, functionRefresh});
    }}>
    <View style={styles.item}>
      <View style={styles.leftCol}>
        <View style={styles.row1}>
          <Text>From </Text>
          <Text style={styles.value}>{item.routeName}</Text>
          {
            item.bookingGroup != null && item.bookingGroup != "" ?
              <Image source={Images.icon_recurring_booking} resizeMode="contain" style={styles.serviceProviderIcon} />
              :
              <></>
          }
        </View>
        <Text style={styles.row}>
          <Text>Booked By </Text>
          <Text style={styles.value}>{item.displayUserName}</Text>
        </Text>
        <Text style={styles.row}>
          <Text>Purpose </Text>
          <Text style={styles.value}>{item.purposeShort}</Text>
        </Text>
      </View>
      <View style={styles.rightCol}>
        <View style={[styles.codeContainer, { backgroundColor: CODE_BACKGROUND_COLOR[item.bookingType] }]}>
          <Text style={[styles.value, styles.code, { color: CODE_COLOR[item.bookingType] }]}>{item.bookingCode}</Text>
        </View>
        <Text style={styles.row}>
          <Text>Time </Text>
          <Text style={styles.value}>{item.departureTime}</Text>
        </Text>
        <View style={[styles.statusContainer, { backgroundColor: STATUS_BACKGROUND_COLOR[item.status] }]}>
          <Text style={[styles.value, { color: STATUS_COLOR[item.status] }]}>{item.status}</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
          );
        }
      }
    />
  );
};

export default SPListItem;

const CODE_BACKGROUND_COLOR = {
    "OOS": "#262e83",
    "Ad-Hoc": "#e72014"
  };
  
  const CODE_COLOR = {
    "Fixed": "black",
    "OOS": "white",
    "Ad-Hoc": "white"
  };
  const STATUS_BACKGROUND_COLOR = {
    "Pending": "#ffdbad",
    "Rejected": "#ffc5cc",
    "Approved": "#bbe3c4"
  };
  
  const STATUS_COLOR = {
    "Pending": "#f3582d",
    "Rejected": "#bf1d28",
    "Approved": "#116132"
  };

const styles = StyleSheet.create({
    item: {
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 5,
      padding: 20,
      borderRadius: 3,
      alignSelf: "center",
      backgroundColor: "white"
    },
    leftCol: {
      width: "60%"
    },
    rightCol: {
      width: "40%",
      alignItems: "center"
    },
    row1: {
      marginTop: 5,
      flexDirection: "row",
      width: 60,
      height: 23
    },
    row: {
      paddingVertical: 5,
    },
    value: {
      fontWeight: "bold"
    },
    code: {
      color: "#fff"
    },
    codeContainer: {
      paddingHorizontal: 20,
      borderRadius: 3,
      paddingVertical: 2,
      marginVertical: 3,
    },
    statusContainer: {
      paddingHorizontal: 30,
      paddingVertical: 5,
      borderRadius: 3,
    },
    value: {
      fontWeight: "bold",
      fontFamily: 'Roboto',
    },
    serviceProviderIcon: {
      width: 20,
      height: 17,
      marginLeft: 5
    }
  });


