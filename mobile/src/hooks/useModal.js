import React, { useState } from "react";

function useModal(initialState = false) {
  const [visible, setVisible] = useState(initialState);

  function showModal() {
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  return [visible, showModal, hideModal];
}

export default useModal;
