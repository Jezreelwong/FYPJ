import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native";
import { CheckBox } from 'react-native-elements';
import AwsData from "../../shared/AwsData";
import screens from '../screens';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalPicker from "../../components/ModalPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker"

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
  focused: {
    color: '#1876d2'
  },
  pickerStyle:
  {
    height: 40,
    width: 300,
    color: '#1A1A1A',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginLeft: 30,
  },
  ButtonSubmit:
  {
    width: '50%',
    height: '11%',
    borderRadius: 10,
    backgroundColor: '#ffa500',
    marginLeft: 110,
    marginRight: 10,
    marginTop: 30,
    justifyContent:'center'
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
    width: '90%',
    marginLeft: '5%',
    borderRadius: 5,
    marginTop: 20,
    borderColor: 'grey'
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
    marginLeft: '50%',
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
    width: "15%",
    marginLeft: 5,
  },
  secondCol: {
    width: "30%"
  },
  ThirdCol: {
    width: "50%",
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
    marginTop: 30,
    marginVertical: 10,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  Icons:
  {
    height: 40,
    width: 60,
    fontSize: 35,
    color: '#1876d2',
    marginLeft: 20,
    marginTop: 23,
    marginBottom: 4,
  },
  image:{
    height: 30,
    width: 30,
    marginLeft: 25,
    marginTop: 25,
  }

});

const Check = [
  { BookingType: "Fixed", checked: false, title: "Fixed", b: 'green' }, { BookingType: "Ad-Hoc", checked: false, title: "Ad-Hoc", b: 'yellow' },
  { BookingType: "OOS", checked: false, title: "OOS", b: 'red' }

]

const awsData = new AwsData();

