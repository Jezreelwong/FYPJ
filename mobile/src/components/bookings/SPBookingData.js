import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground
} from 'react-native';
import { Divider } from 'react-native-elements';
import AwsData from '../../shared/AwsData';
import Images from '../../images';
import ModalPicker from "../../components/ModalPicker";
import moment from 'moment';

export default class SPBookingData extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      title: 'Booking Code: ' + this.props.route.params.booking.bookingCode,
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
      headerTitleAlign: 'center',
    });
    this.state = {
      selectedFeedback: 'General',
      comment: '',
      CancelledOrRejected: '',
      reason: 'None',
      rplOrPassenger: '',
      displayrplPassenger: 0,
      errormsg: false,
      bookingCode: this.props.route.params.booking.bookingCode,
      modalVisible: false,
    };
    console.log(this.props);
  }

  componentDidMount() {
    this.setReason();
    this.setRplPassenger();
  }

  async setReason() {
    if (this.props.route.params.booking.rejectedReason != null) {
      this.setState({ reason: this.props.route.params.booking.rejectedReason });
    } else if (this.props.route.params.booking.cancellationReason != null) {
      this.setState({ reason: this.props.route.params.booking.cancellationReason });
    }
    if (this.props.route.params.booking.status == 'Rejected')
      this.setState({ CancelledOrRejected: 'Rejected' });
    if (this.props.route.params.booking.status == 'Cancelled')
      this.setState({ CancelledOrRejected: 'Cancelled' });
  }

  async setRplPassenger() {
    if (this.props.route.params.booking.serviceProviderType == 'RPL') {
      this.setState({ rplOrPassenger: 'Total load ' });
      this.setState({
        displayrplPassenger: this.props.route.params.booking.totalLoad,
      });
    } else if (this.props.route.params.booking.serviceProviderType == 'P') {
      this.setState({ rplOrPassenger: 'No. Of Pax ' });
      this.setState({
        displayrplPassenger: this.props.route.params.booking.numPassenger,
      });
    }
  }

  putData() {
    const awsData = new AwsData();
    if (this.state.comment == '') {
      this.setState({ errormsg: true });
      return;
    }
    awsData.putSPFeedback(
      this.state.bookingCode,
      this.state.selectedFeedback,
      this.state.comment,
    ).then(
      this.setState({ modalVisible: true }));
  }

  render() {
    if (
      this.props.route.params.feedback &&
      (this.props.route.params.booking.status == 'Completed' ||
        this.props.route.params.booking.status == 'Late')
    ) {
      return (
        <ImageBackground
          source={Images.sp_background_booking_details}
          style={styles.backgroundImage}
        >
          <ScrollView style={{ flex: 1, marginBottom: 10 }}>
            <KeyboardAvoidingView
              style={styles.container}
              behavior={"position"}
              keyboardVerticalOffset={40}
            >
              <TouchableWithoutFeedback
                touchSoundDisabled={true}
                onPress={Keyboard.dismiss}
              >
                <View>
                  <BookingDetails props={this.props} state={this.state} />
                  <View style={styles.remarksBox}>
                    <Text style={{ paddingLeft: 5, fontWeight: "bold" }}>
                      Provide Feedback
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        height: 55,
                        marginTop: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: "black",
                      }}
                    >
                      <ModalPicker
                        screen={"filter1"}
                        placeholder="Select feedback type"
                        style={styles.Picker}
                        value={this.state.selectedFeedback}
                        items={[
                          { key: 1, section: true, label: "General" },
                          { key: 2, label: "Non-compliance" },
                        ]}
                        onItemSelected={(item) => {
                          this.setState({ selectedFeedback: item.label });
                          console.log(item.label);
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.remarksBox}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{ paddingLeft: 5, fontWeight: "bold" }}
                      >
                        Comments
                      </Text>
                      {this.state.errormsg && (
                        <Text style={{ color: "red", marginLeft: 10 }}>
                          Please enter comment
                        </Text>
                      )}
                    </View>
                    <TextInput
                      style={styles.comment}
                      multiline={true}
                      value={this.state.comment}
                      onChangeText={(comment) => {
                        this.setState({ comment });
                        this.setState({ errormsg: false });
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        this.putData();
                      }}
                      style={styles.ButtonSubmit}
                    >
                      <Text style={styles.ButtonSubmitText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View
                          style={{
                            height: 200,
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={Images.sp_success}
                            style={styles.modalImage}
                          />
                          <Text
                            style={{
                              marginTop: 20,
                              fontSize: 18,
                              fontWeight: "bold",
                              fontFamily:'Roboto'
                            }}
                          >
                            Feedback Submitted
                          </Text>
                        </View>
                        <TouchableHighlight
                          style={styles.confirmTouchable}
                          underlayColor="#e1a706"
                          onPress={() => {
                            this.setState({ modalVisible: false });
                            this.setState({ errormsg: false });
                            this.props.navigation.goBack();
                          }}
                        >
                          <Text style={styles.confirmText}>OK</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </ScrollView>
        </ImageBackground>
      );
    } else {
      return !this.props.route.params.feedback ? (
        <>
          <View style={{ paddingTop: 15 }}>
            <BookingDetails props={this.props} state={this.state} />
            <View style={styles.remarksBox}>
              <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>
                Feedback
              </Text>
              <Divider style={styles.dividerRemarks} />
              <Text style={{ paddingLeft: 8, paddingTop: 10 }}>
                {this.props.route.params.booking.SPFFeedback.feedbackType}:
              </Text>
              <Text style={{ paddingLeft: 8, paddingTop: 10 }}>
                {this.props.route.params.booking.SPFFeedback.comments}
              </Text>
            </View>
          </View>
        </>
      ) : (
          <View style={{ alignContent: 'center', paddingTop: 15 }}>
            <BookingDetails props={this.props} state={this.state} />
          </View>
        );
    }
  }
}

