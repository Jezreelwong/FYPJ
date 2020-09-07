import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge } from "react-native-elements";

const SelectedVehicleItem = ({ vehicle }) => {
    return (
        <View style={styles.row}>
            <View style={styles.item}>
                <Text style={styles.name}>{vehicle.name}</Text>
                <Badge
                    value={vehicle.quantity}
                    badgeStyle={styles.badge}
                />
            </View>
        </View>
    );
};

export default SelectedVehicleItem;

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 30,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ebebeb"
    },
    name: {
        fontSize: 17
    },
    badge: {
        borderWidth: 0,
        backgroundColor: "#000"
    }
});
