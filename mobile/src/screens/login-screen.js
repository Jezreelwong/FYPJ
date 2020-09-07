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
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert
} from 'react-native';
import Screens from './screens';
import Images from '../images';
import AwsData from "../shared/AwsData";
import { UserRoles } from '../models/User';
import { createStackNavigator } from '@react-navigation/stack';
import ForgotPasswordScreen from './forgot-password-screen';
import OTPScreen from './forgot-password-otp-screen';
import FirstTimeLoginScreen from './first-time-login-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import TwoFAScreen from './2fa-screen';

const awsData = new AwsData();

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  SafeAreaView:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: Constants.statusBarHeight,
  },
  button:
  {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#45B39D',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  button_text:
  {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20
  },
  header: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginTop: 30,
  },
  title: {
    fontWeight: "bold",
    fontFamily: 'Roboto',
    fontSize: 24,
    color: "white",
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 30
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
  forgot: {
    color: "white",
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1
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

const LoginStack = createStackNavigator();
function loginScreenStack() {
  return (
    <LoginStack.Navigator screenOptions={LoginHeaderOptions}>
      <LoginStack.Screen name={Screens.Login} component={LoginScreen} options={{ headerShown: false }} />
      <LoginStack.Screen name={Screens.ForgotPassword} component={ForgotPasswordScreen} />
      <LoginStack.Screen name={Screens.OTP} component={OTPScreen} options={{ headerLeft: null }} />
      <LoginStack.Screen name={Screens.FirstTimeLogin} component={FirstTimeLoginScreen} />
      <LoginStack.Screen name={Screens.TwoFA} component={TwoFAScreen} />
    </LoginStack.Navigator>
  )
}

const LoginHeaderOptions = {
  title: 'SAF Ferry Booking App',
  headerStyle: {
    backgroundColor: '#45B39D',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleAlign: 'center',
  headerBackTitleVisible: false
};

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      loading: false
    }
    console.disableYellowBox = true;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  validate_field = () => {
    const { email, password } = this.state
    if (email === "") {
      Alert.alert(
        "Login Failed",
        "Please enter your username/email",
        [
          {
            text: 'OK'
          }
        ]
      )
      return false
    } else if (password === "") {
      Alert.alert(
        "Login Failed",
        "Please enter your password. Please try again",
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
    if (capsEmail === "BLUEFROG" || capsEmail === "LIONADMIN" || capsEmail === "LIONDP" || capsEmail === "JAMES" || capsEmail === "TIANSAN") {
      return false;
    } else {
      return true;
    }
    // if (capsEmail === "PINKPANTHER" || capsEmail === "DANIELSHEA" || capsEmail === "FELIXCHANG" || capsEmail === "JAMES" || capsEmail === "LIONPORTAL") {
    //   return true
    // } else {
    //   return false
    // }
  }

  choose_account = async () => {
    // console.log("Choose account function")
    const { email, password } = this.state;
    // console.log("Credentials: " + email + " " + password)
    if (this.validate_field()) {
      try {
        this.setState({ loading: true })
        let user;
        if (this.checkEncrypt(email)) {
          user = await awsData.loginEncrypted(email, password)
        } else {
          user = await awsData.loginAsync(email, password);
        }

        if (typeof user === 'string' || user instanceof String) {
          if (user === 'Redirect2FA') {
            this.setState({ loading: false })
            this.props.navigation.navigate(Screens.TwoFA)
          } else {
            this.setState({ loading: false })
            this.props.navigation.navigate(Screens.FirstTimeLogin, { session: user })
          }
        } else {
          console.log('USER ROLE ' + user.role);
          if (user.role === "A") {
            awsData.fetchData(); // Added fetchData here for unencrypted login (during testing)
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.Admin }]
            });
            return;
          } else if (user.role === "DP") {
            awsData.fetchData();
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.DutyPersonnel }]
            });
            return;
          } else if (user.role === "SP") {
            awsData.fetchData();
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.ServiceProvider }]
            });
            return;
          } else if (user.role === "U" || user.role === "PU") {
            awsData.fetchData();
            this.setState({ loading: false })
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Screens.Unit }]
            });
            return;
          } else {
            Alert.alert(
              "Login Failed",
              "Invalid Email or Password. Please try again",
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false })
                }
              ]
            )
          }
        }
      } catch (error) {
        Alert.alert(
          "Login Failed",
          "Network unavailable. Please try again",
          [
            {
              text: 'OK', onPress: () => this.setState({ loading: false })
            }
          ]
        )
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

            <Text style={styles.header}>SAF Ferry Booking App</Text>

            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputView}>
              <TextInput
                testID="UsernameInput"
                value={this.state.email}
                style={styles.inputText}
                placeholder="Username or Email"
                placeholderTextColor="white"
                onChangeText={(value) => {
                  this.setState({ email: value.trim() })
                }}
              />
            </View>

            <View style={styles.inputView}  >
              <TextInput
                testID="PasswordInput"
                secureTextEntry
                value={this.state.password}
                style={styles.inputText}
                placeholder="Password"
                placeholderTextColor="white"
                onChangeText={(value) => {
                  this.setState({ password: value.trim() })
                }}
              />
            </View>

            <TouchableOpacity testID="loginBtn" style={styles.loginBtn}
              onPress={() => {
                // console.log("Login button pressed")
                this.choose_account()
              }}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(Screens.ForgotPassword);
              }}>
              <Text testID="forgotText" style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  };
}

export default loginScreenStack;