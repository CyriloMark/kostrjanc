import React, { useState, useEffect } from 'react'

import { View, KeyboardAvoidingView, ScrollView, StyleSheet, Keyboard, TextInput, Text, Pressable, Alert } from 'react-native'

import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";

import MapView, { Marker } from 'react-native-maps';

import BackHeader from '../comp_static_items/BackHeader'

const initialRegion = {
    latitude: 51.186106956552244,
    longitude: 14.435684115023259,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

const EVENT_PLACEHOLDER = {
    title: "",
    description: "",
    starting: 0,
    geoCords: {
        latitude: 90,
        latitudeDelta: 90,
        longitude: -36,
        longitudeDelta: 124
    }
}

let btnPressed;
export default function EventCreate({ navigation }) {

    const [pin, setPin] = useState(initialRegion);
    const [eventData, setEventData] = useState(EVENT_PLACEHOLDER);

    const [submittalbe, setSubmittalbe] = useState(false);

    const convertTextIntoTimestamp = (val) => {
         // "10.12.2022 19:25"
        // "December 10, 1815 19:25"

        const splitRegex = /\D/;
        const dateSplit = val.split(splitRegex);

        if (dateSplit.length != 5) return;

        const dateFormat = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0], dateSplit[3], dateSplit[4], 0, 0);
        const a = Date.parse(dateFormat)
        return a;
    }

    const publish = async () => {
        if (btnPressed) false;
        if (!submittalbe) return;
        if (eventData.starting === "undefined") return;
        btnPressed = true;


        const id = Date.now();
        set(ref(getDatabase(), 'events/' + id), {
            id: id,
            type: 1,
            title: eventData.title,
            description: eventData.description,
            starting: eventData.starting,
            created: id,
            creator: getAuth().currentUser.uid,
            geoCords: pin
        });

        get(child(ref(getDatabase()), 'users/' + getAuth().currentUser.uid))
            .then((userData) => {
                const data = userData.val();
                
                let a;
                if (userData.hasChild('events')) a = data['events'];
                else a = [];
                a.push(id);
                
                set(ref(getDatabase(), 'users/' + getAuth().currentUser.uid), {
                    ...data,
                    events: a
                }).finally(() =>

                    Alert.alert("Ewent zarjadowany", 'Waš nowy ewent "' + eventData.title + '" je so wuspěšnje zarjadował.', [
                        {
                            text: "Ok",
                            style: "default",
                            onPress: navigation.navigate('Recent')
                        }
                    ])
                )
            })
            .catch((error) => console.log("error userudata", error.code))
    }

    useEffect(() => {
        btnPressed = false;
    }, []);

    const checkIfPublishable = () => {
        if (!(eventData.title.length !== 0 && eventData.description.length !== 0 && eventData.starting.toString().length !== 0))
            setSubmittalbe(false);
        else setSubmittalbe(true)
        return;
    }

    return (
        <View style={ styles.container }>

            <BackHeader style={ styles.backHeader } title="Nowy ewent wozjewić" onPress={ () => navigation.goBack() } />

            <ScrollView style={ styles.contentContainer } contentContainerStyle={[ styles.contentInnerContainer, { marginTop: -5 } ]} showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }} >

                    {/* Map */}
                <View style={ styles.mapOutlineContainer } >
                    <View style={ styles.mapContainer } >
                        <MapView style={styles.map} userInterfaceStyle='dark' showsUserLocation showsScale rotateEnabled={false}
                            accessible={false} focusable={false} onRegionChange={(result) => setPin(result)}
                            initialRegion={ eventData.geoCords } >
                                <Marker title={eventData.title} coordinate={pin} />
                        </MapView>
                    </View>
                </View>

                    {/* Name */}
                <TextInput
                    style={ styles.input } placeholder="Titul" maxLength={32}
                    multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                    keyboardType="default" keyboardAppearance='dark' value={eventData.title}
                    autoCapitalize='sentences' autoComplete={ false } textContentType="name" 
                    editable onChangeText={ (value) =>  {
                        setEventData({
                            ...eventData,
                            title: value
                        });
                        checkIfPublishable();
                    }}
                />

                    {/* Desc */}
                <TextInput
                    style={ styles.input } placeholder="Wopisaj twój ewent..." maxLength={512}
                    multiline placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                    keyboardType="default" keyboardAppearance='dark' value={eventData.description}
                    autoCapitalize='sentences' autoComplete={ false }
                    editable onChangeText={ (value) => {
                        setEventData({
                            ...eventData,
                            description: value
                        });
                        checkIfPublishable();
                    }}
                />

                
                    {/* Starting */}
                <TextInput
                    style={ styles.input } placeholder="Započatk" maxLength={32}
                    multiline={false} numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                    keyboardType="numbers-and-punctuation" keyboardAppearance='dark'
                    autoCapitalize='none' autoComplete={ false }
                    editable onChangeText={ (value) => {
                        setEventData({
                            ...eventData,
                            starting: convertTextIntoTimestamp(value)
                        });
                        checkIfPublishable();
                    }}
                />
                <Text style={styles.timeHint}>(forma: dźeń.měsac.lěto hodź:min)</Text>

                    {/* Check */}
                <Pressable style={[ styles.checkBtnContainer, {
                    backgroundColor: submittalbe ? "#B06E6A" : "#143C63" } ]}
                    onPress={ publish }>
                    <Text style={ styles.checksBtnText }>Wozjewić</Text>
                </Pressable>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
    },

    contentContainer: {
        flex: .8,
        width: "100%",
        paddingVertical: 5,
        borderRadius: 25,
    },
    contentInnerContainer: {
        paddingHorizontal: 10,
        backgroundColor: "#000",
        minHeight: "100%"
    },

    backHeader: {
        flex: .12,
        width: "100%",
    
        alignSelf: "center",
    
        zIndex: 99
    },

    mapOutlineContainer: {
        width: "100%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#143C63",

        marginVertical: 10,
        
        zIndex: 3,
    },
    mapContainer: {
        width: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",

        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    },


    input: {
        width: "100%",
        paddingHorizontal: 25 ,
        paddingVertical: 10,

        marginVertical: 5,

        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",

        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
    },
    timeHint: {
        width: "100%",
        fontFamily: "RobotoMono_Thin",
        fontSize: 15,
        color: "#5884B0",
        alignSelf: "center",
        textAlign: "center"
    },

    checkBtnContainer: {
        width: "60%",
        
        borderRadius: 15,

        marginTop: 25,
        
        paddingHorizontal: 25,
        paddingVertical: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#B06E6A",
    },
    checksBtnText: {
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#000000",
    },
});