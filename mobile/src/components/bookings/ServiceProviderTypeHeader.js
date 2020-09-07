import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Images from '../../images';

const icon = {
  "PASSENGER": Images.ferry_icon_passenger,
  "RPL": Images.ferry_icon_rpl
};

const ServiceProviderTypeHeader = ({ title }) => {
  return (
    <View style={styles.header}>
      <Image source={icon[title]} resizeMode="contain" style={styles.serviceProviderIcon} />
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 7,
    paddingVertical: 5
  },
  serviceProviderIcon: {
    width: 20,
    height: 20,
    marginRight: 6
  }
});

export default ServiceProviderTypeHeader;
