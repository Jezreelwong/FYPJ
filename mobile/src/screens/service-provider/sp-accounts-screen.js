import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import Screens from '../screens';
import Images from '../../images';
import Colors from '../../colors';
import AwsData from "../../shared/AwsData";
import Stars from 'react-native-stars';

const awsData = new AwsData();

export default ServiceProviderAccountScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [initials, setIntials] = useState('Initials');
  const [averageRating, setRating] = useState('');
  const [userName, setUserName] = useState('Username');
  const [email, setEmail] = useState('Email Address');
  const [isbusy, setbusy] = useState(true);

  useEffect(() => {
    setFullName(AwsData.user.givenName + ' ' + AwsData.user.familyName);
    setIntials(AwsData.user.givenName ? AwsData.user.givenName.charAt(0) : '');
    setRating(AwsData.user.SPaverageRating);
    setUserName(AwsData.user.username);
    setEmail(AwsData.user.email);
    setbusy(false);
  });

  return (
    <View>
      <Avatar
        rounded
        size={160}
        title={initials}
        containerStyle={styles.avatar}
        overlayContainerStyle={{ backgroundColor: Colors.sp_primary }}
      />

      <Text style={styles.TitleName}>{fullName}</Text>
      <Text style={styles.SmallText}>Performance Ratings</Text>
      <Divider source={Images.divider_line} style={styles.Divider} />
      <View style={styles.ratingsView}>
        <Text style={styles.rating}>{averageRating}</Text>
        <View>
          {isbusy?(
            <Text>Loading</Text>
          ): (
            <Stars
            display={averageRating}
            spacing={8}
            count={5}
            starSize={40}
            fullStar={require('../../images/service-provider/star_rating.png')}
            emptyStar={require('../../images/service-provider/star_rating-placeholder.png')}
          />
          )}
        </View>
      </View>
      <Text style={styles.row}>
      <Text>Username </Text>
      <Text style={styles.SmallText}>{userName}</Text>
      </Text>
      <Divider source={Images.divider_line} style={styles.Divider} />
      <Text style={styles.row}>
      <Text>Email </Text>
      <Text style={styles.SmallText}>{email}</Text>
      </Text>
      <Divider source={Images.divider_line} style={styles.Divider} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          awsData.spBookingsCalendar = null;
          awsData.spBookingsHome = null;
          awsData.spBookingsAdHoc = null;
          awsData.spBookingsFixed = null;
          awsData.spBookingsOOS = null;
          navigation.reset({
            index: 0,
            routes: [{ name: Screens.Login }]
          })
        }}>
        <Text style={styles.button_text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    marginTop: 10,
    alignSelf: 'center'
  },
  TitleName: {
    color: "black",
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  SmallText: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 30
  },
  row:{
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 30
  },
  Divider: {
    height: 1,
    width: '90%',
    alignSelf: 'center'
  },
  button:
  {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1876d2',
    marginTop: 20,
    alignSelf: 'center'
  },
  button_text:
  {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 20,
  },
  StarImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  ratingsView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  rating: {
    fontSize: 30,
    marginRight: 10
  }
});