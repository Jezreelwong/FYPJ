import React from 'react';
import { SectionList, Text, View, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import DateSectionHeader from "../../components/bookings/DateSectionHeader(DP)";
import AwsData from "../../shared/AwsData";
import Images from '../../images';
import Screens from '../../screens/screens.js';
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

const STATUS_BACKGROUND_COLOR = {
  "Pending": "#ffdbad",
  "Rejected": "#ffc5cc",
  "Approved": "#bbe3c4"
};

const STATUS_COLOR = {
  "Pending": "#f3582d",
  "Rejected": "#bf1d28",
  "Approved": "#116132"
};

class DutyPersonnelBookingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.sectionList = React.createRef();
    this.state = {
      bookings: [],
      refreshing: false,
      loading: false,
    }
  }

  async fetchData() {
    this.setState({
      loading: true
    })
    const result = await awsData.getDPBookings();
    if (result != undefined) {
      this.setState({
        bookings: result,
        loading: false,
      });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  refresh() {
    console.log('Refresh');
    awsData.dpBookingsHomeArray = null;
    this.fetchData();
  }

  render() {
    return (
      this.state.bookings != undefined && this.state.bookings != null && this.state.bookings.length > 0 ?
        <>
          <Spinner
            visible={this.state.loading}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground source={Images.dp_background} style={styles.BackgroundImage}>
            <SectionList
              ref={this.sectionList}
              sections={this.state.bookings}
              keyExtractor={item => item.bookingCode}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refresh()}
              renderSectionHeader={
                ({ section: { bookingDate } }) => <DateSectionHeader text={bookingDate} />
              }
              renderItem={
                ({ item }) => (
                  <>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                      this.props.navigation.navigate(Screens.AdminBookingData, { booking: item });
                    }}>
                      <View style={styles.item}>
                        <View style={styles.leftCol}>
                          <Text style={styles.row}>
                            <Text style={styles.text}>From </Text>
                            <Text style={styles.value}>{item.routeName}</Text>
                          </Text>
                          <Text style={styles.row}>
                            <Text style={styles.text}>Booked By </Text>
                            <Text style={styles.value}>{item.displayUserName}</Text>
                          </Text>
                          <Text style={styles.row}>
                            <Text style={styles.text}>Purpose </Text>
                            <Text style={styles.value}>{item.purposeShort}</Text>
                          </Text>
                        </View>
                        <View style={styles.rightCol}>
                          <Text style={styles.row}>
                            <Text style={styles.value}>{item.bookingCode}</Text>
                          </Text>
                          <Text style={styles.row}>
                            <Text style={styles.text}>Time </Text>
                            <Text style={styles.value}>{item.departureTime}</Text>
                          </Text>
                          <View style={[styles.statusContainer, { backgroundColor: STATUS_BACKGROUND_COLOR[item.status] }]}>
                            <Text style={[styles.value, { color: STATUS_COLOR[item.status] }]}>{item.status}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                )
              }
            />
          </ImageBackground>
        </>
        :
        <ImageBackground source={Images.dp_background} style={styles.BackgroundImage}>
          <SafeAreaView style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
              }
            >
              <Text style={styles.noBookings}>No Bookings</Text>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  BackgroundImage:
  {
    width: '100%',
    height: '100%'
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noBookings: {
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.7)"
  },
  item: {
    width: '97%',
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 20,
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: 'white',
  },
  leftCol: {
    width: "67%",
  },
  rightCol: {
    alignItems:'center',
    width: "35%",
  },
  row: {
    paddingVertical: 5,
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto',
    fontSize: 14
  },
  text: {
    fontSize: 16
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  statusContainer: {
    paddingHorizontal: 20,
    alignItems:'center',
    paddingVertical: 5,
    borderRadius: 3,
  },
});

export default DutyPersonnelBookingsScreen;
