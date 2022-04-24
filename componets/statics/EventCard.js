import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

import { getDatabase, ref, onValue } from "firebase/database";

import MapView from 'react-native-maps';

const EVENT_PLACEHOLDER = {
    title: "hey",
    description: "test",
    created: "27.3.2022 21:20",
    checks: 0,
}

export default function EventCard(props) {

    const [event, setEvent] = useState(EVENT_PLACEHOLDER);
    const [pin, setPin] = useState(null);

    const loadData = () => {
        const db = getDatabase();
        onValue(ref(db, 'events/' + props.eventID), snapshot => {
            const data = snapshot.val();
            
            // setCreator(data['creator']);

            setEvent({
                id: data['id'],
                creator: data['creator'],
                title: data['title'],
                description: data['description'],
                geoCords: data['geoCords'],
                created: data['created'],
                checks: data['checks'],
            });
            setPin(data['geoCords']);
        });
    }

    useEffect(() => {
        if (event === EVENT_PLACEHOLDER) loadData();
    }, []);

    return (
        <Pressable style={[ props.style, { borderRadius: 15, overflow: "hidden" } ]} onPress={ props.onPress }>

            {
                pin != null ?
                <MapView style={styles.map}
                    accessible={false} focusable={false}
                    initialRegion={ event.geoCords }
                /> : null
            }

            <View style={ styles.eventCardContainer }>
                    {/* Info Text */}
                <View style={ styles.eventCardInfoContainer }>
                        {/* Title */}
                    <Text style={ styles.eventCardInfoTitle }>{event.title}</Text>
                        {/* Describtion */}
                    <Text style={ styles.eventCardInfoBio } >{event.description}</Text>
                </View>

                {/* <View style={ styles.eventCardInterationsContainer }>
                    <Pressable style={[ styles.eventCardInterationsBtn, { backgroundColor: (!true) ? "#143C63" : "#9FB012" } ]} onPress={props.onBtnTogglePress} >
                        <Text style={[ styles.eventCardInterationsBtnText, { color: (!true) ? "#5884B0" : "#143C63" } ]} >
                            {!true ? "Sym tež tu" : "Njejsym ty"}
                        </Text>
                    </Pressable>
                </View> */}

            </View>
        </Pressable>
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
        aspectRatio: 1.8,
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