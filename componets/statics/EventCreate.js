import React, { useState, useEffect } from 'react'

import { View, KeyboardAvoidingView, ScrollView, StyleSheet, Keyboard, TextInput, Text, Pressable, Alert } from 'react-native'

import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";

import MapView from 'react-native-maps';

import BackHeader from './BackHeader'

const initialRegion = {
    latitude: 51.186106956552244,
    longitude: 14.435684115023259,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

export default function EventCreate({ navigation }) {

    const [pin, setPin] = useState(initialRegion);
    const [eventData, setEventData] = useState({});

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
        if (!(eventData.title.length !== 0 && eventData.description.length !== 0)) return;
        if (eventData.starting === "undefined") return;

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

    return (
        <View style={ styles.container } >
            <KeyboardAvoidingView behavior='height' enabled={ Platform.OS != 'ios' } style={{ height: "100%" }}>

                <BackHeader style={[ styles.shadow, styles.backHeader ]} title="Nowy ewent wozjawnić" onPress={ () => navigation.goBack() } />

                <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }}
                        keyboardDismissMode='on-drag' bounces={true}>

                        {/* MapView */}
                    <View style={ styles.mapViewContainer }>
                        <MapView style={styles.map} showsUserLocation showsTraffic rotateEnabled={false}
                            accessible={true} focusable={true}
                            initialRegion={initialRegion} onRegionChange={(result) => setPin(result)} >
                            <View style={styles.marker} />
                        </MapView>
                    </View>

                        {/* Name */}
                    <View style={ styles.inputContainer }>
                        <TextInput style={ styles.input } keyboardType="default" autoCapitalize='sentences' maxLength={32}
                            placeholder="Titul" autoComplete={ false } textContentType="name" keyboardAppearance='dark' value={eventData.title}
                            multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setEventData({
                                ...eventData,
                                title: value
                            }) }
                        />
                    </View>

                    <Text style={styles.timeHint}>(w formje: dźeń.měsac.lěto hodź:min)</Text>
                        {/* 1.1.1970 0:00 hodź. */}
                        {/* Starting */} 
                    <View style={ styles.inputContainer }>
                        <TextInput style={ styles.input } keyboardType="default" autoCapitalize='sentences' maxLength={32}
                            placeholder="Započatk" autoComplete={ false } textContentType="name" keyboardAppearance='dark'
                            multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setEventData({
                                ...eventData,
                                starting: convertTextIntoTimestamp(value)
                            }) }
                        />
                    </View>

                        {/* Bio */}
                    <View style={ styles.inputContainer }>
                        <TextInput style={ styles.input } keyboardType="default" autoCapitalize='sentences' maxLength={512}
                            placeholder="Wopisaj twój post..." autoComplete={ false } keyboardAppearance='dark' value={eventData.description}
                            multiline blurOnSubmit={ true } numberOfLines={5} editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setEventData({
                                ...eventData,
                                description: value,
                            }) }
                        />
                    </View>

                        {/* Submit */}
                    <Pressable style={ styles.submitBtn } onPress={ publish }>
                        <Text style={ styles.submitBtnText }>Wozjewić</Text>
                    </Pressable>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0",
        paddingHorizontal: 10,
    },

    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
    },

    backHeader: {
        position: "absolute",
        width: "100%",
        height: "10%",
        top: 10,

        alignSelf: "center",

        zIndex: 99
    },

    mapViewContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        marginVertical: 10,
        position: "relative",
        overflow: "hidden"
    },
    map: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",

        justifyContent: "center",
        alignItems: "center",
    },

    timeHint: {
        textAlign: "center",
        marginTop: 15,

        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        color: "#143C63",
    },

    inputContainer: {
        width: "100%",
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "80%",
        color: "#5884B0",

        padding: 25,

        fontFamily: "Inconsolata_Regular",
        fontSize: 25,

        backgroundColor: "#143C63",
        borderRadius: 15,
    },

    submitBtn: {
        width: "80%",
        alignSelf: "center",
        marginVertical: 25,

        backgroundColor: "#B06E6A",
        borderRadius: 15,

        padding: 25,

        alignItems: "center",
        justifyContent: "center",
    },
    submitBtnText: {
        color: "rgba(0, 0, 0, .5)",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },


    marker: {
        position: "absolute",
        width: "5%",
        height: "5%",

        borderRadius: 100,
        borderColor: "#B06E6A",
        borderWidth: 5,
        zIndex: 999
    }
});