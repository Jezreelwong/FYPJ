import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import Screens from '../screens';
import Images from '../../images';
import Colors from '../../colors';
import AwsData from "../../shared/AwsData";

export default UnitAccountScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [initials, setIntials] = useState('Initials');
  const [userName, setUserName] = useState('Username');
  const [email, setEmail] = useState('Email Address');
  const [averageRating, setRating] = useState(' ');

  async function fetchPerformanceRating() {
    const awsData = new AwsData();
    const performanceRating = await awsData.getUnitPerformanceRating()
    setRating(performanceRating)
    return performanceRating;
  };

  useEffect(() => {
    setFullName(AwsData.user.givenName + ' ' + AwsData.user.familyName);
    setIntials(AwsData.user.givenName ? AwsData.user.givenName.charAt(0) : '');
    setUserName(AwsData.user.username);
    setEmail(AwsData.user.email);
    navigation.addListener('focus', () => {
      fetchPerformanceRating();
      }
    )
  }, []);

  return (
    <SafeAreaView>
      <Avatar
        rounded
        size={160}
        title={initials}
        containerStyle={styles.avatar}
        overlayContainerStyle={{ backgroundColor: Colors.unit_primary }}
      />
      <Text style={styles.TitleName}>{fullName}</Text>
      <Text style={styles.SmallText}>Performance Rating</Text>
      <Divider source={Images.divider_line} style={[styles.Divider, styles.dividerAccent]} />
      <View style={styles.ratingsView}>
        <Text style={styles.rating}>{averageRating}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.SmallText}>Username</Text>
        <Text style={styles.SmallText2}>{userName}</Text>
      </View>
      <Divider source={Images.divider_line} style={styles.Divider} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.SmallText}>Email</Text>
        <Text style={styles.SmallText2}>{email}</Text>
      </View>
      <Divider source={Images.divider_line} style={styles.Divider} />
      <TouchableOpacity style={styles.button} onPress={() => 
        navigation.reset({
          index: 0,
          routes: [{ name: Screens.Login }]
        })
        }>
        <Text style={styles.button_text}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    color: 'black',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 30,
  },
  SmallText2: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 5,
  },
  Divider: {
    height: 1,
    width: '90%',
    alignSelf: 'center'
  },
  dividerAccent: {
    backgroundColor: Colors.unit_accent,
  },
  button:
  {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.unit_accent,
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
    marginTop: 10,
  },
  rating: {
    fontSize: 50
  }
});