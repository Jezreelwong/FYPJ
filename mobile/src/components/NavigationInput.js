import React from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import Input from "./Input";

const NavigationInput = (props) => {
  const {
    leftIcon,
    placeholder,
    value,
    errorMessage,
    testID = ""
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
          leftIcon={leftIcon}
          placeholder={placeholder}
          value={value}
          errorMessage={errorMessage}
          editable={false}
          pointerEvents="none"
        />
      </View>
    </TouchableWithoutFeedback>
  )
};

export default NavigationInput;
