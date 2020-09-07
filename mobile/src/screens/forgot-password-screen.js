import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import Screens from './screens';
import Images from '../images';
import AwsData from "../shared/AwsData";
import { UserRoles } from '../models/User';
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20
  },
  logo: {

    fontWeight: "bold",
    fontFamily: 'Roboto',
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    marginBottom: 30,

  },
  inputView: {
    width: "80%",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    height: 40,
    marginBottom: 4,
    justifyContent: "center",
    padding: 10
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
  loginText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      loading: false
    }
  }

  validate_field = () => {
    const { username } = this.state
    if (username === "") {
      Alert.alert(
        "Invalid user",
        "Please enter your username/email",
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

  sendOTP = async () => {
    if (this.validate_field()) {
      this.setState({ loading: true })
      const response = await awsData.forgetPassword(this.state.username)
      this.setState({ loading: false })
      if (response === "Success") {
        this.props.navigation.navigate(Screens.OTP, { username: this.state.username })
      } else {
        Alert.alert(
          "Unable to process",
          response,
          [
            { text: "OK" }
          ]);
      }
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={styles.container}>

            <Text style={styles.logo}>Forgot Password</Text>

            <View style={styles.inputView}>
              <TextInput style={styles.inputText}
                placeholder="Enter Username or Email"
                value={this.state.username}
                placeholderTextColor="white"
                onChangeText={(value) => this.setState({ username: value.trim() })}
              />
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this.sendOTP()}>
              <Text style={styles.loginText}>Send OTP to Email</Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  };
}

export default ForgotPasswordScreen;

