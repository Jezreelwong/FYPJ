import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity, Image,Alert } from 'react-native';
import Screens from '../screens';
import Images from '../../images';
import AwsData from '../../shared/AwsData';

const styles = StyleSheet.create({

  itemContainer:
  {
    width: "95%",
    flexDirection: "row",
    padding: 20,
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: 'white'
  },

  leftCol:
  {
    width: "70%"
  },

  rightCol:
  {
    width: "30%",
    alignItems: "flex-start",
  },
  DividerTopstyle:
  {
    marginTop: 10,
    width: 340,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    marginBottom: 10
  },
  codeContainer: {
    paddingHorizontal: 20,
    borderRadius: 3,
    paddingVertical: 2,
    marginBottom: 5
  },
  TextBold:
  {
    fontWeight: 'bold',
  },
  item: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 20,
    borderRadius: 3,
    alignSelf: "center",
    backgroundColor: "white"
  },
  leftCol: {
    width: "60%"
  },
  rightCol: {
    width: "40%",
    alignItems: "center"
  },
  row: {
    paddingVertical: 5,
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto'
  },
  statusContainer: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 3,
  },
  screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
})

const STATUS_COLOR = {
  "Pending": "#f3582d",
  "Rejected": "#bf1d28",
  "Approved": "#116132"
};

const STATUS_BACKGROUND_COLOR = {
  "Pending": "#ffdbad",
  "Rejected": "#ffc5cc",
  "Approved": "#bbe3c4"
};

const CODE_BACKGROUND_COLOR = {
  "OOS": "#262e83",
  "Ad-Hoc": "#e72014"
};

const CODE_COLOR = {
  "Fixed": "black",
  "OOS": "white",
  "Ad-Hoc": "white"
};

const awsData = new AwsData();

export default class filteredResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: this.props.route.params.startDate,
      endDate: this.props.route.params.endDate,
      purposeId: this.props.route.params.purposeId,
      bookingType: this.props.route.params.bookingType,
      bookings: []
    };
  }

  async componentDidMount() {
    this.removeFocusListener = this.props.navigation.addListener("focus", () => {
      this.refresh();
    });
  }

  componentWillUnmount() {
    if (this.removeFocusListener) {
      this.removeFocusListener();
    }
  }

  async refresh(){
    if(this.state.bookings === [])
    await this.setState({bookings: this.props.route.params.results});
    let result = await awsData.getSPBookings('CALENDAR');
    if (result != undefined) {
      let newArray = [];
      this.props.route.params.results.forEach(obj => {
        newArray.push(result.find(o => o.bookingCode === obj.bookingCode));
      });
      await this.setState({bookings: newArray});
    }
  }
  
  render() {

      this.props.navigation.setOptions({
        title: 'Filtered Bookings',
        headerTitleStyle: {alignSelf: 'center'},
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
          onPress = {()=> {
            if(this.state.bookings.length >= 1){
              if(awsData.spExportReport(this.state.startDate, this.state.endDate, parseInt(this.state.purposeId), this.state.bookingType))
              Alert.alert(
                '',
                'Success. Report sent to email',
                [
                  { text: "OK"}
                ]
              );
              else
              Alert.alert(
                '',
                'Something went wrong, please try again.',
                [
                  { text: "OK"}
                ]
              );
            }
            else{
              Alert.alert(
                '',
                'There are no bookings to export, please try again',
                [
                  { text: "OK"}
                ]
              );
            }}}>
            <Image
            source = {Images.header_export}
            style ={{height: 25, width: 25, marginRight: 10}}/>
          </TouchableOpacity>
        </View>
        ),
      });

    return (
      this.state.bookings.length > 0 ?
      <SafeAreaView>
        <View>
          <FlatList
            data={this.state.bookings}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  let feedback = true;
                  if (item.SPFFeedback != undefined) feedback = false;
                  this.props.navigation.navigate(Screens.ServiceProviderBookingData, { booking:item , feedback});
                }}>
                <View style={styles.item}>
                  <View style={styles.leftCol}>
                    <Text style={styles.row}>
                      <Text>From </Text>
                      <Text style={styles.value}>{item.routeName}</Text>
                    </Text>
                    <Text style={styles.row}>
                      <Text>Booked By </Text>
                      <Text style={styles.value}>
                        {item.displayUserName}
                      </Text>
                    </Text>
                    <Text style={styles.row}>
                      <Text>Purpose </Text>
                      <Text style={styles.value}>{item.purposeShort}</Text>
                    </Text>
                  </View>
                  <View style={styles.rightCol}>
                    <View
                      style={[
                        styles.codeContainer,
                        {
                          backgroundColor:
                            CODE_BACKGROUND_COLOR[item.bookingType],
                        },
                      ]}>
                      <Text
                        style={[
                          styles.value,
                          styles.code,
                          {color: CODE_COLOR[item.bookingType]},
                        ]}>
                        {item.bookingCode}
                      </Text>
                    </View>
                    <Text style={styles.row}>
                      <Text>Time </Text>
                      <Text style={styles.value}>{item.departureTime}</Text>
                    </Text>
                    <View
                      style={[
                        styles.statusContainer,
                        {
                          backgroundColor:
                            STATUS_BACKGROUND_COLOR[item.status],
                        },
                      ]}>
                      <Text
                        style={[
                          styles.value,
                          {color: STATUS_COLOR[item.status]},
                        ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={({item}, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
      :
      <View style={styles.screen}>
        <Text style={styles.noBookings}>No bookings</Text>
      </View>
    );
  }
}