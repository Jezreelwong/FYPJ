import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import ServiceProviderTypeHeader from "./ServiceProviderTypeHeader";
import BookingItem from "./BookingItem";
import BookingActions from "./BookingActions";
import Screens from '../../screens/screens.js';
import { pure } from 'recompose';


const ServiceProviderTypeSection = ({
  section,
  onSwipe,
  onSwipeEnd,
  onReject,
  onApprove,
  onApproveSuccess,
  onApproveFailure,
  loading,
  closeAllOpenRows,
  onRowDidOpen,
  navigation
}) => {
  return (
    <SwipeListView
      onRowDidOpen={(rowKey, rowMap) => onRowDidOpen(rowKey,rowMap)}
      useSectionList={true}
      swipeGestureBegan={onSwipe}
      swipeGestureEnded={onSwipeEnd}
      closeOnRowBeginSwipe={true}
      closeOnRowOpen={true}
      closeOnRowPress
      closeOnScroll
      sections={section}
      keyExtractor={item => item.bookingCode}
      renderSectionHeader={
        ({ section }) =>
          section.data.length > 0 && <ServiceProviderTypeHeader title={section.serviceProviderType} />
      }
      renderItem={
        ({ item }) => {
          const rightOpenValue = -170;
          const rightThreshold = -30;
          return (
            <SwipeRow
              tension={50}
              recalculateHiddenLayout={true}
              disableRightSwipe={true}
              rightOpenValue={rightOpenValue}
              style={{ marginBottom: 5 }}
              swipeToOpenPercent={
                (rightThreshold / rightOpenValue) * 100
              }
            >
              <BookingActions
                booking={item}
                onReject={onReject}
                onApprove={onApprove}
                onApproveSuccess={onApproveSuccess}
                onApproveFailure={onApproveFailure}
                loading={loading}
                closeAllOpenRows={closeAllOpenRows}
                style={{ width: Math.abs(rightOpenValue) - 5 }}
              />
              <TouchableOpacity activeOpacity={1} onPress={() => {
                navigation.navigate(Screens.AdminBookingData, { booking: item });
              }}>
                <BookingItem booking={item} />
              </TouchableOpacity>
            </SwipeRow>
          );
        }
      }
    />
  );
};

export default pure(ServiceProviderTypeSection);


