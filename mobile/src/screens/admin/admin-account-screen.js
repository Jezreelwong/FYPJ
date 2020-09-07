import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import Screens from '../screens';
import Images from '../../images';
import Colors from '../../colors';
import AwsData from "../../shared/AwsData";

export default AdminAccountScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [initials, setIntials] = useState('Initials');
  const [userName, setUserName] = useState('Username');
  const [email, setEmail] = useState('Email Address');

  useEffect(() => {
    setFullName(AwsData.user.givenName + ' ' + AwsData.user.familyName);
    setIntials(AwsData.user.givenName ? AwsData.user.givenName.charAt(0) : '');
    setUserName(AwsData.user.username);
    setEmail(AwsData.user.email);
  });

  return (
    <View>

      <Avatar
        rounded
        size={160}
        title={initials}
        containerStyle={styles.avatar}
        overlayContainerStyle={{ backgroundColor: Colors.admin_primary }}
      />

      <Text style={styles.TitleName}>{fullName}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.SmallText1}>Username </Text><Text style={styles.SmallText}>{userName}</Text>
      </View>
      <Divider source={Images.divider_line} style={styles.Divider} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.SmallText1}>Email </Text><Text style={styles.SmallText}>{email}</Text>
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
  },
  SmallText1: {
    color: 'black',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 30,
  },
  Divider: {
    height: 2,
    width: '90%',
    alignSelf: 'center'
  },
  button:
  {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ff5621',
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
});
