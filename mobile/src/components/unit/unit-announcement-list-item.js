import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Screens from '../../screens/screens';

const UnitAnnouncementItem = ({ announcement, navigation }) => {
  
  return (
      <View style={styles.itemContainer}>
        <View style={styles.leftCol}>
          <View style={styles.row}>
            <Text style={styles.title}>{announcement.message}</Text>
          </View>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
            }}
          />
          <Text style={styles.row}>
            <Text style={styles.time}>
              On {moment(announcement.createdDate).utc().format("LLL")}
            </Text>
          </Text>
        </View>
       
      </View>

  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "95%",
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: "center",
    backgroundColor: "white",
  },
  leftCol: {
    width: "100%"
  },
  row: {
    paddingVertical: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
  },
  value: {
    
  },
  time: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#646D6D'
  }
})

export default UnitAnnouncementItem;