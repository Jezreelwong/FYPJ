import React from 'react';
import { Text, StyleSheet } from 'react-native';

const DateSectionHeader = ({ text }) => {
    return (
        <Text style={styles.text}>{text}</Text>
    );
};

const styles = StyleSheet.create({
    text: {
        paddingHorizontal: 7,
        paddingVertical: 5,
        color: "#fff",
        fontWeight: "bold",
        backgroundColor: "#f79900"
    }
});

export default DateSectionHeader;
