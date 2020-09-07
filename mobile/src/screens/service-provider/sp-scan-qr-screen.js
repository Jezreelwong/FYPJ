import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, TouchableWithoutFeedback, Keyboard , TouchableOpacity, KeyboardAvoidingView, Text, Modal, Alert, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AwsData from "../../shared/AwsData";
import Screens from '../screens';
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 300,
  },
  sectionContainer1: {
    height: '100%',
    justifyContent: 'center',
  },
  buttonTouchable: {
    padding: 16,
  },
  openButton: {
    borderRadius: 10,
    padding: 10,
    height: 50,
    width: 100,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5
  },
  ButtonSubmit:
  {
    width: "50%",
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    flex: 1,
  },
  ButtonSubmitText:
  {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 20,
    backgroundColor: '#1876d2',
    borderRadius: 5,
    margin:2,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 35,
    alignItems: "center",
    width: 500,
    height: 400
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 500
  },
  modalText: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center",
    width: 280,
  },
  itemContainer:
  {
    width: "95%",
    flexDirection: "row",
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 5,
  },

  leftCol:
  {
    width: "70%",
  },

  rightCol:
  {
    width: "30%",
    justifyContent: 'center',
    marginTop: '5%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

  export default scanQRCodeScreen = ({ navigation }) => {
  
  const [value, onChangeText] = React.useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errormsg, seterrormsg] = useState('');
  const [loading, setloading] = useState(false);
  let scanner = useRef(null);

  function onSuccess(e) {
    setModalVisible(false);
    verifyBooking(e.data, 1);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      if(scanner != null && scanner != undefined)
      scanner.reactivate();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  async function verifyBooking(bookingCode, from){
    if(bookingCode == ''){
      seterrormsg('Please enter a booking code');
      setloading(false);
      return;
    }
    bookingCode = bookingCode.toUpperCase().trim();
    console.log(bookingCode + ' is being verified');
    await awsData.spVerifyBooking(bookingCode)
    .then(values =>{
      if(values.Booking != undefined && values.Booking != null && values.Booking != []){
        setModalVisible(false);
        //console.log(values.Booking);
        navigation.navigate(Screens.ServiceProviderScanResult, { results: values.Booking });
      }
      else{
        if(from == 1){

        let msg = values.result.body.message;
        
          Alert.alert(
            '',
            msg,
            [
              { text: "OK",  onPress: () =>{ if(scanner != null && scanner != undefined)
                scanner.reactivate() }}
            ]
          );
        }
        if(from == 2)
        seterrormsg(values.result.body.message);
        setloading(false);
      }
    })
  }
  
    return loading ? (
      <Spinner
        visible={true}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
    ) : (
      <>
        <SafeAreaView>
          <View style={styles.sectionContainer1}>
            <QRCodeScanner
              vibrate={false}
              ref = {(camera) => scanner = camera}
              showMarker={true}
              onRead={onSuccess}
              bottomContent={
                <View>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(false);
                    }}
                    style={{height: '100%'}}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : null}>
                    <TouchableWithoutFeedback touchSoundDisabled={true} onPress={Keyboard.dismiss}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Ionicons
                          onPress={() => setModalVisible(false)}
                          name={'ios-close'}
                          style={{
                            height: 40,
                            width: 40,
                            fontSize: 40,
                            marginRight: 330,
                          }}
                        />
                        <Text style={styles.modalText}>
                          <Text>Enter Booking Code</Text>
                        </Text>
                        <View style={styles.itemContainer}>
                          <View style={styles.leftCol}>
                            <Text
                            style={{color: 'red'}}>
                            {errormsg}
                          </Text>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderRadius: 2,
                                width: 255,
                                height: 50,
                                paddingLeft:7,
                                borderColor: 'grey',
                                marginTop: Platform.OS === 'ios' ? 5 : 0
                              }}
                              autoCapitalize='characters'
                              placeholder="Your Code"
                              onChangeText={text =>{
                                onChangeText(text);
                                seterrormsg('');
                              }}
                              value={value}
                            />
                          </View>
                          <View style={styles.rightCol}>
                            <TouchableOpacity
                              style={{
                                ...styles.openButton,
                                backgroundColor: '#1876d2',
                              }}
                              onPress={() => {
                                if(!loading)
                                setloading(true);
                                verifyBooking(value, 2);
                              }}>
                              <Text style={styles.textStyle}>Validate</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                  </Modal>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                    }}
                    style={styles.ButtonSubmit}>
                    <Text style={styles.ButtonSubmitText}>
                      Can't Scan Code
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </SafeAreaView>
      </>
    );
};