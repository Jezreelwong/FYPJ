import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import icon_ferry from "../images/booking/icon_ferry.png";
import icon_rpl from "../images/booking/icon_rpl.png";

const icon = {
    "PASSENGER": icon_ferry,
    "RPL": icon_rpl
};

const ServiceProviderTypeHeader = ({ title }) => {
    return (
        <View style={styles.header}>
            <Image source={icon[title]} resizeMode="contain" style={styles.serviceProviderIcon}/>
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