function BookingDetails(props, state) {
  let reason;
  let remarks;

  if (
    props.props.route.params.booking.status == 'Rejected' ||
    props.props.route.params.booking.status == 'Cancelled'
  ) {
    reason = (
      <View style={styles.remarksBox}>
        <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>{props.state.CancelledOrRejected} reason</Text>
        <Divider style={styles.dividerRemarks} />
        <Text style={{ paddingLeft: 8, paddingTop: 10 }}>
          {props.state.reason}
        </Text>
      </View>
    );
  } else {
    reason = <View />;
  }

  if (props.props.route.params.booking.serviceProviderType == 'RPL' && props.props.route.params.booking.remarks != '' && props.props.route.params.booking.remarks != null) {
    remarks = (
      <View style={styles.remarksBox}>
        <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>Remarks</Text>
        <Divider style={styles.dividerRemarks} />
        <Text style={{ paddingLeft: 8, paddingTop: 10 }}>
          {props.props.route.params.booking.remarks}
        </Text>
      </View>
    );
  } else {
    remarks = <View />;
  }

  return (
    <View>
      <View style={styles.item}>
        <View style={styles.leftCol}>
          <Text style={styles.row}>
            <Text>Date </Text>
            <Text style={styles.value}>
              {props.props.route.params.booking.departureDate}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text>Time </Text>
            <Text style={styles.value}>
              {props.props.route.params.booking.departureTime}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text>Type </Text>
            <Text style={styles.value}>
              {props.props.route.params.booking.bookingType}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text>{props.state.rplOrPassenger}</Text>
            <Text style={styles.value}>{props.state.displayrplPassenger}</Text>
          </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.row}>
            <Text>Status </Text>
            <Text style={styles.value}>
              {props.props.route.params.booking.status}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text>From </Text>
            <Text style={styles.value}>
              {props.props.route.params.booking.routeName}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text>Purpose </Text>
            <Text style={styles.value}>
              {props.props.route.params.booking.purposeShort}
            </Text>
          </Text>
          {
            props.props.route.params.booking.status == 'Completed' || props.props.route.params.booking.status == 'Late' ?
              <Text style={styles.row}>
                <Text>Boarding time </Text>
                <Text style={styles.value}>
                  {moment(props.props.route.params.booking.onBoardTime).utc().format("HHmm")}
                </Text>
              </Text> :
              null
          }
        </View>
      </View>
      {
            props.props.route.params.booking.bookingGroup != null ?
            <Text style={{ width: '100%', marginLeft: 49, paddingVertical: 5 }}>
        <Text>Booking Group </Text>
        <Text style={styles.value}>
          {props.props.route.params.booking.bookingGroup}
        </Text>
      </Text> :
              null
          }
      <Text style={{ width: '100%', marginLeft: 49, marginBottom: 20, paddingVertical: 5 }}>
        <Text>Booked by </Text>
        <Text style={styles.value}>
          {props.props.route.params.booking.displayUserName}
        </Text>
      </Text>
      {reason}
      {remarks}
    </View>

  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%'
  },
  remarksBox: {
    alignSelf: 'center',
    width: '78%',
    marginBottom: 15
  },
  dividerRemarks: {
    marginTop: 5,
    width: 305,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  comment: {
    height: 55,
    width: '100%',
    padding: 10,
    borderColor: 'black',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingTop: 15
  },
  ButtonSubmit: {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffa500',
    marginLeft: 70,
    marginRight: 10,
    marginTop: 30,
  },
  ButtonSubmitText: {
    color: 'white',
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
  },
  item: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 3,
    alignSelf: 'center',
  },
  leftCol: {
    width: '50%',
    marginLeft: 70,
  },
  rightCol: {
    width: '60%',
  },
  row: {
    paddingVertical: 5,
  },
  value: {
    fontWeight: 'bold',
  },
  code: {
    color: '#fff',
  },
  codeContainer: {
    paddingHorizontal: 20,
    borderRadius: 3,
    paddingVertical: 2,
    marginVertical: 3,
  },
  statusContainer: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 3,
  },
  value: {
    fontWeight: 'bold',
  },
  confirmTouchable: {
    padding: 11,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#ffc106',
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  BookingModalPicture: {
    width: 400,
    height: 225,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    marginLeft: 80,
    marginRight: 80,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalImage: {
    height: 85,
    width: 90,
    marginTop: 20
  },
  header: {
    width: 5,
    height: 10,
    marginBottom: 30
  },
  serviceProviderIcon: {
    width: 40,
    height: 40,
  },
});