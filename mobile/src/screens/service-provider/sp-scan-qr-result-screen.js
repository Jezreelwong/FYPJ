import React from 'react';
import { View, SafeAreaView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import moment from 'moment';

import images from '../../images';

const styles = StyleSheet.create({
  itemContainer:
  {
    width: "95%",
    flexDirection: "row",
    marginBottom: 10,
    padding: 20,
    alignSelf: "center",
    marginTop: 50,
  },

  leftCol:
  {
    width: "40%"
  },

  rightCol:
  {
    width: "60%",
    alignItems: "flex-start",
  },
  DividerTopstyle:
  {
    marginTop: 10,
    width: 140,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    marginBottom: 10
  },
  DividerBottomstyle:
  {
    borderColor: '#dcdcdc',
    borderWidth: 1,
    width: 200,
    marginTop: 10,
    marginBottom: 10

  },

  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: 300,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },


})

class scanQRCodeResult extends React.Component {
  constructor(props) {
    super(props)
    // console.log(this.props);
    // console.log(this.props.route.params.results);
    // console.log(this.props.route.params.results.bookingCode);
  }
  render() {

    return(
      <SafeAreaView>
        <View>
          <View>
            <Image source={images.icon_successful} style={{ marginTop: 100, height: 150, width: 400, resizeMode: 'contain' }} />
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.leftCol}>
              <Text>From</Text>
              <Divider style={styles.DividerTopstyle} />
              <Text>Time</Text>
              <Divider style={styles.DividerTopstyle} />
              <Text>Booking Code</Text>
              <Divider style={styles.DividerTopstyle} />
              <Text>Booked By</Text>
              <Divider style={styles.DividerTopstyle} />
              <Text> Purpose</Text>
            </View>
            <View style={styles.rightCol}>
              <Text>{this.props.route.params.results.routeName}</Text>
              <Divider style={styles.DividerBottomstyle} />
              <Text>{moment().format("HHmm")} Hrs</Text>
              <Divider style={styles.DividerBottomstyle} />
              <Text>{this.props.route.params.results.bookingCode}</Text>
              <Divider style={styles.DividerBottomstyle} />
              <Text>{this.props.route.params.results.bookingUnit}</Text>
              <Divider style={styles.DividerBottomstyle} />
              <Text>{this.props.route.params.results.purposeShort}</Text>
            </View>
          </View>

          <View style={{ marginLeft: 40 }}>
            <TouchableOpacity style={{ ...styles.openButton, backgroundColor: "orange" }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    )
  }
}

export default scanQRCodeResult;