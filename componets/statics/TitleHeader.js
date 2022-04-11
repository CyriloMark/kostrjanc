import React from 'react'

import { View, Text, StyleSheet, Image } from 'react-native';

export default function TitleHeader(props) {
    return (
        <View style={ props.style }>
                {/* Title */}
            <View style={ styles.container }>
                <Text style={ styles.titleText }>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#143C63",
        borderRadius: 25,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
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
    
    titleText: {
        flex: 1,
        color: "#B06E6A",
        textAlign: "center",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },
})