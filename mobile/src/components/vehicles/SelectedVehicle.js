import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Badge } from "react-native-elements";

const ICON_SIZE = 60;

const SelectedVehicle = ({ vehicle, index, onPress, onLongPress }) => {
    return (
        <TouchableOpacity
            style={styles.touchable}
            onPress={() => onPress(index)}
            onLongPress={() => onLongPress(index)}
        >
            <View style={styles.iconContainer}>
                <View>
                    <Avatar
                        rounded
                        icon={{ type: "material-community", name: "truck" }}
                        size={ICON_SIZE}
                    />
                    <Badge
                        value={vehicle.quantity}
                        containerStyle={styles.badge}
                    />
                </View>
            </View>
            <Text>{vehicle.name}</Text>
        </TouchableOpacity>
    );
};

export default SelectedVehicle;

const styles = StyleSheet.create({
    touchable: {
        width: ICON_SIZE,
        alignItems: "center",
        marginRight: 20
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0
    }
});
