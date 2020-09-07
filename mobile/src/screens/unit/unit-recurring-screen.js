import React, { Component, useState } from 'react';
import { Alert, Platform, Text, View, TextInput, StyleSheet, Picker, FlatList, SafeAreaView, ImageBackground, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import moment from "moment";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox, Divider } from 'react-native-elements'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import ModalPicker from "../../components/ModalPicker";
import Input from "../../components/Input";
import NavigationInput from "../../components/NavigationInput";
import ServiceProviderType from "../../shared/enums/ServiceProviderType";
import Screens from '../screens';
import Images from '../../images';
import AwsData from "../../shared/AwsData";

class UnitRecurringScreen extends Component {
  constructor(props) {
    super(props);
    props.navigation.setOptions({
      // headerLeft: () => (
      //   <TouchableOpacity
      //     style={styles.headerLeftTouchable}
      //     onPress={this.goBack}
      //   >
      //     <Ionicons name="ios-close" color="white" size={45} style={{ width: 45, height: 45 }} />
      //   </TouchableOpacity>
      // ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerRightTouchable}
          onPress={this.goBack}
        >
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      )
    });
    this.weekdays = [
      { key: 1, label: "Every Monday" },
      { key: 2, label: "Every Tuesday" },
      { key: 3, label: "Every Wednesday" },
      { key: 4, label: "Every Thursday" },
      { key: 5, label: "Every Friday" },
      { key: 6, label: "Every Saturday" },
      { key: 7, label: "Every Sunday" },
    ]

    this.state = {
      weekday: "",
      weekdayErrorMsg: "",
      endDateText: "",
      endDate: null,
      endDateErrorMsg: "",
      dateText: moment().toDate()
    }
  }

  componentDidMount() {
    if (this.props.route.params.dateText !== "") {
      this.setState({
        dateText: this.props.route.params.dateText
      })
    }

    if (this.props.route.params.endDateText) {
      this.setState({
        endDateText: this.props.route.params.endDateText
      })
    }

    if (this.props.route.params.weekday) {
      const weekdayArray = this.props.route.params.weekday
      for (let i = 0; i < weekdayArray.length; i++) {
        switch (weekdayArray[i]) {
          case "Every Monday":
            this.setState({
              checkedMon: true
            });
            break;
          case "Every Tuesday":
            this.setState({
              checkedTue: true
            });
            break;
          case "Every Wednesday":
            this.setState({
              checkedWed: true
            });
            break;
          case "Every Thursday":
            this.setState({
              checkedThu: true
            });
            break;
          case "Every Friday":
            this.setState({
              checkedFri: true
            });
            break;
          case "Every Saturday":
            this.setState({
              checkedSat: true
            });
            break;
          case "Every Sunday":
            this.setState({
              checkedSun: true
            });
            break;
          default:
            break;
        }
      }
    }
  }

  goBack = () => {
    const {
      endDateText,
      weekday,
      checkedMon,
      checkedTue,
      checkedWed,
      checkedThu,
      checkedFri,
      checkedSat,
      checkedSun
    } = this.state

    let weekdayInput = ""

    if (checkedMon) {
      weekdayInput = weekdayInput + "Every Monday,"
    }
    if (checkedTue) {
      weekdayInput = weekdayInput + "Every Tuesday,"
    }
    if (checkedWed) {
      weekdayInput = weekdayInput + "Every Wednesday,"
    }
    if (checkedThu) {
      weekdayInput = weekdayInput + "Every Thursday,"
    }
    if (checkedFri) {
      weekdayInput = weekdayInput + "Every Friday,"
    }
    if (checkedSat) {
      weekdayInput = weekdayInput + "Every Saturday,"
    }
    if (checkedSun) {
      weekdayInput = weekdayInput + "Every Sunday"
    }

    const weekdaySplit = weekdayInput.split(',')
    if (weekdaySplit[weekdaySplit.length-1] === "") {
      weekdaySplit.pop();
    }

    if (this.props.route.params.serviceProviderType === 'P') {
      this.props.navigation.navigate(Screens.UnitBookPassenger, {
        endDateText: endDateText,
        weekday: weekdaySplit
      })
    } else {
      this.props.navigation.navigate(Screens.UnitBookRPL, {
        endDateText: endDateText,
        weekday: weekdaySplit
      })
    }
  }

  setEndDate = endDate => {
    this.setState({
      endDate,
      endDateText: moment(endDate).format("D MMM YYYY"),
      endDateErrorMsg: ""
    })
  }

  setWeekday = weekday => {
    this.setState({
      weekday: weekday.label,
      weekdayErrorMsg: ""
    })
  }

  render() {
    const {
      weekday,
      weekdayErrorMsg,
      endDateText,
      endDateErrorMsg,
      dateText
    } = this.state
    return (
      <ImageBackground source={Images.unit_background}
        style={styles.BackgroundImage}>
        <View>
          <Text style={styles.Title}>Recurring Settings</Text>
          <ScrollView style={styles.screen}>
            {
              AwsData.user.role === "PU" ?
                <>
                  <DatePicker
                    value={endDateText}
                    errorMessage={endDateErrorMsg}
                    onConfirm={endDate => this.setEndDate(endDate)}
                    placeholder="Select End Recurring Date"
                    minDate={moment(this.state.dateText).toDate()}
                    maxDate={moment().add(2, 'months').toDate()}
                  />
                </>
                :
                <>
                  <DatePicker
                    value={endDateText}
                    errorMessage={endDateErrorMsg}
                    onConfirm={endDate => this.setEndDate(endDate)}
                    placeholder="Select End Recurring Date"
                    minDate={moment(this.state.dateText).toDate()}
                    maxDate={moment().add(3, 'months').toDate()}
                  />
                </>
            }
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Monday'
              checked={this.state.checkedMon}
              onPress={() => this.setState({
                checkedMon: !this.state.checkedMon
              })}
              checkedColor="red"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Tuesday'
              checked={this.state.checkedTue}
              onPress={() => this.setState({
                checkedTue: !this.state.checkedTue
              })}
              checkedColor="red"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Wednesday'
              checked={this.state.checkedWed}
              onPress={() => this.setState({
                checkedWed: !this.state.checkedWed
              })}
              checkedColor="red"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Thursday'
              checked={this.state.checkedThu}
              onPress={() => this.setState({
                checkedThu: !this.state.checkedThu
              })}
              checkedColor="red"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Friday'
              checked={this.state.checkedFri}
              onPress={() => this.setState({
                checkedFri: !this.state.checkedFri
              })}
              checkedColor="red"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Saturday'
              checked={this.state.checkedSat}
              onPress={() => this.setState({
                checkedSat: !this.state.checkedSat
              })}
              checkedColor="red"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title='Every Sunday'
              checked={this.state.checkedSun}
              onPress={() => this.setState({
                checkedSun: !this.state.checkedSun
              })}
              checkedColor="red"
            />
          </ScrollView>
        </View>

      </ImageBackground>
    )
  }
}


const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  headerLeftTouchable: {
    marginLeft: 15
  },
  headerRightTouchable: {
    marginRight: 15
  },
  done: {
    fontSize: 18,
    color: 'white'
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
  screen: {
    //flex: 1,
    backgroundColor: "#fff",
    //height: 50,
    //height: '50%',
    marginTop: 16,
    marginBottom: 10
  },
  checkbox: {
    backgroundColor: "#fff",
    marginLeft: 20,
    marginRight: 20,
  }
})

export default UnitRecurringScreen