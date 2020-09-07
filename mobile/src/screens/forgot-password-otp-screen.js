import React from 'react';
import {
  Button,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  ScrollView,
  Platform,
  SafeAreaView
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Images from '../images';
import Screens from './screens';
import AwsData from '../shared/AwsData';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    alignItems: 'center',
    paddingTop: 10,
    height: '100%'
  },
  logo: {

    fontWeight: "bold",
    fontFamily: 'Roboto',
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    marginBottom: 10,

  },
  inputView: {
    width: "80%",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    height: 40,
    marginBottom: 4,
    justifyContent: "center",
    padding: 10,
    marginTop: 10
  },
  inputText: {
    height: 50,
    color: "white",
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
  resendBtn: {
    width: "80%",
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
    fontSize: 30
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  OTPInputView: {
    width: 350,
    height: 100,
    alignSelf: 'center'
  },
  loginText2: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingTop: 10
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
})

const awsData = new AwsData();

class OTPScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      newPassword: "",
      secondPassword: "",
      otp: "",
      loading: false,
    }

    if (this.props.route.params) {
      this.setState({ username: this.props.route.params.username })
    }
  }

  validate_field = () => {
    const { newPassword, otp, secondPassword, username } = this.state
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
    } else if (username === "") {
      Alert.alert(
        "Invalid Username",
        "Please enter your username",
        [
          {
            text: 'OK'
          }
        ]
      )
      return false
    } else if (newPassword === "") {
      Alert.alert(
        "Invalid Password",
        "Please enter your password",
        [
          {
            text: 'OK'
          }
        ]
      )
      return false
    } else if (newPassword != secondPassword) {
      Alert.alert(
        "Invalid Password",
        "Passwords did not match. Please try again",
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

  checkEncrypt = (email) => {
    const capsEmail = email.toUpperCase()
    if (capsEmail === "PINKPANTHER" || capsEmail === "DANIELSHEA" || capsEmail === "FELIXCHANG" || capsEmail === "JAMES" || capsEmail === "LIONPORTAL") {
      return true
    } else {
      return false
    }
  }

  sendPassword = async () => {
    if (this.validate_field()) {
      this.setState({ loading: true })
      let response;
      response = await awsData.confirmForgetPasswordEncrypted(this.state.username, this.state.newPassword, this.state.otp)

      if (response === "Success") {
        Alert.alert(
          "Success",
          "Password changed!",
          [
            {
              text: "OK", onPress: () => {
                this.setState({ loading: false })
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: Screens.Login }]
                });
              }
            }
          ]);
      } else {
        Alert.alert(
          "Unable to process",
          response,
          [
            { text: "OK", onPress: () => this.setState({ loading: false }) }
          ]);
      }
    }
  }

  resendOtp = async () => {
    this.setState({ otp: "" })

    if (this.state.username !== undefined && this.state.username !== "") {
      const result = await awsData.forgetPassword(this.state.username)
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
    } else {
      Alert.alert(
        "Resend OTP Failed",
        "Please enter your username",
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
      <ImageBackground
        style={styles.BackgroundImage}
        resizeMode='cover'
        source={Images.login_background}>
        <Spinner
          visible={this.state.loading}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView>
          <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === "ios" ? 100 : null}
            behavior={Platform.OS === "ios" ? "position" : ""} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              {/* <View styles={styles.container}> */}
              <View style={styles.container}>
                <Text style={styles.logo}>Reset Password</Text>
                <Text style={styles.loginText}>Enter OTP</Text>
                <Text style={styles.loginText}>We have sent OTP to your Email</Text>
                <OTPInputView
                  style={styles.OTPInputView}
                  code={this.state.otp}
                  codeInputFieldStyle={styles.borderStyleBase}
                  codeInputHighlightStyle={styles.borderStyleHighLighted}
                  pinCount={6}
                  onCodeChanged={(code) => this.setState({ otp: code })}
                />

                <Text style={styles.loginText2}>Enter Username</Text>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputText}
                    value={this.state.username}
                    placeholder="Username"
                    placeholderTextColor="white"
                    onChangeText={(value) => this.setState({ username: value.trim() })}
                  />
                </View>

                <Text style={styles.loginText2}>Enter New Password</Text>
                <View style={styles.inputView}>
                  <TextInput style={styles.inputText}
                    secureTextEntry
                    value={this.state.newPassword}
                    placeholder="Password"
                    placeholderTextColor="white"
                    onChangeText={(value) => this.setState({ newPassword: value.trim() })}
                  />
                </View>

                <View style={styles.inputView}>
                  <TextInput style={styles.inputText}
                    secureTextEntry
                    value={this.state.secondPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor="white"
                    onChangeText={(value1) => this.setState({ secondPassword: value1.trim() })}
                  />
                </View>

                <TouchableOpacity style={styles.loginBtn}
                  onPress={() => this.sendPassword()}>
                  <Text style={styles.loginText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendBtn}
                  onPress={() => this.resendOtp()}>
                  <Text style={styles.loginText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
              {/* </View> */}
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    );
  }
}

export default OTPScreen;
