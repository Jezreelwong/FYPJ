import React from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import Input from "./Input";
import AwsData from "../shared/AwsData"

const DEFAULT_COLOR = "#7b8894";
const FOCUSED_COLOR = "tomato";

const ModalInput = (props) => {
    const {
        screen,
        leftIcon,
        placeholder,
        value,
        modalIsVisible,
        disabled,
        placeholderTextColor = "#7b8894",
        testID = '',
    } = props;

    function onPress() {
        Keyboard.dismiss();
        if (props.onPress) {
            props.onPress();
        }
    }

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View>
                <Input
                    testID={testID}
                    screen={screen}
                    leftIcon={{
                        ...leftIcon,
                        color: modalIsVisible ?
                            AwsData.user.role === "DP" ? "#00b8d4" : FOCUSED_COLOR : DEFAULT_COLOR
                    }}
                    placeholder={placeholder}
                    value={value}
                    errorMessage={props.errorMessage}
                    editable={false}
                    pointerEvents="none"
                    disabled={disabled}
                    placeholderTextColor={placeholderTextColor}
                />
            </View>
        </TouchableWithoutFeedback>
    )
};

export default ModalInput;
