import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

const CancelAction = ({
  booking,
  onCancel,
  closeAllOpenRows,
  style,
}) => {
  return (
    <View style={[
      styles.actionsContainer,
      style
    ]}>
      <TouchableHighlight
        style={[styles.action, styles.reject]}
        underlayColor="#f44336"
        onPress={() => {
          {
            { closeAllOpenRows() }
            { onCancel(booking) }
          };
        }
        }
      >
        <Text style={styles.text}>Cancel</Text>
      </TouchableHighlight>
    </View>
  );
};

export default CancelAction;

const styles = StyleSheet.create({
  actionsContainer: {
    height: "100%",
    flexDirection: "row",
    position: "absolute",
    right: 10,
    borderRadius: 3,
    overflow: "hidden"
  },
  action: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  accept: {
    backgroundColor: "#00c752"
  },
  reject: {
    backgroundColor: "#f44336"
  },
  text: {
    color: 'white',
    fontSize: 13
  }
});
