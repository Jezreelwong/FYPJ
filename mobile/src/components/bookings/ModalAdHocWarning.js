import React from "react";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Modal, View, Text, TouchableWithoutFeedback, TouchableHighlight, StyleSheet } from "react-native";

const ModalAdHocWarning = ({ visible, onPress, onContinue }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <TouchableWithoutFeedback touchSoundDisabled={true} onPress={onPress}>
                <View style={styles.screen}>
                    <TouchableWithoutFeedback touchSoundDisabled={true}>
                        <View style={styles.modal}>
                            <View>
                                <TouchableHighlight
                                    style={styles.closeButton}
                                    underlayColor="#ddd"
                                    onPress={onPress}
                                    hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                                >
                                    <Feather name="x" size={30} color="#676767"/>
                                </TouchableHighlight>
                                <View style={styles.warning}>
                                    <View style={styles.warningIcon}>
                                        <Feather name="triangle" size={60} color="#fe2853"/>
                                        <FontAwesome name="exclamation" size={30} style={{ top: "33%", position: "absolute" }}/>
                                    </View>
                                    <Text style={styles.warningBigText}>WARNING!</Text>
                                </View>
                                <Text style={styles.warningText}>Booking must be made 48 hours prior to the event.</Text>
                                <Text style={[styles.warningText, styles.consequence]}>Ad-Hoc charges will be incurred if you proceed.</Text>
                                <Text style={styles.warningText}>Are you sure you want to continue?</Text>
                            </View>
                            <TouchableHighlight
                                style={styles.continue}
                                underlayColor="#008899"
                                onPress={onContinue}
                                hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                            >
                                <Text style={styles.continueText}>Yes, continue</Text>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    modal: {
        width: "100%",
        height: "62%",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 40,
        backgroundColor: "#f5f5f5",
    },
    closeButton: {
        alignSelf: "flex-start",
        borderRadius: 3
    },
    warning: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12
    },
    warningIcon: {
        alignItems: "center",
        justifyContent: "center"
    },
    warningBigText: {
        fontWeight: "bold",
        fontFamily: 'Roboto',
        fontSize: 18
    },
    warningText: {
        fontSize: 15,
        alignSelf: "center"
    },
    consequence: {
        marginBottom: 12,
        fontWeight: "bold",
        fontFamily: 'Roboto',
        color: "#fe2853"
    },
    continue: {
        alignSelf: "center",
        paddingHorizontal: 100,
        paddingVertical: 7,
        borderRadius: 5,
        backgroundColor: "#00bbd3"
    },
    continueText: {
        fontSize: 18,
        color: "#fff"
    }
});

export default ModalAdHocWarning;
