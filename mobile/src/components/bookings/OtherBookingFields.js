import React, { useState, useEffect } from "react";
import Input from "../Input";

const PassengerField = ({ value, onChangeText }) => {
    return (
        <Input
            placeholder="Select Number of Passengers"
            value={value}
            onChangeText={text => onChangeText(text)}
            keyboardType="numeric"
            leftIcon={{ type: "material-community", name: "human-male-male" }}
        />
    )
};

const VehiclesField = () => {
    return (
        <Input
            placeholder="Select Vehicles"
            keyboardType="numeric"
            leftIcon={{ type: "material-community", name: "car-multiple" }}
        />
    )
};

export { PassengerField, VehiclesField };
