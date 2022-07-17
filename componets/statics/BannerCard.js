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
        <View style={[props.style, { borderRadius: 15, overflow: "hidden" } ]}>
            <View style={ styles.bannerContainer } >

                    {/* ! */}
                <View style={ styles.markerContainer }>
                    <Text style={ styles.markerText }>!</Text>
                </View>

                    {/* Txt */}
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
        fontFamily: "Inconsolata_Regular",
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
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        color: "#143C63",
    },
    textInfoSub: {
        flex: .4,
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        color: "#143C63"
    },
});
