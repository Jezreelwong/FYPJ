import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input as RNElementsInput } from "react-native-elements";

const DEFAULT_COLOR = "#7b8894";
const FOCUSED_COLOR = "tomato";
const ICON_SIZE = 26;

const Input = ({
  screen,
  leftIcon,
  placeholder,
  value,
  errorMessage,
  editable,
  onChangeText,
  keyboardType,
  pointerEvents,
  disabled,
  placeholderTextColor = "#7b8894",
  testID = '',
}) => {
  const inputRef = React.createRef();
  const [color, setColor] = useState(DEFAULT_COLOR);

  function changeIconColor() {
    setColor(inputRef.current.isFocused() ? FOCUSED_COLOR : DEFAULT_COLOR);
  }

  return (
    <RNElementsInput
      testID={testID}
      leftIcon={screen === "filter" || screen === "filter1" ? null : { color, ...leftIcon, size: ICON_SIZE, width: ICON_SIZE }}
      placeholder={placeholder}
      value={value}
      errorMessage={errorMessage}
      editable={editable}
      ref={inputRef}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      pointerEvents={pointerEvents}
      onFocus={changeIconColor}
      onBlur={changeIconColor}
      containerStyle={styles.container}
      inputContainerStyle={screen == "filter" || screen === "filter1" ? styles1.inputContainer : styles.inputContainer}
      inputStyle={screen == "filter" || screen === "filter1" ? styles1.input : styles.input}
      errorStyle={styles.error}
      disabled={disabled}
      disabledInputStyle={styles.disabled}
      placeholderTextColor={placeholderTextColor}
    />
  )
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 15,
    borderBottomWidth: 0
  },
  input: {
    padding: 15
  },
  error: {
    marginLeft: 30
  },
  disabled: {
    opacity: 1
  }
});

const styles1 = StyleSheet.create({
  inputContainer: {
    width: "100%",
    borderBottomWidth: 0,
  },
  input: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    fontSize: 15
  },
});
export default Input;
