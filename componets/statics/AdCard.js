import React, { useState, useEffect } from 'react'

import { Alert, View, StyleSheet, Image, Pressable } from 'react-native';

import { openURL } from 'expo-linking'

import SVG_Ad from '../../assets/svg/Ad';
import SVG_Search from '../../assets/svg/Search';

const AD_PLACEHOLDER = {
    redirectUri: "",
    imgUri: "https://www.colorhexa.com/587db0.png",
}

export default function PostCard(props) {

    const [ad, setAd] = useState(AD_PLACEHOLDER);

    const loadData = () => {
        fetch("http://vps343020.ovh.net:8080/get_ad")
            .then(resp => resp.json()
                .then(adData => setAd(adData)))
    }

    const openLink = () => {
        Alert.alert("Link wočinić?", "Chceš so na eksternu stronu dale wodźić dać?", [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    openURL(ad.redirectUri);
                }
            }
        ])
        
    }

    useEffect(() => {
        if (ad === AD_PLACEHOLDER) loadData();
    }, []);

    return (
        <View style={[props.style, { borderRadius: 15, borderColor: "#143C63", borderWidth: 5, overflow: "hidden" } ]}>
            <Pressable style={ styles.postContainer } onPress={ openLink } >
                <Image source={{ uri: ad.imgUri }} style={ styles.postBGImg } resizeMode="cover" />

                <View style={[ styles.adContainer, styles.shadow ]}>
                    <SVG_Ad fill="#143C63" style={{ aspectRatio: 1, height: "100%" }} />
                </View>
                <Pressable onPress={ openLink } style={[ styles.searchContainer, styles.shadow ]}>
                    <SVG_Search fill="#143C63" style={{ aspectRatio: 1, height: "100%" }} />
                </Pressable>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
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

    postBGImg: {
        width: "100%",
        aspectRatio: 3/4,
        alignSelf: "center",
    },

    adContainer: {
        position: "absolute",
        height: "10%",
        margin: 10,
        aspectRatio: 5/3,
        zIndex: 10,
        bottom: 0,
        left: 0,
    },
    searchContainer: {
        position: "absolute",
        height: "10%",
        margin: 10,
        aspectRatio: 1,
        zIndex: 10,
        bottom: 0,
        right: 0
    }
});
