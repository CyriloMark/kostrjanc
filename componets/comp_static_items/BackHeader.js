import React from 'react'

import { View, Pressable, StyleSheet, Text } from 'react-native';

import SVG_Return from '../../assets/svg/Return'

export default function BackHeader(props) {
    return (
        <View style={ props.style }>
            <View style={ styles.container }>

                <Pressable style={ styles.backBtn } onPress={ props.onPress } >
                    <View style={ styles.backBtnBG }>
                        <SVG_Return style={ styles.backBtnIcon } fill={"#143C63"} />
                    </View>
                </Pressable>

                <Text numberOfLines={1} style={ styles.titleText }>{props.title}</Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10,

        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#143C63",
    },
    backBtn: {
        marginVertical: 5,
        flex: .2,
        alignItems: "center",
    },
    backBtnBG: {
        aspectRatio: 1,
        height: "100%",
        paddingVertical: 10,

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,

        backgroundColor: "#5884B0"
    },
    backBtnIcon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,
    },
    titleText: {
        flex: .8,
        color: "#5884B0",
        marginLeft: 10,
        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },
});