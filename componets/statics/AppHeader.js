import React from 'react'

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import SVG_Settings from '../../assets/svg/Settings';

export default function AppHeader(props) {
    return (
        <View style={ props.style }>
                {/* Header */}
            <Pressable style={ styles.headerContainer } onPress={ props.press }>
                    
                    {/* Icon */}
                <View style={ styles.headerIconContainer }>
                    <View style={styles.headerIconBg}>
                        <Image style={[ styles.headerIcon, styles.headerIconShadow ]} source={ require('../../assets/app-system-icons/adaptive-icon.png') } resizeMode='contain' />
                    </View>
                </View>
                <Text style={ styles.headerTitleText }>kostrjanc</Text>
{ props.showSettings ?
                <Pressable style={[ styles.headerIconContainer, { paddingVertical: 10, transform: [{ rotate: "20deg" }] } ]} onPress={ props.settingsPress }>
                    <SVG_Settings style={ styles.headerIcon } fill="#5884B0" />
                </Pressable> : null
}
            </Pressable>
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
        borderRadius: 50,
        padding: 5
    },
    headerIcon: {
        aspectRatio: 1,
        flex: 1,
    },
    headerIconShadow: {
        overflow: "visible",

        shadowOpacity: 1,
        shadowColor: "rgba(0, 0, 0, .8)",
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    headerTitleText: {
        flex: .6,
        color: "#5884B0",
        textAlign: "center",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },
})