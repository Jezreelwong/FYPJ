import React from "react";
import { Avatar } from "react-native-elements";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const SelectableVehicle = ({
    vehicle,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={styles.availableVehicleTouchable}
            onPress={() => onPress(vehicle)}
            testID="vehicle"
        >
            <Avatar
                rounded
                icon={{ type: "material-community", name: "truck" }}
                size={60}
                overlayContainerStyle={styles.iconBackground}
                containerStyle={styles.iconContainer}
            />
            <Text>
                <Text>{vehicle.name.trim()} </Text>
                <Text>- {vehicle.load}</Text>
            </Text>
        </TouchableOpacity>
    );
};

export default SelectableVehicle;

const styles = StyleSheet.create({
    availableVehicleTouchable: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5
    },
    iconBackground: {
        backgroundColor: "tomato"
    },
    iconContainer: {
        marginRight: 10
    }
});