const FilterScreen = ({ navigation, route }) => {

  const [date, setDate] = useState(new Date());
  const oneMonth = new Date();
  oneMonth.setMonth(oneMonth.getMonth() - 1);
  const threeMonth = new Date();
  threeMonth.setMonth(threeMonth.getMonth() + 3);
  const [minimumDate, setMinimumDate] = useState(oneMonth);
  const [maximumDate, setMaximumDate] = useState(threeMonth);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [purposes, setPurposes] = useState(awsData.purposes)
  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setMinimumDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };



  const [TOdate, TOsetDate] = useState(new Date());
  const [TOmode, TOsetMode] = useState('date');
  const [TOshow, TOsetShow] = useState(false);
  const TOonChange = (TOselectedDate) => {
    const TOcurrentDate = TOselectedDate || TOdate;
    TOsetShow(false);
    TOsetDate(TOcurrentDate);
    setMaximumDate(TOcurrentDate);
  };

  const TOshowMode = currentMode => {
    TOsetShow(true);
    TOsetMode(currentMode);
  };

  const TOshowDatepicker = () => {
    TOshowMode('date1');
  };

  const [selectedpurpose, onpurposeChange] = useState('ALL');
  const [purposeId, setPurposeId] = useState(0);
  const [checkbox, setcheckbox] = useState([...Check]);

  function togglecheckbox(index) {
    const checked = [...checkbox]
    checked[index]["checked"] = !checked[index]["checked"]
    setcheckbox(checked)
  }

  function mapPurposes(purposes){
    return purposes.reduce((accumulator, purpose) => {
      accumulator.push({
        value: purpose.purposeId,
        label: purpose.purposeDesc,
        short: purpose.purposeShort
      });

      return accumulator;
    }, []);
  }

  function reset(){
    setDate(oneMonth);
    setMinimumDate(oneMonth);
    TOsetDate(threeMonth);
    setMaximumDate(threeMonth);
    onpurposeChange('ALL');
    const checked = [...checkbox]
    checked[0]["checked"] = false;
    checked[1]["checked"] = false;
    checked[2]["checked"] = false;
    setcheckbox(checked);
  }

  async function fetchData() {
    const awsData = new AwsData();
    const response = await awsData.getSPBookings('CALENDAR');
    setData(response);
  }
  useEffect(() => {
    fetchData();
    const passengerPurposes = purposes.filter(booking => {
      return booking.serviceProviderType == awsData.spBookingsHome[0].serviceProviderType;
    });
    let purpose = mapPurposes(passengerPurposes);
    purpose.unshift({
      value: 0,
      label: 'ALL',
      short: 'ALL'
    })
    setPurposes(purpose);
    reset();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Filter',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => reset()}>
          <Text style={{ marginRight: 10, color: 'white', fontSize: 15}}>Reset all</Text>
        </TouchableOpacity>
      </View>
      ),
    });
  }, [navigation]);

  const hideModal = () => {
    setShow(false);
  }

  const hideTOModal = () => {
    TOsetShow(false);
  }

  return (
    <SafeAreaView>
      <View>
        <Text style={{ marginTop: 20, marginBottom: 5, marginLeft: 10 }}>Date range</Text>
        <View style={styles.itemContainer1}>
          <View style={{ marginLeft: 20, position: "absolute", width: "100%", flexDirection: "row" }}>
            <View style={styles.ThirdCol}>
              <Text>From</Text>
            </View>
            <View >
              <Text>To</Text>
            </View>
          </View>
          <View style={styles.pickerborder1}></View>
          <View style={styles.firstCol}>
          <Ionicons style={styles.Icons} name={"ios-calendar"} />
          </View>
          <View style={styles.secondCol}>
            <Text style={styles.textStyleDate} onPress={showDatepicker}>
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
              minimumDate={oneMonth}
            />
          </View>


          <View style={styles.pickerborder2}></View>
          <View style={styles.firstCol}>
          <Ionicons style={styles.Icons} name={"ios-calendar"} />
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
              maximumDate={threeMonth}
                minimumDate={minimumDate}
            />

          </View>
        </View>

        <Text style={{ marginTop: 20, marginLeft: 10, marginBottom: 5}}> Purpose </Text>
        <View style={{ width: '100%', backgroundColor: 'white', height: 100 }}>
          <View style={styles.pickerborder}>
            <ModalPicker
            screen={"filter1"}
            placeholder="Select Purpose"
            value={selectedpurpose}
            items={purposes}
            onItemSelected={purpose => {onpurposeChange(purpose.short)
              setPurposeId(purpose.value)}}
          />
          </View>
        </View>

        <Text style={{ marginTop: 20, marginLeft: 10, marginBottom: 5 }}>Type</Text>
        <View style={{ width: "100%" , backgroundColor: 'white'}}>

          <FlatList keyExtractor={item => item.title} style={{ width: "100%"}}
            renderItem={({ item, index }) =>
              <CheckBox containerStyle={{ flex: 1}}
                title={item.title}
                onPress={() =>togglecheckbox(index)}
                checked={checkbox[index].checked}
              />
            }
            data={checkbox}
            numColumns={3}
          />
        </View>




        <TouchableOpacity onPress={() => {
          let BookingData = data.filter(booking => {
            return booking.purposeShort != null;
          })
          const filteredcheckbox = checkbox.filter(checkbox => checkbox.checked).map(checkbox => checkbox.BookingType);
          let Bookings = BookingData.filter(booking => {
            const bookingdate = new Date(booking.departureDate);
            const isBetween = moment(bookingdate).isBetween(date, TOdate, "day", '[]');
            const isbookingtype = filteredcheckbox.includes(booking.bookingType);
            if (selectedpurpose != 'ALL') {
              const isPurpose = booking.purposeShort.toLowerCase() === selectedpurpose.toLowerCase();
              return isBetween && isPurpose && isbookingtype;
            }
            return isBetween && isbookingtype;
          });

          let bookingType = [];

          checkbox.forEach(item => {
            if(item.checked)
            bookingType.push(item.BookingType)
          })

          //console.log(moment(date).format('YYYY-MM-DD'), moment(TOdate).format('YYYY-MM-DD'), purposeId, bookingType)
          navigation.navigate(screens.ServiceProviderFilteredResult, { results: Bookings, purpose: selectedpurpose, startDate: moment(date).format('YYYY-MM-DD'), endDate: moment(TOdate).format('YYYY-MM-DD'), purposeId, bookingType})
        }} style={styles.ButtonSubmit}>
          <Text style={styles.ButtonSubmitText}>Done</Text>
        </TouchableOpacity>

      </View>


    </SafeAreaView>


  );
};
export default FilterScreen;