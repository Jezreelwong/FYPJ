import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { CheckBox } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screens from '../screens';
import AwsData from '../../shared/AwsData';
import moment from "moment";
import ModalPicker from "../../components/ModalPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker"


const Check = [
  { BookingType: "Fixed", checked: false, title: "Fixed", b: 'green' }, { BookingType: "Ad-Hoc", checked: false, title: "Ad-Hoc", b: 'yellow' },
  { BookingType: "OOS", checked: false, title: "OOS", b: 'red' }
]

const awsData = new AwsData();

const AdminFilterScreen = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [minimumDate, setMinimumDate] = useState(new Date());
  const [maximumDate, setMaximumDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [today, setToday] = useState(new Date());
  const [data, setData] = useState([]);
  const [purposes, setPurposes] = useState(mapPurposes(awsData.purposes));
  const [bookingUnits, setBookingUnits] = useState(mapBookingUnits(awsData.bookingUnits));

  const onChange = (selectedDate) => {
    setShow(false);
    setMinimumDate(selectedDate);
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  function reset() {
    setDate(new Date());
    TOsetDate(new Date());
    onpurposeChange('All');
    onUnitChange('All');
    const checked = [...checkbox]
    checked[0]["checked"] = false;
    setcheckbox(checked);
    checked[1]["checked"] = false;
    setcheckbox(checked);
    checked[2]["checked"] = false;
    setcheckbox(checked);
    setMinimumDate(new Date());
    setMaximumDate(new Date());
  }

  async function fetchData() {
    let result = await awsData.getAdminBookings("All");
    if (result != undefined) {
      setData(result);
    }
  }
  useEffect(() => {
    fetchData();
    const passengerPurposes = awsData.purposes.filter(booking => {
      return booking.serviceProviderType == "P";
    });
    let allObject = { "purposeDesc": "All", "purposeShort": "All" };
    passengerPurposes.unshift(allObject);
    setPurposes(mapPurposes(passengerPurposes));

    const array = awsData.bookingUnits.filter(booking => {
      return booking != null;
    })
    array.unshift("All");

    setBookingUnits(mapBookingUnits(array))
  }, []);

  function mapPurposes(purposes) {
    return purposes.reduce((accumulator, purpose) => {
      accumulator.push({
        value: purpose.purposeId,
        label: purpose.purposeDesc,
        short: purpose.purposeShort
      });

      return accumulator;
    }, []);
  }

  function mapBookingUnits(bookingUnits) {
    return bookingUnits.reduce((accumulator, bookingUnit) => {
      accumulator.push({
        value: bookingUnit,
        label: bookingUnit,
      });

      return accumulator;
    }, []);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Filter',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => reset()}>
            <Text style={{ marginRight: 10, color: 'white', fontSize: 15 }}>Reset all</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);


  const [TOdate, TOsetDate] = useState(new Date());
  const [TOmode, TOsetMode] = useState('date');
  const [TOshow, TOsetShow] = useState(false);
  const TOonChange = (TOselectedDate) => {
    TOsetShow(false);
    setMaximumDate(TOselectedDate);
    const TOcurrentDate = TOselectedDate || TOdate;
    TOsetDate(TOcurrentDate);
  };

  const TOshowMode = currentMode => {
    TOsetShow(true);
    TOsetMode(currentMode);
  };

  const TOshowDatepicker = () => {
    TOshowMode('date1');
  };


  const [selectedpurpose, onpurposeChange] = useState("All");
  const [selectedUnit, onUnitChange] = useState("All");
  const [checkbox, setcheckbox] = useState([...Check]);

  function togglecheckbox(index) {
    const checked = [...checkbox]
    checked[index]["checked"] = !checked[index]["checked"]
    setcheckbox(checked)
  }

  function filterData() {
    let BookingData = data.filter(booking => {
      return booking.purposeShort != null && booking.bookingUnit != null;
    })

    const filteredcheckbox = checkbox.filter(checkbox => checkbox.checked).map(checkbox => checkbox.BookingType);
    let bookings = BookingData.filter(booking => {
      const bookingdate = new Date(booking.departureDate);
      const isBetween = moment(bookingdate).isBetween(date, TOdate, "day", '[]');
      const isbookingtype = filteredcheckbox.includes(booking.bookingType);
      const isPurpose = booking.purposeShort.toLowerCase() === selectedpurpose.toLowerCase();
      const isBookingUnit = booking.bookingUnit.toLowerCase() === selectedUnit.toLowerCase();
      if (selectedpurpose != "All") {
        if (selectedUnit != "All") {

          return isBetween && isPurpose && isbookingtype && isBookingUnit;
        } else {
          return isBetween && isPurpose && isbookingtype
        }
      }
      if (selectedUnit != "All") {
        if (selectedpurpose != "All") {
          return isBetween && isPurpose && isbookingtype && isBookingUnit;
        } else {
          return isBetween && isbookingtype && isBookingUnit
        }
      }
      return isBetween && isbookingtype;
    })
    navigation.navigate(Screens.AdminFilterResults, { results: bookings, purpose: selectedpurpose })
  }

  const hideModal = () => {
    setShow(false);
  }

  const hideTOModal = () => {
    TOsetShow(false);
  }
  return (
    <SafeAreaView>
      <Text style={{ marginTop: 20, marginBottom: 5, marginLeft: 7 }}>Date range</Text>
      <View style={styles.itemContainer1}>
        <View style={{ marginLeft: 20, position: "absolute", width: "100%", flexDirection: "row" }}>
          <View style={styles.ThirdCol}>
            <Text>From</Text>
          </View>
          <View >
            <Text>To</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: "95%", marginLeft: 3 }}>
          <View style={styles.pickerborder1}></View>
          <View style={styles.firstCol}>
            <Ionicons style={styles.Icons} name={"ios-calendar"} />
          </View>
          <View style={styles.secondCol}>
            <Text style={styles.textStyleDate1} onPress={showDatepicker}>
              {date.toDateString()}
            </Text>
            <DateTimePickerModal
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              isVisible={show}
              mode="date"
              value={date}
              is24Hour={true}
              display="Calendar"
              onConfirm={onChange}
              onCancel={hideModal}
              maximumDate={maximumDate}
              minimumDate={new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())}
            />
          </View>
          <View style={styles.pickerborder2}></View>
          <View style={styles.firstCol}>
          <Ionicons style={styles.Icons1} name={"ios-calendar"} />
          </View>
          <View>
            <Text style={styles.textStyleDate} onPress={TOshowDatepicker}>
              {TOdate.toDateString()}
            </Text>
            <DateTimePickerModal
              testID="TOdateTimePicker"
              timeZoneOffsetInMinutes={0}
              isVisible={TOshow}
              mode="date"
              value={TOdate}
              is24Hour={true}
              display="Calendar"
              onConfirm={TOonChange}
              onCancel={hideTOModal}
              maximumDate={new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())}
              minimumDate={minimumDate}
            />
          </View>
        </View>
      </View>

      <Text style={{ marginTop: 20, marginLeft: 7, marginBottom: 3 }}> Purpose </Text>
      <View style={{ width: '100%', backgroundColor: 'white', height: 80 }}>
        <View style={styles.pickerborder}>
          <ModalPicker
            screen={"filter1"}
            placeholder="Select Purpose"
            value={selectedpurpose}
            items={purposes}
            onItemSelected={purpose => {
              onpurposeChange(purpose.short)
            }}
          />
        </View>
      </View>

      <Text style={{ marginTop: 20, marginLeft: 7, marginBottom: 3 }}> SAF Unit </Text>
      <View style={{ width: '100%', backgroundColor: 'white', height: 80 }}>
        <View style={styles.pickerborder}>
          <ModalPicker
            screen={"filter"}
            placeholder="Select Booking Unit"
            value={selectedUnit}
            items={bookingUnits}
            onItemSelected={unit => {
              onUnitChange(unit.value)
            }}
          />
        </View>
      </View>

      <Text style={{ marginTop: 20, marginLeft: 7 }}>Type</Text>
      <View style={{ width: "100%", backgroundColor: 'white' }}>
        <FlatList keyExtractor={item => item.title} style={{ width: "100%" }}
          renderItem={({ item, index }) =>
            <CheckBox containerStyle={{ flex: 1 }}
              title={item.title}
              onPress={() => togglecheckbox(index)}
              checked={checkbox[index].checked}
            />
          }
          data={checkbox}
          numColumns={3}
        />
      </View>

      <TouchableOpacity onPress={() => filterData()} style={styles.ButtonSubmit}>
        <Text style={styles.ButtonSubmitText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView >
  );
};

