import * as React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SectionList,
  Platform,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AwsData from '../../shared/AwsData';
import BookingItem from "../../components/bookings/BookingItem";
import Booking from "../../models/Booking";
import Screens from "../screens";
import DateSectionHeader from "../../components/bookings/DateSectionHeader";
import { Divider } from 'react-native-elements';

const awsData = new AwsData();

class Items extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={() => {
        this.props.navigation.navigate(Screens.AdminBookingData, { booking: this.props.item });
      }}>
        <BookingItem booking={this.props.item} image={"yes"} />
      </TouchableOpacity>
    )
  }
}

export default class AdminSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: ''
    };
    this.arrayholder = [];
  }


  async fetchData() {
    let result = await awsData.getAdminBookings("All");
    if (result != undefined) {
      result = Booking.sortBookingsByDay(result);
      this.setState({
        dataSource: result
      });
      this.arrayholder = result;
    }
  }

  componentDidMount() {
    console.disableYellowBox = true;
    this.fetchData();
  }

  search = text => {
    console.log(text);
  };
  clear = () => {
    this.search.clear();
  };

  SearchFilterFunction(text) {
    text = text.replace(/\s/g, "");
    let unsortedArray = Booking.unsortArray(this.arrayholder);
    let newData = unsortedArray.filter(function (item) {
      const bookingCodeData = item.bookingCode ? item.bookingCode.toUpperCase() : ''.toUpperCase();
      const bookingGroupData = item.bookingGroup ? item.bookingGroup.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return bookingCodeData.indexOf(textData) > -1 || bookingGroupData.indexOf(textData) > -1;
    });
    newData = Booking.sortBookingsByDay(newData);
    this.setState({
      dataSource: newData,
      search: text,
    });
  }

  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#080808',
        }}
      />
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollEndDrag: Keyboard.dismiss };
    return (
      <View style={styles.viewStyle}>
        <SearchBar
          platform={Platform.OS}
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder="Search by booking code/group..."
          value={this.state.search}
          containerStyle={{ marginBottom: Platform.OS === 'ios' ? -10 : 0, marginTop: Platform.OS === 'ios' ? -30 : 0 }}
        />
        {
          Platform.OS === 'android' ?
            <Divider style={styles.dividerStyle}></Divider>
            :
            <></>
        }
        <SectionList
          {...keyboardDismissProp}
          sections={this.state.dataSource}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          renderSectionHeader={
            ({ section: { bookingDate } }) => <DateSectionHeader text={bookingDate} />
          }
          renderItem={({ item }) => (
            <Items navigation={this.props.navigation} item={item} />
          )}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          keyExtractor={item => item.bookingCode}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS == 'ios' ? 30 : 0,
  },
  textStyle: {
    padding: 10,
  },
  dividerStyle: {
    width: "100%",
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom:-10
  }
});
