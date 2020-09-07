import React from 'react';
import { SectionList, Text, View, StyleSheet, RefreshControl, SafeAreaView, ScrollView, Modal, Image, TouchableHighlight, AppState } from 'react-native';
import DateSectionHeader from "../../components/bookings/DateSectionHeader";
import ServiceProviderTypeSection from "../../components/bookings/ServiceProviderTypeSection";
import ModalBookingRejectReason from "../../components/bookings/ModalBookingRejectReason";
import AwsData from "../../shared/AwsData";
import Screens from '../screens';
import Spinner from 'react-native-loading-spinner-overlay';
import Images from '../../images';
import Colors from '../../colors';
import ModalBookingApprove from '../../components/bookings/ModalBookingApprove'

const awsData = new AwsData();

class AdminRequestAllScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bookingType = this.props.route.params.bookingType;
    this.sectionList = React.createRef();
    this.openRowRefs = [];
    this.state = {
      bookings: [],
      refreshing: false,
      currentBooking: [],
      loading: false,
      approveModalVisible: false,
      approveSuccessModalVisible: false,
      approveFailureModalVisible: false,
      rejectModalVisible: false,
      rejectSuccessModalVisible: false,
      rejectFailureModalVisible: false,
      appState: AppState.currentState,
    }
  }

  async fetchData() {
    this.setState({
      loading: true,
    });
    const result = await awsData.getAdminBookings(this.bookingType);
    if (result != undefined) {
      this.setState({
        bookings: result,
        loading: false,
      });
    }
  }

  componentDidMount() {
    this.removeFocusListener = this.props.navigation.addListener("focus", () => {
      this.fetchData();
    });

    if (AppState._eventHandlers.change.size != 2) {
      AppState.addEventListener("change", this._handleAppStateChange);
    };
  }

  componentWillUnmount() {
    if (this.removeFocusListener) {
      this.removeFocusListener();
    }

    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  refresh() {
    console.log('Refresh');
    awsData.adminBookingsAllArray = null;
    this.fetchData();
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.refresh();
    }
    this.setState({ appState: nextAppState });
  };

  setScrollEnabled = enabled => {
    this.sectionList.current.setNativeProps({ scrollEnabled: enabled });
  };

  showRejectModal = booking => {
    this.setState({
      rejectModalVisible: true,
      currentBooking: booking
    });
  };

  hideRejectModal = () => {
    this.setState({
      rejectModalVisible: false
    });
  };

  showApproveModal = booking => {
    this.setState({
      approveModalVisible: true,
      currentBooking: booking,
    });
  };

  hideApproveModal = () => {
    this.setState({
      approveModalVisible: false,
    });
  };

  showApproveSuccessModal = () => {
    this.setState({
      approveSuccessModalVisible: true,
    });
  };

  showApproveFailureModal = () => {
    this.setState({
      approveFailureModalVisible: true,
    });
  };

  showRejectSuccessModal = () => {
    this.setState({
      rejectSuccessModalVisible: true,
    });
  };

  showRejectFailureModal = () => {
    this.setState({
      rejectFailureModalVisible: true,
    });
  };

  setLoading = (value) => {
    this.setState({
      loading: value
    });
  }

  onRowDidOpen = (rowKey, rowMap) => {
    this.openRowRefs.push(rowMap[rowKey]);
  }

  closeAllOpenRows = () => {
    this.openRowRefs.forEach(ref => {
      ref.closeRow && ref.closeRow();
    });
  }

  render() {
    return (
      <>
        <Spinner
          visible={this.state.loading}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
        {
          this.state.bookings != undefined && this.state.bookings != null && this.state.bookings.length > 0 ?
            <>
              <SectionList
                ref={this.sectionList}
                sections={this.state.bookings}
                keyExtractor={item => item.serviceProviderType}
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
                renderSectionHeader={
                  ({ section: { bookingDate } }) => <DateSectionHeader text={bookingDate} />
                }
                renderItem={
                  ({ item }) => (
                    <ServiceProviderTypeSection
                      section={item}
                      onSwipe={() => this.setScrollEnabled(false)}
                      onSwipeEnd={() => this.setScrollEnabled(true)}
                      onReject={this.showRejectModal}
                      onApprove={this.showApproveModal}
                      onApproveSuccess={this.showApproveSuccessModal}
                      onApproveFailure={this.showApproveFailureModal}
                      navigation={this.props.navigation}
                      loading={this.setLoading}
                      closeAllOpenRows={this.closeAllOpenRows}
                      onRowDidOpen={this.onRowDidOpen}
                    />
                  )
                }
              />
              {
                this.state.rejectModalVisible &&
                <ModalBookingRejectReason
                  booking={this.state.currentBooking}
                  navigation={this.props.navigation}
                  screen={Screens.AdminHome}
                  onBackdropPress={this.hideRejectModal}
                  onClosePress={this.hideRejectModal}
                  onReject={this.showRejectSuccessModal}
                  onFailReject={this.showRejectFailureModal}
                  loading={this.setLoading}
                />
              }

              {
                this.state.approveModalVisible &&
                <ModalBookingApprove
                  booking={this.state.currentBooking}
                  navigation={this.props.navigation}
                  screen={Screens.AdminHome}
                  onBackdropPress={this.hideApproveModal}
                  onClosePress={this.hideApproveModal}
                  onApprove={this.showApproveSuccessModal}
                  onFailApprove={this.showApproveFailureModal}
                  loading={this.setLoading}
                />
              }

              {/*Approve Success Modal*/}
              <View>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={this.state.approveSuccessModalVisible}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Image source={Images.icon_approved} style={styles.iconApproved} />
                      <Text style={styles.modalMessage}>Booking is APPROVED!</Text>
                      <TouchableHighlight
                        style={styles.confirmTouchable}
                        underlayColor="#e1a706"
                        onPress={() => {
                          this.setState({
                            approveModalVisible: false,
                            approveSuccessModalVisible: false,
                          });
                          if (AwsData.user.role === "A") {
                            this.props.navigation.reset({
                              index: 0,
                              routes: [{ name: Screens.AdminHome }]
                            });
                          } else {
                            this.props.navigation.popToTop();
                          }
                        }}
                      >
                        <Text style={styles.confirmText}>OK</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
              </View>

              {/*Approve Failure Modal*/}
              <View>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={this.state.approveFailureModalVisible}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                      <Text style={styles.modalMessage}>Unable to approve booking</Text>
                      <TouchableHighlight
                        style={styles.confirmTouchable}
                        underlayColor="#e1a706"
                        onPress={() => {
                          this.setState({
                            approveModalVisible: false,
                            approveFailureModalVisible: false,
                          })
                          if (AwsData.user.role === "A") {
                            this.props.navigation.reset({
                              index: 0,
                              routes: [{ name: Screens.AdminHome }]
                            });
                          } else {
                            this.props.navigation.popToTop();
                          }
                        }}
                      >
                        <Text style={styles.confirmText}>OK</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
              </View>
              {/*Reject Success Modal*/}
              <View>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={this.state.rejectSuccessModalVisible}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Image source={Images.icon_approved} style={styles.iconApproved} />
                      <Text style={styles.modalMessage}>Booking is REJECTED!</Text>
                      <TouchableHighlight
                        style={styles.confirmTouchable}
                        underlayColor="#e1a706"
                        onPress={() => {
                          this.setState({
                            rejectModalVisible: false,
                            rejectSuccessModalVisible: false,
                          })
                          if (AwsData.user.role === "A") {
                            this.props.navigation.reset({
                              index: 0,
                              routes: [{ name: Screens.AdminHome }]
                            });
                          } else {
                            this.props.navigation.popToTop();
                          }
                        }}
                      >
                        <Text style={styles.confirmText}>OK</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
              </View>
              {/*Reject Failure Modal*/}
              <View>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={this.state.rejectFailureModalVisible}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                      <Text style={styles.modalMessage}>Unable to reject booking</Text>
                      <TouchableHighlight
                        style={styles.confirmTouchable}
                        underlayColor="#e1a706"
                        onPress={() => {
                          this.setState({
                            rejectModalVisible: false,
                            rejectFailureModalVisible: false,
                          })
                          if (AwsData.user.role === "A") {
                            this.props.navigation.reset({
                              index: 0,
                              routes: [{ name: Screens.AdminHome }]
                            });
                          } else {
                            this.props.navigation.popToTop();
                          }
                        }}
                      >
                        <Text style={styles.confirmText}>OK</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
              </View>
            </>
            :
            <SafeAreaView style={styles.container}>
              <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
                }
              >
                <Text style={styles.noBookings}>No Pending Requests</Text>
              </ScrollView>
            </SafeAreaView>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  noBookings: {
    fontSize: 17,
    color: Colors.text_secondary
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  modalView: {
    marginLeft: 80,
    marginRight: 80,
    backgroundColor: "white",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.55,
    shadowRadius: 10.84,
    elevation: 10,
    width: '90%'
  },
  confirmTouchable: {
    padding: 11,
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#ffc106",
    marginTop: 10,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: 'Roboto'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  iconApproved: {
    alignSelf: 'center',
    margin: 20,
    height: 100,
    width: 100,
  },
  iconRejected: {
    alignSelf: 'center',
    margin: 20,
    height: 100,
    width: 100,
  },
  modalMessage: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 20
  },
});

export default AdminRequestAllScreen;