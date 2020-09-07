import React from "react";
import ModalInput from "./ModalInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useModal from "../hooks/useModal";

const TimePicker = (props) => {
  const [visible, showModal, hideModal] = useModal(false);
  const {
    value,
    errorMessage,
    disabled
  } = props;

  function onConfirm(date) {
    hideModal();
    if (props.onConfirm) {
      props.onConfirm(date);
    }
  }

  function inputOnPress() {
    if (!disabled) {
      showModal();
    }
  }

  return (
    <>
      <ModalInput
        leftIcon={{ type: "feather", name: "clock" }}
        placeholder="Select Time"
        value={value}
        errorMessage={errorMessage}
        onPress={inputOnPress}
        modalIsVisible={visible}
        disabled={disabled}
      />
      <DateTimePickerModal
        headerTextIOS="Pick a time"
        isVisible={visible}
        mode="time"
        date={new Date()}
        display="spinner"
        onConfirm={onConfirm}
        onCancel={hideModal}
      />
    </>
  )
};

export default TimePicker;
