import React from 'react';
import { SectionList, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import DateSectionHeader from "../../components/bookings/DateSectionHeader(SP)";
import SPListItem from "../../components/bookings/SPListItem"
import AwsData from "../../shared/AwsData";
import Spinner from 'react-native-loading-spinner-overlay';

const awsData = new AwsData();

class SPGetBookingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bookingType = this.props.route.params.bookingType;
    this.sectionList = React.createRef();
    this.state = {
      rejectModalVisible: false,
      bookings: [],
      refreshing: false,
      loading: true,
	};
    console.disableYellowBox = true;
    this.localRefresh = this.localRefresh.bind(this);
  }

  async fetchData() {
    this.setState({loading: true});
    const result = await awsData.getSPBookings(this.bookingType);
    await this.setState({
      bookings: result,
      loading: false
    });
  }

  async componentDidMount() {
    this.fetchData();
    this.removeFocusListener = this.props.navigation.addListener("focus", () => {
      this.localRefresh();
    });
  }

  componentWillUnmount() {
    if (this.removeFocusListener) {
      this.removeFocusListener();
    }
  }

  refresh() {
    console.log('Refresh');
    awsData.spBookingsCalendar = null;
    this.fetchData();
  }

  async localRefresh(){
    console.log('local refresh')
    let result = await awsData.getSPBookings(this.bookingType);
    if (result != undefined) {
      this.setState({bookings: result});
    }
  }

  setScrollEnabled = enabled => {
    this.sectionList.current.setNativeProps({scrollEnabled: enabled});
  };

  render() {
    return this.state.loading ? (
      <Spinner
        visible={true}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
    ) : this.state.bookings.length > 0 ? (
      <>
        <SectionList
          ref={this.sectionList}
          sections={this.state.bookings}
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
          keyExtractor={(bookingDate) => bookingDate}
          renderSectionHeader={({section: {bookingDate}}) => (
            <DateSectionHeader text={bookingDate} />
          )}
          renderItem={({item}) => (
            <SPListItem
              functionRefresh = {this.localRefresh}
              section={item}
              onSwipe={() => this.setScrollEnabled(false)}
              onSwipeEnd={() => this.setScrollEnabled(true)}
              navigation={this.props.navigation}
            />
          )}
        />
      </>
    ) : (
      <ScrollView
        contentContainerStyle={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.refresh()}
          />
        }>
        <Text style={styles.noBookings}>No bookings</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	noBookings: {
		fontSize: 20,
		color: "rgba(0, 0, 0, .4)"
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

export default SPGetBookingsScreen;