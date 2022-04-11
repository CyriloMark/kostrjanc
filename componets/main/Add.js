import React, { useState } from 'react'

import { View, StyleSheet, Text } from "react-native";

import TitleHeader from '../statics/TitleHeader';
import Navbar from '../statics/Navbar';
import PostPreview from '../statics/PostPreview';

const Data_PLACEHOLDER = [
    {
        type: 0,
        title: "Nowy post wozjewić",
        checked: false
    },
    {
        type: 1,
        title: "Nowy ewent wozjewić",
        geoCords: {
            latitude : 51.2392335862277,
            latitudeDelta : 0.01,
            longitude : 14.281389642218592,
            longitudeDelta : 0.005
        },
    }
]

export default function Add({ navigation }) {

    return (
        <View style={ styles.container } >

            <Navbar style={ styles.navbar } active={2}
                onPressRecent={ () => { navigation.navigate("Recent") }}
                onPressSearch={ () => { navigation.navigate("Search") }}
                onPressAdd={ () => { navigation.navigate("Add") }}
                onPressProfile={ () => { navigation.navigate("Profile") }}
            />

            <TitleHeader style={[styles.header, styles.shadow]} title="Post abo ewent wozjawnić" />
            
            <View style={[ styles.body, styles.shadow ]}>

                <Text style={styles.titleText}>Wuzwol sej typ:</Text>

                <View style={styles.itemsContainer}>
                    <PostPreview style={styles.item} postShowText item={Data_PLACEHOLDER[0]} press={ () => navigation.navigate("PostCreate") } />
                    <PostPreview style={styles.item} item={Data_PLACEHOLDER[1]} press={ () => navigation.navigate("EventCreate") } />
                </View>

            </View>

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

    navbar: {
        width: "80%",
        height: "10%",
        bottom: "5%",
        alignSelf: "center",
        position: "absolute",
        zIndex: 99,
    
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },

    header: {
        width: "100%",
        height: "10%",
    },

    body: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },

    titleText: {
        width: "80%",
        textAlign: "center",
        paddingVertical: 25,
        
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#143C63"

    },

    itemsContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row"
    },

    item: {
        aspectRatio: .9,
        flex: 1,

        borderRadius: 25,
        margin: 10,
        backgroundColor: "#143C63",

        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#5884B0"
    },
})