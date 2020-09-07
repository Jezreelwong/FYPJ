import React from 'react';
import { Button, View, Text, ImageBackground, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Images from '../images';
import Screens from './screens';
import AwsData from '../shared/AwsData';
import Spinner from 'react-native-loading-spinner-overlay';
import { UserRoles } from '../models/User';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
    height: '100%'
  },
  logo: {
    marginTop: 100,
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    textAlign: 'center',
    marginBottom: 10,

  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#00bfa5",
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  loginText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  borderStyleBase: {
    width: 55,
    height: 55,
    borderWidth: 1,
    fontSize: 30,
    borderColor: "#888888",
    color: 'black',
    backgroundColor: '#D3D3D3'
  },
  borderStyleHighLighted: {
    borderColor: "#888888",
  },
  OTPInputView: {
    width: 350,
    height: 80,
    color: 'black',
    alignSelf: 'center'
  },
  loginText2: {
    color: "black",
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingBottom: 20
  },
  resendText: {
    color: "#00bfa5",
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  resendBtn: {
    width: "80%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
})

const awsData = new AwsData();

class TwoFAScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: AwsData.user.email,
      otp: "",
      loading: false,
    }
  }

  validate_field = () => {
    const { otp } = this.state
    if (otp === "") {
      Alert.alert(
        "Invalid OTP",
        "Please enter the OTP",
        [
          {
            text: 'OK'
          }
        ]
      )
      return false
    }
    return true
  }

  verifyOTP = async () => {
    if (this.validate_field()) {
      this.setState({ loading: true })
      let response = await awsData.verifyOTP(this.state.email, this.state.otp)

      if (response === "Success") {
        awsData.fetchData();
        switch (AwsData.user.role) {
          case UserRoles.Admin:
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.Admin }]
            });
            break;

          case UserRoles.DutyPersonnel:
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.DutyPersonnel }]
            });
            break;

          case UserRoles.ServiceProvider:
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.ServiceProvider }]
            });
            break;

          case UserRoles.Unit:
          case UserRoles.PrivilegedUser:
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.Unit }]
            });
            break;

          default:
            break;
        }
      } else {
        Alert.alert(
          "Unable to Login",
          response,
          [
            { text: "OK", onPress: () => this.setState({ loading: false }) }
          ]);
      }
    }
  }

  resendOTP = async () => {
    this.setState({ otp: "" })
    const result = await awsData.resendOTP();

    if (result == "Success") {
      Alert.alert(
        "Success",
        "OTP has been resent. Please check your email",
        [
          {
            text: 'OK'
          }
        ]
      )
    } else {
      Alert.alert(
        "Resend OTP Failed",
        result,
        [
          {
            text: 'OK'
          }
        ]
      )
    }
  }

  render() {
    return (
      <View>
        <Spinner
          visible={this.state.loading}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.logo}>Enter OTP</Text>
            <Text style={styles.loginText2}>We have sent OTP to your Email</Text>
            <OTPInputView
              style={styles.OTPInputView}
              code={this.state.otp}
              codeInputFieldStyle={styles.borderStyleBase}
              codeInputHighlightStyle={styles.borderStyleHighLighted}
              pinCount={6}
              onCodeChanged={(code) => this.setState({ otp: code })}
            />

            <TouchableOpacity style={styles.loginBtn}
              onPress={() => this.verifyOTP()}>
              <Text style={styles.loginText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn}
              onPress={() => this.resendOTP()}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default TwoFAScreen;
