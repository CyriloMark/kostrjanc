import React from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

import MapView from 'react-native-maps';

export default function EventCard(props) {
    return (
        <View style={[ props.style, { borderRadius: 15, overflow: "hidden" } ]}>

            <MapView style={styles.map}
                accessible={false} focusable={false}
                initialRegion={{
                    latitude: 51.180707,
                    longitude: 14.427958,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.005,
                  }}
            />

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
                    <Pressable style={[ styles.eventCardInterationsBtn, { backgroundColor: "#143C63" } ]} onPress={props.onBtnInfoPress} >
                        <Text style={[ styles.eventCardInterationsBtnText, { color: "#5884B0" } ]} >Info</Text>
                    </Pressable>
                    <Pressable style={[ styles.eventCardInterationsBtn, { backgroundColor: (!props.checked) ? "#143C63" : "#9FB012" } ]} onPress={props.onBtnTogglePress} >
                        <Text style={[ styles.eventCardInterationsBtnText, { color: (!props.checked) ? "#5884B0" : "#143C63" } ]} >
                            {!props.checked ? "Sym tež tu" : "Njejsym ty"}
                        </Text>
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
        zIndex: 2
    },

    eventCardContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: "rgba(176, 110, 106, .8)",
        zIndex: 3
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
        marginRight: 10,

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
    },
})