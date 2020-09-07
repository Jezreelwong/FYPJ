import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Picker
} from "react-native";
import ModalInput from "./ModalInput";
import useModal from "../hooks/useModal";

const ModalPicker = ({
  screen,
  leftIcon,
  placeholder,
  value,
  errorMessage,
  items,
  onItemSelected,
  disabled,
  testID = "",
}) => {
  const [visible, showModal, hideModal] = useModal(false);
  const [pickerState, setPickerState] = useState(null);

  useEffect(() => {
    if (!disabled) {
      setPickerState({
        value: items[0]?.value,
        index: 0
      })
    }
    if(!screen) {
      screen = "booking"
    }
  }, [items]);

  function setPickerItem(item) {
    hideModal();
    if (onItemSelected) {
      onItemSelected(item);
    }
  }

  function renderItems(items) {
    return items.map(item => {
      return (
        Platform.OS === "ios" ?
          <Picker.Item
            key={item.value}
            value={item.value}
            label={item.label}
          />
          :
          <TouchableHighlight
            key={item.value}
            underlayColor="#DDD"
            onPress={() => setPickerItem(item)}
          >
            <Text style={android.text}>{item.label}</Text>
          </TouchableHighlight>
      );
    });
  }

  function inputOnPress() {
    if (!disabled) {
      showModal();
    }
  }

  return (
    <>
      <ModalInput
        screen={screen}
        leftIcon={leftIcon}
        placeholder={placeholder}
        value={value}
        errorMessage={errorMessage}
        modalIsVisible={visible}
        onPress={inputOnPress}
        disabled={disabled}
        testID={testID}
      />
      {
        !disabled &&
        <Modal
          visible={visible}
          animationType={Platform.OS === "ios" ? "slide" : "fade"}
          transparent={true}
        >
          <TouchableWithoutFeedback touchSoundDisabled={true} onPress={hideModal}>
            {
              Platform.OS === "ios" ?
                <View style={ios.backdrop}>
                  <TouchableWithoutFeedback touchSoundDisabled={true}>
                    <View style={ios.pickerContainer}>
                      <View style={ios.actionBar}>
                        <TouchableOpacity style={ios.action} onPress={hideModal}>
                          <Text style={[
                            ios.actionText,
                            ios.cancel
                          ]}>
                            Cancel
                                                    </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={ios.action}
                          onPress={() => setPickerItem(items[pickerState.index])}
                        >
                          <Text style={[
                            ios.actionText,
                            ios.done
                          ]}>
                            Done
                                                    </Text>
                        </TouchableOpacity>
                      </View>
                      <Picker
                        style={{ backgroundColor: "#c7cad1" }}
                        itemStyle={{fontSize: screen === "filter1" || screen==="booking" ? 18 : 20}}
                        selectedValue={pickerState?.value}
                        onValueChange={
                          (value, index) => setPickerState({
                            value,
                            index
                          })
                        }
                      >
                        {renderItems(items)}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                :
                <View style={android.backdrop}>
                  <TouchableWithoutFeedback touchSoundDisabled={true}>
                    <View style={android.picker}>
                      <Text style={[android.text, android.title]}>{placeholder}</Text>
                      {renderItems(items)}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            }
          </TouchableWithoutFeedback>
        </Modal>
      }
    </>
  );
};

const ios = StyleSheet.create({
  backdrop: {
    flex: 1
  },
  pickerContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  actionBar: {
    paddingHorizontal: 7,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e7e7e7",
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  actionText: {
    fontSize: 18,
    color: "#007aff"
  },
  action: {
    paddingHorizontal: 8,
    paddingVertical: 13
  },
  cancel: {
    fontWeight: "400",
  },
  done: {
    fontWeight: "600",
  },
  picker: {
    flex: 1,
    backgroundColor: "#c7cad1"
  }
});

const android = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .5)"
  },
  picker: {
    width: "80%",
    borderRadius: 2,
    backgroundColor: "#f5f5f5"
  },
  title: {
    opacity: .4
  },
  text: {
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 12
  }
});

export default ModalPicker;
