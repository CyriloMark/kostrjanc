import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text, Image } from 'react-native';

import { getDatabase, ref, onValue, get, child } from "firebase/database";

import MapView, { Marker } from 'react-native-maps';

import BackHeader from './statics/BackHeader';
import UserHeader from './statics/UserHeader';

const USER_PLACEHOLDER = {
    name: "",
    pbUri: "https://www.colorhexa.com/587db0.png"
}
const EVENT_PLACEHOLDER = {
    title: "hey",
    description: "test",
    geoCords: {
        latitude: 51.2392335862277,
        longitude: 14.281389642218592,
        latitudeDelta: 0.01,
        longitudeDelta: 0.005,
    },
    created: "27.3.2022 21:20",
    checks: 0,
    starting: 0
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function EventView({ navigation, route }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    
    const [creator, setCreator] = useState(null);
    
    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [event, setEvent] = useState(EVENT_PLACEHOLDER);
    
    const {eventID} = route.params;

    const loadData = () => {
        const db = getDatabase();
        onValue(ref(db, 'events/' + eventID), snapshot => {
            const data = snapshot.val();
            
            setCreator(data['creator']);

            setEvent({
                id: data['id'],
                creator: data['creator'],
                title: data['title'],
                description: data['description'],
                geoCords: data['geoCords'],
                created: data['created'],
                checks: data['checks'],
                starting: data['starting']
            });
        });
    }

    const loadUser = () => {
        const db = ref(getDatabase());
        get(child(db, 'users/' + creator))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    const data = snapshot.val();

                    setUser({
                        name: data['name'],
                        description: data['description'],
                        pbUri: data['pbUri'],
                        gender: data['gender'],
                        ageGroup: data['ageGroup']
                    });
                }
                else {
                    setUser(USER_PLACEHOLDER);
                }
            })
    }

    useEffect(() => {
        if (event === EVENT_PLACEHOLDER) loadData();
    }, []);

    useEffect(() => {
        if (creator === null) return;
        loadUser();
    }, [creator]);

    const convertTimestampIntoString = (val) => {
        const date = new Date(val);

        let min = date.getMinutes().toString().length === 1 ? date.getMinutes() + "0" : date.getMinutes()
        return (date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + min + " hodź.");
    }

    return (
        <View style={ styles.container }>

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title="Event" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    /> }>

                <UserHeader onPress={ () => navigation.navigate('ProfileView', { userID: creator }) } user={user} />

                    {/* MapView */}
                <View style={ styles.mapViewContainer }>
                    <MapView style={styles.map}
                        accessible={false} focusable={false}
                        initialRegion={ event.geoCords } >
                        <Marker title={event.title} coordinate={event.geoCords} />
                    </MapView>
                </View>

                    {/* Describtion */}
                <View style={ styles.descriptionContainer }>
                    <Text style={ styles.titleText }>{event.title}</Text>
                    <Text style={ styles.titleText }>{convertTimestampIntoString(event.starting)}</Text>
                    <Text style={ styles.descriptionText }>{event.description}</Text>
                </View>

                    {/* Join */}
                <Pressable style={[ styles.joinBtnContainer, { backgroundColor: (!true) ? "#B06E6A" : "#9FB012" } ]}>
                    <Text style={ [styles.joinText, { color: (!true) ? "#143C63" : "#143C63" } ]} >
                        {!true ? "Sym tež tu" : "Njejsym ty"}
                    </Text>
                </Pressable>

            </ScrollView>

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
        elevation: 10
    },

    backHeader: {
        position: "absolute",
        width: "100%",
        height: "10%",
        top: 10,

        alignSelf: "center",

        zIndex: 99
    },

    userHeader: {
        width: "100%",
        position: "relative",
        zIndex: 2,
    },

    mapViewContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        marginTop: 10,
        position: "relative",
        overflow: "hidden"
    },
    map: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center"
    },

    descriptionContainer: {
        width: "90%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        position: "relative",
        marginTop: 10,
        alignSelf: "center",
        
        paddingHorizontal: 25,
        paddingVertical: 10,

        elevation: 10,
    },
    titleText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#5884B0",
        marginBottom: 10
    },
    descriptionText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#5884B0"
    },

    joinBtnContainer: {
        width: "60%",
        backgroundColor: "",
        padding: 25,

        position: "relative",
        alignSelf: "center",
        marginTop: 25,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#143C63",

        borderRadius: 15,
        elevation: 10
    },
    joinText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#143C63"
    }
});