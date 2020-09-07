import React from "react";
import { View, StyleSheet } from "react-native";
import { SwipeRow } from "react-native-swipe-list-view";
import Animated, { sub } from "react-native-reanimated";

const margin = 10;

const Swipeable = (props) => {
  const width = new Animated.Value(0);

  return (
    <View style={styles.itemContainer}>
      <SwipeRow
        tension={20}
        disableRightSwipe={props.disableRightSwipe}
        rightOpenValue={props.rightOpenValue}
        swipeToOpenPercent={(props.rightThreshold / props.rightOpenValue) * 100}
        onSwipeValueChange={data => width.setValue(data.value)}
      >
        <Animated.View style={[
          styles.mask,
          { width: sub(sub(0, width), margin) }
        ]}>
          <View style={[
            styles.actionsContainer,
            { minWidth: Math.abs(props.rightOpenValue) - margin }
          ]}>
            {props.rightActions}
          </View>
        </Animated.View>
        {props.children}
      </SwipeRow>
    </View>
  );
};

export default Swipeable;

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: margin,
    marginVertical: 3
  },
  mask: {
    height: "100%",
    position: "absolute",
    right: 0,
    borderRadius: 3,
    overflow: "hidden"
  },
  actionsContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    right: 0,
    flexDirection: "row"
  }
});
