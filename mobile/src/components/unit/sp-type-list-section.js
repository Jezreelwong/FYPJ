import React from 'react';
import { SectionList, Text, StyleSheet, Image, View } from 'react-native';
//import Resultbookingitem from '../Resultbookingitem'
import UnitBookingListItem from './booking-list-item';
import { pure } from 'recompose';

import ServiceProviderTypeHeader from '../Sectionicons';

const UnitSPTypeSectionList = ({ section, navigation }) => {
  return (
    <View>
      <SectionList
        sections={[section]}
        keyExtractor={item => item.bookingCode}
        renderSectionHeader={
          ({ section }) =>
            section.data.length > 0 && <ServiceProviderTypeHeader title={section.serviceProviderType} />
        }
        renderItem={
          ({ item }) =>
            <UnitBookingListItem booking={item} navigation={navigation} />
        }
      />
    </View>
  );
};

export default pure(UnitSPTypeSectionList);
