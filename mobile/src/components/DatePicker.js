import React from "react";
import ModalInput from "./ModalInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useModal from "../hooks/useModal";

const DatePicker = (props) => {
  const [visible, showModal, hideModal] = useModal(false);
  const currentDate = new Date();
  const {
    value,
    errorMessage,
    disabled,
    placeholder = "Select Date",
    minDate = new Date(),
    maxDate = currentDate.setMonth( currentDate.getMonth() + 3),
    testID = ''
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
        testID={testID}
        leftIcon={{ type: "material-community", name: "calendar-month-outline" }}
        placeholder={placeholder}
        value={value}
        errorMessage={errorMessage}
        onPress={inputOnPress}
        modalIsVisible={visible}
        disabled={disabled}
      />
      <DateTimePickerModal
        isVisible={visible}
        date={new Date()}
        minimumDate={minDate}
        onConfirm={onConfirm}
        onCancel={hideModal}
        maximumDate={maxDate}
      />
    </>
  )
};

export default DatePicker;
