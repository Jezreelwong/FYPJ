import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView  } from 'react-native';
import { Divider } from 'react-native-elements';
import Images from '../../images';
import { BookingStatus } from '../../models/Booking';
import moment from "moment";

const icon = {
  "PASSENGER": Images.ferry_icon_passenger,
  "RPL": Images.ferry_icon_rpl
};

export default class AdminBookingData extends React.Component {
  constructor(props) {
    super(props)
    this.props.navigation.setOptions({
      title: "Booking Code: " + this.props.route.params.booking.bookingCode,
    })
  }

  render() {
    return (
      <>
        <ScrollView style={{marginBottom:15}}>
          <View style={styles.item}>
            <View style={styles.leftCol}>
              {
                this.props.route.params.booking.serviceProviderType == "P" ?
                  <View style={styles.header}>
                    <Image source={icon["PASSENGER"]} resizeMode="contain" style={styles.serviceProviderIcon} />
                  </View>
                  :
                  <View style={styles.header}>
                    <Image source={icon["RPL"]} resizeMode="contain" style={styles.serviceProviderIcon} />
                  </View>
              }
              <Text style={styles.row}>
                <Text>Date </Text>
                <Text style={styles.value}>{this.props.route.params.booking.departureDate}</Text>
              </Text>
              <Text style={styles.row}>
                <Text>Time </Text>
                <Text style={styles.value}>{this.props.route.params.booking.departureTime}</Text>
              </Text>
              {
                this.props.route.params.booking.onBoardTime ?
                  <Text style={styles.row}>
                    <Text>Boarding Time </Text>
                    <Text style={styles.value}>{moment(this.props.route.params.booking.onBoardTime).utc().format("HHmm")}</Text>
                  </Text>
                  :
                  <></>
              }
              <Text style={styles.row}>
                <Text>Type </Text>
                <Text style={styles.value}>{this.props.route.params.booking.bookingType}</Text>
              </Text>
              {
                this.props.route.params.booking.serviceProviderType == "P" ?
                  this.props.route.params.booking.numPassenger != null ?
                    <Text style={styles.row}>
                      <Text>No. Of Pax </Text>
                      <Text style={styles.value}>{this.props.route.params.booking.numPassenger}</Text>
                    </Text>
                    :
                    <Text style={styles.row}>
                      <Text>No. Of Pax </Text>
                      <Text style={styles.value}>0</Text>
                    </Text>
                  :
                  this.props.route.params.booking.totalLoad != null ?
                    <Text style={styles.row}>
                      <Text>Total Load </Text>
                      <Text style={styles.value}>{this.props.route.params.booking.totalLoad}</Text>
                    </Text>
                    :
                    <Text style={styles.row}>
                      <Text>Total Load </Text>
                      <Text style={styles.value}>0</Text>
                    </Text>
              }
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.row}>
                <Text>Status </Text>
                <Text style={styles.value}>{this.props.route.params.booking.status}</Text>
              </Text>
              {
                this.props.route.params.booking.bookingGroup != null && this.props.route.params.booking.bookingGroup != "" ?
                  <Text style={styles.row}>
                    <Text>Booking Group </Text>
                    <Text style={styles.value}>{this.props.route.params.booking.bookingGroup}</Text>
                  </Text>
                  :
                  <></>
              }
              <Text style={styles.row}>
                <Text>From </Text>
                <Text style={styles.value}>{this.props.route.params.booking.routeName}</Text>
              </Text>
              <Text style={styles.row}>
                <Text>Purpose </Text>
                <Text style={styles.value}>{this.props.route.params.booking.purposeShort}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.secondLeftCol}>
            <Text style={styles.row}>
              <Text>Booked by </Text>
              <Text style={styles.value}>{this.props.route.params.booking.displayUserName}</Text>
            </Text>
          </View>
          {
            this.props.route.params.booking.remarks != "" && this.props.route.params.booking.remarks != null ?
              <View style={styles.remarksBox}>
                <Text style={{ paddingLeft: 3, fontWeight: "bold" }}>Remarks</Text>
                <Divider style={styles.dividerRemarks} />
                <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.remarks}</Text>
              </View>
              :
              <></>
          }
          <View>
            {
              this.props.route.params.booking.status == BookingStatus.REJECTED ?
                this.props.route.params.booking.rejectedReason != null ?
                  <View style={styles.remarksBox}>
                    <Text style={{ paddingLeft: 3, fontWeight: "bold", }}>Rejection Reason</Text>
                    <Divider style={styles.dividerRemarks} />
                    <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.rejectedReason}</Text>
                  </View>
                  :
                  <></>
                :
                this.props.route.params.booking.status == BookingStatus.CANCELLED ?
                  this.props.route.params.booking.cancellationReason != null ?
                    <View style={styles.remarksBox}>
                      <Text style={{ paddingLeft: 3, fontWeight: "bold" }}>Cancellation Reason</Text>
                      <Divider style={styles.dividerRemarks} />
                      <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.cancellationReason}</Text>
                    </View>
                    :
                    <></>
                  :
                  <></>
            }
            {
              this.props.route.params.booking.SPFFeedback ?
                <View>
                  <View style={styles.remarksBox}>
                    <Text style={{ paddingLeft: 3, fontWeight: "bold" }}>Service Provider Feedback</Text>
                    <Divider style={styles.dividerRemarks} />
                    <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.SPFFeedback.feedbackType}:</Text>
                    <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.SPFFeedback.comments}</Text>
                  </View>
                </View>
                :
                <></>
            }
            {
              this.props.route.params.booking.SAFFeedback ?
                <View>
                  <View style={styles.remarksBox}>
                    <Text style={{ paddingLeft: 3, fontWeight: "bold" }}>SAF Unit Feedback</Text>
                    <Divider style={styles.dividerRemarks} />
                    <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.SAFFeedback.comments}</Text>
                  </View>
                </View>
                :
                <></>
            }
            {
              this.props.route.params.booking.SAFFeedback ?
                <View style={styles.remarksBox}>
                  <Text style={{ paddingLeft: 3, fontWeight: "bold" }}>SAF Unit Rating</Text>
                  <Divider style={styles.dividerRemarks} />
                  <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.SAFFeedback.rating}/5</Text>
                </View>
                :
                <></>
            }
            {
              this.props.route.params.booking.BookingIssue != null ?
                <View style={styles.remarksBox}>
                  <Text style={{ paddingLeft: 3, fontWeight: "bold" }}>Issue</Text>
                  <Divider style={styles.dividerRemarks} />
                  <Text style={{ paddingLeft: 5, paddingTop: 10 }}>{this.props.route.params.booking.BookingIssue.reportIssue}</Text>
                </View>
                :
                <></>
            }
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  remarksBox: {
    alignSelf: 'center',
    width: '77%',
    marginTop: 20,
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
  dividerRemarks: {
    marginTop: 10,
    width: 295,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    marginLeft: 3
  },
  item: {
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10
  },
  leftCol: {
    width: "49%",
    marginLeft: 40,
  },
  secondLeftCol: {
    marginLeft: 51
  },
  rightCol: {
    marginTop: 40,
    width: "51%",
  },
  row: {
    paddingVertical: 5,
  },
  value: {
    fontWeight: "bold",
    fontFamily: 'Roboto'
  },
  code: {
    color: "#fff"
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
    fontWeight: "bold",
    fontFamily:'Roboto',
  },
})
