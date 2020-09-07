import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Input } from "react-native-elements";

const DEFAULT_COLOR = "#7b8894";
const FOCUSED_COLOR = "tomato";

const PickerInput = ({ placeholder, value, onPress, isFocused, leftIcon }) => {
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    setColor(isFocused ? FOCUSED_COLOR : DEFAULT_COLOR);
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <Input
          placeholder={placeholder}
          value={value}
          editable={false}
          inputContainerStyle={styles.container}
          inputStyle={styles.input}
          leftIcon={{ ...leftIcon, color }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0
  },
  input: {
    padding: 15
  }
});

export default PickerInput;