export default AdminFilterScreen;

const styles = StyleSheet.create({

  itemContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 5,
    alignSelf: 'flex-end',
    backgroundColor: "white",
  },
  leftCol: {
    width: "26%"
  },
  middleCol: {
    width: "31%"
  },
  rightCol: {
    width: "50%",
    alignItems: 'flex-start',
  },
  date: {
    marginTop: 50
  },
  pickerStyle:
  {
    height: 40,
    width: 300,
    color: '#1A1A1A',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginLeft: 30,
  },
  ButtonSubmit:
  {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffa500',
    marginLeft: 110,
    marginRight: 10,
    marginTop: 30
  },
  ButtonSubmitText:
  {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 20,
  },
  pickerborder:
  {
    borderWidth: 1,
    width: 350,
    height: "60%",
    borderRadius: 5,
    marginTop: 17,
    borderColor: 'grey',
    alignSelf: "center",
  },
  pickerborder1:
  {
    borderWidth: 1,
    width: 170,
    marginLeft: 15,
    borderRadius: 5,
    marginTop: 20,
    borderColor: 'grey',
    position: "absolute",
    height: 45
  },
  pickerborder2:
  {
    borderWidth: 1,
    width: 170,
    marginLeft: '53%',
    borderRadius: 5,
    marginTop: 20,
    borderColor: 'grey',
    position: "absolute",
    height: 45
  },

  itemContainer1: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 5,
    alignSelf: 'flex-end',
    backgroundColor: "white",
  },
  firstCol: {
    width: "18%"
  },
  secondCol: {
    width: "30%"
  },
  ThirdCol: {
    width: "46.5%",
  },
  LastCol:
  {
    width: "80%",
    alignItems: 'flex-start',
  },
  textStyleDate:
  {
    height: 30,
    borderColor: 'black',
    color: '#1A1A1A',
    borderRadius: 10,
    marginTop: 33,
    marginVertical: 10,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  textStyleDate1:
  {
    height: 30,
    borderColor: 'black',
    color: '#1A1A1A',
    borderRadius: 10,
    marginTop: 33,
    marginVertical: 10,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  Icons:
  {
    height: 40,
    width: 60,
    fontSize: 40,
    color: 'tomato',
    marginLeft: 22,
    marginTop: 20,
    marginBottom: 4,
  },
  Icons1:
  {
    height: 40,
    width: 60,
    fontSize: 40,
    color: 'tomato',
    marginLeft: 25,
    marginTop: 20,
    marginBottom: 4,
  },
});


