import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

import { getDatabase, ref, get, child } from "firebase/database";

const BANNER_PLACEHOLDER = {
    title: "",
    description: "",
    starting: 0,
    ending: 0,
}

export default function BannerCard(props) {

    const [banner, setBanner] = useState(BANNER_PLACEHOLDER);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), 'banners/' + props.bannerID))
            .then(snapshot => {
                const data = snapshot.val();
                setBanner({...data});
            })
            .catch(error => console.log("error", error.code));
    }

    useEffect(() => {
        if (banner === BANNER_PLACEHOLDER) loadData();
    }, []);

    return (
        <View style={ props.style }>
            <View style={ styles.container } >

                    {/* Marker */}
                <View style={ styles.markerContainer } >
                    <View style={ styles.marker } />
                </View>

                    {/* Txt Container */}
                <View style={ styles.textInfoContainer } >
                        {/* Title */}
                    <Text style={ styles.textInfoTitle }>{banner.title}</Text>
                        {/* Describtion */}
                    <Text style={ styles.textInfoSub } >{banner.description}</Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#B06E6A",
        
        padding: 10,
        justifyContent: "center",
        
        zIndex: 3,

        flexDirection: "row",
        alignItems: "center"
    },

    markerContainer: {
        position: "relative",
        flex: .1,
        height: 50,
        alignItems: "center",
    },
    marker: {
        width: 1,
        height: "100%",
        backgroundColor: "#B06E6A",
    },

    textInfoContainer: {
        height: "100%",
        flex: .9,
        flexDirection: "column",
    },

    textInfoTitle: {
        flex: .6,
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#B06E6A",
    },
    textInfoSub: {
        marginVertical: 10,
        flex: .4,
        fontFamily: "RobotoMono_Thin",
        fontSize: 15,
        color: "#B06E6A"
    },
});

const styles2 = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        backgroundColor: "#B06E6A",
        padding: 10,

        flexDirection: "row",
        alignItems: "center"
    },

    markerContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    markerText: {
        fontFamily: "Barlow_Regular",
        fontSize: 100,
        color: "#143C63"
    },

    textInfoContainer: {
        flex: .8,
        flexDirection: "column",
        marginVertical: 25,
    },

    textInfoTitle: {
        flex: .6,
        fontFamily: "Barlow_Bold",
        fontSize: 50,
        color: "#B06E6A",
    },
    textInfoSub: {
        flex: .4,
        fontFamily: "Barlow_Regular",
        fontSize: 15,
        color: "#B06E6A"
    },
});
