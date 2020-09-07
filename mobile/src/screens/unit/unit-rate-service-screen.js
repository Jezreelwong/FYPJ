//This is an example code to make a Star Rating Bar // 
import React, { Component } from 'react';
//import react in our code. 
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  TextInput,
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native';
import Images from '../../images';
import Colors from '../../colors';
import moment from 'moment';
import AwsData from '../../shared/AwsData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import Booking, { BookingStatus } from '../../models/Booking';
import { BookingTypes, ServiceProviderTypes } from '../../models/Booking';
import Spinner from 'react-native-loading-spinner-overlay';
import { ScrollView } from 'react-native-gesture-handler';
import Screens from '../screens';
moment.locale("en-SG");


const styles = StyleSheet.create({
  BackgroundImage: {
    width: '100%',
    height: '100%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  SafeAreaView: {
    flex: 1
    //marginTop: Constants.statusBarHeight,
  },
  itemContainer1: {
    width: "100%",
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  captionText: {
    // opacity: 0.3, 
    color: 'gray',
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 40,
    textAlign: 'center'
  },
  itemContainer: {
    width: "100%",
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    alignSelf: "center",
  },
  itemContainer2: {
    width: "100%",
    padding: 20,
    paddingBottom: 10,
    paddingTop: 10,
    alignSelf: "center",
  },
  leftCol: {
    width: "50%",
  },
  rightCol: {
    width: "50%",
    alignItems: 'flex-start',
  },
  singleCol: {
    width: '100%'
  },
  childView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  StarImage: {
    width: 40,
    height: 40,
    marginLeft: 15,
    marginRight: 15,
    resizeMode: 'cover',
  },
  textStyle: {
    fontSize: 16,
    color: Colors.text,
  },
  textStyleSmall: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: Colors.text,
  },
  ratings: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#000',
    marginLeft: 40,
  },
  poorView: {
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  poorWord: {
    marginLeft: '11.5%',
    fontSize: 10,
    color: 'gray'
  },
  excellentWord: {
    fontSize: 10,
    alignSelf: 'flex-end',
    color: 'gray',
    marginRight: '9%',
  },
  ButtonReport: {
    width: 120,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    alignSelf: "flex-end",
    borderColor: 'gray',
    borderWidth: 1.5,
    marginTop: 5,
    marginRight: 5,
    justifyContent: 'center',
  },
  ButtonReportText: {
    color: 'gray',
    textAlign: 'center',
    padding: 7,
    fontSize: 12,
  },
  ButtonSubmit: {
    width: 180,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#dc143c',
    marginLeft: 110,
    marginRight: 10,
    marginBottom: 30
  },
  ButtonSubmitText: {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 20,
  },
  comment: {
    height: 180,
    width: 350,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    alignSelf: 'center'
  },
  LeaveCommentTag: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginLeft: 40
  },
  LeaveCommentTag2: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 40
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    width: '100%',
    paddingBottom: 10
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: 300,
    marginBottom: 35
  },
  IconsLeft: {
    height: 60,
    width: 80,
    fontSize: 60,
    color: 'black',
    marginRight: 300,
  },
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    fontFamily: 'Roboto',
    textAlign: "center"
  },
  Title: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  comment1: {
    height: 200,
    width: 350,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10
  },
  submittedText: {
    marginTop: 10,
    marginLeft: 40,
    marginBottom: 15,
    marginRight: 40
  },
  submittedRatingText: {
    color: "black",
    fontWeight: "bold",
    fontFamily: 'Roboto',
    textAlign: "center"
  },
  submittedIssueText: {
    color: "black",
    marginTop: 20,
    fontSize: 20
  },
  iconApproved: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10,
    height: 60,
    width: 60,
  },
  iconRejected: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10,
    height: 60,
    width: 60,
  },
  modalMessage2: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 40
  },
  centeredView2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: 'Roboto'
  },
  modalView2: {
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
  detailsSpacing: {
    paddingBottom: 9
  },
  dividerRemarks: {
    marginTop: 5,
    width: 340,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    alignSelf: 'center'
  },
  errorText: {
    color: "red",
    alignSelf: 'flex-start',
    paddingLeft: 40
  },
});

