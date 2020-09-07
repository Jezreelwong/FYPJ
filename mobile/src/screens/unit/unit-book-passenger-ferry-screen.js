import React, { Component, useState } from 'react';
import { Platform, Text, View, TextInput, StyleSheet, Picker, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Screens from '../screens';
import Images from '../../images';

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  Overallbackgroundcontainer:
  {
    height: 50,
    marginTop: 10
  },
  backgroundcontainer:
  {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
  },
  SafeAreaView:
  {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  textStyle:
  {
    height: 40,
    borderColor: 'black',
    color: '#1A1A1A',
    borderRadius: 10,
    marginTop: 15,
    marginVertical: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    width: 200,
  },
  textStyleDate:
  {
    height: 40,
    borderColor: 'black',
    color: '#1A1A1A',
    borderRadius: 10,
    marginTop: 22,
    marginVertical: 20,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  Icons:
  {
    height: 40,
    width: 60,
    fontSize: 40,
    color: 'red',
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  IconsLeft:
  {
    height: 60,
    width: 80,
    fontSize: 60,
    color: 'white',
    marginLeft: 30,
  },
  IconsRight:
  {
    height: 40,
    width: 60,
    fontSize: 40,
    color: 'white'
  },
  pickerStyle:
  {
    height: 50,
    width: "80%",
    color: '#1A1A1A',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  pickerStyleIOS:
  {
    height: 100,
    width: "80%",
    color: '#000000',
  },
  ButtonSubmit:
  {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#dc143c',
    marginLeft: 110,
    marginRight: 10,
  },
  ButtonSubmitText:
  {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 20,
  },
  Title:
  {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});

const DetailPicker = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [selectedroute, onrouteChange] = useState('');
  const [selectedpurpose, onpurposeChange] = useState('');
  const [text, setText] = useState('');


  return (
    <ImageBackground source={Images.unit_background}
      style={styles.BackgroundImage}>
      <SafeAreaView style={styles.SafeAreaView}>
        <Text style={styles.Title}>Bookings</Text>
        <View>
          <View style={styles.Overallbackgroundcontainer}>
            <View style={styles.backgroundcontainer}>
              <Ionicons style={styles.Icons} name={"ios-calendar"} />
              <View>
                <Text style={styles.textStyleDate} onPress={showDatepicker}>
                  {date.toDateString()}
                </Text>
                {show && (
                  <RNDateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={date}
                    is24Hour={true}
                    display="Calendar"
                    onChange={onChange}
                    maximumDate={new Date(2020, 4, 30)}
                    minimumDate={new Date()}

                  />
                )}
              </View>

            </View>
            <Divider style={{ backgroundColor: 'grey' }} />
            <View style={styles.backgroundcontainer}>
              <Ionicons style={styles.Icons} name={"ios-compass"} />
              <Picker style={styles.pickerStyle}
                selectedValue={selectedroute}
                onValueChange={(itemValue) => onrouteChange(itemValue)}
              >
                <Picker.Item label="Select Your  Route " value="Null" />
                <Picker.Item label="SFT-TFT" value="SFT-TFT" />
                <Picker.Item label="TFT-SFT" value="TFT-SFT" />
              </Picker>

            </View>
            <Divider style={{ backgroundColor: 'grey' }} />
            <View style={styles.backgroundcontainer}>
              <Ionicons style={styles.Icons} name={"ios-copy"} />
              <Picker style={styles.pickerStyle}
                selectedValue={selectedpurpose}
                onValueChange={(itemValue) => onpurposeChange(itemValue)}
              >
                <Picker.Item label="Choose Purpose" value="Null" />
                <Picker.Item label="Daily Ferry Service" value="Ferry Service" />
                <Picker.Item label="Recruit Book In/Out" value="Book In/Out " />
                <Picker.Item label="Direct Enlistment" value="Enlistment" />
                <Picker.Item label="Graduation Parade" value="Parade" />
                <Picker.Item label="Singapore Permanent Resident Visit" value="Visit" />
                <Picker.Item label="Training Qualification Course(TQC) Participants" value="Participants" />
                <Picker.Item label="MINDEF/SAF Units residing on mainland Singapore" value="MINDEF/SAF" />
                <Picker.Item label="Family Visit" value="Family" />
              </Picker>
            </View>
            <Divider style={{ backgroundColor: 'grey' }} />
            <View style={styles.backgroundcontainer}>
              <Ionicons style={styles.Icons} name={"ios-people"} />
              <TextInput style={styles.textStyle} keyboardType="number-pad"
                placeholder="Select Number of Passenger" onChangeText={text => setText(text)}
                defaultValue={text}
              />
            </View>
          </View>
          <View style={{ marginTop: 300 }}>
            <TouchableOpacity onPress={() => navigation.navigate(Screens.UnitFerryScheduledTimings, { route: selectedroute, time: date.toDateString() })} style={styles.ButtonSubmit}>
              <Text style={styles.ButtonSubmitText}>Search</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>


  );
};

export default DetailPicker;


