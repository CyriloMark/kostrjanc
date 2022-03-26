import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text, Image } from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import BackHeader from './statics/BackHeader';
import UserHeader from './statics/UserHeader';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function EventView({ navigation, route }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const {item, user} = route.params;

    return (
        <View style={ styles.container }>

            <BackHeader style={ styles.backHeader } title="Event" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    /> }>

                <UserHeader user={user} />

                    {/* MapView */}
                <View style={ styles.mapViewContainer }>
                    <MapView style={styles.map}
                        accessible={false} focusable={false}
                        initialRegion={ item.geoCords } >
                        <Marker title={item.name} coordinate={item.geoCords} />
                    </MapView>
                </View>

                    {/* Describtion */}
                <View style={ styles.descriptionContainer }>
                    <Text style={ styles.titleText }>{item.name}</Text>
                    <Text style={ styles.descriptionText }>{item.description}</Text>
                </View>

                    {/* Join */}
                <Pressable style={[ styles.joinBtnContainer, { backgroundColor: (!item.checked) ? "#B06E6A" : "#9FB012" } ]}>
                    <Text style={ [styles.joinText, { color: (!item.checked) ? "#143C63" : "#143C63" } ]} >
                        {!item.checked ? "Sym tež tu" : "Njejsym ty"}
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