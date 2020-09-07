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
  Alert
} from 'react-native';
import Screens from './screens';
import Images from '../images';
import AwsData from "../shared/AwsData";
import { UserRoles } from '../models/User';

const awsData = new AwsData();

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20
  },
  logo: {

    fontWeight: "bold",
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
  },
  loginText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
  },

});

class FirstTimeLoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      session: this.props.route.params.session,
      email: "",
      password: "",
      username: "",
      secondPassword: "",
    }
  }

  validate_field = () => {
    const { username, password, email, secondPassword } = this.state
    if (username === "") {
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
    } else if (password === "") {
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
    } else if (email === "") {
      Alert.alert(
        "Invalid Email",
        "Please enter your email",
        [
          {
            text: 'OK'
          }
        ]
      )
      return false
    } else if (password != secondPassword) {
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

  completeRegistration = async () => {
    if (this.validate_field()) {
      // const response = await awsData.completeRegistration(this.state.email, this.state.username, this.state.password, this.state.session)
      const response = await awsData.firstTimeLogin(this.state.email, this.state.username, this.state.password, this.state.session)

      if (response === "Success") {
        Alert.alert(
          "Registration complete!",
          "You may now Login using your new crdentials",
          [
            { text: "OK", onPress: () => this.props.navigation.navigate(Screens.Login) }
          ]);
      } else {
        Alert.alert(
          "Registration Failed",
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

        <KeyboardAvoidingView style={styles.container}>

          <Text style={styles.logo}>First-Time Login</Text>

          <View style={styles.inputView}>
            <TextInput style={styles.inputText}
              placeholder="Enter Email"
              placeholderTextColor="white"
              onChangeText={(value) => this.setState({ email: value })}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput style={styles.inputText}
              placeholder="Enter New Username"
              placeholderTextColor="white"
              onChangeText={(value) => this.setState({ username: value })}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput style={styles.inputText}
              secureTextEntry
              placeholder="Enter New Password"
              placeholderTextColor="white"
              onChangeText={(value) => this.setState({ password: value })}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput style={styles.inputText}
              secureTextEntry
              placeholder="Confirm Password"
              placeholderTextColor="white"
              onChangeText={(value) => this.setState({ secondPassword: value })}
            />
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.completeRegistration()}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </ImageBackground>
    );
  };
}

export default FirstTimeLoginScreen;

