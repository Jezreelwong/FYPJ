import React from 'react';
import { Text, StyleSheet } from 'react-native';

const DateSectionHeaderSP = ({ text }) => {
    return (
        <Text style={styles.text}>{text}</Text>
    );
};

const styles = StyleSheet.create({
    text: {
        paddingHorizontal: 7,
        paddingVertical: 5,
        color: "white",
        fontWeight: "bold",
        backgroundColor: "#1876d2"
    }
});

export default DateSectionHeaderSP;
