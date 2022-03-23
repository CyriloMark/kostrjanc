import React from 'react'

import { View, Text, StyleSheet } from 'react-native';

export default function AppHeader(props) {
  return (
    <View style={ props.style }>
             {/* Header */}
        <View style={ styles.headerContainer }>
                
                {/* Icon */}
            <View style={ styles.headerIconContainer }>
                <View style={ styles.headerIcon } />
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
    headerIconContainer: {
        height: "100%",
        flex: .2,
        alignItems: "center",
        justifyContent: "center",
    },
    headerIcon: {
        aspectRatio: 1,
        height: "100%",
        backgroundColor: "#B06E6A",
        borderRadius: 50,
    },
    headerTitleText: {
        flex: .75,
        color: "#5884B0",
        marginLeft: "5%",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
})