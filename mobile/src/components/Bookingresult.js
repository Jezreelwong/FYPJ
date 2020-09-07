import React from 'react';
import { SectionList, Text, StyleSheet, Image, View } from 'react-native';
import Resultbookingitem from './Resultbookingitem'
import ServiceProviderTypeHeader from './Sectionicons';

const Bookingsection = ({ section, navigation }) => {
    return (
        <View>
        <SectionList
            sections={[section]}
            keyExtractor={item => item.bookingCode}
            renderSectionHeader={
                ({ section }) =>
            section.data.length > 0 && <ServiceProviderTypeHeader title= {section.serviceProviderType}/>
            }
            renderItem={
            ({ item }) => 
            <Resultbookingitem booking={item} navigation={navigation}/> 
            }
        />
         </View>
    );
};

export default Bookingsection;
