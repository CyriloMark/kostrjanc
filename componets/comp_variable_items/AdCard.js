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

    return(
        <View style={ props.style }>
            <Pressable style={ styles.container } onPress={ openLink } >

                    {/* IMG */}
                <View style={ styles.imageContainer }>
                    <Image source={{ uri: ad.imgUri }} style={ styles.image } resizeMode="cover" />
                </View>

                    {/* Menu */}
                <View style={ styles.menuContainer }>
                    <SVG_Ad fill="#143C63" style={[ styles.icon, { aspectRatio: 5/3 } ]} />
                    <SVG_Search fill="#143C63" style={[ styles.icon, { aspectRatio: 1, height: "80%" } ]} />
                </View>

            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        zIndex: 3,
        justifyContent: "center",
    },

    imageContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        overflow: "hidden",
        aspectRatio: 1,
    },
    image: {
        flex: 1,
        width: "100%",
    },

    menuContainer: {
        width: "100%",
        aspectRatio: 8,
        
        paddingHorizontal: 10,
        paddingTop: 10,

        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        height: "100%",
        marginRight: 10,
    },
});