const awsData = new AwsData();

//import all the components we are going to use.
export default class GiveRatings extends React.Component {
  constructor() {
    super();
    this.state = {
      Default_Rating: 5,
      //To set the default Star Selected
      Max_Rating: 5,
      //To set the max number of Stars

      comment: '',
      modalVisible: false,
      issueComment: '',
      issueDate: '',
      ratingSuccessModal: false,
      ratingFailModal: false,
      reportSuccessModal: false,
      reportFailModal: false,
      loading: false,
      issueError: false
    };
    //Filled Star. You can also give the path from local
    this.Star = 'https://www.iconsdb.com/icons/preview/red/star-xxl.png';

    //Empty Star. You can also give the path from local
    this.Star_With_Border = 'https://www.iconsdb.com/icons/preview/gray/star-xxl.png';

  }
  UpdateRating(key) {
    this.setState({ Default_Rating: key });
    //Keeping the Rating Selected in state this.props.route.params.Id
  }

  async sendRating() {
    let response = await awsData.giveRatingUnit(this.state.Default_Rating, this.state.comment, this.props.route.params.Id, this.props.route.params.By);
    this.setState({ loading: false })
    if (response == "Success") {
      this.setState({ ratingSuccessModal: true })
      this.props.route.params.Feedback = {
        rating: this.state.Default_Rating,
        comments: this.state.comment
      }
    } else {
      this.setState({ ratingFailModal: true })
    }
  }

  async sendIssue() {
    let response = await awsData.reportBookingIssue(this.state.issueComment, this.props.route.params.By, this.props.route.params.Id);
    this.setState({ loading: false })
    if (response == "Success") {
      this.setState({ reportSuccessModal: true })
      this.setState({ modalVisible: false });
      this.props.route.params.Issue = {
        reportIssue: this.state.issueComment,
        reportedDate: moment()
      }
    } else {
      this.setState({ reportFailModal: true })
    }
  }

  render() {
    this.props.navigation.setOptions({
      title: "Booking Code: " + this.props.route.params.Id,
      headerRight: () => (
        <View />
      )
    })
    let React_Native_Rating_Bar = [];
    //Array to hold the filled or empty Stars

    let previousFeedback = '';
    if (this.props.route.params.Feedback) {
      previousFeedback = this.props.route.params.Feedback;
      this.state.Default_Rating = previousFeedback.rating;
      this.state.comment = previousFeedback.comments
    } else {
      // console.log("No previous feedback")
    }

    let previousIssue = '';
    if (this.props.route.params.Issue) {
      previousIssue = this.props.route.params.Issue;
      this.state.issueComment = previousIssue.reportIssue;
      this.state.issueDate = moment(previousIssue.reportedDate).format("LL")
    } else {
      // console.log("No previous issue")
    }

    for (var i = 1; i <= this.state.Max_Rating; i++) {
      React_Native_Rating_Bar.push(
        <TouchableOpacity
          activeOpacity={0.7}
          key={i}
          onPress={this.UpdateRating.bind(this, i)}>
          <Image
            style={styles.StarImage}
            source={
              i <= this.state.Default_Rating
                ? { uri: this.Star }
                : { uri: this.Star_With_Border }
            }
          />
        </TouchableOpacity>
      );
    }
    if ((moment(new Date(this.props.route.params.Date))).diff(moment(new Date()), 'hours') < -48) {
      // More than 48 hours have past
      return (
        <ImageBackground source={Images.unit_background_booking_details} style={styles.BackgroundImage}>
          <SafeAreaView style={styles.SafeAreaView}>
            <ScrollView>
              <View style={styles.itemContainer1}>
                {
                  this.props.route.params.Status !== 'No-Show' ?
                    <>
                      <Text style={styles.captionText}>You’ll no longer be able to rate service provider after 48 hours</Text>
                    </>
                    :
                    <>
                    </>
                }
                <View style={styles.itemContainer}>
                  <View style={styles.leftCol}>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Date</Text>{" "}
                      <Text style={styles.textStyleSmall}>{moment(new Date(this.props.route.params.Date)).format("LL")}</Text>
                    </Text>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Time</Text>{" "}
                      <Text style={styles.textStyleSmall}>{moment(this.props.route.params.Time, "HHmm").format("HHmm")}</Text>
                    </Text>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle} >Type</Text>{"  "}
                      <Text style={styles.textStyleSmall} >{this.props.route.params.bookingType}</Text>
                    </Text>
                    {
                      this.props.route.params.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >No. of Pax</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.Pax}</Text>
                          </Text>
                        </>
                        :
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >Total Load</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.totalLoad}</Text>
                          </Text>
                        </>
                    }
                  </View>

