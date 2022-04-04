import React from 'react'

import { View, Text, StyleSheet, Image } from 'react-native';

export default function AppHeader(props) {
    return (
        <View style={ props.style }>
                {/* Header */}
            <View style={ styles.headerContainer }>
                    
                    {/* Icon */}
                <View style={ styles.headerIconContainer }>
                    <View style={styles.headerIconBg}>
                        <Image style={ styles.headerIcon } source={ require('../../assets/app-system-icons/adaptive-icon.png') } resizeMode='contain' />
                    </View>
                </View>
                <Text style={ styles.headerTitleText }>kostrjanc</Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
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
    headerIconContainer: {
        flex: .2,
        maxHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerIconBg: {
        flex: 1,
        backgroundColor: "#B06E6A",
        borderRadius: 50,
        padding: 5
    },
    headerIcon: {
        aspectRatio: 1,
        flex: 1,
    },
    headerTitleText: {
        flex: .6,
        color: "#B06E6A",
        textAlign: "center",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },
})