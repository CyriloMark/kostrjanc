import React from 'react'

import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

import MapView from 'react-native-maps';

export default function EventCard(props) {
    return (
        <View style={[ props.style, { borderRadius: 15, overflow: "hidden" } ]}>

            {/* <MapView style={styles.map}
            accessible={false} focusable={false}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
            /> */}

            <View style={ styles.eventCardContainer }>
                    {/* Info Text */}
                <View style={ styles.eventCardInfoContainer }>
                        {/* Title */}
                    <Text style={ styles.eventCardInfoTitle }>{props.title}</Text>
                        {/* Describtion */}
                    <Text style={ styles.eventCardInfoBio } >{props.bio}</Text>
                </View>

                    {/* Interations */}
                <View style={ styles.eventCardInterationsContainer }>
                    <Pressable style={ styles.eventCardInterationsBtn } onPress={props.onBtnPress} >
                        <Text style={ styles.eventCardInterationsBtnText } >Sym tež tu</Text>
                    </Pressable>
                </View>
            </View>
    </View>
    )
}

const styles = StyleSheet.create({

    map: {
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        borderRadius: 15,
    },

    eventCardContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: "rgba(176, 110, 106, 1)"
    },
    eventCardInfoContainer: {
        width: "100%",
        padding: 10,
    },
    eventCardInfoTitle: {
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        marginVertical: 10,
    },
    eventCardInfoBio: {
        width: "80%",
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
    },
    eventCardInterationsContainer: {
        width: "100%",
        flexDirection: "row",
        padding: 10
    },
    eventCardInterationsBtn: {
        backgroundColor: "#143C63",
        borderRadius: 25,

        paddingVertical: 10,
        paddingHorizontal: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    eventCardInterationsBtnText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        color: "#5884B0",
    },
})