                  <View style={styles.rightCol}>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle} >Status</Text>{"  "}
                      <Text style={styles.textStyleSmall} >{this.props.route.params.Status}</Text>
                    </Text>
                    {
                      this.props.route.params.Status === "Completed" || this.props.route.params.Status === "Late" ?
                        <Text style={styles.detailsSpacing}>
                          <Text style={styles.textStyle}>Boarding Time</Text>{" "}
                          <Text style={styles.textStyleSmall}>{moment(this.props.route.params.onBoardTime).utc().format("HHmm")}</Text>
                        </Text>
                        :
                        <>
                        </>
                    }
                    {
                      this.props.route.params.bookingGroup !== "" && this.props.route.params.bookingGroup != null ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle}>Booking Group</Text>{"  "}
                            <Text style={styles.textStyleSmall}>{this.props.route.params.bookingGroup}</Text>
                          </Text>
                        </>
                        :
                        <>
                        </>
                    }
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>From</Text>{" "}
                      <Text style={styles.textStyleSmall}>{this.props.route.params.route}</Text>
                    </Text>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Purpose</Text>{" "}
                      <Text style={styles.textStyleSmall}>{this.props.route.params.Purpose}</Text>
                    </Text>
                  </View>

                </View>
                <View style={styles.itemContainer2}>
                  <Text style={styles.detailsSpacing}>
                    <Text style={styles.textStyle}>Booked By</Text>{" "}
                    <Text style={styles.textStyleSmall}>{this.props.route.params.By}</Text>
                  </Text>
                  {
                    this.props.route.params.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                      <>
                      </>
                      :
                      <>
                        <Text style={styles.detailsSpacing}>
                          <Text style={styles.textStyle} >Remarks</Text>{"  "}
                          <Text style={styles.textStyleSmall} >{this.props.route.params.remarks}</Text>
                        </Text>
                      </>
                  }
                  {
                    this.props.route.params.Status === BookingStatus.CANCELLED ?
                      <>
                        <Text style={styles.detailsSpacing}>
                          <Text style={styles.textStyle} >Cancellation Reason</Text>{"  "}
                          <Text style={styles.textStyleSmall} >{this.props.route.params.cancelReason}</Text>
                        </Text>
                      </>
                      : this.props.route.params.Status === BookingStatus.REJECTED ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >Rejected Reason</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.rejectReason}</Text>
                          </Text>
                        </>
                        :
                        <>
                        </>
                  }
                </View>
                {
                  this.props.route.params.Issue ?
                    <>
                      <View style={styles.itemContainer1}>
                        <Text style={styles.ratings}>Issue reported</Text>
                        <Divider style={styles.dividerRemarks} />
                        <Text style={styles.submittedText}>{this.state.issueComment}</Text>
                      </View>
                    </>
                    :
                    <>
                    </>
                }
                {
                  this.props.route.params.Feedback ?
                    <>
                      <Text style={styles.ratings}>Ratings submitted</Text>
                      {/*View to hold our Stars*/}
                      <View style={styles.childView}>{React_Native_Rating_Bar}</View>
                      <View style={styles.poorView}>
                        <Text style={styles.poorWord}>Poor</Text>
                        <Text style={styles.excellentWord}>Excellent</Text>
                      </View>
                      {
                        this.state.comment !== '' && this.state.comment != undefined && this.state.comment != null ?
                          <>
                            <View style={styles.itemContainer1}>
                              <Text style={styles.LeaveCommentTag}>Comment</Text>
                              <Divider style={styles.dividerRemarks} />
                              <Text style={styles.submittedText}>{this.state.comment}</Text>
                            </View>
                          </>
                          :
                          <>
                          </>
                      }
                    </>
                    :
                    <>
                    </>
                }
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      );

    }
    else if (this.props.route.params.Status === "Completed" || this.props.route.params.Status === "Late") {
      // Show rating and comments
      return (
        <ImageBackground source={Images.unit_background_booking_details} style={styles.BackgroundImage} >
          <Spinner
            visible={this.state.loading}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
          <SafeAreaView style={styles.SafeAreaView}>
            <ScrollView>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : null}
                behavior={Platform.OS === "ios" ? "position" : ""}
              >
                <View style={styles.itemContainer1}>
                  {
                    this.props.route.params.Issue ?
                      <>
                      </>
                      :
                      <>
                        <View>
                          <TouchableOpacity
                            style={styles.ButtonReport}
                            onPress={() => { this.setState({ modalVisible: true }) }}>
                            <Text style={styles.ButtonReportText}>Report an issue</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                  }
                  <View style={styles.itemContainer}>
                    <View style={styles.leftCol}>
                      <Text style={styles.detailsSpacing}>
                        <Text style={styles.textStyle}>Date</Text>{" "}
                        <Text style={styles.textStyleSmall}>{moment(new Date(this.props.route.params.Date)).format("LL")}</Text>
                      </Text>
                      <Text style={styles.detailsSpacing}>
                        <Text style={styles.textStyle}>Time</Text>{" "}
                        <Text style={styles.textStyleSmall}>{moment(this.props.route.params.Time, "HHmm").format("HHmm")}</Text>
                      </Text>
                      <Text style={styles.detailsSpacing}>
                        <Text style={styles.textStyle} >Type</Text>{"  "}
                        <Text style={styles.textStyleSmall} >{this.props.route.params.bookingType}</Text>
                      </Text>
                      {
                        this.props.route.params.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                          <>
                            <Text style={styles.detailsSpacing}>
                              <Text style={styles.textStyle} >No. of Pax</Text>{"  "}
                              <Text style={styles.textStyleSmall} >{this.props.route.params.Pax}</Text>
                            </Text>
                          </>
                          :
                          <>
                            <Text style={styles.detailsSpacing}>
                              <Text style={styles.textStyle} >Total Load</Text>{"  "}
                              <Text style={styles.textStyleSmall} >{this.props.route.params.totalLoad}</Text>
                            </Text>
                          </>
                      }
                    </View>

                    <View style={styles.rightCol}>
                      <Text style={styles.detailsSpacing}>
                        <Text style={styles.textStyle} >Status</Text>{"  "}
                        <Text style={styles.textStyleSmall} >{this.props.route.params.Status}</Text>
                      </Text>
                      {
                        this.props.route.params.Status === "Completed" || this.props.route.params.Status === "Late" ?
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle}>Boarding Time</Text>{" "}
                            <Text style={styles.textStyleSmall}>{moment(this.props.route.params.onBoardTime).utc().format("HHmm")}</Text>
                          </Text>
                          :
                          <>
                          </>
                      }
                      {
                        this.props.route.params.bookingGroup !== "" && this.props.route.params.bookingGroup != null ?
                          <>
                            <Text style={styles.detailsSpacing}>
                              <Text style={styles.textStyle}>Booking Group</Text>{"  "}
                              <Text style={styles.textStyleSmall}>{this.props.route.params.bookingGroup}</Text>
                            </Text>
                          </>
                          :
                          <>
                          </>
                      }
                      <Text style={styles.detailsSpacing}>
                        <Text style={styles.textStyle}>From</Text>{" "}
                        <Text style={styles.textStyleSmall}>{this.props.route.params.route}</Text>
                      </Text>
                      <Text style={styles.detailsSpacing}>
                        <Text style={styles.textStyle}>Purpose</Text>{" "}
                        <Text style={styles.textStyleSmall}>{this.props.route.params.Purpose}</Text>
                      </Text>
                    </View>

                  </View>
                  <View style={styles.itemContainer2}>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Booked By</Text>{" "}
                      <Text style={styles.textStyleSmall}>{this.props.route.params.By}</Text>
                    </Text>
                    {
                      this.props.route.params.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                        <>
                        </>
                        :
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >Remarks</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.remarks}</Text>
                          </Text>
                        </>
                    }
                    {
                      this.props.route.params.Status === BookingStatus.CANCELLED ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >Cancellation Reason</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.cancelReason}</Text>
                          </Text>
                        </>
                        : this.props.route.params.Status === BookingStatus.REJECTED ?
                          <>
                            <Text style={styles.detailsSpacing}>
                              <Text style={styles.textStyle} >Rejected Reason</Text>{"  "}
                              <Text style={styles.textStyleSmall} >{this.props.route.params.rejectReason}</Text>
                            </Text>
                          </>
                          :
                          <>
                          </>
                    }
                  </View>
                  {
                    this.props.route.params.Issue ?
                      <>
                        <View style={styles.itemContainer1}>
                          <Text style={styles.ratings}>Issue reported</Text>
                          <Divider style={styles.dividerRemarks} />
                          <Text style={styles.submittedText}>{this.state.issueComment}</Text>
                        </View>
                      </>
                      :
                      <>
                      </>
                  }
                  {
                    this.props.route.params.Feedback ?
                      <>
                        <Text style={styles.ratings}>Ratings submitted</Text>
                      </>
                      :
                      <>
                        <Text style={styles.ratings}>Ratings</Text>
                      </>
                  }
                  {/*View to hold our Stars*/}
                  <View style={styles.childView}>{React_Native_Rating_Bar}</View>
                  <View style={styles.poorView}>
                    <Text style={styles.poorWord}>Poor</Text>
                    <Text style={styles.excellentWord}>Excellent</Text>
                  </View>
                </View>

                {
                  this.props.route.params.Feedback ?
                    <>
                      {
                        this.state.comment !== '' && this.state.comment != undefined && this.state.comment != null ?
                          <>
                            <View style={styles.itemContainer1}>
                              <Text style={styles.LeaveCommentTag}>Comment</Text>
                              <Divider style={styles.dividerRemarks} />
                              <Text style={styles.submittedText}>{this.state.comment}</Text>
                            </View>
                          </>
                          :
                          <>
                          </>
                      }
                    </>
                    :
                    <>
                      <View>
                        <Text style={styles.LeaveCommentTag2}>Leave a comment</Text>
                        <TextInput style={styles.comment}
                          onChangeText={text => this.setState({ comment: text })}
                          multiline
                        />
                      </View>
                      <View style={{ marginTop: 15 }}>
                        <TouchableOpacity style={styles.ButtonSubmit} onPress={() => {
                          this.setState({ loading: true })
                          let response = this.sendRating();
                        }
                        }>
                          <Text style={styles.ButtonSubmitText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                }
              </KeyboardAvoidingView>
            </ScrollView>
          </SafeAreaView>

          {/* Report Issue Modal */}
          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
            >
              <KeyboardAvoidingView style={styles.centeredView}
                behavior={Platform.OS === 'ios' ? "padding" : ""}
              >
                <View style={styles.modalView}>
                  <Ionicons style={styles.IconsLeft} name={"ios-close"} onPress={() => { this.setState({ modalVisible: false }) }} />
                  {
                    this.props.route.params.Issue ?
                      <>
                        <Text style={styles.Title}>Issue Reported:</Text>
                        <Text style={styles.submittedIssueText}>{this.state.issueComment}</Text>
                        <Text style={styles.submittedIssueText}>On {this.state.issueDate}</Text>
                      </>
                      :
                      <>
                        <Text style={styles.Title}>Report Issue:</Text>
                        <TextInput style={styles.comment1}
                          value={this.state.issueComment}
                          onChangeText={text => this.setState({ issueComment: text })}
                          multiline
                          placeholder="Enter Issue"
                        />
                        {
                          this.state.issueError && this.state.issueComment === "" &&
                          <>
                            <Text style={styles.errorText}>Please enter an issue</Text>
                          </>
                        }
                        <TouchableOpacity
                          style={{ ...styles.openButton, backgroundColor: "red" }}
                          onPress={() => {
                            if (this.state.issueComment === "") {
                              this.setState({ issueError: true })
                              // console.log("Error")
                              return
                            }
                            // console.log("No error")
                            this.setState({ loading: true })
                            let response = this.sendIssue();
                          }}
                        >
                          <Text style={styles.textStyle1}>Report</Text>
                        </TouchableOpacity>
                      </>
                  }
                </View>
              </KeyboardAvoidingView>
            </Modal>
          </View>

          {/* Rating Success Modal */}
          <View>
            <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.ratingSuccessModal}>
              <View style={styles.centeredView2}>
                <View style={styles.modalView2}>
                  {/* <Ionicons style={styles.iconApproved} name={"ios-checkmark-circle-outline"} /> */}
                  <Image source={Images.icon_approved} style={styles.iconApproved} />
                  <Text style={styles.modalMessage2} >Rating has been submitted</Text>
                  <TouchableHighlight
                    style={styles.confirmTouchable}
                    underlayColor="#e1a706"
                    onPress={() => {
                      this.setState({ ratingSuccessModal: false })
                    }}
                  >
                    <Text style={styles.confirmText}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>

          {/* Rating Fail Modal */}
          <View>
            <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.ratingFailModal}>
              <View style={styles.centeredView2}>
                <View style={styles.modalView2}>
                  {/* <Ionicons style={styles.iconRejected} name={"ios-close-circle-outline"} /> */}
                  <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                  <Text style={styles.modalMessage2} >Unable to submit rating</Text>
                  <TouchableHighlight
                    style={styles.confirmTouchable}
                    underlayColor="#e1a706"
                    onPress={() => {
                      this.setState({ ratingFailModal: false })
                    }}
                  >
                    <Text style={styles.confirmText}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>

          {/* Issue Success Modal */}
          <View>
            <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.reportSuccessModal}>
              <View style={styles.centeredView2}>
                <View style={styles.modalView2}>
                  {/* <Ionicons style={styles.iconApproved} name={"ios-checkmark-circle-outline"} /> */}
                  <Image source={Images.icon_approved} style={styles.iconApproved} />
                  <Text style={styles.modalMessage2} >Issue has been submitted</Text>
                  <TouchableHighlight
                    style={styles.confirmTouchable}
                    underlayColor="#e1a706"
                    onPress={() => {
                      this.setState({ reportSuccessModal: false })
                    }}
                  >
                    <Text style={styles.confirmText}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>

          {/* Issue Fail Modal */}
          <View>
            <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.reportFailModal}>
              <View style={styles.centeredView2}>
                <View style={styles.modalView2}>
                  {/* <Ionicons style={styles.iconRejected} name={"ios-close-circle-outline"} /> */}
                  <Image source={Images.icon_cancelled} style={styles.iconRejected} />
                  <Text style={styles.modalMessage2} >Unable to submit issue</Text>
                  <TouchableHighlight
                    style={styles.confirmTouchable}
                    underlayColor="#e1a706"
                    onPress={() => {
                      this.setState({ reportFailModal: false })
                    }}
                  >
                    <Text style={styles.confirmText}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>

        </ImageBackground>
      );
    } else {
      // Show if the booking is less than 48 hrs but not completed nor late
      return (
        <ImageBackground source={Images.unit_background_booking_details} style={styles.BackgroundImage}>
          <SafeAreaView style={styles.SafeAreaView}>
            <ScrollView>
              <View style={styles.itemContainer1}>
                <Text style={{ opacity: 0.3, marginTop: 15, textAlign: 'center', marginBottom: 8 }}>This is a {(this.props.route.params.Status).toLowerCase()} booking</Text>
                <View style={styles.itemContainer}>
                  <View style={styles.leftCol}>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Date</Text>{" "}
                      <Text style={styles.textStyleSmall}>{moment(new Date(this.props.route.params.Date)).format("LL")}</Text>
                    </Text>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Time</Text>{" "}
                      <Text style={styles.textStyleSmall}>{moment(this.props.route.params.Time, "HHmm").format("HHmm")}</Text>
                    </Text>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle} >Type</Text>{"  "}
                      <Text style={styles.textStyleSmall} >{this.props.route.params.bookingType}</Text>
                    </Text>
                    {
                      this.props.route.params.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >No. of Pax</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.Pax}</Text>
                          </Text>
                        </>
                        :
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >Total Load</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.totalLoad}</Text>
                          </Text>
                        </>
                    }
                  </View>

                  <View style={styles.rightCol}>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle} >Status</Text>{"  "}
                      <Text style={styles.textStyleSmall} >{this.props.route.params.Status}</Text>
                    </Text>
                    {
                      this.props.route.params.bookingGroup !== "" && this.props.route.params.bookingGroup != null ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle}>Booking Group</Text>{"  "}
                            <Text style={styles.textStyleSmall}>{this.props.route.params.bookingGroup}</Text>
                          </Text>
                        </>
                        :
                        <>
                        </>
                    }
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>From</Text>{" "}
                      <Text style={styles.textStyleSmall}>{this.props.route.params.route}</Text>
                    </Text>
                    <Text style={styles.detailsSpacing}>
                      <Text style={styles.textStyle}>Purpose</Text>{" "}
                      <Text style={styles.textStyleSmall}>{this.props.route.params.Purpose}</Text>
                    </Text>
                  </View>

                </View>
                <View style={styles.itemContainer2}>
                  <Text style={styles.detailsSpacing}>
                    <Text style={styles.textStyle}>Booked By</Text>{" "}
                    <Text style={styles.textStyleSmall}>{this.props.route.params.By}</Text>
                  </Text>
                  {
                    this.props.route.params.serviceProviderType === ServiceProviderTypes.PASSENGER ?
                      <>
                      </>
                      :
                      <>
                        <Text style={styles.detailsSpacing}>
                          <Text style={styles.textStyle} >Remarks</Text>{"  "}
                          <Text style={styles.textStyleSmall} >{this.props.route.params.remarks}</Text>
                        </Text>
                      </>
                  }
                  {
                    this.props.route.params.Status === BookingStatus.CANCELLED ?
                      <>
                        <Text style={styles.detailsSpacing}>
                          <Text style={styles.textStyle} >Cancellation Reason</Text>{"  "}
                          <Text style={styles.textStyleSmall} >{this.props.route.params.cancelReason}</Text>
                        </Text>
                      </>
                      : this.props.route.params.Status === BookingStatus.REJECTED ?
                        <>
                          <Text style={styles.detailsSpacing}>
                            <Text style={styles.textStyle} >Rejected Reason</Text>{"  "}
                            <Text style={styles.textStyleSmall} >{this.props.route.params.rejectReason}</Text>
                          </Text>
                        </>
                        :
                        <>
                        </>
                  }
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      );
    }

  }
}