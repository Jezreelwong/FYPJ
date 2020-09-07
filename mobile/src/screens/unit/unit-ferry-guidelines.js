import React from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AwsData from '../../shared/AwsData';
import Ionicons from "react-native-vector-icons/Ionicons";

const awsData = new AwsData();

const styles = StyleSheet.create({
  headerLeftTouchable: {
    marginLeft: 15
  }
})

export default class FeedBackGuidlines extends React.Component {
  constructor(props) {
    super(props);
    this.serviceProviderType = this.props.route.params.ServiceProviderType;
    this.guidelines = awsData.guidelines.filter(guideline => guideline.serviceProviderType === this.serviceProviderType);  
    this.props.navigation.setOptions({
      title: "Ferry Guidelines",
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerLeftTouchable}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons name="ios-close" color="white" size={45} style={{ width: 45, height: 45 }} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View/>
      )
    })
  }
  render() {
    return (

      <SafeAreaView>
        <FlatList
          data={this.guidelines}
          keyExtractor={({ item }, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text style={{ margin: 20 }}>{item.guideline}</Text>
            </View>
          )
          }

        />
      </SafeAreaView>
    )
  }
}