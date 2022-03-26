import React from 'react'

import { View, Pressable, StyleSheet, Text } from 'react-native';

import SVG_Return from '../../assets/svg/Return'

export default function BackHeader(props) {
    return (
        <View style={ props.style }>
              {/* Back */}
            <View style={[ styles.backContainer, styles.shadow ]}>
                <Pressable style={ styles.backBtn } onPress={ props.onPress } >
                    <SVG_Return style={[ styles.backBtnIcon, styles.shadow ]} fill={"#B06E6A"} />
                </Pressable>
                <Text style={ styles.titleText }>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backContainer: {
        borderRadius: 25,
        padding: 10,
        backgroundColor: "#143C63",
        height: "100%",
        width: "100%",

        flexDirection: "row",
        alignItems: "center"
    },
    backBtn: {
        height: "100%",
        flex: .2,
        alignItems: "center",
        paddingVertical: 10,
        justifyContent: "center",
    },
    backBtnIcon: {
        aspectRatio: 1,
        height: "100%",
        borderRadius: 50,
    },
    titleText: {
        flex: .6,
        color: "#B06E6A",
        textAlign: "center",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },
});